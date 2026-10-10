import { CampusError, type CampusContext } from "./campus-types";
import { checkOrigin, iso, limit, requireTeacher, textField } from "./campus-security";
import { requireStudent, SUBJECT_IDS } from "./campus-store";

export const WORKSHEET_MAX_BYTES = 5 * 1024 * 1024;
export const FLOOR_SUBJECTS = [
    ["playground", "hall"], ["chinese", "english", "maths"],
    ["chemistry", "geography", "computer"], ["history", "art", "music"],
    ["library", "rooftop"],
];
type PdfFile = { key: string; filename: string; bytes: number };
type WorksheetRow = { id: string; owner_id: string; grade: number; subject_id: string; title: string; files: string; created_at: string };
const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { "cache-control": "no-store" } });
const filesFor = (row: WorksheetRow) => JSON.parse(row.files) as Partial<Record<"zh" | "en", PdfFile>>;
function publicWorksheet(row: WorksheetRow) {
    const files = filesFor(row);
    return { id: row.id, title: row.title, grade: row.grade, subjectId: row.subject_id, createdAt: row.created_at,
        files: Object.entries(files).map(([locale, file]) => ({ locale, filename: file!.filename, bytes: file!.bytes,
            url: `/api/campus/worksheets/${encodeURIComponent(row.id)}/${locale}` })) };
}
async function formDataLimited(request: Request) {
    const maximum = WORKSHEET_MAX_BYTES * 2 + 65536;
    if (Number(request.headers.get("content-length")) > maximum) throw new CampusError(413, "WORKSHEET_SIZE", "Each PDF must be 5 MB or smaller.");
    const reader = request.body?.getReader();
    if (!reader) throw new CampusError(400, "WORKSHEET_FILE", "Choose a PDF file.");
    const chunks: Uint8Array[] = [];
    let length = 0;
    for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        length += value.length;
        if (length > maximum) { await reader.cancel(); throw new CampusError(413, "WORKSHEET_SIZE", "Each PDF must be 5 MB or smaller."); }
        chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    try { return await new Response(bytes, { headers: { "content-type": request.headers.get("content-type")! } }).formData(); }
    catch { throw new CampusError(400, "WORKSHEET_FILE", "Use a valid PDF upload form."); }
}
async function canRead(request: Request, ctx: CampusContext, row: WorksheetRow) {
    try {
        const student = await requireStudent(request, ctx);
        if (student.owner_id === row.owner_id && student.grade === row.grade) return;
    } catch (error) { if (!(error instanceof CampusError && error.status === 401)) throw error; }
    try { const teacher = await requireTeacher(request, ctx); if (teacher.userId === row.owner_id) return; }
    catch (error) { if (!(error instanceof CampusError && [401, 403].includes(error.status))) throw error; }
    throw new CampusError(404, "WORKSHEET_NOT_FOUND", "This worksheet is not available to this class.");
}
export async function handleWorksheets(request: Request, ctx: CampusContext): Promise<Response> {
    const url = new URL(request.url), parts = url.pathname.replace(/^\/api\/campus\//, "").split("/");
    const teacherRoute = parts[0] === "teacher", method = request.method;
    checkOrigin(request, method === "POST" ? "multipart/form-data" : "application/json");
    if (teacherRoute) {
        const teacher = await requireTeacher(request, ctx), ownerId = teacher.userId;
        if (method === "GET" && parts.length === 2) {
            const rows = await ctx.db.prepare("SELECT * FROM campus_worksheets WHERE owner_id=? ORDER BY created_at DESC,id").bind(ownerId).all<WorksheetRow>();
            return json({ worksheets: rows.results.filter(row => (!url.searchParams.has("grade") || row.grade === Number(url.searchParams.get("grade"))) && (!url.searchParams.has("subjectId") || row.subject_id === url.searchParams.get("subjectId"))).map(publicWorksheet), maxFileBytes: WORKSHEET_MAX_BYTES });
        }
        if (method === "POST" && parts.length === 2) {
            if (!ctx.bucket) throw new CampusError(503, "WORKSHEET_STORAGE", "Worksheet storage is not configured.");
            await limit(ctx, "worksheet-upload:" + ownerId, 30, 60 * 60 * 1000);
            const form = await formDataLimited(request), grade = Number(form.get("grade"));
            const title = textField(form.get("title"), "title", 160), subject = textField(form.get("subjectId"), "subjectId", 40);
            if (!Number.isInteger(grade) || grade < 1 || grade > 6 || !SUBJECT_IDS.includes(subject)) throw new CampusError(400, "WORKSHEET_SCOPE", "Choose a valid grade and subject.");
            const id = crypto.randomUUID(), files: Partial<Record<"zh" | "en", PdfFile>> = {}, uploads: { key: string; bytes: ArrayBuffer }[] = [];
            for (const locale of ["zh", "en"] as const) {
                const file = form.get(locale);
                if (!file || typeof file === "string" || file.size === 0) continue;
                if (file.size > WORKSHEET_MAX_BYTES) throw new CampusError(413, "WORKSHEET_SIZE", "Each PDF must be 5 MB or smaller.");
                const bytes = await file.arrayBuffer();
                if (new TextDecoder().decode(bytes.slice(0, 5)) !== "%PDF-" || (file.type && file.type !== "application/pdf")) throw new CampusError(400, "WORKSHEET_FILE", "Upload a PDF file, not a renamed document.");
                const key = `worksheets/${id}/${locale}.pdf`;
                // Count Unicode code points so truncation cannot split an emoji
                // and later make Content-Disposition encoding fail.
                const filename = Array.from(file.name.replace(/[\u0000-\u001f/\\]/g, "_")).slice(0, 160).join("");
                files[locale] = { key, filename, bytes: file.size };
                uploads.push({ key, bytes });
            }
            if (!uploads.length) throw new CampusError(400, "WORKSHEET_FILE", "Provide a Traditional Chinese or English PDF, or both.");
            const uploaded: string[] = [];
            try {
                for (const item of uploads) { await ctx.bucket.put(item.key, item.bytes, { httpMetadata: { contentType: "application/pdf" } }); uploaded.push(item.key); }
                await ctx.db.prepare("INSERT INTO campus_worksheets (id,owner_id,grade,subject_id,title,files,created_at) VALUES (?,?,?,?,?,?,?)").bind(id, ownerId, grade, subject, title, JSON.stringify(files), iso(ctx)).run();
            } catch (error) { if (uploaded.length) await ctx.bucket.delete(uploaded); throw error; }
            return json({ worksheet: publicWorksheet({ id, owner_id: ownerId, grade, subject_id: subject, title, files: JSON.stringify(files), created_at: iso(ctx) }) }, 201);
        }
        if (method === "DELETE" && parts.length === 3) {
            const row = await ctx.db.prepare("SELECT * FROM campus_worksheets WHERE id=? AND owner_id=?").bind(parts[2], ownerId).first<WorksheetRow>();
            if (!row) throw new CampusError(404, "WORKSHEET_NOT_FOUND", "Worksheet not found.");
            if (!ctx.bucket) throw new CampusError(503, "WORKSHEET_STORAGE", "Worksheet storage is not configured.");
            // R2 deletion is idempotent. Keep the row until it succeeds, so a
            // transient storage failure leaves keys available for a safe retry.
            await ctx.bucket.delete(Object.values(filesFor(row)).map(file => file!.key));
            await ctx.db.prepare("DELETE FROM campus_worksheets WHERE id=? AND owner_id=?").bind(row.id, ownerId).run();
            return json({ deleted: true });
        }
    } else if (parts[0] === "student" && method === "GET" && parts.length === 2) {
        const student = await requireStudent(request, ctx), rawFloor = url.searchParams.get("floor"), floor = Number(rawFloor);
        if (rawFloor === null || !Number.isInteger(floor) || floor < 0 || floor > 4) throw new CampusError(400, "WORKSHEET_SCOPE", "Choose a valid floor.");
        const rows = await ctx.db.prepare("SELECT * FROM campus_worksheets WHERE owner_id=? AND grade=? ORDER BY created_at DESC,id").bind(student.owner_id, student.grade).all<WorksheetRow>();
        return json({ worksheets: rows.results.filter(row => FLOOR_SUBJECTS[floor].includes(row.subject_id)).map(publicWorksheet), floor, grade: student.grade });
    } else if (parts[0] === "worksheets" && method === "GET" && parts.length === 3 && ["zh", "en"].includes(parts[2])) {
        const row = await ctx.db.prepare("SELECT * FROM campus_worksheets WHERE id=?").bind(parts[1]).first<WorksheetRow>();
        if (!row) throw new CampusError(404, "WORKSHEET_NOT_FOUND", "Worksheet not found.");
        await canRead(request, ctx, row);
        const file = filesFor(row)[parts[2] as "zh" | "en"], object = file && await ctx.bucket?.get(file.key);
        if (!object) throw new CampusError(404, "WORKSHEET_NOT_FOUND", "This language version is not available.");
        return new Response(object.body, { headers: { "content-type": "application/pdf", "content-length": String(object.size), "cache-control": "private, no-store", "x-content-type-options": "nosniff", "content-disposition": `${url.searchParams.has("download") ? "attachment" : "inline"}; filename="worksheet-${parts[2]}.pdf"; filename*=UTF-8''${encodeURIComponent(file!.filename)}` } });
    }
    throw new CampusError(404, "NOT_FOUND", "Worksheet route not found.");
}
