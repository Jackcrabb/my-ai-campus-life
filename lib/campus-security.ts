import { CampusError, type CampusContext, type TeacherIdentity } from "./campus-types";
export const STUDENT_COOKIE = "campus_student";
export const TEACHER_COOKIE = "campus_teacher";
export const now = (ctx: CampusContext) => ctx.now ?? Date.now();
export const iso = (ctx: CampusContext) => new Date(now(ctx)).toISOString();
export const token = () => Array.from(crypto.getRandomValues(new Uint8Array(24)), x => x.toString(16).padStart(2, "0")).join("");
export async function hash(value: string) { return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value))), x => x.toString(16).padStart(2, "0")).join(""); }
export function cookie(request: Request, name: string) { return request.headers.get("cookie")?.split(";").map(v => v.trim()).find(v => v.startsWith(name + "="))?.slice(name.length + 1) ?? ""; }
export function setCookie(request: Request, name: string, value: string, maxAge: number) {
    return `${name}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${new URL(request.url).protocol === "https:" ? "; Secure" : ""}`;
}
export function checkOrigin(request: Request, contentType = "application/json") {
    if (["GET", "HEAD"].includes(request.method))
        return;
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin)
        throw new CampusError(403, "CROSS_ORIGIN", "Cross-origin writes are not allowed.");
    if (!request.headers.get("content-type")?.includes(contentType))
        throw new CampusError(415, "JSON_REQUIRED", "Use application/json.");
}
export async function readBody(request: Request) {
    const text = await request.text();
    if (text.length > 65000)
        throw new CampusError(413, "BODY_TOO_LARGE", "Request is too large.");
    try {
        const value = JSON.parse(text || "{}");
        if (!value || typeof value !== "object" || Array.isArray(value))
            throw Error();
        return value as Record<string, unknown>;
    }
    catch {
        throw new CampusError(400, "INVALID_JSON", "A JSON object is required.");
    }
}
export function textField(value: unknown, name: string, max = 100) {
    if (typeof value !== "string" || !value.trim() || value.trim().length > max || /[\u0000-\u001f]/.test(value))
        throw new CampusError(400, "INVALID_FIELD", `Invalid ${name}.`);
    return value.trim();
}
export function allowedTeacher(ctx: CampusContext): TeacherIdentity {
    const emails = (ctx.env.TEACHER_EMAILS ?? "").split(",").map(x => x.trim().toLowerCase()).filter(Boolean);
    if (ctx.teacher && emails.includes(ctx.teacher.email.toLowerCase()))
        return ctx.teacher;
    if (ctx.localDevelopment && ctx.env.CAMPUS_LOCAL_TEACHER === "1")
        return { userId: "local-development-teacher", email: "local-teacher@example.invalid" };
    return null;
}
export async function requireTeacher(request: Request, ctx: CampusContext, unlocked = true) {
    const identity = allowedTeacher(ctx);
    if (!identity)
        throw new CampusError(403, "TEACHER_FORBIDDEN", "Sign in with an authorised teacher account.");
    if (unlocked) {
        const key = cookie(request, TEACHER_COOKIE);
        const row = key && await ctx.db.prepare("SELECT owner_id FROM campus_teacher_unlocks WHERE token_hash=? AND owner_id=? AND expires_at>?").bind(await hash(key), identity.userId, now(ctx)).first();
        if (!row)
            throw new CampusError(401, "TEACHER_LOCKED", "Unlock the teacher workspace.");
    }
    return identity;
}
export async function limit(ctx: CampusContext, key: string, maximum: number, windowMs: number) {
    const time = now(ctx);
    await ctx.db.prepare("INSERT INTO campus_rate_limits (key,count,reset_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN reset_at<=? THEN 1 ELSE count+1 END,reset_at=CASE WHEN reset_at<=? THEN excluded.reset_at ELSE reset_at END").bind(key, time + windowMs, time, time).run();
    const row = await ctx.db.prepare("SELECT count,reset_at FROM campus_rate_limits WHERE key=?").bind(key).first<{
        count: number;
        reset_at: number;
    }>();
    if (row && row.count > maximum)
        throw new CampusError(429, "RATE_LIMITED", "Too many attempts. Please try again later.");
}
export async function equalSecret(a: string, b: string) { const left = await hash(a), right = await hash(b); let difference = 0; for (let i = 0; i < left.length; i++)
    difference |= left.charCodeAt(i) ^ right.charCodeAt(i); return difference === 0; }
