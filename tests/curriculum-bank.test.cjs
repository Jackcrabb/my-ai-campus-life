'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const crypto = require('node:crypto');
const vm = require('node:vm');

const bytes = fs.readFileSync('data/grade-bank.json');
const bank = JSON.parse(bytes);
const version = JSON.parse(fs.readFileSync('data/curriculum-version.json'));
const alignment = JSON.parse(fs.readFileSync('data/curriculum-alignment.json'));
const sources = version.authoringFiles.flatMap(path => JSON.parse(fs.readFileSync(path)));
assert.equal(version.version, 'hk-curriculum-2026-10-v2');
assert.equal(version.contentHash, crypto.createHash('sha256').update(bytes).digest('hex'));
assert.equal(version.questionCount, 234);
assert.equal(alignment.version, version.version);
assert.equal(alignment.outcomes.length, 78);
const aligned = alignment.outcomes.flatMap(row => row.items);
assert.equal(aligned.length, 234);
assert.equal(new Set(aligned.map(item => item.questionId)).size, 234);
for (const row of alignment.outcomes) {
  assert.ok(row.sources.length);
  for (const source of row.sources) assert.match(new URL(source).hostname, /(^|\.)(edb\.gov\.hk|hkeaa\.edu\.hk)$/);
  for (const item of row.items) {
    const question = bank.find(q => q.id === item.questionId);
    assert.equal(question.grade, row.grade);
    assert.equal(question.subjectId, row.subjectId);
    assert.deepEqual(item.learningOutcome, question.takeaway);
  }
}
for (const locale of ['zh','cn','en']) {
  assert.equal(new Set(bank.map(q => q.question[locale])).size, 234, 'each question has its own complete stem');
}
for (const question of bank) {
  const level = ['foundation','application','challenge'].indexOf(question.level) + 1;
  assert.equal(question.id, `s${question.grade}-${question.subjectId}-${String(level).padStart(2,'0')}`);
  assert.equal(question.stars, level);
  assert.equal(question.maxScore, 1);
  assert.equal(question.category, 'subject');
  const source = sources.find(q => q.subjectId === question.subjectId && q.grade === question.grade && q.level === level);
  assert.ok(source);
  const correct = question.options.find(o => o.correct);
  assert.equal(correct.text.zh, source.options[source.answer][0]);
  assert.equal(correct.text.en, source.options[source.answer][1]);
  assert.equal(correct.feedback.zh, source.options[source.answer][2]);
  assert.equal(correct.feedback.en, source.options[source.answer][3]);
  for (const locale of ['zh','cn','en']) {
    assert.equal(new Set(question.options.map(o => o.text[locale])).size, 3);
    assert.equal(new Set(question.options.map(o => o.feedback[locale])).size, 3);
  }
  assert.doesNotMatch(question.question.en, /AI answers:|If you choose .+which justification is strongest/s);
  assert.doesNotMatch(question.options.map(o => o.text.en).join('\n'), /Because the answer sounds confident|Because most people chose it/);
}
for (const subject of version.subjects) for (const grade of version.grades) {
  const rows = bank.filter(q => q.subjectId === subject && q.grade === grade);
  assert.deepEqual(rows.map(q => q.options.findIndex(o => o.correct)).sort(), [0,1,2], 'balanced answer positions');
  assert.equal(new Set(rows.map(q => q.title.en)).size, 3, 'different learning focus in each level');
  for (let a=0;a<3;a++) for (let b=a+1;b<3;b++) {
    assert.ok(!rows[a].question.en.startsWith(rows[b].question.en) && !rows[b].question.en.startsWith(rows[a].question.en), 'do not repeat a base stem with a stock follow-up');
  }
}

// Independent calculations catch changes to numbers, ratios, units or answer
// rotation. They are representative mathematical checks, not a claim of a
// complete automated subject-content review.
const correct = id => bank.find(q => q.id===id).options.find(o => o.correct).text.en;
assert.equal(correct('s1-maths-01'), `${45*2/(2+3)} books`);
assert.equal(correct('s1-maths-02'), `${(30-6)/4} m`);
assert.equal(correct('s2-maths-01'), `$${200*.8*1.2}`);
assert.equal(correct('s2-maths-02'), `$${2*48-84}`);
assert.equal(correct('s3-maths-01'), `${40*1.5**2} cm²`);
assert.equal(2/5*1/4, 1/10); assert.equal(correct('s3-maths-02'),'1/10');
assert.match(correct('s3-maths-03'), new RegExp(String(12.5*8.5).replace('.','\\.')));
assert.equal(correct('s5-maths-01'), `${Math.sqrt(13**2-5**2)} cm`);
assert.match(correct('s5-maths-02'), /6\/15=2\/5/);
assert.equal(correct('s5-maths-03'), `Mean ${1.5*60+10}, standard deviation ${1.5*8}`);
assert.equal(correct('s6-maths-01'), 'log(2)/log(1.08)');
const feasible = [[0,0],[0,10],[4,6],[7,0]];
assert.equal(Math.max(...feasible.map(([x,y])=>5*x+3*y)), 38);
assert.match(correct('s6-maths-02'), /revenue 38/);
assert.ok(19/20>90/100 && 20/100>1/10 && 91/110>39/120, 'Simpson comparison is numerically valid');
assert.match(correct('s4-chemistry-02'), /2\.40 dm³/); assert.ok(Math.abs(10/100*24-2.4)<1e-10);
assert.match(correct('s4-chemistry-03'), /0\.100 mol H₂.*0\.020 mol Mg/);
assert.match(correct('s5-chemistry-02'), /−58\.8 kJ mol⁻¹/);
assert.ok(Math.abs(-(100*4.2*7/1000)/.05+58.8)<1e-10);
assert.match(correct('s6-chemistry-03'), /0\.0993 mol dm⁻³/);
assert.equal((.1*((24.8+24.85)/2)/25).toFixed(4),'0.0993');
assert.match(correct('s2-geography-02'), /^500 L$/);
assert.equal(1000*(.8-.3),500);
assert.match(correct('s4-geography-02'), /^4 m³\/s$/);
assert.equal(4*.5*2,4);
assert.equal(correct('s2-computer-01'), String(parseInt('00101101',2)));
assert.equal(correct('s2-computer-03'), String([1,2,3].reduce((n,i)=>n+2*i,0)));
assert.equal(correct('s4-computer-01'), `${1000*800*24/8/1e6} MB`);
assert.equal(correct('s5-computer-03'), `${18/30*100}%`);
assert.equal(correct('s2-rooftop-02'), `${10*20*.8} L`);
assert.equal(correct('s4-rooftop-01'), `${.4/2*100}%`);
assert.equal(correct('s5-rooftop-02'), `${1200/300} years.`);
assert.ok((9+4)/2<(6+8)/2 && .8*9+.2*4>.8*6+.2*8);
assert.match(correct('s6-rooftop-02'), /^B ranks higher.*A ranks higher/);

const browser = vm.createContext({window:{}});
vm.runInContext(fs.readFileSync('public/campus/game/grade-content.js','utf8'),browser);
assert.equal(browser.window.GRADE_CONTENT_VERSION,version.version);
assert.deepEqual(JSON.parse(JSON.stringify(browser.window.GRADE_CONTENT)),bank);
console.log('PASS curriculum replacement: 234 independent tasks, balanced options, source/outcome mapping, stable scoring, version hash, browser parity and independent numeric checks.');
