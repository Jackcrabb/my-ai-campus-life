'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

// Load the static content contract without requiring a browser or executing the app.
const context = vm.createContext({ window: {} });
const filename = __dirname + '/../public/campus/content.js';
vm.runInContext(fs.readFileSync(filename, 'utf8'), context, { filename, timeout: 1000 });

const { GAME_CONTENT, TRANSFER_CONTENT } = context.window;
const locales = ['zh', 'cn', 'en'];
let translatedFields = 0;

function translated(value, path) {
  assert.ok(value && typeof value === 'object' && !Array.isArray(value), `${path}: expected a translated object`);
  for (const locale of locales) {
    assert.equal(typeof value[locale], 'string', `${path}.${locale}: missing translation`);
    assert.ok(value[locale].trim(), `${path}.${locale}: empty translation`);
  }
}

function checkAllTranslations(value, path) {
  if (!value || typeof value !== 'object') return;
  if (locales.some(locale => Object.hasOwn(value, locale))) {
    translated(value, path);
    translatedFields++;
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    checkAllTranslations(child, `${path}.${key}`);
  }
}

function threeOptions(options, path) {
  assert.ok(Array.isArray(options), `${path}: expected options`);
  assert.equal(options.length, 3, `${path}: the game requires three selectable choices`);
  options.forEach((option, index) => {
    translated(option.text, `${path}[${index}].text`);
    translated(option.feedback, `${path}[${index}].feedback`);
  });
}

function oneAcceptedAnswer(options, path) {
  threeOptions(options, path);
  const accepted = [];
  options.forEach((option, index) => {
    assert.equal(typeof option.correct, 'boolean', `${path}[${index}].correct: expected a boolean`);
    if (option.correct) accepted.push(index);
  });
  assert.equal(accepted.length, 1, `${path}: exactly one accepted answer is needed for completion`);
  return accepted[0];
}

assert.ok(GAME_CONTENT && typeof GAME_CONTENT === 'object', 'GAME_CONTENT must be exported');
assert.ok(Array.isArray(GAME_CONTENT.missions), 'GAME_CONTENT.missions must be an array');
assert.equal(GAME_CONTENT.missions.length, 4, 'The campus investigation requires four cases');

const expectedLocations = {
  voice: 'corridor',
  privacy: 'computer',
  culture: 'library',
  access: 'courtyard'
};
const missionIds = new Set();
const bestDecisionPositions = new Set();
const translatedMissionFields = [
  'name', 'role', 'title', 'tag', 'subtitle', 'scene', 'task', 'takeaway', 'languageMove'
];

for (const mission of GAME_CONTENT.missions) {
  const path = `mission[${mission.id}]`;
  assert.ok(Object.hasOwn(expectedLocations, mission.id), `${path}: unknown campus case`);
  assert.ok(!missionIds.has(mission.id), `${path}: duplicate case id would overwrite progress`);
  missionIds.add(mission.id);
  assert.equal(mission.location, expectedLocations[mission.id], `${path}: case must match its campus location`);
  assert.ok(Number.isInteger(mission.portrait) && mission.portrait >= 0 && mission.portrait < 4,
    `${path}: portrait must address an existing character`);
  for (const field of ['icon', 'color']) {
    assert.ok(typeof mission[field] === 'string' && mission[field].trim(), `${path}.${field}: missing visual metadata`);
  }
  for (const field of translatedMissionFields) translated(mission[field], `${path}.${field}`);

  assert.ok(Array.isArray(mission.opening), `${path}.opening: dialogue must be an array`);
  assert.equal(mission.opening.length, 2, `${path}.opening: two opening dialogue lines are required`);
  mission.opening.forEach((line, index) => translated(line, `${path}.opening[${index}]`));

  assert.ok(Array.isArray(mission.evidence), `${path}.evidence: expected evidence cards`);
  assert.equal(mission.evidence.length, 3, `${path}.evidence: three clues are required for the investigation`);
  mission.evidence.forEach((clue, index) => {
    translated(clue.label, `${path}.evidence[${index}].label`);
    translated(clue.text, `${path}.evidence[${index}].text`);
  });

  threeOptions(mission.options, `${path}.options`);
  const qualityLevels = new Set();
  mission.options.forEach((option, index) => {
    translated(option.title, `${path}.options[${index}].title`);
    assert.ok([0, 1, 2].includes(option.quality), `${path}.options[${index}]: invalid feedback quality`);
    qualityLevels.add(option.quality);
  });
  assert.equal(qualityLevels.size, 3, `${path}: decisions must include one weak, one partial and one strongest response`);
  bestDecisionPositions.add(mission.options.findIndex(option => option.quality === 2));

  assert.ok(mission.repair && typeof mission.repair === 'object', `${path}.repair: missing repair task`);
  translated(mission.repair.question, `${path}.repair.question`);
  const repairIndex = oneAcceptedAnswer(mission.repair.options, `${path}.repair.options`);
  console.log(`PASS ${mission.id}: three locales, three clues, valid decisions, repair answer ${repairIndex + 1}`);
}

assert.equal(missionIds.size, Object.keys(expectedLocations).length, 'Every campus case must be present');
assert.ok(bestDecisionPositions.size > 1, 'Vary the strongest decision position so learners cannot rely on one answer slot');

assert.ok(TRANSFER_CONTENT && typeof TRANSFER_CONTENT === 'object', 'TRANSFER_CONTENT must be exported');
translated(TRANSFER_CONTENT.scene, 'transfer.scene');
translated(TRANSFER_CONTENT.question, 'transfer.question');
const transferIndex = oneAcceptedAnswer(TRANSFER_CONTENT.options, 'transfer.options');

checkAllTranslations(GAME_CONTENT, 'GAME_CONTENT');
checkAllTranslations(TRANSFER_CONTENT, 'TRANSFER_CONTENT');
console.log(`PASS transfer: one accepted answer (${transferIndex + 1})`);
console.log(`PASS content integrity: ${missionIds.size} cases; ${translatedFields} complete zh/cn/en text objects`);
