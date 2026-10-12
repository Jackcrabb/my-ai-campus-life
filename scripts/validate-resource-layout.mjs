// Check deployable paths after resource organization. No browser or network needed.
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const campus = resolve(root, 'public/campus');
const checked = new Set();
const source = async path => readFile(path, 'utf8');

async function check(base, value, origin) {
  if (!value || /^(?:[a-z]+:|#|\/\/)/i.test(value)) return;
  const clean = decodeURIComponent(value.split(/[?#]/)[0]);
  const target = clean.startsWith('/') ? resolve(root, 'public', '.' + clean) : resolve(base, clean);
  assert.ok(target.startsWith(campus + sep) || target === resolve(root, 'public/favicon.svg'), `Unexpected resource root: ${origin}: ${value}`);
  assert.ok((await stat(target).catch(() => null))?.isFile(), `Missing resource: ${origin}: ${value}`);
  checked.add(relative(root, target));
}

const index = await source(resolve(campus, 'index.html'));
for (const match of index.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
  await check(campus, match[1], 'index.html');
}
const runtimeFiles = await readdir(resolve(campus, 'game'));
assert.ok(runtimeFiles.includes('app.js') && runtimeFiles.includes('teacher-ui.js'), 'Game source belongs in game/');
for (const filename of runtimeFiles) {
  if (!/\.(?:css|js)$/.test(filename)) continue;
  const path = resolve(campus, 'game', filename), text = await source(path);
  assert.doesNotMatch(text, /assets\/(?:voices|fonts|activities|backgrounds|characters|icons|life|portraits|ui)\//, `Legacy path in ${filename}`);
  if (filename.endsWith('.css')) for (const match of text.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
    await check(dirname(path), match[1], filename);
  }
  if (filename.endsWith('.js')) for (const match of text.matchAll(/["'`]((?:images|audio|resources)\/[^"'`]+\.(?:png|svg|mp3|woff2))["'`]/g)) {
    if (!match[1].includes('${')) await check(campus, match[1], filename);
  }
}

const context = vm.createContext({ window: {} });
for (const filename of ['characters.js', 'campus-art.js', 'fixed-voices.js']) {
  vm.runInContext(await source(resolve(campus, 'game', filename)), context, { filename, timeout: 2000 });
}
const registry = context.window.CAMPUS_CHARACTERS;
const sources = new Set();
const visited = new WeakSet();
function inspect(value) {
  if (!value || typeof value !== 'object' || visited.has(value)) return;
  visited.add(value);
  if (typeof value.src === 'string') sources.add(value.src);
  for (const child of Object.values(value)) inspect(child);
}
inspect(registry); inspect(context.window.CAMPUS_ART); inspect(context.window.CAMPUS_FIXED_VOICES);
for (const id of Object.keys(registry.byId)) for (const uniform of [0, 1, 2, 3]) {
  inspect(registry.portrait(id, false, { uniform }));
  inspect(registry.portrait(id, true, { uniform }));
}
for (const value of sources) await check(campus, value, 'canonical resource registry');

assert.equal((await stat(resolve(campus, 'assets')).catch(() => null)), null, 'Legacy assets/ directory should not remain');
assert.ok((await stat(resolve(root, 'resources/design')).catch(() => null))?.isDirectory(), 'Production/design evidence belongs under resources/');
assert.ok((await stat(resolve(root, 'data/grade-bank.json')).catch(() => null))?.isFile(), 'Canonical question data must remain available');
console.log(`PASS resource layout: ${checked.size} entry, stylesheet, image, font and audio references resolve; game/, images/, audio/, resources/ and data/ are present.`);
