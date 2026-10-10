import { handleWorksheets } from "./campus-worksheets";
import { CASE_RULES } from "./campus-cases";
import { CampusError, type CampusContext } from "./campus-types";
import { allowedTeacher, checkOrigin, cookie, equalSecret, hash, iso, limit, now, readBody, requireTeacher, setCookie, STUDENT_COOKIE, TEACHER_COOKIE, textField, token } from "./campus-security";
import { assignmentQuestions, BANK, calculateResults, classPublic, createAssignment, createClass, ownedClass, progressFor, publicQuestion, requireStudent, seedQuestions, splitQuestion, studentAttempts, studentPublic, teacherQuestion, validateQuestion, type ClassRow, type QuestionRow, type StudentRow } from "./campus-store";
const json = (value: unknown, status = 200, headers: Record<string, string> = {}) => new Response(JSON.stringify(value), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers } });
const forbidden = () => { throw new CampusError(404, "NOT_FOUND", "This resource was not found."); };
const number = (v: unknown, min: number, max: number, label: string) => { if (!Number.isInteger(v) || Number(v) < min || Number(v) > max)
    throw new CampusError(400, "INVALID_FIELD", `Invalid ${label}.`); return Number(v); };
function classDetails(body: Record<string, unknown>) {
    const grade = number(body.grade, 1, 6, "grade"), section = textField(body.section, "section", 1).toUpperCase();
    if (!["A", "B", "C", "D"].includes(section))
        throw new CampusError(400, "INVALID_SECTION", "Choose A, B, C or D.");
    const schoolYear = textField(body.schoolYear ?? "2026-27", "schoolYear", 9);
    if (!/^\d{4}-\d{2,4}$/.test(schoolYear))
        throw new CampusError(400, "INVALID_YEAR", "Use a school year such as 2026-27.");
    return { grade, section, schoolYear };
}
function normaliseNumber(value: unknown) { const raw = textField(value, "studentNumber", 3); if (!/^\d{1,3}$/.test(raw) || Number(raw) < 1)
    throw new CampusError(400, "INVALID_STUDENT_NUMBER", "Use a student number from 1 to 999."); return String(Number(raw)).padStart(2, "0"); }
async function issueStudentSession(request: Request, ctx: CampusContext, id: string) {
    const raw = token(), lifetime = 30 * 24 * 60 * 60;
    await ctx.db.prepare("INSERT INTO campus_sessions (token_hash,student_id,expires_at,created_at) VALUES (?,?,?,?)").bind(await hash(raw), id, now(ctx) + lifetime * 1000, iso(ctx)).run();
    const requestWithCookie = new Request(request.url, { headers: { cookie: `${STUDENT_COOKIE}=${raw}` } });
    return { student: await requireStudent(requestWithCookie, ctx), cookie: setCookie(request, STUDENT_COOKIE, raw, lifetime) };
}
async function getAssignedQuestion(ctx: CampusContext, student: StudentRow, body: Record<string, unknown>, sourceId?: string) {
    const assignmentId = textField(body.assignmentId, "assignmentId", 100);
    if (assignmentId !== student.active_assignment_id)
        throw new CampusError(409, "ASSIGNMENT_CHANGED", "Your teacher has started a new activity. Refresh the questions.");
    const questions = await assignmentQuestions(ctx, assignmentId);
    const row = sourceId ? questions.find(q => q.source_id === sourceId) : questions.find(q => q.id === body.questionId && q.revision === body.revision);
    if (!row)
        throw new CampusError(404, "QUESTION_NOT_ASSIGNED", "This question version is not assigned to you.");
    return { assignmentId, row, questions };
}
async function recordAttempt(ctx: CampusContext, student: StudentRow, body: Record<string, unknown>, row: QuestionRow, assignmentId: string, optionId: string) {
    const key = textField(body.idempotencyKey, "idempotencyKey", 100);
    if (!/^[A-Za-z0-9_-]{12,100}$/.test(key))
        throw new CampusError(400, "INVALID_REQUEST_ID", "Use a unique random request ID.");
    const q = JSON.parse(row.content), answer = JSON.parse(row.answer);
    if (!q.options.some((o: {
        id: string;
    }) => o.id === optionId))
        throw new CampusError(400, "INVALID_OPTION", "Unknown answer option.");
    const correct = optionId === answer.correctOptionId;
    // The SELECT and INSERT execute as one SQLite statement. A retry with the same
    // idempotency key returns the original attempt; concurrent unique requests
    // cannot both become the first graded response.
    const evidence = q.category === "case" ? JSON.stringify([...new Set(body.seenEvidence as number[])]) : null, decisionIndex = q.category === "case" ? Number(body.decisionIndex) : null;
    const insertion = await ctx.db.prepare("INSERT OR IGNORE INTO campus_attempts (id,student_id,assignment_id,question_id,revision,option_id,attempt_number,correct,score,idempotency_key,created_at,evidence,decision_index) SELECT ?,?,?,?,?,?,COALESCE(MAX(attempt_number),0)+1,?,CASE WHEN COUNT(*)=0 AND ?=1 THEN ? ELSE 0 END,?,?,?,? FROM campus_attempts WHERE student_id=? AND assignment_id=? AND question_id=?").bind(crypto.randomUUID(), student.id, assignmentId, row.id, row.revision, optionId, correct ? 1 : 0, correct ? 1 : 0, q.maxScore, key, iso(ctx), evidence, decisionIndex, student.id, assignmentId, row.id).run();
    const attempt = await ctx.db.prepare("SELECT id,assignment_id AS assignmentId,question_id AS questionId,revision,option_id AS optionId,attempt_number AS attemptNumber,correct,score FROM campus_attempts WHERE student_id=? AND idempotency_key=?").bind(student.id, key).first<{
        id: string;
        assignmentId: string;
        questionId: string;
        revision: number;
        optionId: string;
        attemptNumber: number;
        correct: number;
        score: number;
    }>();
    if (!attempt || attempt.questionId !== row.id || attempt.assignmentId !== assignmentId || attempt.optionId !== optionId)
        throw new CampusError(409, "IDEMPOTENCY_CONFLICT", "That request ID belongs to a different answer.");
    const firstCorrect = await ctx.db.prepare("SELECT id FROM campus_attempts WHERE student_id=? AND assignment_id=? AND question_id=? AND correct=1 ORDER BY attempt_number LIMIT 1").bind(student.id, assignmentId, row.id).first<{
        id: string;
    }>();
    const progress = await progressFor(ctx, student);
    return { attempt, correct: attempt.correct === 1, feedback: answer.feedback[attempt.optionId], takeaway: attempt.correct === 1 ? q.takeaway : null, awardedStars: insertion.meta.changes > 0 && firstCorrect?.id === attempt.id ? q.stars : 0, score: attempt.score, firstAttempt: attempt.attemptNumber === 1, progress };
}
function sanitiseProgress(raw: Record<string, unknown>) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
        throw new CampusError(400, "INVALID_PROGRESS", "Progress must be a JSON object.");
    }
    const result: Record<string, unknown> = {};
    if (typeof raw.reflection === "string")
        result.reflection = raw.reflection.slice(0, 1200);
    const locale = raw.locale ?? raw.lang;
    if (["zh", "cn", "en"].includes(String(locale)))
        result.locale = locale;
    if (typeof raw.location === "string" && /^[a-z0-9-]{1,40}$/.test(raw.location))
        result.location = raw.location;
    if (typeof raw.prologueSeen === "boolean")
        result.prologueSeen = raw.prologueSeen;
    if (raw.avatar && typeof raw.avatar === "object") {
        const a = raw.avatar as Record<string, unknown>, gender = a.gender === "girl" ? "girl" : "boy", uniform = Number(a.uniform), allowed = gender === "boy" ? [0, 1] : [2, 3];
        result.avatar = { gender, uniform: allowed.includes(uniform) ? uniform : allowed[0], hair: a.hair === 1 ? 1 : 0, skin: [0, 1, 2].includes(Number(a.skin)) ? Number(a.skin) : 0 };
    }
    // Presentation choices may sync; completion, scores and stars are calculated
    // exclusively from validated server attempts and are never accepted here.
    if (raw.cases && typeof raw.cases === "object") {
        const cases: Record<string, unknown> = {};
        for (const id of Object.keys(CASE_RULES)) {
            const source = (raw.cases as Record<string, unknown>)[id] as Record<string, unknown> | undefined;
            if (!source || typeof source !== "object")
                continue;
            const seen = Array.isArray(source.seen) ? [...new Set(source.seen.filter(x => Number.isInteger(x) && Number(x) >= 0 && Number(x) < CASE_RULES[id].evidenceCount))] : [];
            const choice = (v: unknown) => Number.isInteger(v) && Number(v) >= 0 && Number(v) < 3 ? v : null;
            cases[id] = { seen, choice: choice(source.choice), firstChoice: choice(source.firstChoice), repairChoice: choice(source.repairChoice), phase: Number.isInteger(source.phase) ? Math.max(0, Math.min(4, Number(source.phase))) : 0 };
        }
        result.cases = cases;
    }
    return result;
}
export async function handleCampus(request: Request, ctx: CampusContext): Promise<Response> {
    try {
        if (/^\/api\/campus\/(?:teacher\/worksheets|student\/worksheets|worksheets)(?:\/|$)/.test(new URL(request.url).pathname)) return await handleWorksheets(request, ctx);
        checkOrigin(request);
        const url = new URL(request.url), path = url.pathname.replace(/^\/api\/campus\/?/, "").split("/").filter(Boolean), route = path.join("/"), method = request.method;
        const body = ["POST", "PUT", "PATCH", "DELETE"].includes(method) ? await readBody(request) : {};
        if (route === "bootstrap" && method === "GET") {
            let session = null;
            try {
                session = studentPublic(await requireStudent(request, ctx));
            }
            catch (error) {
                if (!(error instanceof CampusError && error.status === 401))
                    throw error;
            }
            return json({ grades: [1, 2, 3, 4, 5, 6], sections: ["A", "B", "C", "D"], session });
        }
        if ((route === "student/join" || route === "student/resume") && method === "POST") {
            const code = textField(body.classCode, "classCode", 20).toUpperCase();
            const ip = request.headers.get("cf-connecting-ip") ?? "local";
            const studentNumber = normaliseNumber(body.studentNumber);
            // School networks share public IPs. Limit a guessed student credential
            // separately so one class's normal enrolment does not block its peers.
            await limit(ctx, "join-ip:" + await hash(ip), 300, 60 * 1000);
            await limit(ctx, "join:" + await hash(ip + ":" + code + ":" + studentNumber), 10, 15 * 60 * 1000);
            const classroom = await ctx.db.prepare("SELECT * FROM campus_classrooms WHERE join_code=?").bind(code).first<ClassRow>();
            if (!classroom)
                throw new CampusError(400, "INVALID_CLASS_CODE", "The class code or recovery details are not valid.");
            if (body.grade !== undefined && (body.grade !== classroom.grade || body.section !== classroom.section))
                throw new CampusError(400, "CLASS_MISMATCH", "The selected class does not match the class code.");
            const existing = await ctx.db.prepare("SELECT id,recovery_hash FROM campus_students WHERE classroom_id=? AND student_number=?").bind(classroom.id, studentNumber).first<{
                id: string;
                recovery_hash: string;
            }>();
            let studentId: string, recoveryCode: string | undefined;
            if (route === "student/resume") {
                const recovery = textField(body.recoveryCode, "recoveryCode", 100).replace(/[-\s]/g, "").toUpperCase();
                if (!existing || !await equalSecret(await hash(recovery), existing.recovery_hash))
                    throw new CampusError(400, "INVALID_RECOVERY", "The class code or recovery details are not valid.");
                studentId = existing.id;
            }
            else {
                if (existing)
                    throw new CampusError(409, "STUDENT_EXISTS", "This student number already has a record. Use the recovery code to resume.");
                const name = textField(body.name, "name", 60);
                studentId = crypto.randomUUID();
                recoveryCode = token().slice(0, 20).toUpperCase();
                try {
                    await ctx.db.prepare("INSERT INTO campus_students (id,classroom_id,student_number,name,recovery_hash,created_at) VALUES (?,?,?,?,?,?)").bind(studentId, classroom.id, studentNumber, name, await hash(recoveryCode), iso(ctx)).run();
                }
                catch (error) {
                    if (String(error).includes("UNIQUE"))
                        throw new CampusError(409, "STUDENT_EXISTS", "This student number already has a record. Use recovery.");
                    throw error;
                }
            }
            const issued = await issueStudentSession(request, ctx, studentId);
            return json({ session: studentPublic(issued.student), ...(recoveryCode ? { recoveryCode } : {}), progress: await progressFor(ctx, issued.student) }, 200, { "set-cookie": issued.cookie });
        }
        if (route === "student/logout" && method === "POST") {
            const raw = cookie(request, STUDENT_COOKIE);
            if (raw)
                await ctx.db.prepare("DELETE FROM campus_sessions WHERE token_hash=?").bind(await hash(raw)).run();
            return json({ ok: true }, 200, { "set-cookie": setCookie(request, STUDENT_COOKIE, "", 0) });
        }
        if (route === "questions" && method === "GET") {
            const subjectId = url.searchParams.get("subjectId");
            if (cookie(request, STUDENT_COOKIE)) {
                const student = await requireStudent(request, ctx), rows = student.active_assignment_id ? await assignmentQuestions(ctx, student.active_assignment_id) : [];
                const questions = rows.map(publicQuestion).filter(q => !subjectId || q.subjectId === subjectId);
                return json({ assignmentId: student.active_assignment_id, grade: student.grade, questions });
            }
            const grade = number(Number(url.searchParams.get("grade") ?? 1), 1, 6, "grade");
            return json({ assignmentId: null, grade, guest: true, questions: BANK.filter(q => (q.grade === grade || q.grade === 0) && (!subjectId || q.subjectId === subjectId)).map(q => ({ ...JSON.parse(splitQuestion(q).content), sourceId: q.id, revision: 1 })) });
        }
        if (route === "practice/check" && method === "POST") {
            const q = BANK.find(q => q.id === body.questionId), option = q?.options.find(o => o.id === body.optionId);
            if (!q || !option)
                throw new CampusError(404, "QUESTION_NOT_FOUND", "Unknown practice question.");
            return json({ correct: option.correct, feedback: option.feedback, takeaway: option.correct ? q.takeaway : null, recorded: false });
        }
        if (route === "student/progress" && method === "GET")
            return json(await progressFor(ctx, await requireStudent(request, ctx)));
        if (route === "student/progress" && method === "PUT") {
            const student = await requireStudent(request, ctx), version = number(body.version, 0, 2147483647, "version"), raw = (body.progress ?? body) as Record<string, unknown>;
            const data = sanitiseProgress(raw), time = iso(ctx);
            const result = version === 0 ? await ctx.db.prepare("INSERT OR IGNORE INTO campus_student_progress (student_id,data,version,updated_at) VALUES (?,?,1,?)").bind(student.id, JSON.stringify(data), time).run() : await ctx.db.prepare("UPDATE campus_student_progress SET data=?,version=version+1,updated_at=? WHERE student_id=? AND version=?").bind(JSON.stringify(data), time, student.id, version).run();
            if (!result.meta.changes)
                throw new CampusError(409, "PROGRESS_CONFLICT", "Another device updated your progress. Reload before saving.");
            return json(await progressFor(ctx, student));
        }
        if ((route === "attempts" || route === "cases") && method === "POST") {
            const student = await requireStudent(request, ctx);
            await limit(ctx, "answer:" + student.id, 120, 60 * 1000);
            const sourceId = route === "cases" ? "case-" + textField(body.caseId, "caseId", 30) : undefined;
            const assigned = await getAssignedQuestion(ctx, student, body, sourceId), q = JSON.parse(assigned.row.content);
            let optionId: string;
            if (route === "cases") {
                const rule = CASE_RULES[String(body.caseId)];
                if (!rule)
                    throw new CampusError(400, "INVALID_CASE", "Unknown learning event.");
                number(body.decisionIndex, 0, rule.decisionCount - 1, "decisionIndex");
                const seen = Array.isArray(body.seenEvidence) ? new Set(body.seenEvidence) : new Set();
                if (seen.size < 2 || [...seen].some(i => !Number.isInteger(i) || Number(i) < 0 || Number(i) >= rule.evidenceCount))
                    throw new CampusError(400, "EVIDENCE_REQUIRED", "Review at least two distinct evidence items before submitting a repair.");
                optionId = String(number(body.repairIndex, 0, q.options.length - 1, "repairIndex"));
            }
            else {
                if (q.category === "case")
                    throw new CampusError(400, "CASE_PROOF_REQUIRED", "Submit the evidence and repair through the learning-event route.");
                if (q.category === "transfer") {
                    const answers = await studentAttempts(ctx, student.id, assigned.assignmentId);
                    if (!assigned.questions.filter(r => JSON.parse(r.content).category === "case").every(r => answers.some(a => a.questionId === r.id && a.correct === 1)))
                        throw new CampusError(409, "TRANSFER_LOCKED", "Complete the four learning events first.");
                }
                optionId = textField(body.optionId, "optionId", 30);
            }
            return json(await recordAttempt(ctx, student, body, assigned.row, assigned.assignmentId, optionId));
        }
        if (route === "teacher/session" && method === "GET") {
            const identity = allowedTeacher(ctx);
            let unlocked = false;
            if (identity) {
                try {
                    await requireTeacher(request, ctx);
                    unlocked = true;
                }
                catch (error) {
                    if (!(error instanceof CampusError && error.code === "TEACHER_LOCKED"))
                        throw error;
                }
            }
            return json({ signedIn: !!ctx.teacher, allowed: !!identity, unlocked, localDevelopment: ctx.localDevelopment === true && ctx.env.CAMPUS_LOCAL_TEACHER === "1", signInUrl: "/signin-with-chatgpt?return_to=%2F" });
        }
        if (route === "teacher/unlock" && method === "POST") {
            const identity = await requireTeacher(request, ctx, false);
            await limit(ctx, "teacher-pin:" + identity.userId, 5, 15 * 60 * 1000);
            const configured = ctx.env.TEACHER_PIN ?? (ctx.localDevelopment ? "1234" : undefined);
            if (!configured)
                throw new CampusError(503, "TEACHER_PIN_NOT_CONFIGURED", "The teacher workspace has not been configured.");
            if (!await equalSecret(textField(body.pin, "pin", 100), configured))
                throw new CampusError(401, "INVALID_PIN", "The PIN is not correct.");
            const raw = token(), lifetime = 30 * 60;
            await ctx.db.prepare("INSERT INTO campus_teacher_unlocks (token_hash,owner_id,expires_at) VALUES (?,?,?)").bind(await hash(raw), identity.userId, now(ctx) + lifetime * 1000).run();
            await seedQuestions(ctx, identity.userId);
            return json({ unlocked: true, expiresIn: lifetime }, 200, { "set-cookie": setCookie(request, TEACHER_COOKIE, raw, lifetime) });
        }
        if (route === "teacher/lock" && method === "POST") {
            const identity = await requireTeacher(request, ctx, false), raw = cookie(request, TEACHER_COOKIE);
            if (raw)
                await ctx.db.prepare("DELETE FROM campus_teacher_unlocks WHERE token_hash=? AND owner_id=?").bind(await hash(raw), identity.userId).run();
            return json({ ok: true }, 200, { "set-cookie": setCookie(request, TEACHER_COOKIE, "", 0) });
        }
        if (path[0] === "teacher") {
            const identity = await requireTeacher(request, ctx), ownerId = identity.userId;
            if (route === "teacher/classes" && method === "GET")
                return json({ classes: (await ctx.db.prepare("SELECT * FROM campus_classrooms WHERE owner_id=? ORDER BY school_year DESC,grade,section").bind(ownerId).all<ClassRow>()).results.map(classPublic) });
            if (route === "teacher/classes" && method === "POST") {
                if (body.seedDefault === true) {
                    const classes = [];
                    for (let grade = 1; grade <= 6; grade++)
                        for (const section of ["A", "B", "C", "D"]) {
                            const details = classDetails({ ...body, grade, section });
                            classes.push(await createClass(ctx, ownerId, details.grade, details.section, details.schoolYear));
                        }
                    return json({ classes }, 201);
                }
                const d = classDetails(body);
                return json({ classroom: await createClass(ctx, ownerId, d.grade, d.section, d.schoolYear) }, 201);
            }
            if (path.length === 4 && path[1] === "classes" && path[3] === "assignment" && method === "POST") {
                const classroom = await ownedClass(ctx, ownerId, path[2]);
                return json({ assignment: await createAssignment(ctx, classroom, textField(body.title ?? "Campus learning", "title", 100)) }, 201);
            }
            if (path.length === 4 && path[1] === "classes" && path[3] === "assignments" && method === "GET") {
                const classroom = await ownedClass(ctx, ownerId, path[2]);
                return json({ activeAssignmentId: classroom.active_assignment_id, assignments: (await ctx.db.prepare("SELECT id,title,created_at AS createdAt FROM campus_assignments WHERE classroom_id=? ORDER BY created_at DESC,id").bind(classroom.id).all()).results });
            }
            if (route === "teacher/questions" && method === "GET") {
                await seedQuestions(ctx, ownerId);
                const rows = (await ctx.db.prepare("SELECT q.id,q.source_id,q.status,r.revision,r.content,r.answer FROM campus_questions q JOIN campus_question_revisions r ON r.question_id=q.id AND r.revision=q.current_revision WHERE q.owner_id=? ORDER BY q.grade,q.subject_id,q.id").bind(ownerId).all<QuestionRow>()).results;
                return json({ questions: rows.map(teacherQuestion).filter(q => (!url.searchParams.get("grade") || q.grade === Number(url.searchParams.get("grade"))) && (!url.searchParams.get("subjectId") || q.subjectId === url.searchParams.get("subjectId"))) });
            }
            if (route === "teacher/questions" && method === "POST") {
                const id = crypto.randomUUID(), q = validateQuestion(body, id), data = splitQuestion(q), status = body.status === "published" ? "published" : "draft";
                await ctx.db.batch([ctx.db.prepare("INSERT INTO campus_questions (id,owner_id,grade,subject_id,room_id,category,current_revision,status,created_at) VALUES (?,?,?,?,?,'subject',1,?,?)").bind(id, ownerId, q.grade, q.subjectId, q.roomId, status, iso(ctx)), ctx.db.prepare("INSERT INTO campus_question_revisions (id,question_id,revision,content,answer,created_at) VALUES (?,?,1,?,?,?)").bind(id + ":1", id, data.content, data.answer, iso(ctx))]);
                return json({ question: { ...q, revision: 1, status } }, 201);
            }
            if (path.length === 3 && path[1] === "questions" && path[2] && (method === "PATCH" || method === "DELETE")) {
                const row = await ctx.db.prepare("SELECT id,current_revision,category FROM campus_questions WHERE id=? AND owner_id=?").bind(path[2], ownerId).first<{
                    id: string;
                    current_revision: number;
                    category: string;
                }>();
                if (!row)
                    forbidden();
                if (row!.category !== "subject")
                    throw new CampusError(400, "CORE_EVENT", "The four authored learning events are maintained separately from the subject bank.");
                if (method === "DELETE") {
                    await ctx.db.prepare("UPDATE campus_questions SET status='archived' WHERE id=? AND owner_id=?").bind(row!.id, ownerId).run();
                    return json({ archived: true });
                }
                const expected = number(body.expectedRevision, 1, 2147483647, "expectedRevision");
                if (row!.current_revision !== expected)
                    throw new CampusError(409, "QUESTION_CONFLICT", "Refresh this question before editing.");
                const q = validateQuestion(body, row!.id), revision = expected + 1, data = splitQuestion(q), status = body.status === "published" ? "published" : "draft";
                try {
                    await ctx.db.batch([ctx.db.prepare("INSERT INTO campus_question_revisions (id,question_id,revision,content,answer,created_at) VALUES (?,?,?,?,?,?)").bind(row!.id + ":" + revision, row!.id, revision, data.content, data.answer, iso(ctx)), ctx.db.prepare("UPDATE campus_questions SET grade=?,subject_id=?,room_id=?,current_revision=?,status=? WHERE id=? AND owner_id=? AND current_revision=?").bind(q.grade, q.subjectId, q.roomId, revision, status, row!.id, ownerId, expected)]);
                }
                catch (error) {
                    if (String(error).includes("UNIQUE"))
                        throw new CampusError(409, "QUESTION_CONFLICT", "Another teacher update was saved. Refresh first.");
                    throw error;
                }
                return json({ question: { ...q, revision, status } });
            }
            if (route === "teacher/results" && method === "GET") {
                const classId = textField(url.searchParams.get("classId"), "classId", 100), classroom = await ownedClass(ctx, ownerId, classId), assignmentId = url.searchParams.get("assignmentId") ?? classroom.active_assignment_id;
                if (!assignmentId)
                    return json({ classroom: classPublic(classroom), rows: [], subjects: [] });
                const assignment = await ctx.db.prepare("SELECT id,title FROM campus_assignments WHERE id=? AND classroom_id=?").bind(assignmentId, classroom.id).first();
                if (!assignment)
                    forbidden();
                const questions = await assignmentQuestions(ctx, assignmentId), students = (await ctx.db.prepare("SELECT id,student_number,name FROM campus_students WHERE classroom_id=? ORDER BY CAST(student_number AS INTEGER),student_number").bind(classId).all<{
                    id: string;
                    student_number: string;
                    name: string;
                }>()).results;
                const allAttempts = (await ctx.db.prepare("SELECT a.student_id AS studentId,a.id,a.assignment_id AS assignmentId,a.question_id AS questionId,a.revision,a.option_id AS optionId,a.attempt_number AS attemptNumber,a.correct,a.score,a.created_at AS createdAt,a.evidence,a.decision_index AS decisionIndex FROM campus_attempts a JOIN campus_students s ON s.id=a.student_id WHERE s.classroom_id=? AND a.assignment_id=? ORDER BY a.created_at,a.attempt_number").bind(classId, assignmentId).all<Awaited<ReturnType<typeof studentAttempts>>[number] & {
                    studentId: string;
                }>()).results;
                const subjectId = url.searchParams.get("subjectId"), rows = [];
                for (const student of students) {
                    const result = calculateResults(questions, allAttempts.filter(a => a.studentId === student.id));
                    for (const subject of result.results.filter(s => !subjectId || s.subjectId === subjectId))
                        rows.push({ studentId: student.id, className: `${classroom.grade}${classroom.section}`, studentNumber: student.student_number, studentName: student.name, ...subject });
                }
                return json({ classroom: classPublic(classroom), assignment, scoringPolicy: "first_response", headers: ["班別", "學號", "學生姓名", "學科得分"], rows, subjects: [...new Set(questions.map(q => JSON.parse(q.content).subjectId))] });
            }
            if (path.length === 4 && path[1] === "students" && path[2] && path[3] === "recovery" && method === "POST") {
                const student = await ctx.db.prepare("SELECT s.id FROM campus_students s JOIN campus_classrooms c ON c.id=s.classroom_id WHERE s.id=? AND c.owner_id=?").bind(path[2], ownerId).first<{
                    id: string;
                }>();
                if (!student)
                    forbidden();
                const recoveryCode = token().slice(0, 20).toUpperCase();
                await ctx.db.batch([ctx.db.prepare("UPDATE campus_students SET recovery_hash=? WHERE id=?").bind(await hash(recoveryCode), student!.id), ctx.db.prepare("DELETE FROM campus_sessions WHERE student_id=?").bind(student!.id)]);
                return json({ recoveryCode });
            }
        }
        return json({ error: { code: "NOT_FOUND", message: "Unknown campus API route." } }, 404);
    }
    catch (error) {
        if (error instanceof CampusError)
            return json({ error: { code: error.code, message: error.message } }, error.status);
        // Do not expose database statements, secret values, or student records.
        console.error("Campus API request failed", error instanceof Error ? error.name : "unknown");
        return json({ error: { code: "SERVER_ERROR", message: "The request could not be completed. Please try again." } }, 500);
    }
}
