#!/usr/bin/env node
// Authoring-only: produces audition files, never changes the live game's audio.
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LANGUAGES = Object.freeze({ zh: 'yue-HK', cn: 'cmn-CN', en: 'en-GB' });
const PRICE_PER_CHARACTER = 0.00003; // Gross estimate, before free allowance/tax.
const sha256 = value => createHash('sha256').update(value).digest('hex');
const safeId = value => typeof value === 'string' && /^[a-z][a-z0-9-]{0,79}$/.test(value);

export function planVoices(cast, corpus) {
  if (cast?.schemaVersion !== 1 || corpus?.schemaVersion !== 1 || cast.provider !== 'google-chirp3-hd') throw Error('Unsupported voice data schema.');
  if (Object.keys(cast.locales || {}).length !== 3 || Object.entries(LANGUAGES).some(([key, value]) => cast.locales[key] !== value)) throw Error('Explicit Cantonese, Mandarin and English locale mapping is required.');
  if (!Array.isArray(corpus.lines) || !corpus.lines.length) throw Error('No audition lines.');
  const voices = Object.values(cast.characters || {}).map(item => item.voice);
  if (new Set(voices).size !== voices.length) throw Error('Each character needs a distinct voice.');
  const ids = new Set();
  return corpus.lines.flatMap(line => {
    if (!safeId(line.id) || !safeId(line.characterId) || ids.has(line.id)) throw Error('Invalid or duplicate line ID.');
    ids.add(line.id);
    const actor = cast.characters[line.characterId];
    if (!actor || !/^[A-Za-z]+$/.test(actor.voice) || !Number.isFinite(actor.rate) || actor.rate < 0.75 || actor.rate > 1.25) throw Error(`Invalid cast for ${line.characterId}.`);
    return Object.entries(LANGUAGES).map(([locale, languageCode]) => {
      const text = line.text?.[locale]?.trim();
      if (!text || Buffer.byteLength(text, 'utf8') > 4500) throw Error(`Missing or oversized ${locale} script for ${line.id}.`);
      const request = { input: { text }, voice: { languageCode, name: `${languageCode}-Chirp3-HD-${actor.voice}` }, audioConfig: { audioEncoding: 'MP3', speakingRate: actor.rate } };
      const fingerprint = sha256(JSON.stringify(request));
      return { id: `${line.id}:${locale}`, characterId: line.characterId, locale, text, textHash: sha256(text), request, fingerprint, characters: [...text].length, file: `${locale}/${line.characterId}/${line.id}-${fingerprint.slice(0, 16)}.mp3` };
    });
  });
}

export function validateProviderVoices(plan, available) {
  for (const item of plan) {
    const voice = available.find(voice => voice.name === item.request.voice.name);
    if (!voice?.languageCodes?.includes(item.request.voice.languageCode)) throw Error(`The project does not offer ${item.request.voice.name}; no substitute will be used.`);
  }
}

export function estimate(plan) {
  const characters = plan.reduce((sum, item) => sum + item.characters, 0);
  return { clips: plan.length, characters, grossUsd: Number((characters * PRICE_PER_CHARACTER).toFixed(6)), pricePerMillionCharactersUsd: 30 };
}

function parseArgs(args) {
  const options = { generate: false, input: resolve(ROOT, 'data/voice-auditions.json'), output: resolve(ROOT, 'design/voice-auditions') };
  for (let index = 0; index < args.length; index++) {
    const name = args[index];
    if (name === '--generate') options.generate = true;
    else if (name === '--dry-run') continue;
    else if (['--input', '--output', '--project', '--max-cost-usd'].includes(name)) {
      const value = args[++index];
      if (!value || value.startsWith('--')) throw Error(`Missing value for ${name}.`);
      options[{ '--input': 'input', '--output': 'output', '--project': 'project', '--max-cost-usd': 'maxCost' }[name]] = value;
    } else throw Error(`Unknown option: ${name}`);
  }
  return options;
}

async function saveJson(path, data) {
  await writeFile(`${path}.tmp`, `${JSON.stringify(data, null, 2)}\n`);
  await rename(`${path}.tmp`, path);
}

export async function main(args = process.argv.slice(2)) {
  const options = parseArgs(args);
  const cast = JSON.parse(await readFile(resolve(ROOT, 'data/voice-cast.json'), 'utf8'));
  const corpus = JSON.parse(await readFile(resolve(options.input), 'utf8'));
  const plan = planVoices(cast, corpus), totals = estimate(plan);
  console.log(JSON.stringify({ mode: options.generate ? 'generate' : 'dry-run', ...totals, locales: LANGUAGES, output: resolve(options.output), note: 'Gross estimate before free allowance and tax. Auditions are not approved game assets.' }, null, 2));
  if (!options.generate) return totals; // No credentials, network, or files in dry run.
  if (!/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(options.project || '')) throw Error('Pass the Google Cloud project ID with --project.');
  const ceiling = Number(options.maxCost);
  if (!Number.isFinite(ceiling) || ceiling <= 0 || totals.grossUsd > ceiling) throw Error('A positive --max-cost-usd covering this batch estimate is required. This is not a provider billing cap.');

  // Short-lived token stays in this process; never log it or put it in a file.
  let token;
  try { token = execFileSync('gcloud', ['auth', 'print-access-token', '--quiet'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 30000 }).trim(); }
  catch { throw Error('Google Cloud sign-in is unavailable. Follow docs/GOOGLE-CLOUD-VOICE-SETUP.zh-Hant.md.'); }
  if (!token) throw Error('Google Cloud returned no access token.');
  const headers = { Authorization: `Bearer ${token}`, 'x-goog-user-project': options.project, 'Content-Type': 'application/json' };
  async function api(path, body) {
    const response = await fetch(`https://texttospeech.googleapis.com/v1/${path}`, { method: body ? 'POST' : 'GET', headers, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(60000) });
    if (!response.ok) throw Error(`Google Text-to-Speech returned HTTP ${response.status}. Batch stopped; successful clips are preserved. No automatic synthesis retry.`);
    return response.json();
  }
  const catalog = await api('voices');
  validateProviderVoices(plan, catalog.voices || []);
  const output = resolve(options.output), manifestPath = resolve(output, 'manifest.json');
  await mkdir(output, { recursive: true });
  let manifest = { schemaVersion: 1, provider: cast.provider, status: 'audition-only', entries: {} };
  try { manifest = JSON.parse(await readFile(manifestPath, 'utf8')); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (manifest.schemaVersion !== 1 || manifest.provider !== cast.provider || manifest.status !== 'audition-only' || !manifest.entries || typeof manifest.entries !== 'object') throw Error('Unrecognized existing audition manifest.');

  for (const item of plan) {
    const target = resolve(output, item.file), prior = manifest.entries[item.id];
    if (prior?.fingerprint === item.fingerprint && prior.file === item.file) {
      try { if (sha256(await readFile(target)) === prior.audioHash) { console.log(`Cached ${item.id}`); continue; } }
      catch (error) { if (error.code !== 'ENOENT') throw error; }
    }
    // Submit one complete utterance. Never synthesize or concatenate characters.
    const result = await api('text:synthesize', item.request);
    if (typeof result.audioContent !== 'string' || !/^[A-Za-z0-9+/]+={0,2}$/.test(result.audioContent)) throw Error(`Missing audio for ${item.id}.`);
    const bytes = Buffer.from(result.audioContent, 'base64');
    if (bytes.length < 256 || !(bytes.subarray(0, 3).toString() === 'ID3' || (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0))) throw Error(`Invalid MP3 response for ${item.id}.`);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(`${target}.tmp`, bytes);
    await rename(`${target}.tmp`, target);
    manifest.entries[item.id] = { characterId: item.characterId, locale: item.locale, languageCode: item.request.voice.languageCode, voice: item.request.voice.name, rate: item.request.audioConfig.speakingRate, text: item.text, textHash: item.textHash, fingerprint: item.fingerprint, audioHash: sha256(bytes), file: item.file, generatedAt: new Date().toISOString(), approved: false };
    await saveJson(manifestPath, manifest);
    console.log(`Generated ${item.id}`);
  }
  console.log('Auditions saved. Listen and approve each language before connecting these files to the game.');
  return totals;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
