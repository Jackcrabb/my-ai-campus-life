import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildDialogueCorpus, dialogueSnapshot, loadDialogueSources, validateDialogueCorpus } from '../scripts/export-fixed-dialogue.mjs';

const sources = await loadDialogueSources();
const snapshot = dialogueSnapshot(sources), corpus = buildDialogueCorpus(sources);
const saved = JSON.parse(await readFile(new URL('../data/fixed-dialogue-corpus.json', import.meta.url), 'utf8'));
assert.deepEqual(saved, corpus, 'committed corpus exactly matches current runtime model');
assert.equal(snapshot.characters.length, 20);assert.equal(snapshot.subjects.length, 13);assert.equal(snapshot.missions.length, 4);
assert.equal(snapshot.dialogues.length, 54, '27 routes per language include both exit and case completion states');
assert.deepEqual(validateDialogueCorpus(saved, sources), { lines: corpus.lines.length, characters: 20, locales: ['cn', 'en'] });
const tuple = line => JSON.stringify([line.characterId, line.gender, line.locale, line.text]);
assert.equal(new Set(corpus.lines.map(tuple)).size, corpus.lines.length, 'exact tuples are deduplicated');
assert.equal(new Set(corpus.lines.map(line => line.id)).size, corpus.lines.length);
for (const characterId of snapshot.characters) for (const locale of ['cn', 'en']) assert.ok(corpus.lines.some(line => line.characterId === characterId && line.locale === locale));
for (const dialogue of snapshot.dialogues) for (const text of dialogue.lines) assert.equal(corpus.lines.filter(line => tuple(line) === tuple({ ...dialogue, text })).length, 1, 'every real dialogue variant has one exact recording target');
for (const line of corpus.lines) {
  assert.match(line.id, /^[a-z0-9-]+$/);assert.ok(['male', 'female'].includes(line.gender));assert.ok(['cn', 'en'].includes(line.locale));
  assert.equal(Object.keys(line).join(','), 'id,characterId,gender,locale,text');
  assert.ok(snapshot.dialogues.some(dialogue => dialogue.characterId === line.characterId && dialogue.gender === line.gender && dialogue.locale === line.locale && dialogue.lines.includes(line.text)), 'no invented or question-derived line');
}
const changed = { ...sources, 'app.js': sources['app.js'].replace('Welcome to Ming Ching College!', 'Welcome to our new campus!') };
const revised = buildDialogueCorpus(changed);
assert.throws(() => validateDialogueCorpus(saved, changed), /stale/);
const previousWelcome = corpus.lines.find(line => line.text.startsWith('Welcome to Ming Ching College!'));
const nextWelcome = revised.lines.find(line => line.text.startsWith('Welcome to our new campus!'));
assert.ok(previousWelcome && nextWelcome);assert.notEqual(previousWelcome.id, nextWelcome.id, 'changing spoken text invalidates its recording ID');
assert.equal(revised.lines.filter(line => !corpus.lines.some(old => old.id === line.id)).length, 1, 'only the changed exact line needs regeneration');
const questionSentinel = 'DYNAMIC_QUESTION_MUST_NEVER_BE_RECORDED';
const extraQuestion = { ...sources, 'subjects.js': sources['subjects.js'] + `\nfor (const room of window.SUBJECT_CONTENT) room.levels = [{ question: {cn:'${questionSentinel}',en:'${questionSentinel}'}, options: [] }];` };
assert.deepEqual(buildDialogueCorpus(extraQuestion), corpus, 'teacher question changes cannot enter or invalidate fixed dialogue');
for (const expression of ['subjects[0].levels[0].question.cn', 'state.student.name', 'progress().stars']) {
  const unsafe = { ...sources, 'app.js': sources['app.js'].replace('  function dialogueModel() {', `  function dialogueModel() {\n    ${expression};`) };
  assert.throws(() => buildDialogueCorpus(unsafe), /Fixed dialogue cannot read/, `reject runtime dependency on ${expression}`);
}
const duplicateOpening = { ...sources, 'content.js': sources['content.js'] + '\nwindow.GAME_CONTENT.missions[0].opening.push(window.GAME_CONTENT.missions[0].opening[0]);' };
assert.deepEqual(buildDialogueCorpus(duplicateOpening), corpus, 'repeated exact lines for one character do not create duplicate files');
const invalidCharacter = { ...sources, 'characters.js': sources['characters.js'] + '\nwindow.CAMPUS_CHARACTERS.byId["staff-mentor"].gender="unknown";' };
assert.throws(() => buildDialogueCorpus(invalidCharacter), /canonical character\/gender/);
const stale = structuredClone(corpus);stale.lines[0].text += ' ';
assert.throws(() => validateDialogueCorpus(stale, sources), /stale/, 'whitespace is part of the exact runtime contract');
console.log(`PASS fixed dialogue: ${corpus.lines.length} exact lines; all 20 characters in cn/en; 13 subjects, 4 opening/completed cases, prologue, office, vice, finale and both exits; source revisions, gender, deduplication and exclusion of question/profile data.`);
