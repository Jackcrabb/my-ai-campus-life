import catalog from "../data/tts-script-catalog.json";
import { CampusError, type CampusContext } from "./campus-types";
import { checkOrigin, hash, iso, limit, now, requireTeacher, textField } from "./campus-security";
import { requireStudent } from "./campus-store";

// Writes require explicit enablement, reviewed configuration and hard caps.
// FREE_ONLY additionally verifies the exact model's live zero pricing. Playback
// never calls the provider, and audition clips cannot be published to students.
const SPEECH_URL = "https://openrouter.ai/api/v1/audio/speech";
const MODEL_CATALOG_URL = "https://openrouter.ai/api/v1/models?output_modalities=speech";
const FREE_MODEL = "fish-audio/s2.1-pro-free:free";
const DEFAULT_AUDITION_VOICE = "__provider_default__";
const MAX_TEXT = 2000, MAX_AUDIO = 8 * 1024 * 1024, MAX_BODY = 8192;
const LOCALES = ["zh", "cn", "en"] as const;
type Locale = typeof LOCALES[number];
type Voice = { model: string; voice: string; reviewed?: { locale: Locale; gender: string; date: string } };
type Model = { billing: "characters" | "free"; usdPerMillionCharacters: number; priceReviewedAt: string; voices: Record<Locale, string[]> };
type Config = { schemaVersion: 1; models: Record<string, Model>; cast: Record<string, Partial<Record<Locale, Voice>>> };
type Limits = { characters: number; requests: number; micros: number };
type Source = { kind: "script"; id: string; revision: number; part: string; characterId: string; text: string; scope: "public" | "teacher"; classroomId: string | null };
type Clip = { hash: string; owner_id: string; scope: string; classroom_id: string | null; source_kind: string; source_id: string; revision: number; part: string; character_id: string; locale: string; model: string; voice: string; status: string; budget_day: string; characters: number; reserved_micros: number; bytes: number; generation_id: string | null; failure_code: string | null; created_at: string; audition_only: number; reviewed_by: string | null; reviewed_at: string | null };
const CHARACTER_IDS = new Set(catalog.lines.map(line => line.characterId));
const CHARACTER_GENDERS = Object.fromEntries(catalog.lines.map(line => [line.characterId, line.gender]));
const json = (value: unknown, status = 200) => Response.json(value, { status, headers: { "cache-control": "no-store" } });
function fail(status: number, code: string, message: string): never { throw new CampusError(status, code, message); }
function subjectSpeechDisabled(): never { return fail(410, "TTS_SUBJECT_AUDIO_DISABLED", "Academic questions, options and feedback have no speech. Only fixed NPC dialogue is supported."); }
function assertFixedClip(row: Clip) { if (row.source_kind !== "script") subjectSpeechDisabled(); }
const day = (ctx: CampusContext) => iso(ctx).slice(0, 10); // One global UTC-day budget, never per browser or teacher.
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);
const positiveInteger = (raw: string | undefined, maximum: number) => {
    const n = Number(raw); return Number.isSafeInteger(n) && n > 0 && n <= maximum ? n : 0;
};
function blockedLocales(ctx: CampusContext) {
    const blocked = new Set((ctx.env.CAMPUS_TTS_BLOCKED_LOCALES || "").split(",").map(value => value.trim()));
    // The owner heard Mandarin from this exact default-voice Cantonese audition.
    // Preserve that rejection even when deployment settings have not caught up.
    try {
        const config = JSON.parse(ctx.env.CAMPUS_TTS_CONFIG || "null"), voices = config?.models?.[FREE_MODEL]?.voices;
        if (object(voices) && Object.values(voices).some(value => Array.isArray(value) && value.includes(DEFAULT_AUDITION_VOICE))) blocked.add("zh");
    } catch { /* Invalid configuration is independently disabled by settings(). */ }
    return LOCALES.filter(locale => blocked.has(locale)).map(locale => ({ locale, reason: "dialect_unverified" }));
}
function clipDialectBlocked(ctx: CampusContext, clip: Clip) {
    return blockedLocales(ctx).some(item => item.locale === clip.locale) || (clip.locale === "zh" && clip.model === FREE_MODEL && clip.voice === DEFAULT_AUDITION_VOICE);
}
function assertLocaleAvailable(ctx: CampusContext, locale: string) {
    if (blockedLocales(ctx).some(item => item.locale === locale)) fail(503, "TTS_DIALECT_UNVERIFIED", "This speech language is suspended after dialect verification failed. Another language will not be substituted.");
}
function settings(ctx: CampusContext) {
    const reasons: string[] = [], env = ctx.env;
    const freeOnly = env.CAMPUS_TTS_MODE !== "BUDGETED", auditionOnly = env.CAMPUS_TTS_AUDITION_ONLY === "1";
    if (env.CAMPUS_TTS_ENABLED !== "1") reasons.push("disabled");
    if (!env.OPENROUTER_API_KEY?.trim()) reasons.push("key_missing");
    if (!ctx.bucket) reasons.push("storage_missing");
    const usd = Number(env.CAMPUS_TTS_DAILY_USD);
    const limits: Limits = {
        characters: positiveInteger(env.CAMPUS_TTS_DAILY_CHARACTERS, 10_000_000),
        requests: positiveInteger(env.CAMPUS_TTS_DAILY_REQUESTS, 10_000),
        micros: !freeOnly && Number.isFinite(usd) && usd > 0 && usd <= 1000 ? Math.floor(usd * 1_000_000) : 0,
    };
    if (!limits.characters || !limits.requests || (!freeOnly && !limits.micros)) reasons.push("budget_not_authorised");
    if (freeOnly && env.CAMPUS_TTS_DAILY_USD !== undefined && usd !== 0) reasons.push("free_mode_requires_zero_usd");
    if (auditionOnly && !freeOnly) reasons.push("audition_requires_free_mode");
    let config: Config | null = null;
    try {
        const parsed = JSON.parse(env.CAMPUS_TTS_CONFIG || "null");
        if (!object(parsed) || parsed.schemaVersion !== 1 || !object(parsed.models) || !object(parsed.cast) || !Object.keys(parsed.models).length || !Object.keys(parsed.cast).length) throw Error();
        for (const [id, raw] of Object.entries(parsed.models)) {
            if (!/^[a-z0-9._-]+\/[a-z0-9._:-]+$/i.test(id) || !object(raw) || !object(raw.voices)) throw Error();
            if (freeOnly ? id !== FREE_MODEL || raw.billing !== "free" || raw.usdPerMillionCharacters !== 0 : raw.billing !== "characters" || typeof raw.usdPerMillionCharacters !== "number" || !(raw.usdPerMillionCharacters > 0 && raw.usdPerMillionCharacters <= 10000)) throw Error();
            const reviewed = typeof raw.priceReviewedAt === "string" ? Date.parse(raw.priceReviewedAt) : NaN;
            if (!Number.isFinite(reviewed) || reviewed > now(ctx) || now(ctx) - reviewed > 30 * 86400000) throw Error();
            for (const locale of LOCALES) if (!Array.isArray(raw.voices[locale]) || !(raw.voices[locale] as unknown[]).every(v => typeof v === "string" && v.length > 0 && v.length <= 160 && !/[\u0000-\u001f]/.test(v))) throw Error();
        }
        for (const [id, locales] of Object.entries(parsed.cast)) {
            if (!CHARACTER_IDS.has(id) || !object(locales) || !Object.keys(locales).length) throw Error();
            for (const [locale, voice] of Object.entries(locales)) {
                if (!LOCALES.includes(locale as Locale) || !object(voice) || typeof voice.model !== "string" || typeof voice.voice !== "string") throw Error();
                const model = parsed.models[voice.model] as Model | undefined;
                if (!model?.voices[locale as Locale]?.includes(voice.voice)) throw Error();
                if (voice.voice === DEFAULT_AUDITION_VOICE && !auditionOnly) throw Error();
                if (!auditionOnly && !reviewedVoice(voice as unknown as Voice, id, locale as Locale, ctx)) reasons.push("voice_cast_unverified");
            }
        }
        config = parsed as unknown as Config;
    } catch { reasons.push("model_voice_or_reviewed_price_missing"); }
    return { enabled: reasons.length === 0, reasons: [...new Set(reasons)], limits, config, freeOnly, auditionOnly, mode: freeOnly ? "FREE_ONLY" : "BUDGETED" };
}
function reviewedVoice(voice: Voice, characterId: string, locale: Locale, ctx: CampusContext) {
    const reviewed = voice.reviewed, date = reviewed?.date ? Date.parse(reviewed.date) : NaN;
    return voice.voice !== DEFAULT_AUDITION_VOICE && reviewed?.locale === locale && reviewed.gender === CHARACTER_GENDERS[characterId] && Number.isFinite(date) && date <= now(ctx);
}
async function bodyLimited(request: Request) {
    if (Number(request.headers.get("content-length")) > MAX_BODY) fail(413, "TTS_BODY_SIZE", "Speech requests contain source references, not uploaded text.");
    const reader = request.body?.getReader();
    if (!reader) fail(400, "TTS_BODY", "Provide a speech source reference.");
    const chunks: Uint8Array[] = []; let length = 0;
    for (;;) { const { done, value } = await reader.read(); if (done) break; length += value.length; if (length > MAX_BODY) { await reader.cancel(); fail(413, "TTS_BODY_SIZE", "Speech request is too large."); } chunks.push(value); }
    const bytes = new Uint8Array(length); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    try { const value = JSON.parse(new TextDecoder().decode(bytes)); if (!object(value)) throw Error(); return value; }
    catch { return fail(400, "TTS_BODY", "Provide a JSON object."); }
}
function localeFor(raw: unknown): Locale {
    if (!LOCALES.includes(raw as Locale)) fail(400, "TTS_LOCALE", "Choose zh, cn or en.");
    return raw as Locale;
}
function providerOptions(model: string, locale: Locale) {
    // This bounded provider composition is documented by OpenRouter + MiniMax.
    // It is not a quality claim; no live generation is part of the test suite.
    if (/^minimax\/speech-2\.8-(turbo|hd)$/.test(model)) return { options: { minimax: { language_boost: { zh: "Chinese,Yue", cn: "Chinese", en: "English" }[locale] } } };
    return undefined;
}
function plainText(raw: unknown) {
    if (typeof raw !== "string") return fail(400, "TTS_TEXT", "This source has no text in the selected language.");
    const text = raw.normalize("NFC").trim().replace(/\s+/g, " ");
    if (!text || text.length > MAX_TEXT || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]|<\/?[a-z!][^>]*>/i.test(text)) fail(400, "TTS_TEXT", "Use a short plain-text teaching source, without markup.");
    return text;
}
function sourceFor(value: unknown, locale: Locale): Source {
    if (!object(value)) return fail(400, "TTS_SOURCE", "Choose a fixed authored script.");
    if (value.kind === "question") return subjectSpeechDisabled();
    if (value.kind !== "script" || Object.keys(value).some(k => !["kind", "id", "revision"].includes(k))) fail(400, "TTS_SOURCE", "Only fixed authored script references are accepted.");
    const id = textField(value.id, "source.id", 160), line = catalog.lines.find(item => item.id === id);
    if (!line) return fail(404, "TTS_SOURCE", "Script not found.");
    if (value.revision !== undefined && value.revision !== line.revision) fail(409, "TTS_SOURCE_CHANGED", "Refresh this script version.");
    return { kind: "script", id, revision: line.revision, part: "line", characterId: line.characterId, text: plainText(line.text[locale]), scope: "public", classroomId: null };
}
function descriptor(row: Clip, ctx: CampusContext) {
    const status = row.status === "pending" && now(ctx) - Date.parse(row.created_at) > 120000 ? "unknown" : row.status;
    return { hash: row.hash, status, locale: row.locale, characterId: row.character_id, source: { kind: row.source_kind, id: row.source_id, revision: row.revision, part: row.part }, scope: row.scope,
        url: ["ready", "review"].includes(status) ? `/api/campus/audio/${row.hash}` : null, bytes: row.bytes, failureCode: row.failure_code,
        auditionOnly: row.audition_only === 1, reviewed: !!row.reviewed_at, expectedGender: CHARACTER_GENDERS[row.character_id],
        reservedUsd: row.reserved_micros / 1000000, automaticRetry: false };
}
function scopedSource(source: Source, auditionOnly: boolean): Source {
    if (!auditionOnly) return source;
    return { ...source, scope: "teacher", classroomId: null };
}
async function speechIdentity(ownerId: string, source: Source, locale: Locale, voice: Voice, model: Model, auditionOnly = false) {
    const provider = providerOptions(voice.model, locale);
    const fingerprint = await hash(JSON.stringify({ schema: 2, owner: source.scope === "public" ? null : ownerId, ...source, locale, model: voice.model, voice: voice.voice, provider, auditionOnly }));
    return { provider, fingerprint, micros: Math.ceil(source.text.length * model.usdPerMillionCharacters) };
}
async function budgetUsed(ctx: CampusContext) {
    return await ctx.db.prepare("SELECT COUNT(*) AS requests,COALESCE(SUM(characters),0) AS characters,COALESCE(SUM(reserved_micros),0) AS micros FROM campus_speech_clips WHERE budget_day=?").bind(day(ctx)).first<Limits>() || { requests: 0, characters: 0, micros: 0 };
}
async function canRead(request: Request, ctx: CampusContext, row: Clip) {
    if (row.scope === "public" && row.status === "ready") return;
    try { const teacher = await requireTeacher(request, ctx); if (teacher.userId === row.owner_id) return; }
    catch (error) { if (!(error instanceof CampusError && [401, 403].includes(error.status))) throw error; }
    fail(404, "TTS_CLIP_NOT_FOUND", "This audio is not available to this class.");
}
// Workerd supports manual redirects, not redirect: "error". Rejecting every
// non-2xx response below prevents redirected requests or credential forwarding.
async function assertFreeCatalogue(upstream: typeof fetch, model: string) {
    if (model !== FREE_MODEL) fail(503, "TTS_FREE_MODEL_DENIED", "This model is not on the exact free-only allowlist.");
    const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 10000);
    try {
        const response = await upstream(MODEL_CATALOG_URL, { method: "GET", redirect: "manual", cache: "no-store", signal: controller.signal, headers: { accept: "application/json" } });
        if (!response.ok) fail(503, "TTS_FREE_PRICE_UNVERIFIED", "The live free-model price could not be verified.");
        const reader = response.body?.getReader(); if (!reader) fail(503, "TTS_FREE_PRICE_UNVERIFIED", "The live model catalog is empty.");
        const chunks: Uint8Array[] = []; let size = 0;
        for (;;) { const { done, value } = await reader.read(); if (done) break; size += value.length; if (size > 2 * 1024 * 1024) { await reader.cancel(); fail(503, "TTS_FREE_PRICE_UNVERIFIED", "The model catalog could not be safely verified."); } chunks.push(value); }
        const bytes = new Uint8Array(size); let offset = 0;
        for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
        const data = JSON.parse(new TextDecoder().decode(bytes));
        const entry = Array.isArray(data?.data) ? data.data.find((item: { id: string }) => item.id === FREE_MODEL) : null;
        const pricing = entry?.pricing;
        const zero = (value: unknown) => (typeof value === "number" || typeof value === "string" && value.trim() !== "") && Number.isFinite(Number(value)) && Number(value) === 0;
        if (!Array.isArray(entry?.architecture?.output_modalities) || !entry.architecture.output_modalities.includes("speech") || !object(pricing) || !Object.hasOwn(pricing, "prompt") || !Object.hasOwn(pricing, "completion") || !Object.values(pricing).every(zero)) fail(503, "TTS_FREE_PRICE_CHANGED", "The exact model is missing or its live pricing is not entirely zero. No synthesis was requested.");
    } catch (error) {
        if (error instanceof CampusError) throw error;
        fail(503, "TTS_FREE_PRICE_UNVERIFIED", "The live free-model price could not be verified. No synthesis was requested.");
    } finally { clearTimeout(timer); }
}
async function audioBytes(response: Response) {
    if (!response.headers.get("content-type")?.toLowerCase().startsWith("audio/mpeg")) fail(502, "TTS_INVALID_AUDIO", "The provider did not return an MP3.");
    if (Number(response.headers.get("content-length")) > MAX_AUDIO) fail(502, "TTS_AUDIO_SIZE", "The provider audio exceeded the storage limit.");
    const reader = response.body?.getReader(); if (!reader) return fail(502, "TTS_INVALID_AUDIO", "The provider returned no audio.");
    const chunks: Uint8Array[] = []; let length = 0;
    for (;;) { const { done, value } = await reader.read(); if (done) break; length += value.length; if (length > MAX_AUDIO) { await reader.cancel(); fail(502, "TTS_AUDIO_SIZE", "The provider audio exceeded the storage limit."); } chunks.push(value); }
    const bytes = new Uint8Array(length); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    const id3 = bytes[0] === 73 && bytes[1] === 68 && bytes[2] === 51;
    const frame = bytes[0] === 255 && (bytes[1] & 224) === 224;
    if (length < 4 || !(id3 || frame)) fail(502, "TTS_INVALID_AUDIO", "The provider returned invalid MP3 bytes.");
    return bytes;
}
async function generate(request: Request, ctx: CampusContext, ownerId: string, upstream: typeof fetch) {
    const body = await bodyLimited(request);
    if (Object.keys(body).some(k => !["idempotencyKey", "locale", "source", "confirmNoPersonalData"].includes(k))) fail(400, "TTS_REFERENCE_ONLY", "Text, model, voice and provider overrides are not accepted from the browser.");
    if (body.confirmNoPersonalData !== true) fail(400, "TTS_REVIEW_REQUIRED", "Review the teaching text and confirm that it contains no personal data.");
    const key = textField(body.idempotencyKey, "idempotencyKey", 100);
    if (!/^[a-z0-9_-]{12,100}$/i.test(key)) fail(400, "TTS_REQUEST_ID", "Use a unique request ID.");
    const configured = settings(ctx), locale = localeFor(body.locale);
    const source = scopedSource(sourceFor(body.source, locale), configured.auditionOnly);
    if (!configured.enabled || !configured.config) fail(503, "TTS_NOT_CONFIGURED", "Speech generation is disabled or lacks an authorised model, voice, reviewed price and positive budget.");
    assertLocaleAvailable(ctx, locale);
    const voice = configured.config.cast[source.characterId]?.[locale];
    if (!voice) return fail(503, "TTS_VOICE_NOT_CONFIGURED", "No reviewed voice is configured for this character and language.");
    const model = configured.config.models[voice.model];
    const { micros, provider, fingerprint } = await speechIdentity(ownerId, source, locale, voice, model, configured.auditionOnly);
    const budgetDay = day(ctx), createdAt = iso(ctx);
    await limit(ctx, "tts-generate:" + ownerId, 12, 60000);
    // D1 executes this batch atomically. Only the new clip insertion acquires
    // permission to call the provider. Pending/failed/unknown reservations count.
    const result = await ctx.db.batch([
        ctx.db.prepare("INSERT OR IGNORE INTO campus_speech_requests (id,owner_id,idempotency_key,clip_hash,created_at) VALUES (?,?,?,?,?)").bind(await hash(ownerId + ":" + key), ownerId, key, fingerprint, createdAt),
        ctx.db.prepare("INSERT OR IGNORE INTO campus_speech_clips (hash,owner_id,scope,classroom_id,source_kind,source_id,revision,part,character_id,locale,model,voice,status,budget_day,characters,reserved_micros,bytes,created_at,audition_only) SELECT ?,?,?,?,?,?,?,?,?,?,?,?,'pending',?,?,?,0,?,? WHERE (SELECT clip_hash FROM campus_speech_requests WHERE owner_id=? AND idempotency_key=?)=? AND (SELECT COUNT(*) FROM campus_speech_clips WHERE budget_day=?)<? AND (SELECT COALESCE(SUM(characters),0) FROM campus_speech_clips WHERE budget_day=?)+?<=? AND (?=1 OR (SELECT COALESCE(SUM(reserved_micros),0) FROM campus_speech_clips WHERE budget_day=?)+?<=?)").bind(fingerprint, ownerId, source.scope, source.classroomId, source.kind, source.id, source.revision, source.part, source.characterId, locale, voice.model, voice.voice, budgetDay, source.text.length, micros, createdAt, configured.auditionOnly ? 1 : 0, ownerId, key, fingerprint, budgetDay, configured.limits.requests, budgetDay, source.text.length, configured.limits.characters, configured.freeOnly ? 1 : 0, budgetDay, micros, configured.limits.micros),
    ]);
    const original = await ctx.db.prepare("SELECT clip_hash FROM campus_speech_requests WHERE owner_id=? AND idempotency_key=?").bind(ownerId, key).first<{ clip_hash: string }>();
    if (original?.clip_hash !== fingerprint) fail(409, "TTS_IDEMPOTENCY_CONFLICT", "This request ID belongs to different speech content.");
    let row = await ctx.db.prepare("SELECT * FROM campus_speech_clips WHERE hash=?").bind(fingerprint).first<Clip>();
    if (!row) fail(429, "TTS_BUDGET_LIMIT", "The authorised daily speech budget is exhausted.");
    if (!result[1].meta.changes) {
        const clip = descriptor(row, ctx);
        if (["failed", "unknown"].includes(clip.status)) fail(409, "TTS_REVIEW_REQUIRED", "This generation needs manual review. It will not be sent or charged again automatically.");
        if (clip.status === "review" && row.owner_id !== ownerId) fail(409, "TTS_REVIEW_REQUIRED", "The generating teacher must review this clip before it becomes available.");
        return json({ clip, cached: clip.status === "ready" }, clip.status === "pending" ? 202 : 200);
    }
    const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 45000);
    let failure = "TTS_UPSTREAM_UNKNOWN", generationId: string | null = null;
    try {
        if (configured.freeOnly) await assertFreeCatalogue(upstream, voice.model);
        const response = await upstream(SPEECH_URL, { method: "POST", redirect: "manual", signal: controller.signal,
            headers: { authorization: `Bearer ${ctx.env.OPENROUTER_API_KEY}`, "content-type": "application/json" },
            body: JSON.stringify({ model: voice.model, input: source.text, ...(voice.voice === DEFAULT_AUDITION_VOICE ? {} : { voice: voice.voice }), response_format: "mp3", ...(provider ? { provider } : {}) }) });
        generationId = response.headers.get("x-generation-id")?.slice(0, 160) || null;
        if (!response.ok) { failure = "TTS_UPSTREAM_REJECTED"; await response.body?.cancel(); fail(502, failure, "The provider rejected the speech request. Review the configuration before trying different content."); }
        const bytes = await audioBytes(response);
        await ctx.bucket!.put(`speech/${fingerprint}.mp3`, bytes, { httpMetadata: { contentType: "audio/mpeg" } });
        await ctx.db.prepare("UPDATE campus_speech_clips SET status=?,bytes=?,generation_id=? WHERE hash=? AND status='pending'").bind("review", bytes.length, generationId, fingerprint).run();
    } catch (error) {
        if (error instanceof CampusError) failure = error.code;
        const priceStopped = failure.startsWith("TTS_FREE_");
        const status = priceStopped || failure === "TTS_UPSTREAM_REJECTED" ? "failed" : "unknown";
        await ctx.db.prepare("UPDATE campus_speech_clips SET status=?,failure_code=?,generation_id=? WHERE hash=? AND status='pending'").bind(status, failure, generationId, fingerprint).run();
        // Never return raw provider error bodies or headers (they may contain
        // submitted teaching text). Never refund an uncertain billed request.
        if (priceStopped) return fail(503, failure, "The free-price check stopped this request before synthesis. The reservation is retained; automatic retries are disabled. Ask the site owner to review the model catalog.");
        return fail(502, failure, "Speech was not made available. The reservation is retained; automatic retries are disabled. Ask the site owner to review this generation.");
    } finally { clearTimeout(timer); }
    row = await ctx.db.prepare("SELECT * FROM campus_speech_clips WHERE hash=?").bind(fingerprint).first<Clip>();
    return json({ clip: descriptor(row!, ctx), cached: false }, 201);
}

async function approve(request: Request, ctx: CampusContext, ownerId: string, fingerprint: string) {
    const row = await ctx.db.prepare("SELECT * FROM campus_speech_clips WHERE hash=? AND owner_id=?").bind(fingerprint, ownerId).first<Clip>();
    if (!row) return fail(404, "TTS_CLIP_NOT_FOUND", "Audio not found.");
    assertFixedClip(row);
    if (clipDialectBlocked(ctx, row)) fail(503, "TTS_DIALECT_UNVERIFIED", "This clip failed dialect verification and cannot be approved.");
    if (row.audition_only || row.voice === DEFAULT_AUDITION_VOICE) fail(409, "TTS_AUDITION_PRIVATE", "Provider-default auditions remain private and cannot be approved for student playback.");
    if (row.status !== "review") fail(409, "TTS_REVIEW_STATE", "Only a newly generated clip awaiting review can be approved.");
    const configured = settings(ctx), voice = configured.config?.cast[row.character_id]?.[row.locale as Locale];
    if (!configured.enabled || configured.auditionOnly || !voice || voice.model !== row.model || voice.voice !== row.voice || !reviewedVoice(voice, row.character_id, row.locale as Locale, ctx)) fail(503, "TTS_VOICE_NOT_CONFIGURED", "Configure the reviewed locale and gender-matched voice before approving this clip.");
    const body = await bodyLimited(request);
    if (Object.keys(body).some(k => !["locale", "gender", "languageAndDialect", "numbers", "wording"].includes(k)) || body.locale !== row.locale || body.gender !== CHARACTER_GENDERS[row.character_id] || body.languageAndDialect !== true || body.numbers !== true || body.wording !== true) fail(400, "TTS_CLIP_REVIEW_REQUIRED", "Listen to the complete clip and confirm its language or dialect, role gender, numbers and wording.");
    if (!await ctx.bucket!.head(`speech/${row.hash}.mp3`)) fail(404, "TTS_CLIP_NOT_FOUND", "Audio is not currently available.");
    await ctx.db.prepare("UPDATE campus_speech_clips SET status='ready',reviewed_by=?,reviewed_at=? WHERE hash=? AND owner_id=? AND status='review'").bind(ownerId, iso(ctx), fingerprint, ownerId).run();
    const reviewed = await ctx.db.prepare("SELECT * FROM campus_speech_clips WHERE hash=?").bind(fingerprint).first<Clip>();
    return json({ clip: descriptor(reviewed!, ctx), generationTriggered: false });
}

export async function handleTts(request: Request, ctx: CampusContext, upstream: typeof fetch = fetch): Promise<Response> {
    const url = new URL(request.url), route = url.pathname.replace(/^\/api\/campus\//, ""), method = request.method;
    checkOrigin(request);
    if (route === "tts/catalog" && method === "GET") return json({ schemaVersion: catalog.schemaVersion, scripts: catalog.lines, generationTriggered: false, maxTextCharacters: MAX_TEXT });
    if (route.startsWith("teacher/tts")) {
        const teacher = await requireTeacher(request, ctx);
        if (route === "teacher/tts/status" && method === "GET") {
            const config = settings(ctx), used = await budgetUsed(ctx);
            return json({ allowedSourceKinds: ["script"], subjectSpeechEnabled: false, enabled: config.enabled, reasons: config.reasons, blockedLocales: blockedLocales(ctx), mode: config.mode, auditionOnly: config.auditionOnly, studentPublicationEnabled: config.enabled && !config.auditionOnly, reviewRequired: true, livePriceCheckRequired: config.freeOnly,
                budgetDay: day(ctx), limits: { ...config.limits, usd: config.limits.micros / 1000000 }, reserved: { ...used, usd: used.micros / 1000000 },
                pricingBasis: config.freeOnly ? "live-exact-model-zero-price-check" : "configured-character-rate-reservation", providerInvoiceGuaranteed: false,
                configuredCharacters: config.config ? Object.entries(config.config.cast).map(([id, voices]) => ({ id, locales: Object.keys(voices) })) : [], automaticGeneration: false, automaticRetry: false });
        }
        if (route === "teacher/tts/generate" && method === "POST") return generate(request, ctx, teacher.userId, upstream);
        const approval = route.match(/^teacher\/tts\/([a-f0-9]{64})\/approve$/);
        if (approval && method === "POST") return approve(request, ctx, teacher.userId, approval[1]);
        if (route === "teacher/tts/quote" && method === "GET") {
            const configured = settings(ctx), locale = localeFor(url.searchParams.get("locale"));
            const reference = { kind: url.searchParams.get("sourceKind"), id: url.searchParams.get("sourceId"),
                ...(url.searchParams.has("revision") ? { revision: Number(url.searchParams.get("revision")) } : {}),
                ...(url.searchParams.has("part") ? { part: url.searchParams.get("part") } : {}),
                ...(url.searchParams.has("classroomId") ? { classroomId: url.searchParams.get("classroomId") } : {}) };
            const source = scopedSource(sourceFor(reference, locale), configured.auditionOnly);
            if (!configured.config) fail(503, "TTS_NOT_CONFIGURED", "No reviewed speech configuration is available.");
            assertLocaleAvailable(ctx, locale);
            const voice = configured.config.cast[source.characterId]?.[locale];
            if (!voice) fail(503, "TTS_VOICE_NOT_CONFIGURED", "No reviewed voice is configured for this character and language.");
            const model = configured.config.models[voice.model], identity = await speechIdentity(teacher.userId, source, locale, voice, model, configured.auditionOnly);
            const row = await ctx.db.prepare("SELECT * FROM campus_speech_clips WHERE hash=? AND (owner_id=? OR (scope='public' AND status='ready'))").bind(identity.fingerprint, teacher.userId).first<Clip>();
            return json({ generationTriggered: false, enabled: configured.enabled, reasons: configured.reasons, mode: configured.mode, auditionOnly: configured.auditionOnly, reviewRequired: true, livePriceCheckRequired: configured.freeOnly,
                source: { kind: source.kind, id: source.id, revision: source.revision, part: source.part }, text: source.text, locale, characterId: source.characterId, ...voice,
                characters: source.text.length, reservedUsdIfGenerated: identity.micros / 1000000, priceReviewedAt: model.priceReviewedAt,
                expectedGender: CHARACTER_GENDERS[source.characterId], pricingBasis: configured.freeOnly ? "live-exact-model-zero-price-check" : "configured-character-rate-reservation", providerInvoiceGuaranteed: false, clip: row ? descriptor(row, ctx) : null });
        }
        if (route === "teacher/tts/lookup" && method === "GET") {
            const row = await ctx.db.prepare("SELECT * FROM campus_speech_clips WHERE hash=? AND (owner_id=? OR (scope='public' AND status='ready'))").bind(url.searchParams.get("hash") || "", teacher.userId).first<Clip>();
            if (row) assertFixedClip(row);
            return json({ clip: row && !clipDialectBlocked(ctx, row) ? descriptor(row, ctx) : null });
        }
    }
    if (route === "tts/lookup" && method === "GET") {
        const line = catalog.lines.find(item => item.id === url.searchParams.get("sourceId")), locale = localeFor(url.searchParams.get("locale"));
        assertLocaleAvailable(ctx, locale);
        const row = line && await ctx.db.prepare("SELECT * FROM campus_speech_clips WHERE scope='public' AND source_kind='script' AND source_id=? AND revision=? AND locale=? AND status='ready' ORDER BY created_at DESC LIMIT 1").bind(line.id, line.revision, locale).first<Clip>();
        return json({ clip: row ? descriptor(row, ctx) : null });
    }
    if (route === "student/tts" && method === "GET") {
        await requireStudent(request, ctx);
        return subjectSpeechDisabled();
    }
    if (/^audio\/[a-f0-9]{64}$/.test(route) && method === "GET") {
        const row = await ctx.db.prepare("SELECT * FROM campus_speech_clips WHERE hash=? AND status IN ('ready','review')").bind(route.slice(6)).first<Clip>();
        if (!row) return fail(404, "TTS_CLIP_NOT_FOUND", "Audio not found.");
        assertFixedClip(row);
        await canRead(request, ctx, row);
        if (clipDialectBlocked(ctx, row)) fail(503, "TTS_DIALECT_UNVERIFIED", "This stored clip failed dialect verification and cannot be played.");
        const audio = await ctx.bucket?.get(`speech/${row.hash}.mp3`);
        if (!audio) return fail(404, "TTS_CLIP_NOT_FOUND", "Audio is not currently available.");
        return new Response(audio.body, { headers: { "content-type": "audio/mpeg", "content-length": String(audio.size), "cache-control": row.scope === "public" && row.status === "ready" ? "public, max-age=86400, immutable" : "private, no-store", "x-content-type-options": "nosniff", "content-disposition": `inline; filename="campus-${row.locale}.mp3"` } });
    }
    return fail(404, "NOT_FOUND", "Speech route not found.");
}
