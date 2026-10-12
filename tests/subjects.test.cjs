'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const filename = __dirname + '/../public/campus/game/subjects.js';
const context = vm.createContext({ window: {} });
vm.runInContext(fs.readFileSync(filename, 'utf8'), context, { filename, timeout: 1000 });

const rooms = context.window.SUBJECT_CONTENT;
const locales = ['zh', 'cn', 'en'];
const floors = {
  playground: 0, hall: 0,
  chinese: 1, english: 1, maths: 1,
  chemistry: 2, geography: 2, computer: 2,
  history: 3, art: 3, music: 3,
  library: 4, rooftop: 4
};
const tiers = ['foundation', 'application', 'challenge'];
const roomIds = new Set();
let questions = 0;
let maximumStars = 0;
let textObjects = 0;

function translated(value, path) {
  assert.ok(value && typeof value === 'object' && !Array.isArray(value), `${path}: expected translated text`);
  for (const locale of locales) {
    assert.equal(typeof value[locale], 'string', `${path}.${locale}: translation missing`);
    assert.ok(value[locale].trim(), `${path}.${locale}: translation empty`);
  }
  textObjects++;
}

assert.ok(Array.isArray(rooms), 'SUBJECT_CONTENT must be an array');
assert.equal(rooms.length, 13, 'Five-floor campus requires 13 subject rooms');

for (const room of rooms) {
  const label = `room[${room.id}]`;
  assert.ok(Object.hasOwn(floors, room.id), `${label}: unexpected room id`);
  assert.ok(!roomIds.has(room.id), `${label}: duplicate would overwrite saved progress`);
  roomIds.add(room.id);
  assert.equal(room.location, room.id, `${label}: location must identify its room`);
  assert.equal(room.floor, floors[room.id], `${label}: incorrect campus floor`);
  for (const key of ['title', 'subject', 'description', 'npcName', 'npcRole']) {
    translated(room[key], `${label}.${key}`);
  }
  assert.ok(Array.isArray(room.levels), `${label}: missing levels`);
  assert.equal(room.levels.length, 3, `${label}: three levels required`);
  const positions = new Set();
  room.levels.forEach((level, index) => {
    const path = `${label}.${level.id}`;
    assert.equal(level.id, tiers[index], `${path}: invalid progression order`);
    assert.equal(level.stars, index + 1, `${path}: awards must be 1, 2 and 3 stars`);
    maximumStars += level.stars;
    questions++;
    for (const key of ['title', 'question', 'takeaway']) translated(level[key], `${path}.${key}`);
    assert.ok(Array.isArray(level.options), `${path}: missing choices`);
    assert.equal(level.options.length, 3, `${path}: three choices required`);
    const correct = [];
    level.options.forEach((option, choice) => {
      translated(option.text, `${path}.options[${choice}].text`);
      translated(option.feedback, `${path}.options[${choice}].feedback`);
      assert.equal(typeof option.correct, 'boolean', `${path}.options[${choice}]: correct must be boolean`);
      if (option.correct) correct.push(choice);
    });
    assert.equal(correct.length, 1, `${path}: completion requires exactly one accepted answer`);
    positions.add(correct[0]);
  });
  assert.ok(positions.size > 1, `${label}: vary correct-answer positions`);
  console.log(`PASS ${room.id}: floor ${room.floor}, three levels, 6 available stars`);
}

assert.equal(roomIds.size, Object.keys(floors).length, 'Every expected room must be present');
assert.equal(questions, 39, 'Expected 39 finite knowledge checks');
assert.equal(maximumStars, 78, 'Subject checks must contribute exactly 78 available stars');

// The language-learning sentence choices must remain English in every UI locale.
const english = rooms.find(room => room.id === 'english');
for (const level of english.levels) {
  for (const option of level.options) {
    assert.equal(option.text.zh, option.text.en, `${level.id}: preserve the English learning text in zh`);
    assert.equal(option.text.cn, option.text.en, `${level.id}: preserve the English learning text in cn`);
  }
}

console.log(`PASS subject integrity: ${roomIds.size} rooms, ${questions} checks, ${maximumStars} stars, ${textObjects} complete three-language objects`);
console.log('Content completion records practice; it does not establish full subject mastery.');
