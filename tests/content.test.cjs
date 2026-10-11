'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

// Load the static content contract without requiring a browser or executing the app.
const context = vm.createContext({ window: {} });
const filename = __dirname + '/../public/campus/content.js';
vm.runInContext(fs.readFileSync(filename, 'utf8'), context, { filename, timeout: 1000 });

for (const file of ['characters.js', 'engine.js']) {
  vm.runInContext(fs.readFileSync(__dirname + '/../public/campus/' + file, 'utf8'), context, { filename: file, timeout: 1000 });
}
const { GAME_CONTENT, TRANSFER_CONTENT, CAMPUS_CHARACTERS, CAMPUS_LOCATIONS } = context.window;
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
  privacy: 'corridor1',
  culture: 'corridor2',
  access: 'corridor3'
};
const meetingLabels = {
  corridor: {zh: '地下走廊', cn: '地下走廊', en: 'ground-floor corridor'},
  corridor1: {zh: '一樓走廊', cn: '一楼走廊', en: '1F corridor'},
  corridor2: {zh: '二樓走廊', cn: '二楼走廊', en: '2F corridor'},
  corridor3: {zh: '三樓走廊', cn: '三楼走廊', en: '3F corridor'},
};
const retiredNames = /一心|允行|家寶|家宝|思賢|思贤|Yat-sum|Wan-hang|Ka-po|Sze-yin/;
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

  // Test the prose as well as the dialogue heading: the app's registry lookup
  // previously concealed obsolete names and meeting places inside case text.
  const identity = CAMPUS_CHARACTERS.resolve(mission.id);
  assert.ok(identity, `${path}: world/portrait identity must exist`);
  const place = CAMPUS_LOCATIONS[mission.location];
  assert.equal(place?.kind, 'corridor', `${path}: this classmate is met in a corridor`);
  assert.equal(place.floor, Object.keys(expectedLocations).indexOf(mission.id), `${path}: meeting floor matches the campus`);
  for (const locale of locales) {
    assert.equal(mission.name[locale], identity.name[locale], `${path}: canonical ${locale} name`);
    assert.ok(mission.scene[locale].includes(identity.name[locale]), `${path}: scene uses the same ${locale} identity`);
    assert.ok(mission.scene[locale].includes(meetingLabels[mission.location][locale]), `${path}: scene describes the actual ${locale} meeting place`);
  }
  assert.ok(!retiredNames.test(JSON.stringify(mission)), `${path}: retired NPC names must not remain in evidence or prose`);
  if (/\bHe\b/.test(mission.scene.en)) assert.equal(identity.gender, 'boy', `${path}: singular pronoun matches identity`);
  if (/\bShe\b/.test(mission.scene.en)) assert.equal(identity.gender, 'girl', `${path}: singular pronoun matches identity`);


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
