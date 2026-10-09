'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const bank = JSON.parse(fs.readFileSync('data/grade-bank.json','utf8'));
const context = vm.createContext({window:{}});
vm.runInContext(fs.readFileSync('public/campus/grade-content.js','utf8'),context);
assert.deepEqual(JSON.parse(JSON.stringify(context.window.GRADE_CONTENT)),bank,'guest and server starter bank agree');
assert.equal(bank.length,234);
assert.equal(new Set(bank.map(q=>q.id)).size,bank.length,'stable unique question IDs');
for(const grade of [1,2,3,4,5,6]) {
 const rows=bank.filter(q=>q.grade===grade);
 assert.equal(rows.length,39);
 assert.equal(rows.reduce((n,q)=>n+q.stars,0),78);
 assert.equal(new Set(rows.map(q=>q.subjectId)).size,13);
 for(const q of rows) {
  assert.ok([1,2,3].includes(q.stars));
  assert.equal(q.options.filter(o=>o.correct).length,1);
  assert.equal(new Set(q.options.map(o=>o.id)).size,3);
  for(const text of [q.title,q.question,q.takeaway,...q.options.flatMap(o=>[o.text,o.feedback])])
   for(const locale of ['zh','cn','en']) assert.ok(typeof text[locale]==='string' && text[locale].trim(),q.id+': missing '+locale);
 }
}
for(const room of new Set(bank.map(q=>q.roomId))) {
 const foundational=bank.filter(q=>q.roomId===room && q.level==='foundation');
 assert.equal(new Set(foundational.map(q=>q.question.en)).size,6,room+': content differs by year');
}
console.log('PASS grade bank: 234 trilingual questions, six distinct year levels, 13 subjects, unique IDs and 78 subject stars per year.');
