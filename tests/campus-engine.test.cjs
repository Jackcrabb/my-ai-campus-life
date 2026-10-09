'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..', 'public', 'campus');

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
  for (const file of ['characters.js', 'engine.js']) { let source=fs.readFileSync(path.join(root,file),'utf8'); if(file==='engine.js')source=source.replace('window.CampusEngine = CampusEngine;', 'window.testSkinPixel = isSkinPixel; window.CampusEngine = CampusEngine;'); vm.runInContext(source,context,{filename:file}); }
  window.CAMPUS_ART = Object.fromEntries(Object.keys(window.CAMPUS_LOCATIONS).map(id => [id, { src: 'background.png', groundY: 400 }]));
  const view = canvas();
  const engine = new window.CampusEngine({ canvas: view, onInteract: id => interactions.push(id) });
  document.activeElement = view;
  engine.render = () => {};
  let time = 20;
  const run = (frames = 1) => { for (let i = 0; i < frames; i++) { time += 20; engine.tick(time); } };
  const tap = (x, y) => engine.pointer({ button: 0, clientX: x - engine.camera, clientY: y });
  return { engine, window, view, draws, interactions, run, tap, context2d, listeners };
}

const game = launch(), { engine, window: world, interactions, run, tap, draws, context2d } = game;
const registry = world.CAMPUS_CHARACTERS;
assert.equal(world.testSkinPixel(252,199,164,254),true,'source skin colors can be selected');
for(const rgba of [[252,253,255,254],[198,62,52,254],[70,76,91,254],[252,199,164,0],[78,55,46,254]])assert.equal(world.testSkinPixel(...rgba),false,'white fabric,redbelt,navy,transparent pixels and dark hair are excluded');

for (const atlas of Object.values(registry.atlases)) {
  const bytes = fs.readFileSync(path.join(root,atlas.src));
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
assert.equal(registry.resolve('voice').name.zh,'一心');
assert.equal(registry.resolve('staff-principal').name.zh,'何修端校長');
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
  assert.ok(scene.ambient.length >= 2 && scene.ambient.length <= 4);
  for(const actor of [scene.npc,...(scene.extras||[]),...scene.ambient]) assert.ok(engine.actorCanWalk(actor),'every main and background NPC has real walking frames: '+actor.id);
  assert.ok(scene.ambient.every(actor => actor.interactive === false));
  assert.equal(scene.npc.characterId, registry.resolve(scene.npc.id).id);
  if (scene.kind === 'room') assert.equal(scene.printer.id, 'printer:' + id);
}
assert.equal(Object.values(engine.scenes).filter(scene => scene.printer).length, 13);
for (const gender of ['boy', 'girl']) for (let uniform = 0; uniform < 4; uniform++) for (let hair = 0; hair < 2; hair++) {
  assert.equal(registry.player({ gender, uniform, hair }).atlasId, `player-${gender}-${uniform}`);
  assert.equal(registry.player({ gender, uniform, hair }).hair, hair);
}

const npc = engine.npcs()[0], originalX = npc.x;
const readyCaseAtlas = registry.atlases['student-voice'];
delete registry.atlases['student-voice'];
engine.x = npc.x - 30;
run(220);
assert.equal(interactions.length, 0, 'proximity alone never opens dialogue');
assert.equal(npc.x, originalX, 'an actor with no walking atlas stays grounded and still');
registry.atlases['student-voice'] = readyCaseAtlas;
tap(npc.x, engine.groundY() + 14);
run(70);
assert.equal(interactions.length, 0, 'tapping the floor/nameplate beneath an NPC only moves');
assert.equal(engine.pendingInteraction, null);
tap(npc.x, engine.groundY() - 90);
run(30);
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

engine.setLocation('chinese');
engine.x = engine.scenes.chinese.printer.x;
run(30);
engine.keyDown({ key: 'e', repeat: false, preventDefault() {} });
assert.equal(interactions.at(-1), 'printer:chinese');
engine.setLocation('maths');
const printer = engine.scenes.maths.printer;
engine.x = printer.x - 30;
run(30);
tap(printer.x, engine.groundY() - 60);
assert.equal(interactions.at(-1), 'printer:maths');
engine.setLocation('corridor4');
engine.x = engine.npcs()[0].x;
run(30);
engine.keyDown({ key: 'E', repeat: false, preventDefault() {} });
assert.equal(interactions.at(-1), 'finale');

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
teacher.nextChange = 0;
run(70);
assert.equal(teacher.state, 'walk');
assert.ok(teacher.x > home && teacher.x <= home + 94);
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
assert.equal(teacher.state, 'stop');
assert.equal(teacher.phase, 0, 'the actor returns to neutral on conversation exit');
draws.length = 0;
engine.drawAtlasCharacter(context2d, 100, 300, {...teacher.look,talking:false}, false, 0, -1, true);
assert.equal(draws.at(-1)[1], 0, 'conversation exit restores the neutral frame');

run(800);
assert.ok(teacher.x >= home - 94 && teacher.x <= home + 94, 'staff wander within their assigned room area');
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
engine.destroy();
assert.equal(engine.destroyed, true);
assert.ok(!game.listeners.has('campus-art-ready'), 'asset listeners are removed on destroy');
console.log('Campus engine: identity, crop, input intent, 18 rooms, printers, fixed scale, movement and lifecycle checks passed.');
