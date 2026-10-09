'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto').webcrypto;

const source = fs.readFileSync(__dirname + '/../public/campus/campus-cloud.js', 'utf8');
const calls = [], events = [], responses = [];
const browser = {
  crypto,
  GRADE_CONTENT: [],
  dispatchEvent(event) { events.push(event); },
  async fetch(url, options) {
    calls.push({ url, options, body: options.body ? JSON.parse(options.body) : null });
    assert.equal(options.credentials, 'same-origin');
    assert.equal(options.cache, 'no-store');
    if (!responses.length) throw Error('Unexpected fetch: ' + url);
    const next = responses.shift();
    return typeof next === 'function' ? next(url, options) : next;
  },
};
const context = vm.createContext({ window: browser, CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init.detail; } }, URLSearchParams, Uint8Array, Map, Set, Date, Promise, JSON, console });
vm.runInContext(source, context);
const cloud = browser.CampusCloud;
const response = (data, status = 200) => ({ ok: status >= 200 && status < 300, status, json: async () => data });
const enqueue = (data, status = 200) => responses.push(response(data, status));
const session = { studentId: 'student-1', classId: 'class-2a', studentNumber: '01', name: '陳晴', grade: 2, section: 'A', schoolYear: '2026-27', assignmentId: 'assignment-1' };
const question = { id: 'server-q', sourceId: 's2-maths-01', revision: 3, grade: 2, roomId: 'maths', subjectId: 'maths', level: 'application', category: 'subject', options: [{ id: 'a' }, { id: 'b' }, { id: 'c' }] };
const customQuestion = { ...question, id: 'custom-q', sourceId: null, revision: 1 };
const transfer = { id: 'server-transfer', sourceId: 'transfer', revision: 1, category: 'transfer', options: [{ id: '0' }, { id: '1' }, { id: '2' }] };
function progress(version = 0, extra = {}) {
  return {
    profile: session, assignmentId: session.assignmentId, version,
    progress: { reflection: 'Saved reflection', cases: { privacy: { seen: [0, 1], choice: 2, firstChoice: 2, phase: 2 } } },
    questionProgress: {
      'server-q': { sourceId: 's2-maths-01', completed: true, attempts: 2, score: 0, stars: 2, lastOptionId: 'b' },
      'custom-q': { sourceId: null, completed: false, attempts: 0, score: 0, stars: 0, lastOptionId: null },
      'server-case': { sourceId: 'case-voice', completed: true, attempts: 1, score: 1, stars: 5, lastOptionId: '1' },
      'server-privacy': { sourceId: 'case-privacy', completed: false, attempts: 0, score: 0, stars: 0, lastOptionId: null },
      'server-transfer': { sourceId: 'transfer', completed: true, attempts: 2, score: 1, stars: 5, lastOptionId: '0' },
    },
    attempts: [
      { questionId: 'server-q', revision: 3, attemptNumber: 1, optionId: 'a', correct: 0 },
      { questionId: 'server-q', revision: 3, attemptNumber: 2, optionId: 'b', correct: 1 },
      { questionId: 'server-case', revision: 1, attemptNumber: 1, optionId: '1', correct: 1, evidence: '[0,1]', decisionIndex: 2 },
      { questionId: 'server-transfer', revision: 1, attemptNumber: 1, optionId: '1', correct: 1 },
      { questionId: 'server-transfer', revision: 1, attemptNumber: 2, optionId: '0', correct: 0 },
    ],
    stars: 12, maxStars: 103, score: 2, maxScore: 5, results: [], ...extra,
  };
}
async function rejectsCode(promise, code) {
  try { await promise; assert.fail('Expected ' + code); }
  catch (error) { assert.equal(error.code, code); return error; }
}

(async () => {
  enqueue({ session, grades: [1, 2, 3, 4, 5, 6], sections: ['A', 'B', 'C', 'D'] });
  await cloud.bootstrap();
  assert.equal(cloud.session.studentId, session.studentId);
  enqueue(progress()); await cloud.loadProgress();
  enqueue({ assignmentId: session.assignmentId, grade: 2, questions: [question, customQuestion, transfer] });
  await cloud.questions({ grade: 2 });
  const restored = cloud.hydrate();
  assert.equal(restored.subjects.maths['server-q'].choice, 1);
  assert.equal(restored.subjects.maths['server-q'].solvedChoice, 1);
  assert.equal(restored.subjects.maths['server-q'].revision, 3);
  assert.equal(restored.subjects.maths['server-q'].serverVerified, true);
  assert.equal(restored.subjects.maths['server-q'].feedbackChoice, null);
  assert.equal(Object.keys(restored.subjects.maths).length, 2, 'same-level teacher additions retain distinct server question IDs');
  assert.equal(restored.subjects.maths['custom-q'].completed, false);
  assert.equal(restored.cases.voice.completed, true);
  assert.equal(restored.cases.voice.firstChoice, 2);
  assert.equal(restored.cases.privacy.phase, 2);
  assert.deepEqual(Array.from(restored.cases.privacy.seen), [0, 1]);
  assert.equal(restored.transfer.awarded, true);
  assert.equal(restored.transfer.choice, 0);
  assert.equal(restored.transfer.awardChoice, 1);
  assert.equal(restored.stars, 12);
  assert.equal(restored.exitTarget, 100);

  const beforeSaves = calls.length;
  enqueue(progress(1)); enqueue(progress(2));
  await Promise.all([cloud.saveProgress({ reflection: 'one' }), cloud.saveProgress({ reflection: 'two' })]);
  assert.equal(calls[beforeSaves].body.version, 0);
  assert.equal(calls[beforeSaves + 1].body.version, 1);
  assert.equal(cloud.version, 2);
  const savedAt = cloud.state.lastSavedAt;

  const beforeConflict = calls.length;
  enqueue({ error: { code: 'PROGRESS_CONFLICT', message: 'Changed elsewhere.' } }, 409);
  enqueue(progress(7, { progress: { reflection: 'Other device' } }));
  const conflicting = await Promise.allSettled([
    cloud.saveProgress({ reflection: 'old draft' }),
    cloud.saveProgress({ reflection: 'queued old draft' }),
  ]);
  assert.ok(conflicting.every(result => result.status === 'rejected' && result.reason.code === 'PROGRESS_CONFLICT'));
  assert.equal(calls.length - beforeConflict, 2, 'conflict triggers one refresh and blocks the queued overwrite');
  assert.equal(conflicting[0].reason.latestProgress.version, 7);
  assert.equal(cloud.state.status, 'conflict');
  assert.equal(cloud.state.conflict, true);
  assert.equal(cloud.state.lastSavedAt, savedAt, 'refreshing conflict data is not a successful save');
  enqueue(progress(8)); await cloud.saveProgress({ reflection: 'Explicitly chosen draft' }, { resolveConflict: true });
  assert.equal(calls.at(-1).body.version, 7);
  assert.equal(cloud.state.conflict, false);

  responses.push(async () => { throw new TypeError('Network down'); });
  const failure = await rejectsCode(cloud.attempt({ questionId: question.id, revision: 3, optionId: 'b' }), 'NETWORK_ERROR');
  assert.equal(cloud.state.status, 'offline');
  assert.ok(failure.request.body.idempotencyKey);
  const retainedKey = failure.request.body.idempotencyKey;
  enqueue({ correct: true, progress: progress(8), score: 0 });
  await cloud.attempt(failure.request.body);
  assert.equal(calls.at(-1).body.idempotencyKey, retainedKey, 'an explicit retry preserves the original request identity');
  enqueue({ correct: true, progress: progress(8) });
  await cloud.transfer('1');
  assert.equal(calls.at(-1).body.questionId, 'server-transfer');
  assert.equal(calls.at(-1).body.revision, 1);
  assert.equal(calls.at(-1).body.assignmentId, session.assignmentId);

  const signal = new AbortController().signal;
  enqueue({ correct: false, recorded: false });
  await cloud.practiceCheck({ questionId: 's2-maths-01', optionId: 'a' }, { signal });
  assert.equal(calls.at(-1).options.signal, signal);
  assert.equal(calls.at(-1).url, '/api/campus/practice/check');
  const priorCalls = calls.length;
  await rejectsCode(cloud.request('https://example.invalid/private'), 'INVALID_PATH');
  assert.equal(calls.length, priorCalls);
  responses.push(async () => { const error = new Error('aborted'); error.name = 'AbortError'; throw error; });
  await rejectsCode(cloud.loadProgress(), 'ABORTED');
  assert.equal(cloud.state.status, 'cancelled');
  responses.push({ ok: true, status: 200, json: async () => { throw Error('invalid'); } });
  await rejectsCode(cloud.loadProgress(), 'BAD_RESPONSE');
  enqueue({ error: { code: 'STUDENT_SESSION_EXPIRED', message: 'Expired.' } }, 401);
  await rejectsCode(cloud.loadProgress(), 'STUDENT_SESSION_EXPIRED');
  assert.equal(cloud.session, null);
  assert.equal(cloud.state.status, 'unauthorized');
  assert.ok(cloud.messageFor({ code: 'NETWORK_ERROR' }, 'en').includes('not been confirmed'));
  assert.ok(cloud.messageFor({ code: 'PROGRESS_CONFLICT' }, 'cn').includes('设备'));
  assert.ok(events.some(event => event.type === 'campus-cloud-error'));

  enqueue({ session, progress: progress(9), recoveryCode: 'EXAMPLE' });
  await cloud.join({ classCode: 'EXAMPLE', studentNumber: '01', name: '陳晴' });
  let resolveOldRead;
  responses.push(() => new Promise(resolve => { resolveOldRead = resolve; }));
  const oldRead = cloud.loadProgress();
  enqueue({ ok: true }); await cloud.logout();
  resolveOldRead(response(progress(10)));
  await rejectsCode(oldRead, 'SESSION_CHANGED');
  assert.equal(cloud.session, null, 'late data cannot restore a logged-out student');
  assert.equal(cloud.lastProgress, null);
  assert.equal(responses.length, 0);
  console.log('PASS cloud adapter: cookie transport, source/option hydration, sticky awards, sequential versions, conflict refresh and blocked queued overwrite, explicit resolution, retry IDs, transfer revision, abort/network/auth errors, and stale-session isolation.');
})().catch(error => { console.error(error); process.exitCode = 1; });
