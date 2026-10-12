import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'public/campus/game/characters.js'), 'utf8'), context);
const registry = context.window.CAMPUS_CHARACTERS;
const expectations = {
  'staff-chinese':'read', 'staff-english':'organise', 'staff-maths':'write', 'staff-chemistry':'check',
  'staff-geography':'read', 'staff-computer':'check', 'staff-history':'organise', 'staff-art':'write',
  'staff-music':'play-music', 'staff-library':'read', 'staff-rooftop':'write', 'staff-playground':'coach',
  'staff-principal':'read', 'staff-vice':'check', 'staff-office':'organise', 'staff-mentor':'read',
  voice:'read', privacy:'check', culture:'read', access:'check',
};
let identityVariants = 0, frameCount = 0;
for (const atlas of Object.values(registry.activityAtlases)) {
  assert.equal(atlas.releaseStatus, 'released', `${atlas.id} has not passed visual release review`);
  const file = fs.readFileSync(path.join(root, 'public/campus', atlas.src));
  assert.equal(file.subarray(1,4).toString(), 'PNG');
  assert.equal(file.readUInt32BE(16), atlas.width);
  assert.equal(file.readUInt32BE(20), atlas.height);
  assert.equal(atlas.frames.length, atlas.identities.length * 4);
  frameCount += atlas.frames.length;
  for (const identity of atlas.identities) {
    identityVariants += 1;
    const activity = expectations[identity.id];
    assert.ok(activity, `Unknown canonical identity ${identity.id}`);
    assert.ok(identity.activities[activity], `${identity.id} needs its actual duty ${activity}`);
    const uniform = identity.uniform ?? atlas.uniform ?? 0;
    const poseA = registry.activity(identity.id, activity, 0, {uniform}, 'loop');
    const poseB = registry.activity(identity.id, activity, 1 / identity.activities[activity].fps + 0.01, {uniform}, 'loop');
    assert.notEqual(poseA.frameIndex, poseB.frameIndex, 'Main duty must have two drawn keys');
    assert.equal(poseA.identity.standingHeight, poseB.identity.standingHeight, 'Pose scale must be invariant');
    for (const stage of ['enter','loop','exit']) {
      for (const time of [-5,0,0.35,3,60,1e6,Infinity,NaN]) {
        const selected = registry.activity(identity.id, activity, time, {uniform}, stage);
        assert.ok(selected.frame && selected.atlas.src === atlas.src);
        assert.ok(selected.frame.anchorX >= selected.frame.x && selected.frame.anchorX <= selected.frame.x + selected.frame.w);
        assert.ok(selected.frame.baseline >= selected.frame.y && selected.frame.baseline <= selected.frame.y + selected.frame.h);
      }
    }
    assert.equal(registry.activity(identity.id, 'missing-pose', 0, {uniform}), null);
    assert.equal(registry.activity(identity.id, activity, 0, {uniform}, 'invalid'), null);
  }
}
const missing = [];
for (const [id, duty] of Object.entries(expectations)) {
  for (const uniform of registry.resolve(id).adult ? [0] : [0,1,2,3]) {
    if (!registry.activity(id, duty, 0, {uniform})) missing.push(`${id}/uniform-${uniform}`);
  }
}
assert.equal(registry.activity('unknown', 'read', 0), null);
assert.equal(registry.activity('subject:library', 'read', 0).atlas.src, registry.activity('staff-library', 'read', 0).atlas.src, 'Interaction aliases retain the same activity identity');
const stablePortrait = JSON.stringify(registry.portrait('staff-library'));
const stableWalk = JSON.stringify(registry.atlases['staff-library']);
const sample = Object.values(registry.activityAtlases)[0];
registry.registerActivityAtlas(sample);
assert.equal(JSON.stringify(registry.portrait('staff-library')), stablePortrait, 'Activity registration must not replace dialogue portraits');
assert.equal(JSON.stringify(registry.atlases['staff-library']), stableWalk, 'Activity registration must not replace walk metadata');
assert.throws(() => registry.registerActivityAtlas({...sample, frames:[{...sample.frames[0],x:-1},...sample.frames.slice(1)]}), /crop/i, 'Malformed source rectangles fail before replacing registrations');
assert.ok(Object.values(registry.atlases).every(atlas => atlas.identities.every(identity => identity.walk?.length)), 'Walking registrations remain intact');
console.log(`PASS ${Object.keys(registry.activityAtlases).length} sheets, ${identityVariants} identity/outfit variants, ${frameCount} activity drawings: PNG dimensions, stage timing, fixed scale, alias-safe lookup and fallbacks.`);
if (missing.length) {
  console.log(`Pending activity coverage: ${missing.join(', ')}`);
  if (process.argv.includes('--complete')) process.exitCode = 1;
} else console.log('PASS complete 20-character coverage, including all four peer uniform indices.');
