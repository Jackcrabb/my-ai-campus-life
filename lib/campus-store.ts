import gradeBank from "../data/grade-bank.json";
import { CAMPUS_CASES } from "./campus-cases";
import { CampusError, type CampusContext, type CampusQuestion, type Tri } from "./campus-types";
import { STUDENT_COOKIE, cookie, hash, iso, now, textField, token } from "./campus-security";
export const BANK = [...gradeBank as CampusQuestion[], ...CAMPUS_CASES];
export const SUBJECT_IDS = ["playground", "hall", "chinese", "english", "maths", "chemistry", "geography", "computer", "history", "art", "music", "library", "rooftop"];
export type ClassRow = {
    id: string;
    owner_id: string;
    school_year: string;
    grade: number;
    section: string;
    join_code: string;
    active_assignment_id: string | null;
};
export type StudentRow = {
    id: string;
    classroom_id: string;
    student_number: string;
    name: string;
    grade: number;
    section: string;
    school_year: string;
    active_assignment_id: string | null;
    owner_id: string;
};
export type QuestionRow = {
    id: string;
    source_id: string | null;
    revision: number;
    content: string;
    answer: string;
    status?: string;
};
export async function batch(ctx: CampusContext, statements: D1PreparedStatement[]) { for (let i = 0; i < statements.length; i += 50)
    await ctx.db.batch(statements.slice(i, i + 50)); }
export function splitQuestion(question: CampusQuestion) {
    const answer = { correctOptionId: question.options.find(o => o.correct)!.id, feedback: Object.fromEntries(question.options.map(o => [o.id, o.feedback])) };
    const content = { ...question, options: question.options.map(({ id, text }) => ({ id, text })) };
    return { content: JSON.stringify(content), answer: JSON.stringify(answer) };
}
export function publicQuestion(row: QuestionRow) { return { ...JSON.parse(row.content), id: row.id, sourceId: row.source_id, revision: row.revision }; }
export function teacherQuestion(row: QuestionRow) {
    const content = publicQuestion(row), answer = JSON.parse(row.answer);
    return { ...content, status: row.status, options: content.options.map((o: {
            id: string;
            text: Tri;
        }) => ({ ...o, correct: o.id === answer.correctOptionId, feedback: answer.feedback[o.id] })) };
}
export async function seedQuestions(ctx: CampusContext, ownerId: string) {
    const prefix = (await hash(ownerId)).slice(0, 20);
    const existing = await ctx.db.prepare("SELECT COUNT(*) AS n FROM campus_questions WHERE owner_id=? AND source_id IS NOT NULL").bind(ownerId).first<{
        n: number;
    }>();
    if ((existing?.n ?? 0) >= BANK.length)
        return;
    const statements: D1PreparedStatement[] = [];
    // Bounded multi-row statements reduce first-run database calls while staying
    // below 100 bound values per prepared statement.
    for (let i = 0; i < BANK.length; i += 10) {
        const slice = BANK.slice(i, i + 10), values = slice.flatMap(q => [`${prefix}-${q.id}`, ownerId, q.id, q.grade, q.subjectId, q.roomId, q.category, iso(ctx)]);
        statements.push(ctx.db.prepare("INSERT OR IGNORE INTO campus_questions (id,owner_id,source_id,grade,subject_id,room_id,category,current_revision,status,created_at) VALUES " + slice.map(() => "(?,?,?,?,?,?,?,1,'published',?)").join(",")).bind(...values));
    }
    for (let i = 0; i < BANK.length; i += 15) {
        const slice = BANK.slice(i, i + 15), values = slice.flatMap(q => { const id = `${prefix}-${q.id}`, data = splitQuestion(q); return [id + ":1", id, data.content, data.answer, iso(ctx)]; });
        statements.push(ctx.db.prepare("INSERT OR IGNORE INTO campus_question_revisions (id,question_id,revision,content,answer,created_at) VALUES " + slice.map(() => "(?,?,1,?,?,?)").join(",")).bind(...values));
    }
    await batch(ctx, statements);
}
export async function ownedClass(ctx: CampusContext, ownerId: string, id: string) {
    const row = await ctx.db.prepare("SELECT * FROM campus_classrooms WHERE id=? AND owner_id=?").bind(id, ownerId).first<ClassRow>();
    if (!row)
        throw new CampusError(404, "CLASS_NOT_FOUND", "Classroom not found.");
    return row;
}
export function classPublic(row: ClassRow) { return { id: row.id, schoolYear: row.school_year, grade: row.grade, section: row.section, label: `${row.grade}${row.section}`, classCode: row.join_code, assignmentId: row.active_assignment_id }; }
export async function createAssignment(ctx: CampusContext, classroom: ClassRow, title: string) {
    const items = await ctx.db.prepare("SELECT id,current_revision FROM campus_questions WHERE owner_id=? AND status='published' AND (grade=? OR grade=0) ORDER BY id").bind(classroom.owner_id, classroom.grade).all<{
        id: string;
        current_revision: number;
    }>();
    if (!items.results.length)
        throw new CampusError(409, "EMPTY_QUESTION_BANK", "Publish questions before starting an activity.");
    const id = crypto.randomUUID();
    const statements = [ctx.db.prepare("INSERT INTO campus_assignments (id,classroom_id,title,created_at) VALUES (?,?,?,?)").bind(id, classroom.id, title, iso(ctx))];
    for (let i = 0; i < items.results.length; i += 20) {
        const slice = items.results.slice(i, i + 20);
        statements.push(ctx.db.prepare("INSERT INTO campus_assignment_items (id,assignment_id,question_id,revision) VALUES " + slice.map(() => "(?,?,?,?)").join(",")).bind(...slice.flatMap(q => [id + ":" + q.id, id, q.id, q.current_revision])));
    }
    statements.push(ctx.db.prepare("UPDATE campus_classrooms SET active_assignment_id=? WHERE id=? AND owner_id=?").bind(id, classroom.id, classroom.owner_id));
    // The snapshot and active pointer are committed atomically in one D1 batch.
    await ctx.db.batch(statements);
    return { id, title, questionCount: items.results.length };
}
export async function createClass(ctx: CampusContext, ownerId: string, grade: number, section: string, schoolYear: string) {
    await seedQuestions(ctx, ownerId);
    const id = crypto.randomUUID(), joinCode = token().slice(0, 10).toUpperCase();
    await ctx.db.prepare("INSERT OR IGNORE INTO campus_classrooms (id,owner_id,school_year,grade,section,join_code,created_at) VALUES (?,?,?,?,?,?,?)").bind(id, ownerId, schoolYear, grade, section, joinCode, iso(ctx)).run();
    const row = (await ctx.db.prepare("SELECT * FROM campus_classrooms WHERE owner_id=? AND school_year=? AND grade=? AND section=?").bind(ownerId, schoolYear, grade, section).first<ClassRow>())!;
    if (!row.active_assignment_id) {
        const assignment = await createAssignment(ctx, row, "Campus learning 1");
        row.active_assignment_id = assignment.id;
    }
    return classPublic(row);
}
export async function requireStudent(request: Request, ctx: CampusContext) {
    const raw = cookie(request, STUDENT_COOKIE);
    if (!raw)
        throw new CampusError(401, "STUDENT_SESSION_REQUIRED", "Join or resume your class first.");
    const row = await ctx.db.prepare("SELECT s.id,s.classroom_id,s.student_number,s.name,c.grade,c.section,c.school_year,c.owner_id,c.active_assignment_id FROM campus_sessions t JOIN campus_students s ON s.id=t.student_id JOIN campus_classrooms c ON c.id=s.classroom_id WHERE t.token_hash=? AND t.expires_at>?").bind(await hash(raw), now(ctx)).first<StudentRow>();
    if (!row)
        throw new CampusError(401, "STUDENT_SESSION_EXPIRED", "Resume your student session.");
    return row;
}
export function studentPublic(row: StudentRow) { return { studentId: row.id, classId: row.classroom_id, studentNumber: row.student_number, name: row.name, grade: row.grade, section: row.section, schoolYear: row.school_year, assignmentId: row.active_assignment_id }; }
export async function assignmentQuestions(ctx: CampusContext, assignmentId: string) {
    return (await ctx.db.prepare("SELECT q.id,q.source_id,r.revision,r.content,r.answer FROM campus_assignment_items i JOIN campus_questions q ON q.id=i.question_id JOIN campus_question_revisions r ON r.question_id=i.question_id AND r.revision=i.revision WHERE i.assignment_id=? ORDER BY q.subject_id,q.id").bind(assignmentId).all<QuestionRow>()).results;
}
export async function studentAttempts(ctx: CampusContext, studentId: string, assignmentId: string) {
    return (await ctx.db.prepare("SELECT id,assignment_id AS assignmentId,question_id AS questionId,revision,option_id AS optionId,attempt_number AS attemptNumber,correct,score,created_at AS createdAt,evidence,decision_index AS decisionIndex FROM campus_attempts WHERE student_id=? AND assignment_id=? ORDER BY created_at,attempt_number").bind(studentId, assignmentId).all<{
        id: string;
        assignmentId: string;
        questionId: string;
        revision: number;
        optionId: string;
        attemptNumber: number;
        correct: number;
        score: number;
        createdAt: string;
        evidence: string | null;
        decisionIndex: number | null;
    }>()).results;
}
export function calculateResults(questions: QuestionRow[], attempts: Awaited<ReturnType<typeof studentAttempts>>) {
    const groups = new Map<string, {
        subjectId: string;
        score: number;
        maxScore: number;
        attemptedCount: number;
        completedCount: number;
        totalQuestions: number;
        stars: number;
    }>();
    const questionProgress: Record<string, {
        sourceId: string | null;
        completed: boolean;
        attempts: number;
        score: number;
        stars: number;
        lastOptionId: string | null;
    }> = {};
    for (const row of questions) {
        const q = JSON.parse(row.content), answers = attempts.filter(a => a.questionId === row.id && a.revision === row.revision).sort((a, b) => a.attemptNumber - b.attemptNumber), first = answers.find(a => a.attemptNumber === 1), completed = answers.some(a => a.correct === 1);
        const group = groups.get(q.subjectId) ?? { subjectId: q.subjectId, score: 0, maxScore: 0, attemptedCount: 0, completedCount: 0, totalQuestions: 0, stars: 0 };
        group.score += first?.score ?? 0;
        group.maxScore += q.maxScore;
        group.totalQuestions++;
        group.attemptedCount += first ? 1 : 0;
        group.completedCount += completed ? 1 : 0;
        group.stars += completed ? q.stars : 0;
        groups.set(q.subjectId, group);
        questionProgress[row.id] = { sourceId: row.source_id, completed, attempts: answers.length, score: first?.score ?? 0, stars: completed ? q.stars : 0, lastOptionId: answers.at(-1)?.optionId ?? null };
    }
    const results = [...groups.values()].map(g => ({ ...g, percent: g.attemptedCount === g.totalQuestions ? Math.round(100 * g.score / g.maxScore) : null, status: g.attemptedCount === 0 ? "not_started" : g.attemptedCount === g.totalQuestions ? "completed" : "in_progress" }));
    return { results, questionProgress, stars: results.reduce((n, r) => n + r.stars, 0), maxStars: questions.reduce((n, r) => n + JSON.parse(r.content).stars, 0), score: results.reduce((n, r) => n + r.score, 0), maxScore: results.reduce((n, r) => n + r.maxScore, 0) };
}
export async function progressFor(ctx: CampusContext, student: StudentRow) {
    const saved = await ctx.db.prepare("SELECT data,version,updated_at AS updatedAt FROM campus_student_progress WHERE student_id=?").bind(student.id).first<{
        data: string;
        version: number;
        updatedAt: string;
    }>();
    const questions = student.active_assignment_id ? await assignmentQuestions(ctx, student.active_assignment_id) : [];
    const attempts = student.active_assignment_id ? await studentAttempts(ctx, student.id, student.active_assignment_id) : [];
    return { profile: studentPublic(student), assignmentId: student.active_assignment_id, version: saved?.version ?? 0, updatedAt: saved?.updatedAt ?? null, progress: saved ? JSON.parse(saved.data) : {}, attempts, ...calculateResults(questions, attempts) };
}
function tri(value: unknown, label: string): Tri {
    const v = value as Record<string, unknown>, field = (locale: string, max: number) => { const s = v?.[locale]; if (typeof s !== "string" || !s.trim() || s.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(s))
        throw new CampusError(400, "QUESTION_TEXT", `Invalid ${label}.${locale}.`); return s.trim(); };
    return { zh: field("zh", 4000), cn: field("cn", 4000), en: field("en", 6000) };
}
export function validateQuestion(raw: Record<string, unknown>, id: string): CampusQuestion {
    const grade = Number(raw.grade), stars = Number(raw.stars), maxScore = Number(raw.maxScore);
    if (!Number.isInteger(grade) || grade < 1 || grade > 6 || !Number.isInteger(stars) || stars < 1 || stars > 3 || !Number.isInteger(maxScore) || maxScore < 1 || maxScore > 10)
        throw new CampusError(400, "QUESTION_RANGE", "Invalid grade, stars or marks.");
    const subjectId = textField(raw.subjectId, "subjectId", 40), roomId = textField(raw.roomId, "roomId", 40);
    if (!SUBJECT_IDS.includes(subjectId) || !SUBJECT_IDS.includes(roomId))
        throw new CampusError(400, "QUESTION_SUBJECT", "Unknown subject or room.");
    if (!Array.isArray(raw.options) || raw.options.length < 2 || raw.options.length > 5)
        throw new CampusError(400, "QUESTION_OPTIONS", "Provide two to five options.");
    const options = raw.options.map((x: Record<string, unknown>, i: number) => ({ id: textField(x.id, "option id", 30), text: tri(x.text, `option ${i}`), correct: x.correct === true, feedback: tri(x.feedback, `feedback ${i}`) }));
    if (new Set(options.map(o => o.id)).size !== options.length || options.filter(o => o.correct).length !== 1)
        throw new CampusError(400, "QUESTION_ANSWER", "Exactly one correct option and unique option IDs are required.");
    return { id, grade, subjectId, roomId, category: "subject", level: textField(raw.level, "level", 30), stars, maxScore, title: tri(raw.title, "title"), question: tri(raw.question, "question"), options, takeaway: tri(raw.takeaway, "takeaway") };
}
