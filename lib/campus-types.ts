export type Tri = {
    zh: string;
    cn: string;
    en: string;
};
export type CampusOption = {
    id: string;
    text: Tri;
    correct: boolean;
    feedback: Tri;
};
export type CampusQuestion = {
    id: string;
    grade: number;
    subjectId: string;
    roomId: string;
    category: "subject" | "case" | "transfer";
    level: string;
    stars: number;
    maxScore: number;
    title: Tri;
    question: Tri;
    options: CampusOption[];
    takeaway: Tri;
};
export type CampusEnv = {
    TEACHER_EMAILS?: string;
    TEACHER_PIN?: string;
    CAMPUS_LOCAL_TEACHER?: string;
};
export type TeacherIdentity = {
    userId: string;
    email: string;
} | null;
export type CampusContext = {
    db: D1Database;
    bucket?: R2Bucket;
    env: CampusEnv;
    teacher: TeacherIdentity;
    now?: number;
    localDevelopment?: boolean;
};
export class CampusError extends Error {
    status: number;
    code: string;
    constructor(status: number, code: string, message: string) { super(message); this.status = status; this.code = code; }
}
