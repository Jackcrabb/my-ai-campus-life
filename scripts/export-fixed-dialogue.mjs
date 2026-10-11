#!/usr/bin/env node
// Authoring-only export of the actual spoken dialogue model. No TTS requests,
// credentials, grade question bank, browser or application startup are involved.
import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LOCALES = ['cn', 'en'];
const FILES = ['app.js', 'content.js', 'subjects.js', 'characters.js'];
const tuple = line => JSON.stringify([line.characterId, line.gender, line.locale, line.text]);
const plain = value => JSON.parse(JSON.stringify(value));

export async function loadDialogueSources(root = ROOT) {
  return Object.fromEntries(await Promise.all(FILES.map(async file => [file, await readFile(resolve(root, 'public/campus', file), 'utf8')])));
}

function between(source, start, end) {
  const from = source.indexOf(start), to = source.indexOf(end, from + start.length);
  if (from < 0 || to < 0 || source.indexOf(start, from + start.length) !== -1 || source.indexOf(end, to + end.length) !== -1) {
    throw Error(`Dialogue source boundaries changed: ${start.trim()}. Review the exporter before generating audio.`);
  }
  return source.slice(from, to);
}

function onlyFields(value, fields, label) {
  const selected = Object.fromEntries(fields.map(key => [key, value[key]]));
  return new Proxy(selected, { get(target, key) {
    if (typeof key === 'symbol' || Object.hasOwn(target, key)) return target[key];
    throw Error(`Fixed dialogue cannot read ${label}.${key}; dynamic question/profile data is excluded.`);
  } });
}

export function dialogueSnapshot(sources) {
  const context = vm.createContext({ window: {} });
  for (const file of ['content.js', 'subjects.js', 'characters.js']) {
    if (typeof sources[file] !== 'string') throw Error(`Missing dialogue source: ${file}`);
    vm.runInContext(sources[file], context, { filename: file, timeout: 2000 });
  }
  const registry = context.window.CAMPUS_CHARACTERS;
  const missions = context.window.GAME_CONTENT.missions.map(m => onlyFields({ ...m, name: registry.resolve(m.id)?.name || m.name }, ['id', 'name', 'role', 'portrait', 'opening', 'takeaway'], 'mission'));
  const subjects = context.window.SUBJECT_CONTENT.map(room => onlyFields(room, ['id', 'npcName', 'npcRole', 'description'], 'subject'));
  const app = sources['app.js'];
  if (typeof app !== 'string') throw Error('Missing dialogue source: app.js');
  const languageFunctions = between(app, '  function L(zh, cn, en) {', '  function esc(s) {');
  const dialogueFunctions = between(app, '  function specialDialogue(id) {', '  function openDialogue(id) {');
  const portraitFunctions = app.match(/^  function subjectPortrait\(room\) \{[^\n]*\}$/gm);
  if (portraitFunctions?.length !== 1 || !dialogueFunctions.includes('  function dialogueModel() {')) throw Error('Dialogue model source changed; review the exporter.');
  Object.assign(context, { missions, subjects });
  vm.runInContext(`${languageFunctions}\n${portraitFunctions[0]}\n${dialogueFunctions}`, context, { filename: 'actual-dialogue-functions.js', timeout: 2000 });
  const routes = [
    { id: 'prologue' },
    ...subjects.map(room => ({ id: `subject:${room.id}` })),
    { id: 'staff:office' }, { id: 'staff:vice' }, { id: 'finale' },
    { id: 'exit', exitUnlocked: false }, { id: 'exit', exitUnlocked: true },
    ...missions.flatMap(m => [{ id: m.id, completed: false }, { id: m.id, completed: true }]),
  ];
  const dialogues = [];
  for (const locale of LOCALES) for (const route of routes) {
    context.state = onlyFields({ lang: locale }, ['lang'], 'state');
    context.dialogueId = route.id;
    context.progress = () => onlyFields({ exitUnlocked: route.exitUnlocked === true }, ['exitUnlocked'], 'progress');
    context.pstate = id => {
      if (id !== route.id) throw Error(`Unexpected mission state: ${id}`);
      return onlyFields({ completed: route.completed === true }, ['completed'], 'missionState');
    };
    const model = vm.runInContext('dialogueModel()', context, { timeout: 2000 });
    const character = registry.resolve(route.id);
    if (!character || !['boy', 'girl'].includes(character.gender)) throw Error(`Missing canonical character/gender for ${route.id}`);
    if (!model || !Array.isArray(model.lines) || !model.lines.length || model.lines.some(text => typeof text !== 'string' || !text.trim())) throw Error(`Missing dialogue lines: ${route.id}/${locale}`);
    dialogues.push({ ...route, locale, characterId: character.id, gender: character.gender === 'boy' ? 'male' : 'female', lines: plain(model.lines) });
  }
  return { characters: Object.keys(registry.byId).sort(), subjects: subjects.map(room => room.id), missions: missions.map(m => m.id), dialogues };
}

export function buildDialogueCorpus(sources) {
  const snapshot = dialogueSnapshot(sources), unique = new Map();
  for (const dialogue of snapshot.dialogues) for (const text of dialogue.lines) {
    const line = { characterId: dialogue.characterId, gender: dialogue.gender, locale: dialogue.locale, text };
    const key = tuple(line), hash = createHash('sha256').update(key).digest('hex').slice(0, 20);
    if (!unique.has(key)) unique.set(key, { id: `${line.characterId}-${line.locale}-${hash}`, ...line });
  }
  const lines = [...unique.values()].sort((a, b) => a.id.localeCompare(b.id, 'en'));
  if (new Set(lines.map(line => line.id)).size !== lines.length) throw Error('Dialogue ID collision.');
  for (const characterId of snapshot.characters) for (const locale of LOCALES) {
    if (!lines.some(line => line.characterId === characterId && line.locale === locale)) throw Error(`Missing dialogue coverage: ${characterId}/${locale}`);
  }
  return { schemaVersion: 1, lines };
}

export function validateDialogueCorpus(corpus, sources) {
  const expected = buildDialogueCorpus(sources);
  if (JSON.stringify(corpus) !== JSON.stringify(expected)) throw Error('Fixed dialogue corpus is stale or does not exactly match the runtime dialogue. Run scripts/export-fixed-dialogue.mjs.');
  return { lines: corpus.lines.length, characters: new Set(corpus.lines.map(line => line.characterId)).size, locales: [...LOCALES] };
}

export async function main(args = process.argv.slice(2)) {
  if (args.some(arg => arg !== '--check') || args.length > 1) throw Error('Usage: node scripts/export-fixed-dialogue.mjs [--check]');
  const sources = await loadDialogueSources(), destination = resolve(ROOT, 'data/fixed-dialogue-corpus.json');
  if (args.includes('--check')) {
    const result = validateDialogueCorpus(JSON.parse(await readFile(destination, 'utf8')), sources);
    console.log(`Fixed dialogue verified: ${result.lines} exact lines, ${result.characters} canonical characters, cn/en; no question audio.`);
    return result;
  }
  const corpus = buildDialogueCorpus(sources);
  await writeFile(destination, `${JSON.stringify(corpus, null, 2)}\n`);
  console.log(`Exported ${corpus.lines.length} exact cn/en dialogue lines to data/fixed-dialogue-corpus.json. No audio generated.`);
  return corpus;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { console.error(error.message); process.exitCode = 1; });
