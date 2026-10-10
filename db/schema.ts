import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";
export const bankUpdates = sqliteTable("campus_bank_updates", {
    id: text("id").primaryKey(), ownerId: text("owner_id").notNull(),
    version: text("version").notNull(), createdAt: text("created_at").notNull(),
});
export const worksheets = sqliteTable("campus_worksheets", {
    id: text("id").primaryKey(), ownerId: text("owner_id").notNull(),
    grade: integer("grade").notNull(), subjectId: text("subject_id").notNull(),
    title: text("title").notNull(), files: text("files").notNull(),
    createdAt: text("created_at").notNull(),
});

export const classrooms = sqliteTable("campus_classrooms", {
    id: text("id").primaryKey(), ownerId: text("owner_id").notNull(),
    schoolYear: text("school_year").notNull(), grade: integer("grade").notNull(),
    section: text("section").notNull(), joinCode: text("join_code").notNull().unique(),
    activeAssignmentId: text("active_assignment_id"), createdAt: text("created_at").notNull(),
}, t => [uniqueIndex("campus_class_owner_year_section").on(t.ownerId, t.schoolYear, t.grade, t.section)]);
export const students = sqliteTable("campus_students", {
    id: text("id").primaryKey(), classroomId: text("classroom_id").notNull().references(() => classrooms.id),
    studentNumber: text("student_number").notNull(), name: text("name").notNull(),
    recoveryHash: text("recovery_hash").notNull(), createdAt: text("created_at").notNull(),
}, t => [uniqueIndex("campus_student_class_number").on(t.classroomId, t.studentNumber)]);
export const sessions = sqliteTable("campus_sessions", {
    tokenHash: text("token_hash").primaryKey(), studentId: text("student_id").notNull().references(() => students.id),
    expiresAt: integer("expires_at").notNull(), createdAt: text("created_at").notNull(),
});
export const teacherUnlocks = sqliteTable("campus_teacher_unlocks", {
    tokenHash: text("token_hash").primaryKey(), ownerId: text("owner_id").notNull(), expiresAt: integer("expires_at").notNull(),
});
export const questions = sqliteTable("campus_questions", {
    id: text("id").primaryKey(), ownerId: text("owner_id").notNull(), sourceId: text("source_id"),
    grade: integer("grade").notNull(), subjectId: text("subject_id").notNull(), roomId: text("room_id").notNull(),
    category: text("category").notNull(), currentRevision: integer("current_revision").notNull(),
    status: text("status").notNull(), createdAt: text("created_at").notNull(),
}, t => [uniqueIndex("campus_question_owner_source").on(t.ownerId, t.sourceId)]);
export const questionRevisions = sqliteTable("campus_question_revisions", {
    id: text("id").primaryKey(), questionId: text("question_id").notNull().references(() => questions.id),
    revision: integer("revision").notNull(), content: text("content").notNull(), answer: text("answer").notNull(),
    createdAt: text("created_at").notNull(),
}, t => [uniqueIndex("campus_revision_question_number").on(t.questionId, t.revision)]);
export const assignments = sqliteTable("campus_assignments", {
    id: text("id").primaryKey(), classroomId: text("classroom_id").notNull().references(() => classrooms.id),
    title: text("title").notNull(), createdAt: text("created_at").notNull(),
});
export const assignmentItems = sqliteTable("campus_assignment_items", {
    id: text("id").primaryKey(), assignmentId: text("assignment_id").notNull().references(() => assignments.id),
    questionId: text("question_id").notNull().references(() => questions.id), revision: integer("revision").notNull(),
}, t => [uniqueIndex("campus_assignment_question").on(t.assignmentId, t.questionId)]);
export const attempts = sqliteTable("campus_attempts", {
    id: text("id").primaryKey(), studentId: text("student_id").notNull().references(() => students.id),
    assignmentId: text("assignment_id").notNull().references(() => assignments.id), questionId: text("question_id").notNull(),
    revision: integer("revision").notNull(), optionId: text("option_id").notNull(),
    attemptNumber: integer("attempt_number").notNull(), correct: integer("correct").notNull(),
    score: integer("score").notNull(), idempotencyKey: text("idempotency_key").notNull(), createdAt: text("created_at").notNull(),
    evidence: text("evidence"), decisionIndex: integer("decision_index"),
}, t => [uniqueIndex("campus_attempt_idempotency").on(t.studentId, t.idempotencyKey), uniqueIndex("campus_attempt_sequence").on(t.studentId, t.assignmentId, t.questionId, t.attemptNumber)]);
export const studentProgress = sqliteTable("campus_student_progress", {
    studentId: text("student_id").primaryKey().references(() => students.id), data: text("data").notNull(),
    version: integer("version").notNull(), updatedAt: text("updated_at").notNull(),
});
export const rateLimits = sqliteTable("campus_rate_limits", {
    key: text("key").primaryKey(), count: integer("count").notNull(), resetAt: integer("reset_at").notNull(),
});
