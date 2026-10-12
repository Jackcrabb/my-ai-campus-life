import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { Miniflare } from 'miniflare';
import ts from 'typescript';
import { provisionTeacherCode } from '../scripts/provision-teacher-code.mjs';

const root = path.resolve(import.meta.dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'campus-independent-auth-'));
fs.mkdirSync(path.join(temp, 'lib')); fs.mkdirSync(path.join(temp, 'data'));
for (const file of ['grade-bank.json','starter-bank-previous-hashes.json','tts-script-catalog.json'])
  fs.copyFileSync(path.join(root, 'data', file), path.join(temp, 'data', file));
for (const file of fs.readdirSync(path.join(root,'lib')).filter(file => file.startsWith('campus-') && file.endsWith('.ts'))) {
  const output = ts.transpileModule(fs.readFileSync(path.join(root,'lib',file),'utf8'), { compilerOptions: { module:ts.ModuleKind.CommonJS, target:ts.ScriptTarget.ES2022, esModuleInterop:true, resolveJsonModule:true } });
  fs.writeFileSync(path.join(temp,'lib',file.replace(/\.ts$/,'.js')),output.outputText);
}
const require = createRequire(path.join(temp,'runner.cjs'));
const { handleCampus } = require(path.join(temp,'lib/campus-api.js'));
const { allowedTeacher } = require(path.join(temp,'lib/campus-security.js'));
const sha = value => createHash('sha256').update(value).digest('hex');
// Count every SQL statement, including statements in a batch. This is stricter
// than counting D1 round trips and catches first-run work that exceeds Free D1.
function budgetDatabase(db) {
  let count = 0;
  const consume = amount => { count += amount; assert.ok(count <= 50, `Free D1 query budget exceeded: ${count}`); };
  const wrap = statement => ({
    statement,
    bind(...values) { assert.ok(values.length <= 100, 'D1 bound-parameter limit'); return wrap(statement.bind(...values)); },
    first(...args) { consume(1); return statement.first(...args); },
    all(...args) { consume(1); return statement.all(...args); },
    run(...args) { consume(1); return statement.run(...args); },
  });
  return {
    db: { prepare(sql) { assert.ok(Buffer.byteLength(sql) <= 100000, 'D1 statement-size limit'); return wrap(db.prepare(sql)); }, batch(statements) { consume(statements.length); return db.batch(statements.map(item => item.statement)); } },
    count: () => count,
  };
}
const worker = new Miniflare({ modules:true, script:"export default { fetch() { return new Response('test'); } };", compatibilityDate:'2026-05-01', d1Databases:{ DB:'independent-auth' }, r2Buckets:['BUCKET'] });
let checks = 0;
try {
  const db = await worker.getD1Database('DB'), bucket = await worker.getR2Bucket('BUCKET');
  for (const file of fs.readdirSync(path.join(root,'drizzle')).filter(file => file.endsWith('.sql')).sort()) {
    for (const sql of fs.readFileSync(path.join(root,'drizzle',file),'utf8').replaceAll('--> statement-breakpoint','').split(';').map(value => value.trim()).filter(Boolean)) await db.prepare(sql).run();
  }
  const base = { db,bucket,teacher:null,env:{ TEACHER_AUTH_MODE:'access-code' },now:1802070000000,clientIp:'203.0.113.10',localDevelopment:false };
  const call = async (route,{method='GET',body,cookie='',context=base,headers={},expected=200}={}) => {
    const budget = budgetDatabase(context.db);
    const response = await handleCampus(new Request('https://campus.test/api/campus/'+route, { method,headers:{'content-type':'application/json',...headers,...(cookie ? {cookie} : {})},...(method === 'GET' ? {} : {body:JSON.stringify(body ?? {})}) }),{...context,db:budget.db});
    const data = await response.json();
    assert.equal(response.status,expected,`${method} ${route}: ${JSON.stringify(data)}`); checks++;
    return {data,headers:response.headers,cookie:response.headers.get('set-cookie')?.split(';')[0] ?? cookie,queries:budget.count()};
  };
  const blank = (await call('teacher/session')).data;
  assert.deepEqual(blank,{authMode:'access-code',configured:false,signedIn:false,allowed:false,unlocked:false,localDevelopment:false}); checks++;
  await call('teacher/questions',{expected:401});
  const legacy = { ...base,env:{TEACHER_EMAILS:'owner@example.invalid',TEACHER_PIN:'1234'},teacher:{userId:'existing-owner',email:'owner@example.invalid'} };
  const previous = await call('teacher/unlock',{method:'POST',body:{pin:'1234'},context:legacy});
  const classroom = (await call('teacher/classes',{method:'POST',body:{grade:1,section:'A',schoolYear:'2026-27'},context:legacy,cookie:previous.cookie,expected:201})).data.classroom;
  await call('teacher/classes',{cookie:previous.cookie,expected:401});

  const directory = path.join(temp,'.teacher-access');
  const first = provisionTeacherCode({label:"Ms O'Brien",ownerId:'existing-owner',directory});
  const second = provisionTeacherCode({label:'Second teacher',directory});
  const firstPrivate = JSON.parse(fs.readFileSync(first.credentialPath,'utf8')), secondPrivate = JSON.parse(fs.readFileSync(second.credentialPath,'utf8'));
  for (const item of [first,second]) {
    const privateData = JSON.parse(fs.readFileSync(item.credentialPath,'utf8')), sql = fs.readFileSync(item.sqlPath,'utf8');
    assert.match(privateData.accessCode,/^[a-f0-9]{48}$/);
    assert.equal(fs.statSync(item.credentialPath).mode & 0o777,0o600);
    assert.equal(fs.statSync(item.sqlPath).mode & 0o777,0o600);
    assert.ok(!sql.includes(privateData.accessCode)); checks += 4;
    for (const statement of sql.split(';').map(value => value.trim()).filter(Boolean)) await db.prepare(statement).run();
  }
  assert.equal(fs.statSync(directory).mode & 0o777,0o700);
  assert.notEqual(firstPrivate.accessCode,secondPrivate.accessCode);
  assert.throws(() => provisionTeacherCode({label:'No owner',replaceExisting:true,directory}),/requires --owner-id/);
  assert.ok(fs.readFileSync(path.join(root,'.gitignore'),'utf8').includes('.teacher-access/'));
  const persisted = await db.prepare('SELECT * FROM campus_teacher_credentials WHERE id=?').bind(first.credentialId).first();
  assert.equal(persisted.label,"Ms O'Brien");
  assert.equal(persisted.code_hash,sha(firstPrivate.accessCode)); checks += 6;
  const before = (await call('teacher/session')).data;
  assert.equal(before.configured,true); assert.equal(before.allowed,false); assert.ok(!('signInUrl' in before)); checks += 3;
  const spoof = {...base,teacher:legacy.teacher,localDevelopment:true,env:{...base.env,TEACHER_EMAILS:'owner@example.invalid',TEACHER_PIN:'1234',CAMPUS_LOCAL_TEACHER:'1'}};
  assert.equal(allowedTeacher(spoof),null); checks++;
  const spoofHeaders = {'oai-authenticated-user-id':'existing-owner','oai-authenticated-user-email':'owner@example.invalid'};
  await call('teacher/classes',{context:spoof,headers:spoofHeaders,expected:401});
  for (const pin of ['1234','f'.repeat(48),null,'',firstPrivate.accessCode.slice(0,47)])
    await call('teacher/unlock',{method:'POST',body:{pin},context:spoof,headers:spoofHeaders,expected:401});
  await call('teacher/unlock',{method:'POST',body:{pin:firstPrivate.accessCode},headers:{origin:'https://evil.invalid'},expected:403});
  const login = await call('teacher/unlock',{method:'POST',body:{pin:' '+firstPrivate.accessCode.toUpperCase()+' ',ownerId:second.ownerId}});
  assert.match(login.headers.get('set-cookie'),/HttpOnly; SameSite=Strict; Max-Age=1800; Secure/);
  assert.ok(!JSON.stringify(login.data).includes(firstPrivate.accessCode)); checks += 2;
  const rawSession = login.cookie.split('=')[1], storedSession = await db.prepare('SELECT * FROM campus_teacher_unlocks WHERE token_hash=?').bind(sha(rawSession)).first();
  assert.equal(storedSession.owner_id,first.ownerId); assert.equal(storedSession.credential_id,first.credentialId); assert.notEqual(storedSession.token_hash,rawSession); checks += 3;
  assert.equal((await call('teacher/session',{cookie:login.cookie})).data.allowed,true); checks++;
  const ownClasses = (await call('teacher/classes',{cookie:login.cookie})).data.classes;
  assert.equal(ownClasses[0].id,classroom.id); checks++;
  const otherLogin = await call('teacher/unlock',{method:'POST',body:{pin:secondPrivate.accessCode}});
  assert.ok(otherLogin.queries <= 45, 'Fresh 239-question login leaves Free D1 query headroom'); checks++;
  assert.deepEqual((await call('teacher/classes',{cookie:otherLogin.cookie})).data.classes,[]); checks++;
  const defaults = await call('teacher/classes',{method:'POST',body:{seedDefault:true,schoolYear:'2026-27'},cookie:otherLogin.cookie,expected:201});
  assert.equal(defaults.data.classes.length,24);
  assert.ok(defaults.queries <= 12, 'Default setup uses set-based queries for all 24 classes');
  assert.ok(defaults.data.classes.every(row => row.assignmentId)); checks += 3;
  const repeatedDefaults = await call('teacher/classes',{method:'POST',body:{seedDefault:true,schoolYear:'2026-27'},cookie:otherLogin.cookie,expected:201});
  assert.deepEqual(repeatedDefaults.data.classes,defaults.data.classes, 'Existing class codes and assignments remain unchanged'); checks++;
  const concurrentDefaults = await Promise.all([1,2].map(() => call('teacher/classes',{method:'POST',body:{seedDefault:true,schoolYear:'2027-28'},cookie:otherLogin.cookie,expected:201})));
  assert.deepEqual(concurrentDefaults[0].data.classes,concurrentDefaults[1].data.classes);
  assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM campus_assignments a JOIN campus_classrooms c ON c.id=a.classroom_id WHERE c.owner_id=? AND c.school_year=?').bind(second.ownerId,'2027-28').first()).n,24, 'Concurrent setup does not duplicate activities'); checks += 2;
  const snapshotCounts = await db.prepare('SELECT c.grade,COUNT(i.id) AS n FROM campus_classrooms c JOIN campus_assignment_items i ON i.assignment_id=c.active_assignment_id WHERE c.owner_id=? AND c.school_year=? GROUP BY c.id').bind(second.ownerId,'2026-27').all();
  assert.ok(snapshotCounts.results.every(row => row.n === 44), 'Every starter activity contains 39 grade questions and five core case questions'); checks++;
  await call(`teacher/results?classId=${classroom.id}`,{cookie:otherLogin.cookie,expected:404});
  await call(`teacher/classes/${classroom.id}/assignment`,{cookie:otherLogin.cookie,method:'POST',body:{title:'Foreign assignment'},expected:404});
  const question = (await call('teacher/questions?grade=1&subjectId=maths',{cookie:login.cookie})).data.questions[0];
  await call('teacher/questions/'+question.id,{cookie:otherLogin.cookie,method:'DELETE',expected:404});
  const student = await call('student/join',{method:'POST',body:{classCode:classroom.classCode,studentNumber:'1',name:'Test learner'}});
  await call(`teacher/students/${student.data.session.studentId}/recovery`,{method:'POST',cookie:otherLogin.cookie,expected:404});
  await call('student/progress',{cookie:student.cookie});
  assert.equal((await call('bootstrap')).data.session,null); checks++;
  assert.equal((await call('questions?grade=1')).data.guest,true); checks++;

  const pdf = '%PDF-1.4\n%%EOF', form = new FormData();
  form.set('title','Test worksheet'); form.set('grade','1'); form.set('subjectId','maths'); form.set('zh',new File([pdf],'test.pdf',{type:'application/pdf'}));
  const uploaded = await handleCampus(new Request('https://campus.test/api/campus/teacher/worksheets',{method:'POST',headers:{cookie:login.cookie,origin:'https://campus.test'},body:form}),base);
  assert.equal(uploaded.status,201); checks++;
  const worksheet = (await uploaded.json()).worksheet;
  const foreignRead = await handleCampus(new Request(`https://campus.test/api/campus/worksheets/${worksheet.id}/zh`,{headers:{cookie:otherLogin.cookie}}),base);
  assert.equal(foreignRead.status,404); checks++;
  await call('teacher/worksheets/'+worksheet.id,{method:'DELETE',cookie:otherLogin.cookie,expected:404});
  const studentRead = await handleCampus(new Request(`https://campus.test/api/campus/worksheets/${worksheet.id}/zh`,{headers:{cookie:student.cookie}}),base);
  assert.equal(studentRead.status,200); assert.equal(await studentRead.text(),pdf); checks += 2;

  await call('teacher/classes',{cookie:login.cookie,context:{...base,now:base.now+31*60*1000},expected:401});
  const logout = await call('teacher/lock',{method:'POST',cookie:login.cookie});
  assert.match(logout.headers.get('set-cookie'),/Max-Age=0/); checks++;
  await call('teacher/classes',{cookie:login.cookie,expected:401});
  await call('teacher/lock',{method:'POST',cookie:login.cookie});
  const resumed = await call('teacher/unlock',{method:'POST',body:{pin:firstPrivate.accessCode}});
  await db.prepare('UPDATE campus_teacher_credentials SET revoked_at=? WHERE id=?').bind(new Date(base.now).toISOString(),first.credentialId).run();
  await call('teacher/classes',{cookie:resumed.cookie,expected:401});
  await call('teacher/unlock',{method:'POST',body:{pin:firstPrivate.accessCode},expected:401});
  assert.equal((await call('teacher/session',{cookie:resumed.cookie})).data.unlocked,false); checks++;
  const forged = 'a'.repeat(48);
  await db.prepare('INSERT INTO campus_teacher_unlocks (token_hash,owner_id,expires_at,credential_id) VALUES (?,?,?,?)').bind(sha(forged),first.ownerId,base.now+30000,second.credentialId).run();
  await call('teacher/classes',{cookie:'campus_teacher='+forged,expected:401});
  const rotation = provisionTeacherCode({label:'Second rotated',ownerId:second.ownerId,replaceExisting:true,directory});
  for (const statement of fs.readFileSync(rotation.sqlPath,'utf8').split(';').map(value=>value.trim()).filter(Boolean)) await db.prepare(statement).run();
  await call('teacher/classes',{cookie:otherLogin.cookie,expected:401});
  const rotationCode = JSON.parse(fs.readFileSync(rotation.credentialPath,'utf8')).accessCode;
  const rotationLogin = await call('teacher/unlock',{method:'POST',body:{pin:rotationCode}});

  const limited = {...base,clientIp:'203.0.113.99'};
  for (let i=0;i<20;i++) await call('teacher/unlock',{method:'POST',body:{pin:'1234'},context:limited,headers:{'cf-connecting-ip':'198.51.100.'+i,'x-forwarded-for':'198.51.100.'+i},expected:401});
  await call('teacher/unlock',{method:'POST',body:{pin:rotationCode},context:limited,headers:{'cf-connecting-ip':'198.51.100.250'},expected:429});
  await call('teacher/unlock',{method:'POST',body:{pin:rotationCode},context:{...limited,now:base.now+16*60*1000}});

  const pinContext = {...base,clientIp:'203.0.113.11'}, codeFile = path.join(directory,'numeric-code.txt');
  for (const invalid of ['123','1234567890123','12x4','1234\n5678']) {
    fs.writeFileSync(codeFile,invalid,{mode:0o600});
    assert.throws(() => provisionTeacherCode({label:'Invalid code',codeFile,directory}),/4–12 digit/); checks++;
  }
  fs.writeFileSync(codeFile,'1234\n',{mode:0o600});
  fs.chmodSync(codeFile,0o644);
  assert.throws(() => provisionTeacherCode({label:'Shared file',codeFile,directory}),/regular private file/); checks++;
  fs.chmodSync(codeFile,0o600);
  const link = path.join(directory,'code-link.txt'); fs.symlinkSync(codeFile,link);
  assert.throws(() => provisionTeacherCode({label:'Linked file',codeFile:link,directory}),/regular private file/); checks++;

  // Record a real student result before replacing the credential. Rotation must
  // keep the existing owner, class, bank, assignment and earned score intact.
  const preservedClass = defaults.data.classes[0];
  const pinQuestions = (await call('teacher/questions?grade=1&subjectId=maths',{cookie:rotationLogin.cookie,context:pinContext})).data;
  const pinQuestion = pinQuestions.questions[0];
  const learner = await call('student/join',{method:'POST',body:{classCode:preservedClass.classCode,studentNumber:'2',name:'PIN rotation learner'},context:pinContext});
  const assignment = (await call('questions?subjectId=maths',{cookie:learner.cookie,context:pinContext})).data;
  const answer = await call('attempts',{method:'POST',cookie:learner.cookie,context:pinContext,body:{questionId:pinQuestion.id,revision:pinQuestion.revision,assignmentId:assignment.assignmentId,optionId:pinQuestion.options.find(option=>option.correct).id,idempotencyKey:crypto.randomUUID()}});
  assert.ok(answer.data.awardedStars > 0); checks++;
  const priorResults = (await call(`teacher/results?classId=${preservedClass.id}`,{cookie:rotationLogin.cookie,context:pinContext})).data;
  const priorClasses = (await call('teacher/classes',{cookie:rotationLogin.cookie,context:pinContext})).data;
  const numeric = provisionTeacherCode({label:'Shared teacher workspace',ownerId:second.ownerId,replaceExisting:true,codeFile,directory});
  assert.equal(JSON.parse(fs.readFileSync(numeric.credentialPath,'utf8')).accessCode,'1234'); checks++;
  const numericSql = fs.readFileSync(numeric.sqlPath,'utf8');
  assert.ok(!numericSql.includes("'1234'")); checks++;
  for (const statement of numericSql.split(';').map(value=>value.trim()).filter(Boolean)) await db.prepare(statement).run();
  await call('teacher/classes',{cookie:rotationLogin.cookie,context:pinContext,expected:401});
  await call('teacher/classes',{cookie:otherLogin.cookie,context:pinContext,expected:401});
  for (const pin of [rotationCode,secondPrivate.accessCode,'4321','123','1234567890123',1234])
    await call('teacher/unlock',{method:'POST',body:{pin},context:pinContext,expected:401});
  const numericLogin = await call('teacher/unlock',{method:'POST',body:{pin:' 1234 '},context:pinContext});
  assert.match(numericLogin.cookie,/^campus_teacher=[a-f0-9]{48}$/);
  assert.match(numericLogin.headers.get('set-cookie'),/HttpOnly; SameSite=Strict; Max-Age=1800; Secure/);
  const numericSession = await db.prepare('SELECT owner_id,credential_id FROM campus_teacher_unlocks WHERE token_hash=?').bind(sha(numericLogin.cookie.split('=')[1])).first();
  assert.deepEqual(numericSession,{owner_id:second.ownerId,credential_id:numeric.credentialId}); checks += 3;
  assert.deepEqual((await call('teacher/classes',{cookie:numericLogin.cookie,context:pinContext})).data,priorClasses);
  assert.deepEqual((await call('teacher/questions?grade=1&subjectId=maths',{cookie:numericLogin.cookie,context:pinContext})).data,pinQuestions);
  assert.deepEqual((await call(`teacher/results?classId=${preservedClass.id}`,{cookie:numericLogin.cookie,context:pinContext})).data,priorResults); checks += 3;
  await call('teacher/classes',{cookie:'campus_teacher=1234',context:pinContext,expected:401});
  const pinLimited = {...base,clientIp:'203.0.113.98'};
  for (let i=0;i<20;i++) await call('teacher/unlock',{method:'POST',body:{pin:'4321'},context:pinLimited,expected:401});
  await call('teacher/unlock',{method:'POST',body:{pin:'1234'},context:pinLimited,expected:429});
  await call('teacher/unlock',{method:'POST',body:{pin:'1234'},context:{...pinLimited,now:base.now+16*60*1000}});
  console.log(`PASS independent teacher auth: ${checks} checks; provisioned numeric and private codes, legacy preservation, owner and worksheet isolation, ignored identity headers, trusted-IP limits, hashed credentials, secure sessions, expiry, logout and rotation preserving classes, questions and student results. Fresh login ${otherLogin.queries}/50 SQL statements; 24-class setup ${defaults.queries}/50, including concurrent/idempotent setup.`);
} finally {
  await worker.dispose();
  fs.rmSync(temp,{recursive:true,force:true});
}
