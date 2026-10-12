'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const campus = path.join(__dirname, '..', 'public', 'campus');
const root = path.join(campus, 'game');

function launch() {
  const draws = [], interactions = [], listeners = new Map();
  let nextFrame = 1;
  const context2d = new Proxy({}, { get(target, key) {
    if (key in target) return target[key];
    if (key === 'drawImage') return (...args) => draws.push(args);
    if (key === 'createLinearGradient') return () => ({ addColorStop() {} });
    if (key === 'measureText') return text => ({ width: String(text).length * 7 });
    return () => {};
  } });
  function canvas() {
    return { width: 900, height: 500, tabIndex: 0, style: {},
      getContext: () => context2d,
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 900, height: 500 }),
      addEventListener() {}, removeEventListener() {}, focus() { document.activeElement = this; },
    };
  }
  const document = { hidden: false, activeElement: null, createElement: canvas, addEventListener() {}, removeEventListener() {} };
  class Raster {
    constructor() { this.naturalWidth = 1536; this.naturalHeight = 1024; }
    set src(value) { this.path = value; this.onload?.(); }
  }
  const window = { devicePixelRatio: 1, matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
    addEventListener: (name, callback) => listeners.set(name, callback), removeEventListener: name => listeners.delete(name),
    getComputedStyle: () => ({ objectFit: 'fill' }),
  };
  const context = vm.createContext({ window, document, Image: Raster, console,
    requestAnimationFrame: () => nextFrame++, cancelAnimationFrame() {},
  });
  for (const file of ['characters.js', 'campus-routines.js', 'engine.js']) { let source=fs.readFileSync(path.join(root,file),'utf8'); if(file==='engine.js')source=source.replace('window.CampusEngine = CampusEngine;', 'window.testSkinPixel = isSkinPixel; window.CampusEngine = CampusEngine;'); vm.runInContext(source,context,{filename:file}); }
  window.CAMPUS_ART = Object.fromEntries(Object.keys(window.CAMPUS_LOCATIONS).map(id => [id, { src: 'background.png', groundY: 400 }]));
  const view = canvas();
  const engine = new window.CampusEngine({ canvas: view, onInteract: id => interactions.push(id) });
  document.activeElement = view;
  engine.render = () => {};
  let time = 20;
  const run = (frames = 1) => { for (let i = 0; i < frames; i++) { time += 20; engine.tick(time); } };
  const tap = (x, y) => engine.pointer({ button: 0, clientX: x - engine.camera, clientY: y });
  return { engine, window, view, draws, interactions, run, tap, context2d, listeners, document };
}

const game = launch(), { engine, window: world, interactions, run, tap, draws, context2d } = game;
const registry = world.CAMPUS_CHARACTERS;
assert.equal(Object.keys(world.CAMPUS_ROUTINES.definitions).length, 20, 'all interactive identities have a declared everyday purpose');
assert.equal(world.testSkinPixel(252,199,164,254),true,'source skin colors can be selected');
for(const rgba of [[252,253,255,254],[198,62,52,254],[70,76,91,254],[252,199,164,0],[78,55,46,254]])assert.equal(world.testSkinPixel(...rgba),false,'white fabric,redbelt,navy,transparent pixels and dark hair are excluded');

for (const atlas of Object.values(registry.atlases)) {
  const bytes = fs.readFileSync(path.join(campus,atlas.src));
  const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20);
  for (const frame of atlas.frames) assert.ok(frame.x >= 0 && frame.y >= 0 && frame.x + frame.w <= width && frame.y + frame.h <= height,'registered production crops stay inside their PNG');
  for (const identity of atlas.identities) assert.ok(identity.standingHeight > 0 && identity.walk.length >= 4,'production players have a standing metric and four walking keys');
}
for(const character of Object.values(registry.byId)) {
  const atlas=registry.atlases[character.atlasId];
  assert.ok(atlas,'every interactive NPC has a production walking atlas');
  assert.equal(character.portrait.src,atlas.src,'neutral portrait and world sprite use the same source identity');
  assert.equal(character.talkPortrait.src,atlas.src,'talk portrait retains the same source identity');
  assert.notDeepEqual(character.portrait,character.talkPortrait,'talking uses its one dedicated gesture pose');
}
assert.equal(registry.resolve('voice').name.zh,'程曉嵐');
assert.equal(registry.resolve('staff-principal').name.zh,'鍾允修校長');
assert.equal(registry.staffIds.length, 16);
assert.equal(new Set(registry.staffIds).size, 16);
assert.equal(new Set(registry.staffIds.map(id => JSON.stringify(registry.portrait(id)))).size, 16, 'all approved staff have independent portrait crops');
for (const id of registry.staffIds) {
  const staff = registry.resolve(id), crop = staff.portrait;
  assert.equal(staff.look.identityId, id, 'the world look and portrait share a canonical identity');
  assert.ok(crop.x >= 0 && crop.y >= 0 && crop.x + crop.w <= crop.sheetWidth && crop.y + crop.h <= crop.sheetHeight);
  for (const locale of ['zh', 'cn', 'en']) assert.ok(staff.name[locale] && staff.role[locale]);
}
assert.equal(registry.resolve('subject:chinese').id, 'staff-chinese');
assert.equal(registry.resolve('subject:hall').id, 'staff-principal');
assert.equal(registry.resolve('prologue').id, registry.resolve('finale').id);
assert.equal(Object.keys(world.CAMPUS_LOCATIONS).length, 18);
assert.equal(Object.keys(registry.sceneScale).length,18,'every location has one shared environment scale reference');
for(const location of Object.keys(world.CAMPUS_LOCATIONS)){engine.location=location;assert.ok(Math.abs(engine.characterHeight({})/registry.sceneScale[location]-.82)<1e-9);assert.ok(Math.abs(engine.characterHeight({adult:true})/registry.sceneScale[location]-.89)<1e-9);}engine.location='corridor';
assert.deepEqual([...new Set(Object.values(world.CAMPUS_LOCATIONS).map(scene => scene.floor))], [0, 1, 2, 3, 4]);
for (const [id, scene] of Object.entries(engine.scenes)) {
  assert.equal(scene.ambient.length, scene.kind === 'corridor' ? 5 : 3, 'more pupils appear only within bounded scene populations');
  assert.ok(scene.ambient.every(actor => !actor.characterId && !actor.look.identityId), 'named staff are never cloned into the anonymous cast');
  for (const actor of [scene.npc, ...(scene.extras || []), ...scene.ambient]) {
    assert.equal(actor.routine.steps.length, 2);
    assert.notEqual(actor.routine.steps[0].station, actor.routine.steps[1].station);
    for (const step of actor.routine.steps) {
      assert.ok(step.dwell[0] >= 20 && step.dwell[1] <= 60);
      assert.ok(scene.doors.every(door => Math.abs(door.x - step.x) >= door.artWidth / 2 + world.CAMPUS_ROUTINES.timing.stationClearance), 'routine stations keep painted doorways clear');
    }
    if (actor.interactive !== false) assert.ok(Math.abs(actor.routine.steps[1].x - actor.routine.steps[0].x) <= 220, 'main duties use short local routes');
  }
  for(const actor of [scene.npc,...(scene.extras||[]),...scene.ambient]) assert.ok(engine.actorCanWalk(actor),'every main and background NPC has real walking frames: '+actor.id);
  assert.ok(scene.ambient.every(actor => actor.interactive === false));
  assert.equal(scene.npc.characterId, registry.resolve(scene.npc.id).id);
  assert.equal(scene.printer,undefined,'printing is a HUD service, not a physical scene object');
  for(const door of scene.doors) {
    assert.ok(door.artTop > 40 && door.artWidth > 80,'each doorway has a measured art anchor');
    assert.ok(door.x - door.plaqueWidth/2 >= 0 && door.x + door.plaqueWidth/2 <= scene.width,'plaques stay within world bounds');
    assert.ok(door.plaqueTop >= door.artTop && door.plaqueTop + 28 <= door.artTop + 64,'plaque sits in the upper door header above the leaf, matching selected A');
  }
}
// Anchors are immutable render input: resolving character frames must not
// reconstruct or rewrite all entrance geometry during every drawing pass.
for (const scene of Object.values(engine.scenes)) for (const door of scene.doors) Object.freeze(door);
assert.doesNotThrow(() => engine.actorCanWalk(engine.npcs()[0]), 'frame selection does not rewrite scene door anchors');
assert.equal(Object.values(engine.scenes).filter(scene => scene.printer).length, 0);
assert.equal(engine.drawPrinter,undefined,'removed printer rendering has no dormant path');
const plaqueCalls=[];const originalPlaque=engine.mountedPlaque;engine.mountedPlaque=(ctx,label,x,y,w)=>plaqueCalls.push({label,x,y,w});
engine.location='corridor1';engine.viewWidth=250;engine.drawArtEntrances(context2d,engine.scenes.corridor1,0,385);
const beforePlaque=plaqueCalls.find(p=>p.label==='中文課室');plaqueCalls.length=0;engine.drawArtEntrances(context2d,engine.scenes.corridor1,50,385);
const afterPlaque=plaqueCalls.find(p=>p.label==='中文課室');assert.equal(beforePlaque.x-afterPlaque.x,50,'camera scrolling keeps plaques attached to their door, even near portrait viewport edges');
engine.mountedPlaque=originalPlaque;engine.viewWidth=900;engine.location='corridor';
for (const gender of ['boy', 'girl']) for (let uniform = 0; uniform < 4; uniform++) for (let hair = 0; hair < 2; hair++) {
  assert.equal(registry.player({ gender, uniform, hair }).atlasId, `player-${gender}-${uniform}`);
  assert.equal(registry.player({ gender, uniform, hair }).hair, hair);
}


for (let uniform=0;uniform<4;uniform++) for(const id of ['voice','privacy','culture','access']) {
  const base=registry.resolve(id), dressed=registry.npc(id,{gender:'boy',hair:1,skin:2,uniform});
  assert.equal(dressed.atlasId,`student-${id}-uniform-${uniform}`);
  assert.equal(dressed.gender,base.gender,'the player choice cannot change an NPC gender');
  assert.equal(dressed.look.hair,base.look.hair,'the NPC hairstyle is independent');
  assert.equal(dressed.look.skin,base.look.skin,'the NPC skin remains independent');
  assert.equal(registry.atlases[dressed.atlasId].identities[0].id,'student-'+id);
  const portrait=registry.portrait(id,true,{uniform});
  assert.equal(portrait.identityId,id);
  assert.ok(portrait.src.includes('cases-portraits-uniforms'));
  assert.ok(portrait.x>=0&&portrait.y>=0&&portrait.x+portrait.w<=portrait.sheetWidth&&portrait.y+portrait.h<=portrait.sheetHeight);
}
for(const id of registry.staffIds) {
  const portrait=registry.portrait(id);
  assert.equal(portrait.identityId,id);
  assert.ok(portrait.src.includes('staff-portraits-v3'),'dialogue uses dedicated larger face artwork');
}
assert.equal(new Set(Object.values(registry.byId).map(c=>c.name.zh)).size,20,'each NPC has a distinct name');

const npc = engine.npcs()[0], originalX = npc.x;
const readyCaseAtlases = Object.fromEntries(Object.entries(registry.atlases).filter(([id])=>id.startsWith('student-voice')));
for(const id of Object.keys(readyCaseAtlases)) delete registry.atlases[id];
engine.x = npc.x - 30;
run(220);
assert.equal(interactions.length, 0, 'proximity alone never opens dialogue');
assert.equal(npc.x, originalX, 'an actor with no walking atlas stays grounded and still');
Object.assign(registry.atlases,readyCaseAtlases);
tap(npc.x, engine.groundY() + 14);
run(70);
assert.equal(interactions.length, 0, 'tapping the floor/nameplate beneath an NPC only moves');
assert.equal(engine.pendingInteraction, null);
tap(npc.x, engine.groundY() - 90);
run(100);
assert.equal(interactions.at(-1), 'voice', 'a deliberate NPC body hit opens the intended dialogue');
run(30);
engine.x = npc.x - 320;
tap(npc.x, engine.groundY() - 90);
assert.equal(engine.pendingInteraction, 'voice');
run(150);
assert.equal(interactions.filter(id => id === 'voice').length, 2, 'the named NPC is approached and opened once');
assert.ok(Math.abs(engine.x - npc.x) <= 76);
run(30);
engine.x = npc.x - 200;
tap(npc.x, engine.groundY() - 100);
tap(npc.x - 350, engine.groundY() + 20);
run(150);
assert.equal(interactions.filter(id => id === 'voice').length, 2, 'a later ground tap cancels earlier conversation intent');

engine.setLocation('corridor4');
run(30);
engine.x = engine.npcs()[0].x;
engine.keyDown({ key: 'E', repeat: false, preventDefault() {} });
assert.equal(interactions.at(-1), 'finale');

// Key intent remains unambiguous even when a person stands at a doorway.
for (const key of ['E', ' ', 'Enter', 'legacy-button']) {
  const routed = launch(), scene = routed.engine.scenes.corridor;
  const door = scene.doors.find(item => item.id !== 'exit');
  routed.run(30);
  routed.engine.x = door.x;
  for (const person of routed.engine.npcs()) person.x = door.x + 400;
  const person = routed.engine.npcs()[0]; person.x = door.x;
  if (key === 'legacy-button') routed.engine.interact();
  else routed.engine.keyDown({ key, repeat: false, preventDefault() {} });
  if (key === 'E' || key === 'legacy-button') {
    assert.equal(routed.engine.location, 'corridor', 'E never enters a nearby door');
    assert.equal(routed.interactions.at(-1), person.id, 'E talks to the person at the doorway');
  } else {
    assert.equal(routed.engine.location, door.id, 'Space and Enter use the door even when an NPC shares its position');
    assert.equal(routed.interactions.length, 0, 'door keys do not start an NPC conversation');
  }
  routed.engine.destroy();
}

engine.clearInput();
engine.x = 400;
const startingX = engine.x;
engine.move(1);
run(1);
assert.ok(engine.x - startingX < 3.4, 'the player eases into movement');
run(30);
assert.ok(engine.velocity > 160);
const phase = engine.phase, before = engine.x;
run(1);
assert.ok(Math.abs((engine.phase - phase) - (engine.x - before) * Math.PI * 2 / engine.strideDistance({})) < 0.00001, 'the gait is driven by distance, not elapsed time');
engine.move(0);
run(1);
assert.ok(engine.velocity > 0, 'release has a short controlled recovery');
run(20);
assert.equal(engine.velocity, 0);
engine.keys.add('arrowup');
run(80);
assert.equal(engine.depth, -10);
engine.keys.clear(); engine.keys.add('arrowdown');
run(80);
assert.equal(engine.depth, 35);
engine.clearInput();
engine.move('up');
run(60);
assert.equal(engine.depth, -10, 'touch controls include upward movement');
engine.move('down');
run(60);
assert.equal(engine.depth, 35, 'touch controls include downward movement');
engine.move(0);
assert.equal(engine.touchVertical, 0, 'touch release clears both axes');
engine.clearInput();

for(const id of registry.staffIds) {
  const atlas=registry.atlases[id], identity=atlas.identities[0];
  assert.equal(identity.id,id,'production full-body rows retain their canonical teacher identity');
  for(const talking of [false,true]) {
    draws.length=0;
    engine.drawAtlasCharacter(context2d,100,300,{...registry.resolve(id).look,talking},false,0,1,true);
    const frame=atlas.frames[talking?identity.talk:identity.idle];
    assert.equal(draws.at(-1)[1],frame.x);assert.equal(draws.at(-1)[2],frame.y);
  }
}

const frames = [
  { x: 0, y: 0, w: 50, h: 200, anchorX: 25, baseline: 200 },
  { x: 50, y: 0, w: 50, h: 160, anchorX: 75, baseline: 160 },
  { x: 100, y: 0, w: 50, h: 190, anchorX: 125, baseline: 190 },
];
const metadata = { src: 'test-walk.png', facing: 'right', frames,
  identities: [{ idle: 0, walk: [1, 2], talk: 2, standingHeight: 200 }, { idle: 0, walk: [1, 2], standingHeight: 200 }] };
registry.registerAtlas('player-boy-0', metadata);
draws.length = 0;
engine.drawAtlasCharacter(context2d, 100, 300, { gender: 'boy', uniform: 0 }, false, 0, 1, false);
engine.drawAtlasCharacter(context2d, 100, 300, { gender: 'boy', uniform: 0 }, true, 0, 1, false);
const [idleDraw, walkingDraw] = draws;
assert.equal(idleDraw[7], walkingDraw[7], 'same crop width has the same rendered width in idle and bent-knee poses');
assert.equal(idleDraw[8], Math.round(engine.characterHeight({})));
assert.equal(walkingDraw[8], Math.round(engine.characterHeight({}) * 0.8), 'a shorter pose remains shorter; it is not stretched back to standing height');
registry.registerAtlas('staff-chinese', metadata);
engine.setLocation('chinese');
const teacher = engine.npcs()[0], home = teacher.homeX;
teacher.stepIndex = 1; teacher.state = 'prepare'; teacher.elapsed = 0; teacher.duration = 0;
run(30);
assert.equal(teacher.state, 'walk');
assert.equal(teacher.speed,150,'NPCs walk slightly slower than the player at170units/s');
assert.ok(teacher.x > home && teacher.x <= home + 220);
const teacherPhase=teacher.phase, teacherX=teacher.x;
run(1);
assert.ok(Math.abs((teacher.phase-teacherPhase)-(teacher.x-teacherX)*Math.PI*2/engine.strideDistance(teacher.look))<1e-8,'NPC foot phase follows actual distance, just like the player');
engine.setTalking('subject:chinese', true);
const conversationX = teacher.x;
run(20);
assert.equal(teacher.state, 'converse');
assert.equal(teacher.x, conversationX, 'conversation halts wandering');
const portraitBefore = JSON.stringify(registry.portrait('subject:chinese'));
draws.length = 0;
engine.drawAtlasCharacter(context2d, 100, 300, {...teacher.look,talking:true}, false, 0, -1, true);
assert.equal(draws.at(-1)[1], 100, 'the optional gesture frame is selected only while talking');
assert.equal(JSON.stringify(registry.portrait('subject:chinese')),portraitBefore,'a world gesture keeps the same canonical portrait identity');

engine.setTalking('subject:chinese', false);
assert.equal(teacher.state, 'recover');
assert.equal(teacher.phase, 0, 'the actor returns to neutral on conversation exit');
draws.length = 0;
engine.drawAtlasCharacter(context2d, 100, 300, {...teacher.look,talking:false}, false, 0, -1, true);
assert.equal(draws.at(-1)[1], 0, 'conversation exit restores the neutral frame');

run(800);
assert.ok(teacher.x >= home - 220 && teacher.x <= home + 220, 'staff remain within their purposeful station route');
const other = launch();
assert.notEqual(other.engine.scenes.chinese.npc, teacher, 'engine instances do not share mutable actor positions');
assert.equal(other.engine.scenes.chinese.npc.x, home);
assert.throws(() => registry.registerAtlas('broken', { ...metadata, identities: [{ idle: 0, walk: [99], standingHeight: 0 }] }));
engine.setLocation('maths');
engine.x = engine.scenes.maths.doors[0].x;
run(30);
engine.keyDown({key:'Enter',repeat:false,preventDefault(){}});
assert.equal(engine.location,'corridor1','Enter activates the nearest door');
engine.x = engine.scenes.corridor1.doors.find(door=>door.id==='chinese').x;
run(30);
engine.keyDown({key:' ',repeat:false,preventDefault(){}});
assert.equal(engine.location,'chinese','Space activates a classroom door');

const originalBounds=game.view.getBoundingClientRect;
game.view.getBoundingClientRect=()=>({left:0,top:0,width:390,height:788});
world.devicePixelRatio=2;engine.resize();
assert.equal(game.view.height,1576,'backing raster follows CSS height times density');
assert.ok(Math.abs(game.view.width-780)<=2,'backing raster follows the portrait viewport');
assert.equal(context2d.imageSmoothingEnabled,false,'pixel-art interpolation remains disabled');
game.view.getBoundingClientRect=()=>({left:0,top:208,width:390,height:636});
world.devicePixelRatio=1;engine.resize();engine.setLocation('corridor1');
const mountedDoor=engine.scenes.corridor1.doors.find(door=>door.id==='chinese');
engine.x=mountedDoor.x;engine.camera=0;run(30);
engine.pointer({button:0,clientX:mountedDoor.x*390/engine.viewWidth,clientY:208+(mountedDoor.plaqueTop+14)*636/500});
assert.equal(engine.location,'chinese','clicking the mounted plaque works with a canvas inset below mobile HUD');
game.view.getBoundingClientRect=originalBounds;world.devicePixelRatio=1;engine.resize();
const drawnText=[],oldText=engine.text;engine.text=(ctx,text)=>drawnText.push(text);
Object.getPrototypeOf(engine).render.call(engine);engine.text=oldText;
for(const actor of engine.npcs()) assert.ok(!drawnText.includes(actor.name.zh),'names are shown in dialogue only');

// Purposeful routines use the animation clock, explicit state transitions and
// resumable checkpoints, rather than timers or short random pacing.
function routineFixture() {
  const fixture = launch();
  fixture.engine.setLocation('chinese');
  fixture.advance = seconds => {
    for (let left = seconds; left > 0; left -= .04) fixture.engine.updateActors(Math.min(.04, left));
  };
  fixture.until = (predicate, seconds = 90) => {
    for (let left = seconds; left > 0 && !predicate(); left -= .04) fixture.engine.updateActors(.04);
    assert.ok(predicate(), 'routine reaches its expected state within a bounded time');
  };
  return fixture;
}
const daily = routineFixture(), dailyEngine = daily.engine, reader = dailyEngine.npcs()[0];
daily.until(() => reader.state === 'activity');
assert.equal(reader.activity, 'read');
assert.ok(reader.duration >= 40 && reader.duration <= 60, 'primary duty has a substantial declared dwell');
const readingX = reader.x, readingStep = reader.stepIndex;
daily.advance(5);
const readElapsed = reader.elapsed, animationElapsed = reader.activityElapsed;
dailyEngine.setTalking(reader.id, true);
daily.advance(10);
assert.equal(reader.state, 'converse');
assert.equal(reader.x, readingX);
assert.equal(reader.checkpoint.elapsed, readElapsed, 'conversation does not consume saved duty time');
dailyEngine.setTalking(reader.id, false);
assert.ok(reader.duration >= 2 && reader.duration <= 4, 'conversation has a small recovery pause');
daily.until(() => reader.state === 'activity', 5);
assert.equal(reader.stepIndex, readingStep);
assert.equal(reader.x, readingX, 'resuming a task never teleports its actor');
assert.equal(reader.elapsed, readElapsed);
assert.equal(reader.activityElapsed, animationElapsed);
const observed = new Set();
for (let i = 0; i < 2500 && reader.stepIndex === readingStep; i++) { dailyEngine.updateActors(.04); observed.add(reader.state); }
assert.ok(observed.has('recover') && reader.state === 'prepare');
daily.until(() => reader.state === 'walk', 3);
assert.equal(reader.stepIndex, 1);
assert.ok(reader.x > readingX && reader.x < dailyEngine.routineStep(reader).x, 'the next station is reached by real walking');
daily.until(() => reader.state === 'arrive', 3);
assert.equal(reader.x, dailyEngine.routineStep(reader).x);
assert.equal(reader.speed, 0, 'arrival settles before starting a new activity');

const social = routineFixture(), socialEngine = social.engine, leader = socialEngine.npcs()[0];
const socialScene = socialEngine.scenes.chinese;
leader.stepIndex = 1; leader.x = leader.routine.steps[1].x; leader.depth = 0;
leader.state = 'activity'; leader.activityDwell = 30;
assert.equal(socialEngine.beginPair(leader), true);
const pair = socialScene.pairs.get(leader.pairId), partner = pair.partner;
partner.x = partner.routineOverride.x; partner.depth = partner.routineOverride.depth;
partner.state = 'arrive'; partner.elapsed = 0;
social.until(() => pair.started, 1);
assert.equal(leader.direction, Math.sign(partner.x - leader.x));
assert.equal(partner.direction, -leader.direction, 'partners actually face each other');
assert.notEqual(leader.pairTalking, partner.pairTalking, 'only one participant gestures at a time');
const leaderFirst = leader.pairTalking;
social.advance(pair.turnDuration + .04);
assert.notEqual(leader.pairTalking, leaderFirst, 'listening and speaking alternate after a natural pause');
const pairX = leader.x;
socialEngine.setTalking(leader.id, true);
assert.equal(socialScene.pairs.size, 0, 'player interaction cancels both sides of a shared routine');
assert.equal(partner.pairId, null);
assert.equal(partner.routineOverride, null);
assert.equal(partner.state, 'recover');
assert.ok(leader.pairCooldown >= 45 && leader.pairCooldown <= 90);
socialEngine.setTalking(leader.id, false);
social.until(() => leader.state === 'activity', 5);
assert.equal(leader.x, pairX);
assert.equal(leader.stepIndex, 1, 'the interrupted pair duty resumes before continuing its route');
assert.equal(leader.pairId, null, 'a cooldown prevents immediate repetitive exchanges');

const blocked = routineFixture(), blockedEngine = blocked.engine, blockedLeader = blockedEngine.npcs()[0];
blockedLeader.stepIndex = 1; blockedLeader.x = blockedLeader.routine.steps[1].x;
blockedLeader.state = 'activity'; blockedLeader.activityDwell = 25;
assert.equal(blockedEngine.beginPair(blockedLeader), true);
const blockedPartner = blockedEngine.scenes.chinese.pairs.get(blockedLeader.pairId).partner;
blockedPartner.x = 80;
blockedEngine.actorCanWalk = () => false;
blocked.advance(2.1);
assert.equal(blockedEngine.scenes.chinese.pairs.size, 0, 'an unavailable partner cannot deadlock the scene');
assert.equal(blockedLeader.state, 'activity');
assert.equal(blockedPartner.routineOverride, null);
assert.ok(blockedLeader.duration >= 20, 'failed pairing returns to a meaningful quiet dwell');

const frozen = routineFixture(), frozenEngine = frozen.engine, frozenActor = frozenEngine.npcs()[0];
frozen.until(() => frozenActor.state === 'activity');
const elapsedBeforeFreeze = frozenActor.elapsed;
for (const condition of ['paused', 'reducedMotion', 'hidden']) {
  const target = condition === 'hidden' ? frozen.document : frozenEngine;
  target[condition] = true; frozen.advance(30); target[condition] = false;
  assert.equal(frozenActor.elapsed, elapsedBeforeFreeze, condition + ' does not advance background duties');
}
frozen.advance(.04);
assert.ok(frozenActor.elapsed - elapsedBeforeFreeze < .05, 'returning does not replay hidden time');
const station = frozenEngine.routineStep(frozenActor), stranger = frozenEngine.scenes.chinese.ambient[0];
frozenEngine.scenes.chinese.reservations.clear();
assert.equal(frozenEngine.reserveStation(frozenActor, station), true);
assert.equal(frozenEngine.reserveStation(stranger, station), false, 'two actors cannot occupy one reserved activity station');

// A real, measured activity frame keeps the same identity scale and foot anchor.
const art = routineFixture(), artEngine = art.engine, artist = artEngine.npcs()[0], activityCalls = [];
art.window.CAMPUS_CHARACTERS.activity = (id, activity, elapsed, avatar, stage) => {
  activityCalls.push({ id, activity, elapsed, stage });
  return { atlas: { src: 'activity-test.png', facing: 'right' }, identity: { standingHeight: 200 }, frame: frames[1] };
};
artist.activity = 'read'; artist.state = 'arrive'; artist.elapsed = .1;
assert.equal(artEngine.drawRoutineActivity(art.context2d, artist, 100, 300, artist.look), true);
assert.equal(activityCalls.at(-1).stage, 'enter');
const activityDraw = art.draws.at(-1);
assert.equal(activityDraw[8], Math.round(artEngine.characterHeight(artist.look) * .8), 'a bent pose is not stretched taller');
artist.state = 'activity'; artist.activityElapsed = 4;
artEngine.drawRoutineActivity(art.context2d, artist, 100, 300, artist.look);
assert.equal(activityCalls.at(-1).elapsed, 4);
assert.equal(activityCalls.at(-1).stage, 'loop');
artist.state = 'recover'; artEngine.drawRoutineActivity(art.context2d, artist, 100, 300, artist.look);
assert.equal(activityCalls.at(-1).stage, 'exit');
artEngine.reducedMotion = true;
artist.state = 'walk';
artEngine.drawRoutineActivity(art.context2d, artist, 100, 300, artist.look);
assert.equal(activityCalls.at(-1).elapsed, 0);
assert.equal(activityCalls.at(-1).stage, 'loop');
assert.equal(activityCalls.at(-1).activity, 'read', 'reduced motion replaces a interrupted walk with a meaningful static duty pose');
artEngine.reducedMotion = false;
art.window.CAMPUS_CHARACTERS.activity = () => null;
artist.state = 'activity'; let neutralDraws = 0;
artEngine.worldSprite = () => neutralDraws++;
artEngine.drawRoutineActor(art.context2d, artist, 0, 300);
assert.equal(neutralDraws, 1, 'missing artwork uses exactly one existing neutral character, without fake floating props');
assert.ok(artEngine.activityDiagnostics.has(artist.characterId + ':read'));
for (const fixture of [other, daily, social, blocked, frozen, art]) fixture.engine.destroy();

// Run unforced schedules: static station checks alone cannot detect a pupil
// occupying a teacher's destination or a doorway making a partner unreachable.
const naturalExchanges = new Set();
for (const location of Object.keys(world.CAMPUS_LOCATIONS)) {
  const fixture = launch(), localEngine = fixture.engine;
  localEngine.setLocation(location);
  for (let frame = 0; frame < 4500; frame++) {
    localEngine.updateActors(.04);
    for (const pair of localEngine.scenes[location].pairs.values()) if (pair.started) {
      naturalExchanges.add(pair.leader.id);
      assert.notEqual(pair.leader.pairTalking, pair.partner.pairTalking);
      assert.equal(pair.leader.direction, -pair.partner.direction);
    }
  }
  for (const actor of localEngine.npcs()) assert.ok(naturalExchanges.has(actor.id), actor.id + ' can naturally reach a reciprocal exchange without fixture teleporting');
  localEngine.destroy();
}
assert.equal(naturalExchanges.size, 20);

engine.destroy();
assert.equal(engine.destroyed, true);
assert.ok(!game.listeners.has('campus-art-ready'), 'asset listeners are removed on destroy');
console.log('Campus engine: identity, crop, input intent, 18 rooms, mounted plaques, purposeful duties, reciprocal pairs, interruption, missing-art fallback, reduced motion, fixed scale and lifecycle checks passed.');
