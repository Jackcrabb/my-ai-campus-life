import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { Miniflare } from "miniflare";
import ts from "typescript";
// Exercise the real handlers against a real local Cloudflare D1 database.
// Transpilation is test-local; no application files or deployed data are changed.
const root = path.resolve(import.meta.dirname, ".."), temp = fs.mkdtempSync(path.join(os.tmpdir(), "campus-backend-test-"));
fs.mkdirSync(path.join(temp, "lib"));
fs.mkdirSync(path.join(temp, "data"));
fs.copyFileSync(path.join(root, "data/starter-bank-previous-hashes.json"), path.join(temp, "data/starter-bank-previous-hashes.json"));
fs.copyFileSync(path.join(root, "data/tts-script-catalog.json"), path.join(temp, "data/tts-script-catalog.json"));
const fixtureMode = process.argv.includes("--fixture");
if (fixtureMode) {
    const tri = value => ({ zh: value, cn: value, en: value });
    const fixture = ["maths", "chinese"].map(subjectId => ({
        id: `fixture-${subjectId}`, grade: 2, subjectId, roomId: subjectId,
        category: "subject", level: "foundation", stars: 1, maxScore: 1,
        title: tri("Integration fixture"), question: tri("Select the first option."),
        options: ["a", "b", "c"].map((id, index) => ({ id, text: tri(id), correct: index === 0, feedback: tri(index === 0 ? "Accepted." : "Try the first option.") })),
        takeaway: tri("This is test-only data, not the learning bank.")
    }));
    fs.writeFileSync(path.join(temp, "data/grade-bank.json"), JSON.stringify(fixture));
} else {
    fs.copyFileSync(path.join(root, "data/grade-bank.json"), path.join(temp, "data/grade-bank.json"));
}
for (const file of fs.readdirSync(path.join(root, "lib")).filter(x => x.startsWith("campus-") && x.endsWith(".ts"))) {
    const result = ts.transpileModule(fs.readFileSync(path.join(root, "lib", file), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true } });
    fs.writeFileSync(path.join(temp, "lib", file.replace(/\.ts$/, ".js")), result.outputText);
}
const require = createRequire(path.join(temp, "runner.cjs"));
const { handleCampus } = require(path.join(temp, "lib/campus-api.js"));
const { BANK } = require(path.join(temp, "lib/campus-store.js"));
const { allowedTeacher } = require(path.join(temp, "lib/campus-security.js"));
const worker = new Miniflare({ modules: true, script: "export default { fetch() { return new Response('test'); } };", compatibilityDate: "2026-05-01", d1Databases: { DB: "campus-integration" }, r2Buckets: ["BUCKET"] });
let checks = 0;
try {
    const db = await worker.getD1Database("DB");
    const bucket = await worker.getR2Bucket("BUCKET");
    const migrations = fs.readdirSync(path.join(root, "drizzle")).filter(x => x.endsWith(".sql")).sort();
    assert.ok(migrations.length, "Generate D1 migrations before running backend tests.");
    for (const file of migrations) {
        const sql = fs.readFileSync(path.join(root, "drizzle", file), "utf8").replaceAll("--> statement-breakpoint", "");
        for (const statement of sql.split(";").map(x => x.trim()).filter(Boolean))
            await db.prepare(statement).run();
    }
    const env = { TEACHER_EMAILS: "teacher@example.invalid,other@example.invalid", TEACHER_PIN: "1234" };
    const base = { db, bucket, env, teacher: null, now: 1802070000000, localDevelopment: false };
    const teacher = { ...base, teacher: { userId: "teacher-one", email: "teacher@example.invalid" } };
    const other = { ...base, teacher: { userId: "teacher-two", email: "other@example.invalid" } };
    const call = async (route, { method = "GET", body, cookie = "", context = base, origin, expected = 200 } = {}) => {
        const headers = { "content-type": "application/json", ...(cookie ? { cookie } : {}), ...(origin ? { origin } : {}) };
        const request = new Request("https://campus.test/api/campus/" + route, { method, headers, ...(method !== "GET" ? { body: JSON.stringify(body ?? {}) } : {}) });
        const response = await handleCampus(request, context), data = await response.json();
        assert.equal(response.status, expected, `${method} ${route}: ${JSON.stringify(data)}`);
        checks++;
        return { data, cookie: response.headers.get("set-cookie")?.split(";")[0] ?? cookie, headers: response.headers };
    };
    const requestId = () => crypto.randomUUID();
    assert.equal(allowedTeacher({ ...base, env: { CAMPUS_LOCAL_TEACHER: "1" } }), null, "local override cannot enable a production context");
    checks++;
    await call("teacher/questions", { expected: 403 });
    await call("teacher/unlock", { method: "POST", body: { pin: "1234" }, expected: 403 });
    await call("teacher/questions", { context: { ...base, teacher: { userId: "intruder", email: "not-allowed@example.invalid" } }, expected: 403 });
    const unlock = await call("teacher/unlock", { method: "POST", body: { pin: "1234" }, context: teacher });
    const teacherCookie = unlock.cookie;
    assert.match(unlock.headers.get("set-cookie"), /HttpOnly; SameSite=Strict/);
    assert.match(unlock.headers.get("set-cookie"), /Secure/);
    checks += 2;
    const otherUnlock = await call("teacher/unlock", { method: "POST", body: { pin: "1234" }, context: other });
    const classes = (await call("teacher/classes", { method: "POST", body: { seedDefault: true, schoolYear: "2026-27" }, context: teacher, cookie: teacherCookie, expected: 201 })).data.classes;
    assert.equal(classes.length, 24);
    assert.equal(new Set(classes.map(c => c.classCode)).size, 24);
    checks += 2;
    const room = classes.find(c => c.grade === 2 && c.section === "A");
    const anonBootstrap = (await call("bootstrap")).data;
    assert.equal(anonBootstrap.session, null);
    assert.ok(!JSON.stringify(anonBootstrap).includes(room.classCode));
    checks += 2;
    const studentA = await call("student/join", { method: "POST", body: { classCode: room.classCode, studentNumber: "1", name: "陳晴", grade: 2, section: "A" } });
    const a = studentA.data.session, aCookie = studentA.cookie, recovery = studentA.data.recoveryCode;
    assert.equal(a.studentNumber, "01");
    assert.equal(a.grade, 2);
    assert.ok(recovery.length >= 20);
    checks += 3;
    const studentB = await call("student/join", { method: "POST", body: { classCode: room.classCode, studentNumber: "02", name: "林朗" } });
    // Real R2/D1 worksheet round trip; no production data or real student files.
    const pdf = "%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\n%%EOF";
    const upload = async (context, auth, { invalid = false, origin = "https://campus.test" } = {}) => {
        const form = new FormData(); form.set("title", "Ratio practice"); form.set("grade", "2"); form.set("subjectId", "maths");
        form.set("zh", new File([invalid ? "not PDF" : pdf], "繁中.pdf", { type: "application/pdf" }));
        form.set("en", new File([pdf], "English.pdf", { type: "application/pdf" }));
        return handleCampus(new Request("https://campus.test/api/campus/teacher/worksheets", { method: "POST", headers: { cookie: auth, origin }, body: form }), context);
    };
    assert.equal((await upload(base, "")).status, 403);
    assert.equal((await upload(teacher, teacherCookie, { origin: "https://evil.invalid" })).status, 403);
    assert.equal((await upload(teacher, teacherCookie, { invalid: true })).status, 400);
    const uploadedResponse = await upload(teacher, teacherCookie); assert.equal(uploadedResponse.status, 201);
    const worksheet = (await uploadedResponse.json()).worksheet; assert.equal(worksheet.files.length, 2);
    assert.ok(!JSON.stringify(worksheet).includes('worksheets/' + worksheet.id + '/zh.pdf'), 'R2 keys stay private');
    const floor1 = (await call("student/worksheets?floor=1", { cookie: aCookie })).data;
    assert.equal(floor1.worksheets[0].id, worksheet.id);
    assert.equal((await call("student/worksheets?floor=0", { cookie: aCookie })).data.worksheets.length, 0);
    await call("student/worksheets?floor=6", { cookie: aCookie, expected: 400 });
    await call("student/worksheets?floor=1", { expected: 401 });
    const readPdf = (context, auth, id = worksheet.id) => handleCampus(new Request(`https://campus.test/api/campus/worksheets/${id}/zh`, {headers:{cookie:auth}}), context);
    const pdfResponse = await readPdf(base, aCookie); assert.equal(pdfResponse.status,200); assert.equal(await pdfResponse.text(),pdf);
    assert.match(pdfResponse.headers.get('content-type'), /application\/pdf/);
    assert.equal((await readPdf(base, '')).status,404);
    assert.equal((await readPdf(other, otherUnlock.cookie)).status,404);
    const wrongGradeClass = classes.find(c => c.grade === 3 && c.section === 'A');
    const wrongGrade = await call('student/join',{method:'POST',body:{classCode:wrongGradeClass.classCode,studentNumber:'90',name:'Test grade boundary'}});
    assert.equal((await readPdf(base,wrongGrade.cookie)).status,404);
    await call('teacher/worksheets/'+worksheet.id,{method:'DELETE',context:other,cookie:otherUnlock.cookie,expected:404});
    await call('teacher/worksheets/'+worksheet.id,{method:'DELETE',context:teacher,cookie:teacherCookie});
    assert.equal((await readPdf(base,aCookie)).status,404);
    assert.equal((await bucket.list()).objects.length,0);
    checks += 15;

    await call("student/join", { method: "POST", body: { classCode: room.classCode, studentNumber: "01", name: "Overwrite" }, expected: 409 });
    await call("student/resume", { method: "POST", body: { classCode: room.classCode, studentNumber: "01", recoveryCode: "WRONG" }, expected: 400 });
    const resume = await call("student/resume", { method: "POST", body: { classCode: room.classCode, studentNumber: "01", recoveryCode: recovery } });
    assert.equal(resume.data.session.studentId, a.studentId);
    assert.notEqual(resume.cookie, aCookie);
    checks += 2;
    await call("student/progress", { expected: 401 });
    const questionResponse = (await call("questions?grade=6", { cookie: aCookie })).data;
    if (!fixtureMode) {
        assert.equal(questionResponse.questions.length, 44, "39 grade questions plus four activities and transfer are frozen into the assignment");
        assert.equal(studentA.data.progress.maxStars, 103, "the real starter bank preserves the 103-star maximum");
        checks += 2;
    }
    assert.equal(questionResponse.grade, 2, "students cannot select another grade through URL query");
    assert.ok(questionResponse.questions.every(q => q.grade === 2 || q.grade === 0));
    assert.ok(questionResponse.questions.every(q => q.options.every(o => !("correct" in o) && !("feedback" in o))));
    checks += 3;
    const q = questionResponse.questions.find(q => q.subjectId === "maths"), source = BANK.find(x => x.id === q.sourceId), right = source.options.find(o => o.correct).id, wrong = source.options.find(o => !o.correct).id;
    const payload = { questionId: q.id, revision: q.revision, assignmentId: a.assignmentId, optionId: wrong, idempotencyKey: requestId() };
    const wrongAttempt = (await call("attempts", { method: "POST", body: payload, cookie: aCookie })).data;
    assert.equal(wrongAttempt.correct, false);
    assert.equal(wrongAttempt.score, 0);
    checks += 2;
    const retry = (await call("attempts", { method: "POST", body: payload, cookie: aCookie })).data;
    assert.equal(retry.attempt.id, wrongAttempt.attempt.id);
    assert.equal(retry.progress.attempts.length, 1);
    checks += 2;
    await call("attempts", { method: "POST", body: { ...payload, optionId: right }, cookie: aCookie, expected: 409 });
    const corrected = (await call("attempts", { method: "POST", body: { ...payload, optionId: right, idempotencyKey: requestId() }, cookie: aCookie })).data;
    assert.equal(corrected.correct, true);
    assert.equal(corrected.score, 0, "a correction earns progress, not a replacement first-response grade");
    assert.equal(corrected.progress.questionProgress[q.id].stars, q.stars);
    checks += 3;
    const concurrentQ = questionResponse.questions.find(item => item.subjectId === "chinese"), concurrentSource = BANK.find(item => item.id === concurrentQ.sourceId), concurrentOption = concurrentSource.options.find(o => o.correct).id;
    const concurrent = await Promise.all([0, 1].map(() => call("attempts", { method: "POST", cookie: aCookie, body: { assignmentId: a.assignmentId, questionId: concurrentQ.id, revision: concurrentQ.revision, optionId: concurrentOption, idempotencyKey: requestId() } })));
    assert.equal(concurrent.reduce((sum, r) => sum + r.data.score, 0), concurrentQ.maxScore, "concurrent correct submissions grade only one first response");
    assert.equal(concurrent.reduce((sum, r) => sum + r.data.awardedStars, 0), concurrentQ.stars, "concurrent correct submissions award stars once");
    checks += 2;
    await call("student/progress", { method: "PUT", cookie: aCookie, body: { version: 0, progress: [] }, expected: 400 });
    const sync = await call("student/progress", { method: "PUT", cookie: aCookie, body: { version: 0, progress: { reflection: "I will check evidence.", stars: 999, score: 999, avatar: { gender: "girl", uniform: 0, hair: 1, skin: 2 }, cases: { voice: { completed: true, seen: [0, 1], choice: 0, repairChoice: 1 } } } } });
    assert.ok(!("stars" in sync.data.progress));
    assert.ok(!("completed" in sync.data.progress.cases.voice));
    assert.equal(sync.data.progress.avatar.uniform, 0);
    checks += 3;
    await call("student/progress", { method: "PUT", cookie: resume.cookie, body: { version: 0, progress: { reflection: "stale" } }, expected: 409 });
    const restored = (await call("student/progress", { cookie: resume.cookie })).data;
    assert.equal(restored.progress.reflection, "I will check evidence.");
    checks++;
    const bProgress = (await call("student/progress", { cookie: studentB.cookie })).data;
    assert.equal(bProgress.attempts.length, 0);
    assert.equal(bProgress.progress.reflection, undefined);
    checks += 2;
    let wardrobeVersion = restored.version;
    for (const gender of ["boy", "girl"]) {
        for (let uniform = 0; uniform < 4; uniform++) {
            const avatar = { gender, uniform, hair: 1, skin: 2 };
            const saved = (await call("student/progress", { method: "PUT", cookie: aCookie, body: { version: wardrobeVersion, progress: { avatar } } })).data;
            wardrobeVersion = saved.version;
            const onAnotherDevice = (await call("student/progress", { cookie: resume.cookie })).data;
            assert.deepEqual(onAnotherDevice.progress.avatar, avatar, "all eight approved gender/uniform pairs survive cross-device progress storage");
            checks++;
        }
    }
    for (const uniform of [-1, 4, 1.5, "invalid"]) {
        const saved = (await call("student/progress", { method: "PUT", cookie: aCookie, body: { version: wardrobeVersion, progress: { avatar: { gender: "girl", uniform, hair: 1, skin: 2 } } } })).data;
        wardrobeVersion = saved.version;
        assert.deepEqual(saved.progress.avatar, { gender: "girl", uniform: 0, hair: 1, skin: 2 }, "invalid uniform slots fall back without changing the remaining appearance");
        checks++;
    }
    const caseQ = questionResponse.questions.find(q => q.category === "case"), transfer = questionResponse.questions.find(q => q.category === "transfer");
    await call("attempts", { method: "POST", cookie: aCookie, body: { assignmentId: a.assignmentId, questionId: caseQ.id, revision: caseQ.revision, optionId: "1", idempotencyKey: requestId() }, expected: 400 });
    await call("cases", { method: "POST", cookie: aCookie, body: { assignmentId: a.assignmentId, caseId: "voice", decisionIndex: 0, repairIndex: 1, seenEvidence: [0, 0], idempotencyKey: requestId() }, expected: 400 });
    await call("attempts", { method: "POST", cookie: aCookie, body: { assignmentId: a.assignmentId, questionId: transfer.id, revision: transfer.revision, optionId: "1", idempotencyKey: requestId() }, expected: 409 });
    for (const cq of questionResponse.questions.filter(q => q.category === "case")) {
        const correct = BANK.find(q => q.id === cq.sourceId).options.find(o => o.correct).id;
        const answer = (await call("cases", { method: "POST", cookie: aCookie, body: { assignmentId: a.assignmentId, caseId: cq.sourceId.replace("case-", ""), decisionIndex: 0, repairIndex: Number(correct), seenEvidence: [0, 1], idempotencyKey: requestId() } })).data;
        assert.equal(answer.correct, true);
        checks++;
    }
    const transferAnswer = (await call("attempts", { method: "POST", cookie: aCookie, body: { assignmentId: a.assignmentId, questionId: transfer.id, revision: transfer.revision, optionId: "1", idempotencyKey: requestId() } })).data;
    assert.equal(transferAnswer.progress.results.find(r => r.subjectId === "ai-ethics").stars, 25);
    checks++;
    const classResults = (await call(`teacher/results?classId=${room.id}`, { context: teacher, cookie: teacherCookie })).data;
    assert.deepEqual(classResults.headers, ["班別", "學號", "學生姓名", "學科得分", "獲得星星", "可得星星"]);
    assert.ok(classResults.rows.some(r => r.studentName === "陳晴"));
    assert.ok(classResults.rows.some(r => r.studentName === "林朗"));
    checks += 3;
    await call(`teacher/results?classId=${room.id}`, { context: other, cookie: otherUnlock.cookie, expected: 404 });
    await call(`teacher/results?classId=${room.id}`, { cookie: aCookie, expected: 403 });
    const teacherQ = (await call("teacher/questions?grade=2&subjectId=maths", { context: teacher, cookie: teacherCookie })).data.questions.find(item => item.id === q.id);
    const createdQuestion = (await call("teacher/questions", { method: "POST", context: teacher, cookie: teacherCookie, body: { ...teacherQ, status: "draft" }, expected: 201 })).data.question;
    assert.equal(createdQuestion.revision, 1);
    assert.equal(createdQuestion.status, "draft");
    assert.notEqual(createdQuestion.id, teacherQ.id);
    checks += 3;
    for (const stars of [0, 11, 1.5, "invalid"])
        await call("teacher/questions", { method: "POST", context: teacher, cookie: teacherCookie, body: { ...teacherQ, stars }, expected: 400 });
    const extraQuestions = [];
    for (const stars of [7, 10, 2, 4]) {
        const extra = (await call("teacher/questions", { method: "POST", context: teacher, cookie: teacherCookie, body: { ...teacherQ, stars, maxScore: 2, status: "published", title: { ...teacherQ.title, en: `Extra question worth ${stars} stars` } }, expected: 201 })).data.question;
        extraQuestions.push(extra);
        assert.equal(extra.stars, stars, "teachers set the award independently from marks");
        checks++;
    }
    const oldMaths = (await call("questions?subjectId=maths", { cookie: aCookie })).data.questions;
    assert.ok(extraQuestions.every(extra => !oldMaths.some(assigned => assigned.id === extra.id)), "published additions do not silently change an active activity");
    checks++;
    await call("teacher/questions", { method: "POST", context: teacher, cookie: teacherCookie, body: { ...teacherQ, question: { zh: "Incomplete" } }, expected: 400 });
    await call(`teacher/questions/${q.id}`, { method: "DELETE", context: other, cookie: otherUnlock.cookie, expected: 404 });
    const newQ = { ...teacherQ, title: { ...teacherQ.title, en: "Reviewed question" }, status: "published", expectedRevision: teacherQ.revision };
    const edited = (await call(`teacher/questions/${q.id}`, { method: "PATCH", context: teacher, cookie: teacherCookie, body: newQ })).data.question;
    assert.equal(edited.revision, 2);
    checks++;
    await call(`teacher/questions/${q.id}`, { method: "PATCH", context: teacher, cookie: teacherCookie, body: newQ, expected: 409 });
    const oldAssigned = (await call("questions?subjectId=maths", { cookie: aCookie })).data.questions.find(item => item.id === q.id);
    assert.equal(oldAssigned.revision, 1, "existing assignment keeps frozen revision");
    checks++;
    await call(`teacher/questions/${q.id}`, { method: "DELETE", context: teacher, cookie: teacherCookie });
    const afterArchive = (await call(`teacher/results?classId=${room.id}&subjectId=maths`, { context: teacher, cookie: teacherCookie })).data;
    assert.equal(afterArchive.rows.find(r => r.studentId === a.studentId).maxScore, classResults.rows.find(r => r.studentId === a.studentId && r.subjectId === "maths").maxScore);
    checks++;
    const next = (await call(`teacher/classes/${room.id}/assignment`, { method: "POST", context: teacher, cookie: teacherCookie, body: { title: "Second activity" }, expected: 201 })).data.assignment;
    const newAssigned = (await call("questions", { cookie: aCookie })).data;
    assert.equal(newAssigned.assignmentId, next.id);
    assert.ok(!newAssigned.questions.some(item => item.id === q.id));
    checks += 2;
    const nextMaths = newAssigned.questions.filter(item => item.subjectId === "maths");
    assert.ok(nextMaths.length > 3, "a class receives more than three subject questions");
    assert.ok(extraQuestions.every(extra => nextMaths.some(assigned => assigned.id === extra.id && assigned.stars === extra.stars)), "all published additions retain their chosen award in the new activity");
    assert.ok(!newAssigned.questions.some(item => item.id === createdQuestion.id), "draft questions remain excluded");
    checks += 3;
    const custom = extraQuestions[0], customCorrect = custom.options.find(option => option.correct).id;
    const customPayload = { assignmentId: next.id, questionId: custom.id, revision: 1, optionId: customCorrect, idempotencyKey: requestId() };
    await call("attempts", { method: "POST", cookie: aCookie, body: { ...customPayload, optionId: custom.options.find(option => !option.correct).id, idempotencyKey: requestId() } });
    const customAnswer = (await call("attempts", { method: "POST", cookie: aCookie, body: customPayload })).data;
    assert.equal(customAnswer.awardedStars, 7, "a corrected answer receives the configured star award");
    assert.equal(customAnswer.score, 0, "earning stars does not replace the original first-response grade");
    const customRepeat = (await call("attempts", { method: "POST", cookie: aCookie, body: { ...customPayload, idempotencyKey: requestId() } })).data;
    assert.equal(customRepeat.awardedStars, 0, "custom stars are awarded only once");
    const tenStar = extraQuestions[1];
    const tenStarAnswer = (await call("attempts", { method: "POST", cookie: aCookie, body: { assignmentId: next.id, questionId: tenStar.id, revision: 1, optionId: tenStar.options.find(option => option.correct).id, idempotencyKey: requestId() } })).data;
    assert.equal(tenStarAnswer.awardedStars, 10);
    assert.equal(tenStarAnswer.score, 2);
    checks += 5;
    await call(`teacher/questions/${custom.id}`, { method: "PATCH", context: teacher, cookie: teacherCookie, body: { ...custom, stars: 9, expectedRevision: 1, status: "published" } });
    const assignedCustom = (await call("questions?subjectId=maths", { cookie: aCookie })).data.questions.find(item => item.id === custom.id);
    assert.equal(assignedCustom.stars, 7, "a changed reward only affects a later activity snapshot");
    assert.equal(assignedCustom.revision, 1);
    const customResults = (await call(`teacher/results?classId=${room.id}&subjectId=maths`, { context: teacher, cookie: teacherCookie })).data;
    const earned = customResults.rows.find(row => row.studentId === a.studentId);
    assert.equal(earned.stars, 17, "results use server-awarded stars, including corrected answers exactly once");
    assert.equal(earned.maxStars, nextMaths.reduce((sum, item) => sum + item.stars, 0), "the report denominator uses the assigned revisions");
    assert.equal(earned.totalQuestions, nextMaths.length);
    assert.equal(earned.score, 2, "marks remain distinct from earned stars");
    assert.equal(customResults.rows.find(row => row.studentId === studentB.data.session.studentId).stars, 0, "an unattempted student has zero earned stars");
    const allCustomResults = (await call(`teacher/results?classId=${room.id}`, { context: teacher, cookie: teacherCookie })).data;
    const studentRows = allCustomResults.rows.filter(row => row.studentId === a.studentId);
    assert.equal(studentRows.reduce((sum, row) => sum + row.stars, 0), 17, "summing subject rows does not double count stars");
    assert.equal(studentRows.find(row => row.subjectId === "ai-ethics").maxStars, 25, "AI activities and reflection retain their separate five-star awards");
    const previousResults = (await call(`teacher/results?classId=${room.id}&assignmentId=${a.assignmentId}&subjectId=maths`, { context: teacher, cookie: teacherCookie })).data;
    assert.equal(previousResults.rows.find(row => row.studentId === a.studentId).stars, q.stars, "previous activity awards survive new questions and reward edits");
    checks += 10;
    await call("attempts", { method: "POST", cookie: aCookie, body: { ...payload, idempotencyKey: requestId() }, expected: 409 });
    await call("student/progress", { method: "PUT", cookie: aCookie, body: { version: 1, progress: {} }, origin: "https://evil.test", expected: 403 });
    for (let i = 0; i < 4; i++)
        await call("teacher/unlock", { method: "POST", body: { pin: "wrong" }, context: teacher, expected: 401 });
    await call("teacher/unlock", { method: "POST", body: { pin: "1234" }, context: teacher, expected: 429 });
    const expired = { ...teacher, now: base.now + 31 * 60 * 1000 };
    await call("teacher/classes", { context: expired, cookie: teacherCookie, expected: 401 });
    await call("student/logout", { method: "POST", cookie: aCookie });
    await call("student/progress", { cookie: aCookie, expected: 401 });
    const resumedStillWorks = (await call("student/progress", { cookie: resume.cookie })).data;
    assert.equal(resumedStillWorks.profile.studentId, a.studentId);
    checks++;
    const rotated = (await call(`teacher/students/${a.studentId}/recovery`, { method: "POST", context: teacher, cookie: teacherCookie })).data.recoveryCode;
    await call("student/progress", { cookie: resume.cookie, expected: 401 });
    await call("student/resume", { method: "POST", body: { classCode: room.classCode, studentNumber: "01", recoveryCode: recovery }, expected: 400 });
    const restoredWithNewCode = await call("student/resume", { method: "POST", body: { classCode: room.classCode, studentNumber: "01", recoveryCode: rotated } });
    assert.equal(restoredWithNewCode.data.session.studentId, a.studentId);
    checks++;
    console.log(`PASS backend (${fixtureMode ? "test fixture" : "production starter bank"}): ${checks} assertions/API checks against local D1; identity, 24 classes, cross-device recovery, isolation, server grading, idempotency, cases, frozen revisions, archive, results, conflicts, CSRF, expiry and PIN rate limits.`);
}
finally {
    await worker.dispose();
    fs.rmSync(temp, { recursive: true, force: true });
}
