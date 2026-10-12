import type { CampusWorksheetBucket } from "./campus-worksheet-storage";
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
    TEACHER_AUTH_MODE?: "sites" | "access-code";
    TEACHER_EMAILS?: string;
    TEACHER_PIN?: string;
    CAMPUS_LOCAL_TEACHER?: string;
    OPENROUTER_API_KEY?: string;
    CAMPUS_TTS_ENABLED?: string;
    CAMPUS_TTS_MODE?: string;
    CAMPUS_TTS_AUDITION_ONLY?: string;
    CAMPUS_TTS_BLOCKED_LOCALES?: string;
    CAMPUS_TTS_CONFIG?: string;
    CAMPUS_TTS_DAILY_CHARACTERS?: string;
    CAMPUS_TTS_DAILY_REQUESTS?: string;
    CAMPUS_TTS_DAILY_USD?: string;
};
export type TeacherIdentity = {
    userId: string;
    email: string;
} | null;
export type CampusContext = {
    db: D1Database;
    bucket?: R2Bucket;
    worksheetBucket?: CampusWorksheetBucket;
    env: CampusEnv;
    teacher: TeacherIdentity;
    now?: number;
    localDevelopment?: boolean;
    // Supplied only by the trusted hosting adapter, never arbitrary forwarded headers.
    clientIp?: string;
};
export class CampusError extends Error {
    status: number;
    code: string;
    constructor(status: number, code: string, message: string) { super(message); this.status = status; this.code = code; }
}
