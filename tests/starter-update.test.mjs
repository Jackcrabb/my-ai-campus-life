import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { Miniflare } from 'miniflare';
import ts from 'typescript';
const root=path.resolve(import.meta.dirname,'..'), temp=fs.mkdtempSync(path.join(os.tmpdir(),'campus-starter-update-'));
fs.mkdirSync(path.join(temp,'lib')); fs.mkdirSync(path.join(temp,'data'));
const tri=value=>({zh:value,cn:value,en:value});
const bank=['maths','chinese','english'].map(subjectId=>({id:'fixture-'+subjectId,grade:2,subjectId,roomId:subjectId,category:'subject',level:'foundation',stars:1,maxScore:1,title:tri(subjectId),question:tri('New original scenario'),options:[{id:'a',text:tri('A'),correct:true,feedback:tri('Reason A')},{id:'b',text:tri('B'),correct:false,feedback:tri('Reason B')}],takeaway:tri('New learning')}));
const split=q=>({content:JSON.stringify({...q,options:q.options.map(({id,text})=>({id,text}))}),answer:JSON.stringify({correctOptionId:q.options.find(o=>o.correct).id,feedback:Object.fromEntries(q.options.map(o=>[o.id,o.feedback]))})});
const legacy=bank.map(q=>({...q,question:tri('Old repeated scenario')}));
fs.writeFileSync(path.join(temp,'data/grade-bank.json'),JSON.stringify(bank));
fs.writeFileSync(path.join(temp,'data/starter-bank-previous-hashes.json'),JSON.stringify(Object.fromEntries(legacy.map(q=>{const d=split(q);return[q.id,createHash('sha256').update(d.content+'\n'+d.answer).digest('hex')]}))));
for(const file of fs.readdirSync(path.join(root,'lib')).filter(x=>x.startsWith('campus-')&&x.endsWith('.ts'))){fs.writeFileSync(path.join(temp,'lib',file.replace('.ts','.js')),ts.transpileModule(fs.readFileSync(path.join(root,'lib',file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText);}
const require=createRequire(path.join(temp,'runner.cjs')), store=require(path.join(temp,'lib/campus-store.js'));
const worker=new Miniflare({modules:true,script:"export default {fetch(){return new Response('test')}}",compatibilityDate:'2026-05-01',d1Databases:{DB:'starter-update-test'}});
try {
  const db=await worker.getD1Database('DB'),ctx={db,env:{},teacher:null};
  for(const file of fs.readdirSync(path.join(root,'drizzle')).filter(x=>x.endsWith('.sql')).sort()){for(const sql of fs.readFileSync(path.join(root,'drizzle',file),'utf8').split('--> statement-breakpoint').filter(x=>x.trim()))await db.exec(sql.replace(/\n/g,' '));}
  const classroom=await store.createClass(ctx,'teacher-fixture',2,'A','2026-27');
  const row=await db.prepare('SELECT * FROM campus_classrooms WHERE id=?').bind(classroom.id).first();
  const snapshot=row.active_assignment_id;
  const ids={};
  for(const q of legacy){const record=await db.prepare('SELECT id FROM campus_questions WHERE source_id=?').bind(q.id).first();ids[q.subjectId]=record.id;const d=split(q);await db.prepare('UPDATE campus_question_revisions SET content=?,answer=? WHERE question_id=? AND revision=1').bind(d.content,d.answer,record.id).run();}
  const teacherEdit=split({...bank[1],question:tri('Teacher authored replacement')});
  await db.prepare('INSERT INTO campus_question_revisions(id,question_id,revision,content,answer,created_at) VALUES(?,?,2,?,?,?)').bind(ids.chinese+':2',ids.chinese,teacherEdit.content,teacherEdit.answer,'2026-10-10').run();
  await db.prepare('UPDATE campus_questions SET current_revision=2 WHERE id=?').bind(ids.chinese).run();
  await db.prepare("UPDATE campus_questions SET status='archived' WHERE id=?").bind(ids.english).run();
  await db.prepare('DELETE FROM campus_bank_updates').run();
  await store.refreshStarterBank(ctx,'teacher-fixture');
  const get=async id=>db.prepare('SELECT current_revision,status FROM campus_questions WHERE id=?').bind(id).first();
  assert.equal((await get(ids.maths)).current_revision,2);
  assert.equal((await get(ids.chinese)).current_revision,2);
  assert.equal((await get(ids.english)).current_revision,1);
  assert.equal((await get(ids.english)).status,'archived');
  const teacherRevision=await db.prepare('SELECT content FROM campus_question_revisions WHERE question_id=? AND revision=2').bind(ids.chinese).first();
  assert.equal(JSON.parse(teacherRevision.content).question.en,'Teacher authored replacement');
  const old=await store.assignmentQuestions(ctx,snapshot);
  assert.equal(old.find(q=>q.id===ids.maths).revision,1);
  assert.equal(JSON.parse(old.find(q=>q.id===ids.maths).content).question.en,'Old repeated scenario');
  const next=await store.createAssignment(ctx,row,'New curriculum');
  const updated=await store.assignmentQuestions(ctx,next.id);
  assert.equal(updated.find(q=>q.id===ids.maths).revision,2);
  assert.equal(JSON.parse(updated.find(q=>q.id===ids.maths).content).question.en,'New original scenario');
  assert.ok(!updated.some(q=>q.id===ids.english));
  await store.refreshStarterBank(ctx,'teacher-fixture');
  assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM campus_question_revisions WHERE question_id=?').bind(ids.maths).first()).n,2);
  console.log('PASS starter upgrade: untouched defaults update once; teacher edits, archives and frozen activities remain intact.');
} finally {await worker.dispose();fs.rmSync(temp,{recursive:true,force:true});}
