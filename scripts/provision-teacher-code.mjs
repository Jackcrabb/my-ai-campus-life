#!/usr/bin/env node
import { randomBytes, randomUUID, createHash } from 'node:crypto';
import { mkdirSync, lstatSync, chmodSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sqlText = value => "'" + value.replaceAll("'", "''") + "'";
function field(value, name, maximum) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maximum || /[\u0000-\u001f\u007f]/.test(value))
    throw new Error(`Provide a valid ${name}.`);
  return value.trim();
}

function accessCodeFromFile(codeFile) {
  const file = resolve(field(codeFile, 'code-file path', 4096)), info = lstatSync(file);
  if (!info.isFile() || info.isSymbolicLink() || info.size > 64 || (info.mode & 0o077) !== 0)
    throw new Error('The code file must be a regular private file (permissions 600, at most 64 bytes).');
  const code = readFileSync(file, 'utf8').trim();
  if (!/^[0-9]{4,12}$/.test(code)) throw new Error('The code file must contain a 4–12 digit teacher code.');
  return code;
}

// This utility creates local files only. It never connects to a database or
// prints a credential. Apply the SQL explicitly to the intended private DB.
export function provisionTeacherCode({ label, ownerId, replaceExisting = false, codeFile, directory = join(root, '.teacher-access') }) {
  label = field(label, 'teacher label', 100);
  if (replaceExisting && !ownerId) throw new Error('--replace-existing requires --owner-id.');
  ownerId = ownerId ? field(ownerId, 'owner ID', 200) : 'teacher-' + randomUUID();
  const code = codeFile === undefined ? randomBytes(24).toString('hex') : accessCodeFromFile(codeFile);
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  if (!lstatSync(directory).isDirectory() || lstatSync(directory).isSymbolicLink())
    throw new Error('The credential directory must be a real private directory.');
  chmodSync(directory, 0o700);
  const credentialId = randomUUID();
  const codeHash = createHash('sha256').update(code).digest('hex'), createdAt = new Date().toISOString();
  const credentialPath = join(directory, credentialId + '.json'), sqlPath = join(directory, credentialId + '.sql');
  const sql = [
    '-- Private teacher credential import. The raw access code is not in this SQL.',
    '-- Apply core migration 0005_independent_teacher.sql first.',
    `INSERT INTO campus_teacher_credentials (id,owner_id,label,code_hash,created_at,revoked_at) VALUES (${[credentialId,ownerId,label,codeHash,createdAt].map(sqlText).join(',')},NULL);`,
    ...(replaceExisting ? [`UPDATE campus_teacher_credentials SET revoked_at=${sqlText(createdAt)} WHERE owner_id=${sqlText(ownerId)} AND id<>${sqlText(credentialId)} AND revoked_at IS NULL;`] : []),
    '',
  ].join('\n');
  writeFileSync(credentialPath, JSON.stringify({ ownerId, credentialId, label, accessCode: code, createdAt }, null, 2) + '\n', { mode: 0o600, flag: 'wx' });
  writeFileSync(sqlPath, sql, { mode: 0o600, flag: 'wx' });
  return { ownerId, credentialId, credentialPath, sqlPath };
}

export function main(args = process.argv.slice(2)) {
  const options = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--help') {
      console.log('Usage: node scripts/provision-teacher-code.mjs --label "Teacher label" [--owner-id EXISTING_OWNER_ID] [--replace-existing] [--code-file PRIVATE_FILE]');
      console.log('Creates private .teacher-access/*.json (code) and *.sql (hashed credential). No remote operations. Reuse the exact existing owner ID to preserve access to classes and reports.');
      console.log('By default, generates a random access code. --code-file reads a custom 4–12 digit code from a private file with permissions 600.');
      return;
    }
    if (args[i] === '--replace-existing') { options.replaceExisting = true; continue; }
    if (!['--label', '--owner-id', '--code-file'].includes(args[i]) || !args[i + 1] || args[i + 1].startsWith('--'))
      throw new Error('Unknown or incomplete option. Use --help.');
    const key = {'--label':'label','--owner-id':'ownerId','--code-file':'codeFile'}[args[i]];
    if (options[key]) throw new Error('Do not repeat an option.');
    options[key] = args[++i];
  }
  const result = provisionTeacherCode(options);
  console.log(`Private access-code file: ${result.credentialPath}`);
  console.log(`Private SQL import file: ${result.sqlPath}`);
  console.log('The access code has not been printed or uploaded. Share it privately with the intended teacher.');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(error instanceof Error ? error.message : 'Could not prepare the teacher credential.'); process.exitCode = 1; }
}
