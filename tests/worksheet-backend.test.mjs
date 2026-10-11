import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { Miniflare } from 'miniflare';
import ts from 'typescript';

// Failure-path regressions use an isolated real D1/R2 instance, never deployed data.
const root = path.resolve(import.meta.dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'campus-worksheet-backend-'));
fs.mkdirSync(path.join(temp, 'lib')); fs.mkdirSync(path.join(temp, 'data'));
for (const name of ['grade-bank.json', 'starter-bank-previous-hashes.json', 'tts-script-catalog.json'])
  fs.copyFileSync(path.join(root, 'data', name), path.join(temp, 'data', name));
for (const name of fs.readdirSync(path.join(root, 'lib')).filter(x => x.startsWith('campus-') && x.endsWith('.ts'))) {
  fs.writeFileSync(path.join(temp, 'lib', name.replace(/\.ts$/, '.js')), ts.transpileModule(fs.readFileSync(path.join(root, 'lib', name), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText);
}
const require = createRequire(path.join(temp, 'runner.cjs'));
const { handleCampus } = require(path.join(temp, 'lib/campus-api.js'));
const { hash } = require(path.join(temp, 'lib/campus-security.js'));
const { WORKSHEET_MAX_BYTES } = require(path.join(temp, 'lib/campus-worksheets.js'));
const worker = new Miniflare({ modules: true, script: "export default {fetch(){return new Response('fixture')}}", compatibilityDate: '2026-05-01', d1Databases: { DB: 'worksheet-regression' }, r2Buckets: ['BUCKET'] });
try {
  const db = await worker.getD1Database('DB'), bucket = await worker.getR2Bucket('BUCKET');
  for (const name of fs.readdirSync(path.join(root, 'drizzle')).filter(x => x.endsWith('.sql')).sort())
    for (const sql of fs.readFileSync(path.join(root, 'drizzle', name), 'utf8').split('--> statement-breakpoint').filter(x => x.trim()))
      await db.exec(sql.replace(/\n/g, ' '));
  const ctx = { db, bucket, teacher: { userId: 'fixture-teacher', email: 'teacher@example.invalid' }, env: { TEACHER_EMAILS: 'teacher@example.invalid' }, now: 1802070000000 };
  const secret = 'fixture-unlock';
  await db.prepare('INSERT INTO campus_teacher_unlocks(token_hash,owner_id,expires_at) VALUES(?,?,?)').bind(await hash(secret), ctx.teacher.userId, ctx.now + 60000).run();
  const headers = { cookie: 'campus_teacher=' + secret, origin: 'https://campus.test' };
  const pdf = '%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\n%%EOF';
  const upload = async (name, bytes = pdf) => {
    const form = new FormData();
    form.set('title', 'Original worksheet fixture'); form.set('grade', '2'); form.set('subjectId', 'maths');
    form.set('zh', new File([bytes], name, { type: 'application/pdf' }));
    return handleCampus(new Request('https://campus.test/api/campus/teacher/worksheets', { method: 'POST', headers, body: form }), ctx);
  };
  const fileRequest = id => new Request('https://campus.test/api/campus/worksheets/' + id + '/zh?download=1', { headers });
  const deleteRequest = id => new Request('https://campus.test/api/campus/teacher/worksheets/' + id, { method: 'DELETE', headers: { ...headers, 'content-type': 'application/json' }, body: '{}' });

  // The old UTF-16 slice split this emoji and made encodeURIComponent throw on GET.
  const longName = 'a'.repeat(159) + '😀.pdf';
  const uploaded = await upload(longName); assert.equal(uploaded.status, 201);
  const worksheet = (await uploaded.json()).worksheet;
  const downloaded = await handleCampus(fileRequest(worksheet.id), ctx);
  assert.equal(downloaded.status, 200, 'valid Unicode filenames must remain downloadable');
  assert.equal(await downloaded.text(), pdf);
  assert.match(downloaded.headers.get('content-disposition'), /attachment;/);
  assert.equal(downloaded.headers.get('cache-control'), 'private, no-store');
  assert.doesNotThrow(() => encodeURIComponent(worksheet.files[0].filename));

  // A failed object delete must leave its row so a subsequent request can retry.
  const failingBucket = { delete: async () => { throw new Error('Expected fixture storage outage'); } };
  const failedDelete = await handleCampus(deleteRequest(worksheet.id), { ...ctx, bucket: failingBucket });
  assert.equal(failedDelete.status, 500);
  assert.ok(await db.prepare('SELECT id FROM campus_worksheets WHERE id=?').bind(worksheet.id).first(), 'failed storage deletion must retain retry metadata');
  assert.equal((await handleCampus(fileRequest(worksheet.id), ctx)).status, 200);
  assert.equal((await handleCampus(deleteRequest(worksheet.id), ctx)).status, 200);
  assert.equal((await bucket.list()).objects.length, 0);
  assert.equal(await db.prepare('SELECT id FROM campus_worksheets WHERE id=?').bind(worksheet.id).first(), null);

  const atLimit = new Uint8Array(WORKSHEET_MAX_BYTES); atLimit.set(new TextEncoder().encode(pdf));
  const accepted = await upload('limit.pdf', atLimit); assert.equal(accepted.status, 201);
  const acceptedId = (await accepted.json()).worksheet.id;
  assert.equal((await handleCampus(deleteRequest(acceptedId), ctx)).status, 200);
  const tooLarge = new Uint8Array(WORKSHEET_MAX_BYTES + 1); tooLarge.set(new TextEncoder().encode(pdf));
  assert.equal((await upload('too-large.pdf', tooLarge)).status, 413);
  assert.equal((await bucket.list()).objects.length, 0, 'rejected uploads must not create objects');
  console.log('PASS worksheet backend: Unicode download filename, retriable storage deletion, no orphan objects, exact 5 MiB boundary and oversized rejection against isolated D1/R2.');
} finally {
  await worker.dispose(); fs.rmSync(temp, { recursive: true, force: true });
}
