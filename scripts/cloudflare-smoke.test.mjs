import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import { Miniflare } from "miniflare";

// Isolated local D1 + real Worker bundle. No account, remote writes or TTS calls.
const root = path.resolve(import.meta.dirname, "..");
const build = spawnSync(process.execPath, [path.join(root, "scripts/cloudflare-cli.mjs"), "dry-run"], { cwd: root, stdio: "inherit" });
assert.equal(build.status, 0, "Standalone bundle builds before runtime checks");
const worker = new Miniflare({
  modules: true,
  scriptPath: path.join(root, ".cloudflare/dry-run/worker.js"),
  compatibilityDate: "2026-05-15",
  d1Databases: { DB: "standalone-smoke" },
  bindings: { TEACHER_AUTH_MODE: "sites", TEACHER_EMAILS: "forged@example.invalid", CAMPUS_LOCAL_TEACHER: "1" },
  assets: {
    directory: path.join(root, "public"), binding: "ASSETS",
    routerConfig: { has_user_worker: true, static_routing: { user_worker: ["/api/*", "/signin-with-chatgpt", "/signout-with-chatgpt", "/callback"] } },
  },
});
let checks = 0;
try {
  const db = await worker.getD1Database("DB");
  for (const file of fs.readdirSync(path.join(root, "drizzle")).filter(name => name.endsWith(".sql")).sort()) {
    const sql = fs.readFileSync(path.join(root, "drizzle", file), "utf8");
    for (const statement of sql.split("--> statement-breakpoint").map(value => value.trim()).filter(Boolean)) await db.prepare(statement).run();
  }
  const storageSql = fs.readFileSync(path.join(root, "deployment/cloudflare/0001_worksheet_storage.sql"), "utf8");
  for (const statement of storageSql.split("--> statement-breakpoint").map(value => value.trim()).filter(Boolean)) await db.prepare(statement).run();
  async function request(route, options = {}) {
    // Serialize with Node's fetch implementation before crossing Miniflare's
    // request boundary, matching the multipart bytes a browser would send.
    if (options.body instanceof FormData) {
      const encoded = new Request("https://campus.test" + route, options);
      options = { ...options, headers: Object.fromEntries(encoded.headers), body: await encoded.arrayBuffer() };
    }
    const response = await worker.dispatchFetch("https://campus.test" + route, { redirect: "manual", ...options });
    checks++;
    return response;
  }
  const entry = await request("/");
  assert.equal(entry.status, 302);
  assert.equal(entry.headers.get("location"), "https://campus.test/campus/");
  const page = await request("/campus/");
  assert.equal(page.status, 200);
  assert.match(await page.text(), /game\/app\.js/);
  assert.equal((await request("/campus/game/campus-cloud.js")).status, 200);
  assert.equal((await request("/", { method: "POST" })).status, 405);
  for (const route of ["/signin-with-chatgpt", "/signout-with-chatgpt", "/callback"]) assert.equal((await request(route)).status, 410);
  const bootstrap = await request("/api/campus/bootstrap");
  assert.equal(bootstrap.status, 200);
  assert.equal((await bootstrap.json()).session, null);
  const session = await request("/api/campus/teacher/session", { headers: { "oai-authenticated-user-id": "forged", "oai-authenticated-user-email": "forged@example.invalid" } });
  assert.equal(session.status, 200);
  const body = await session.json();
  assert.equal(body.authMode, "access-code", "The Worker pins standalone auth even when the environment says Sites");
  assert.equal(body.unlocked, false);
  assert.ok(!JSON.stringify(body).includes("signin-with-chatgpt"), "Standalone teacher session never links to ChatGPT sign-in");
  assert.ok([401, 403].includes((await request("/api/campus/teacher/questions")).status));
  assert.equal((await request("/api/unknown")).status, 404);
  assert.equal((await request("/api/campus/unknown")).status, 404);
  const crossOrigin = await request("/api/campus/teacher/unlock", { method: "POST", headers: { "content-type": "application/json", origin: "https://other.example" }, body: JSON.stringify({ code: "not-a-real-code" }) });
  assert.equal(crossOrigin.status, 403);
  assert.equal((await crossOrigin.json()).error.code, "CROSS_ORIGIN");
  const accessCode = randomBytes(24).toString("hex");
  await db.prepare("INSERT INTO campus_teacher_credentials (id,owner_id,label,code_hash,created_at) VALUES (?,?,?,?,?)")
    .bind("smoke-credential", "smoke-teacher", "Local test teacher", createHash("sha256").update(accessCode).digest("hex"), new Date().toISOString()).run();
  const login = await request("/api/campus/teacher/unlock", { method: "POST", headers: { "content-type": "application/json", origin: "https://campus.test" }, body: JSON.stringify({ pin: accessCode }) });
  assert.equal(login.status, 200);
  const teacherCookie = login.headers.get("set-cookie").split(";")[0];
  assert.match(login.headers.get("set-cookie"), /HttpOnly; SameSite=Strict/);
  const unlocked = await request("/api/campus/teacher/session", { headers: { cookie: teacherCookie } });
  assert.equal((await unlocked.json()).unlocked, true);
  const classroomResponse = await request("/api/campus/teacher/classes", { method: "POST", headers: { "content-type": "application/json", cookie: teacherCookie }, body: JSON.stringify({ grade: 1, section: "A", schoolYear: "2026-27" }) });
  assert.equal(classroomResponse.status, 201);
  const classroom = (await classroomResponse.json()).classroom;
  const student = await request("/api/campus/student/join", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ classCode: classroom.classCode, studentNumber: "1", name: "Local test learner" }) });
  assert.equal(student.status, 200);
  const studentCookie = student.headers.get("set-cookie").split(";")[0];
  const pdf = "%PDF-1.4\nLocal standalone worksheet test\n%%EOF", form = new FormData();
  form.set("grade", "1"); form.set("subjectId", "maths"); form.set("title", "Local test worksheet");
  form.set("zh", new File([pdf], "worksheet.pdf", { type: "application/pdf" }));
  const upload = await request("/api/campus/teacher/worksheets", { method: "POST", headers: { cookie: teacherCookie, origin: "https://campus.test" }, body: form });
  assert.equal(upload.status, 201, "Standalone teacher uploads PDFs without an R2 binding");
  const worksheet = (await upload.json()).worksheet;
  const studentPdf = await request(`/api/campus/worksheets/${worksheet.id}/zh`, { headers: { cookie: studentCookie } });
  assert.equal(studentPdf.status, 200);
  assert.equal(await studentPdf.text(), pdf);
  assert.equal((await request(`/api/campus/worksheets/${worksheet.id}/zh`)).status, 404, "Worksheet access is restricted to the teacher or matching class");
  assert.equal((await request("/campus/not-a-file.png")).status, 404);
  console.log(`Standalone Cloudflare checks passed: ${checks} same-origin/asset/auth requests against isolated Miniflare D1.`);
} finally { await worker.dispose(); }
