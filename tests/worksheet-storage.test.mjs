import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { Miniflare } from 'miniflare';
import ts from 'typescript';

// Real, isolated D1 transactions; no production data, R2, or external services.
const root = path.resolve(import.meta.dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'campus-worksheet-storage-'));
fs.mkdirSync(path.join(temp, 'lib')); fs.mkdirSync(path.join(temp, 'data'));
for (const name of ['grade-bank.json', 'starter-bank-previous-hashes.json', 'tts-script-catalog.json'])
    fs.copyFileSync(path.join(root, 'data', name), path.join(temp, 'data', name));
for (const name of fs.readdirSync(path.join(root, 'lib')).filter(x => x.startsWith('campus-') && x.endsWith('.ts')))
    fs.writeFileSync(path.join(temp, 'lib', name.replace(/\.ts$/, '.js')), ts.transpileModule(fs.readFileSync(path.join(root, 'lib', name), 'utf8'), {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    }).outputText);
const require = createRequire(path.join(temp, 'runner.cjs'));
const { createD1WorksheetBucket, WORKSHEET_STORAGE_CHUNK_BYTES, WORKSHEET_STORAGE_FILE_BYTES } = require(path.join(temp, 'lib/campus-worksheet-storage.js'));
const { handleCampus } = require(path.join(temp, 'lib/campus-api.js'));
const worker = new Miniflare({ modules: true, script: "export default {fetch(){return new Response('fixture')}}", compatibilityDate: '2026-05-01', d1Databases: { DB: 'worksheet-storage-regression' } });
try {
    const db = await worker.getD1Database('DB');
    const migrations = fs.readdirSync(path.join(root, 'drizzle')).filter(x => x.endsWith('.sql')).sort().map(x => path.join(root, 'drizzle', x));
    migrations.push(path.join(root, 'deployment/cloudflare/0001_worksheet_storage.sql'));
    for (const file of migrations)
        for (const sql of fs.readFileSync(file, 'utf8').split('--> statement-breakpoint').filter(x => x.trim()))
            await db.prepare(sql).run();
    const bucket = createD1WorksheetBucket(db);
    const usage = async () => (await db.prepare('SELECT used_bytes FROM campus_worksheet_storage WHERE id=1').first()).used_bytes;
    const chunkCount = async () => (await db.prepare('SELECT count(*) AS n FROM campus_worksheet_chunks').first()).n;
    const bytes = n => Uint8Array.from({ length: n }, (_, i) => i % 251).buffer;
    assert.throws(() => createD1WorksheetBucket(db, { maxBytes: 104857601 }));
    assert.throws(() => createD1WorksheetBucket(db, { maxBytes: 0 }));
    assert.equal(await bucket.get('missing'), null);
    await bucket.delete(['missing']); await bucket.delete([]);

    const large = bytes(WORKSHEET_STORAGE_FILE_BYTES);
    await bucket.put('large', large);
    const read = await bucket.get('large');
    assert.equal(read.size, WORKSHEET_STORAGE_FILE_BYTES);
    assert.deepEqual(read.body, new Uint8Array(large), '5 MiB of all binary byte values round trips');
    assert.equal(await chunkCount(), 10);
    assert.equal(await usage(), large.byteLength);
    await assert.rejects(bucket.put('oversize', bytes(WORKSHEET_STORAGE_FILE_BYTES + 1)), error => error.status === 413);
    assert.equal(await bucket.get('oversize'), null);

    // A late chunk failure rolls back replacement deletion and all quota changes.
    await db.prepare(`CREATE TRIGGER fixture_reject_chunk BEFORE INSERT ON campus_worksheet_chunks
        WHEN NEW.object_key='large' AND NEW.chunk_index=1 BEGIN SELECT RAISE(ABORT,'FIXTURE_FAILURE'); END`).run();
    await assert.rejects(bucket.put('large', bytes(WORKSHEET_STORAGE_CHUNK_BYTES + 20)), /FIXTURE_FAILURE/);
    assert.deepEqual((await bucket.get('large')).body, new Uint8Array(large));
    assert.equal(await usage(), large.byteLength);
    await db.prepare('DROP TRIGGER fixture_reject_chunk').run();
    await bucket.put('large', bytes(32));
    assert.equal(await usage(), 32); assert.equal(await chunkCount(), 1);
    await bucket.delete(['large', 'large']);
    assert.equal(await usage(), 0); assert.equal(await chunkCount(), 0);

    // Separate adapters represent overlapping worker requests, not a JS mutex.
    const a = createD1WorksheetBucket(db, { maxBytes: 10 }), b = createD1WorksheetBucket(db, { maxBytes: 10 });
    const parallel = await Promise.allSettled([a.put('parallel-a', bytes(6)), b.put('parallel-b', bytes(6))]);
    assert.equal(parallel.filter(x => x.status === 'fulfilled').length, 1);
    const rejected = parallel.find(x => x.status === 'rejected').reason;
    assert.equal(rejected.status, 507); assert.equal(rejected.code, 'WORKSHEET_STORAGE_QUOTA');
    assert.equal(await usage(), 6, 'concurrent uploads cannot overrun the shared cap');
    await bucket.delete(['parallel-a', 'parallel-b']); assert.equal(await usage(), 0);

    // Run existing worksheet authorization scenarios through D1 storage.
    const ctx = { db, worksheetBucket: bucket, teacher: null, env: { TEACHER_EMAILS: 'teacher@example.invalid,other@example.invalid', TEACHER_PIN: '1234' }, now: 1802070000000 };
    const teacher = { ...ctx, teacher: { userId: 'fixture-teacher', email: 'teacher@example.invalid' } };
    const other = { ...ctx, teacher: { userId: 'other-teacher', email: 'other@example.invalid' } };
    const call = async (route, context = ctx, { method = 'GET', body, cookie = '' } = {}) => {
        const response = await handleCampus(new Request('https://campus.test/api/campus/' + route, {
            method, headers: { 'content-type': 'application/json', origin: 'https://campus.test', cookie },
            ...(method === 'GET' ? {} : { body: JSON.stringify(body ?? {}) }),
        }), context);
        return { response, data: await response.json(), cookie: response.headers.get('set-cookie')?.split(';')[0] ?? cookie };
    };
    const auth = await call('teacher/unlock', teacher, { method: 'POST', body: { pin: '1234' } });
    assert.equal(auth.response.status, 200);
    const otherAuth = await call('teacher/unlock', other, { method: 'POST', body: { pin: '1234' } });
    const classes = (await call('teacher/classes', teacher, { method: 'POST', body: { seedDefault: true, schoolYear: '2026-27' }, cookie: auth.cookie })).data.classes;
    const student = await call('student/join', ctx, { method: 'POST', body: { classCode: classes.find(x => x.grade === 2 && x.section === 'A').classCode, studentNumber: '01', name: 'Fixture' } });
    const wrongGrade = await call('student/join', ctx, { method: 'POST', body: { classCode: classes.find(x => x.grade === 3 && x.section === 'A').classCode, studentNumber: '01', name: 'Fixture' } });
    const pdf = '%PDF-1.4\nfixture\n%%EOF';
    const upload = async (context = teacher, cookie = auth.cookie, origin = 'https://campus.test', largePdf = false) => {
        const form = new FormData(); form.set('title', 'D1 worksheet'); form.set('grade', '2'); form.set('subjectId', 'maths');
        const data = largePdf ? new Uint8Array(large) : new TextEncoder().encode(pdf);
        data.set(new TextEncoder().encode(pdf));
        form.set('zh', new File([data], '繁中.pdf', { type: 'application/pdf' }));
        form.set('en', new File([pdf], 'English.pdf', { type: 'application/pdf' }));
        return handleCampus(new Request('https://campus.test/api/campus/teacher/worksheets', { method: 'POST', headers: { origin, cookie }, body: form }), context);
    };
    assert.equal((await upload(ctx, '')).status, 403);
    assert.equal((await upload(teacher, auth.cookie, 'https://evil.invalid')).status, 403);
    const uploaded = await upload(teacher, auth.cookie, 'https://campus.test', true); assert.equal(uploaded.status, 201);
    const worksheet = (await uploaded.json()).worksheet; assert.equal(worksheet.files.length, 2);
    const get = (cookie, context = ctx) => handleCampus(new Request('https://campus.test/api/campus/worksheets/' + worksheet.id + '/zh?download=1', { headers: { cookie } }), context);
    assert.equal((await get('')).status, 404);
    assert.equal((await get(wrongGrade.cookie)).status, 404);
    assert.equal((await get(otherAuth.cookie, other)).status, 404);
    const allowed = await get(student.cookie); assert.equal(allowed.status, 200);
    assert.equal(Number(allowed.headers.get('content-length')), large.byteLength);
    assert.match(allowed.headers.get('content-disposition'), /attachment/);
    assert.equal(allowed.headers.get('cache-control'), 'private, no-store');
    const downloaded = new Uint8Array(await allowed.arrayBuffer());
    assert.equal(new TextDecoder().decode(downloaded.subarray(0, pdf.length)), pdf);
    assert.deepEqual(downloaded.subarray(pdf.length), new Uint8Array(large).subarray(pdf.length));
    assert.equal((await get(auth.cookie, teacher)).status, 200);
    assert.equal((await call('teacher/worksheets/' + worksheet.id, other, { method: 'DELETE', cookie: otherAuth.cookie })).response.status, 404);
    assert.equal((await call('teacher/worksheets/' + worksheet.id, teacher, { method: 'DELETE', cookie: auth.cookie })).response.status, 200);
    assert.equal(await usage(), 0); assert.equal(await chunkCount(), 0);

    // A rejected second language must clean up the successfully stored first file.
    const limitedTeacher = { ...teacher, worksheetBucket: createD1WorksheetBucket(db, { maxBytes: pdf.length }) };
    assert.equal((await upload(limitedTeacher)).status, 507);
    assert.equal(await usage(), 0); assert.equal(await chunkCount(), 0);
    assert.equal((await db.prepare('SELECT count(*) AS n FROM campus_worksheets').first()).n, 0);
    console.log('PASS D1 worksheet storage: 5 MiB binary roundtrip, atomic quota, parallel quota rejection, replacement rollback, idempotent deletion, two-language cleanup, and existing teacher/student authorization.');
} finally {
    await worker.dispose(); fs.rmSync(temp, { recursive: true, force: true });
}
