import { handleCampus } from "../../lib/campus-api";
import { createD1WorksheetBucket } from "../../lib/campus-worksheet-storage";
import type { CampusEnv } from "../../lib/campus-types";

type StandaloneEnv = CampusEnv & { DB?: D1Database; ASSETS: Fetcher };
const legacyAuthPaths = new Set(["/signin-with-chatgpt", "/signout-with-chatgpt", "/callback"]);

// This entrypoint belongs to the user's Cloudflare account. Sites retains its
// separate entrypoint, database and identity integration until migration.
const worker = {
    async fetch(request: Request, env: StandaloneEnv): Promise<Response> {
        const url = new URL(request.url);
        if (legacyAuthPaths.has(url.pathname)) {
            return Response.json({ error: { code: "EXTERNAL_LOGIN_REMOVED", message: "Open /campus/ and choose Teacher. ChatGPT sign-in is not used on this website." } }, { status: 410, headers: { "cache-control": "no-store" } });
        }
        if (url.pathname === "/") {
            if (!["GET", "HEAD"].includes(request.method)) return new Response("Method not allowed", { status: 405, headers: { allow: "GET, HEAD" } });
            return Response.redirect(new URL("/campus/", url), 302);
        }
        if (url.pathname === "/api/campus" || url.pathname.startsWith("/api/campus/")) {
            if (!env.DB) return Response.json({ error: { code: "DATABASE_UNAVAILABLE", message: "The learning database is not configured." } }, { status: 503, headers: { "cache-control": "no-store" } });
            return handleCampus(request, {
                db: env.DB,
                worksheetBucket: createD1WorksheetBucket(env.DB),
                // Never accept an identity or development override from public
                // request headers. This host uses its own teacher access codes.
                teacher: null,
                localDevelopment: false,
                clientIp: request.headers.get("cf-connecting-ip") ?? undefined,
                env: { ...env, TEACHER_AUTH_MODE: "access-code", CAMPUS_LOCAL_TEACHER: "0", CAMPUS_TTS_ENABLED: "0" },
            });
        }
        if (url.pathname === "/api" || url.pathname.startsWith("/api/")) return Response.json({ error: { code: "NOT_FOUND", message: "Unknown API route." } }, { status: 404, headers: { "cache-control": "no-store" } });
        return env.ASSETS.fetch(request);
    },
};
export default worker;
