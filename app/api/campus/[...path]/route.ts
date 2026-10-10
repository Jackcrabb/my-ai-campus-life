import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../../chatgpt-auth";
import { handleCampus } from "../../../../lib/campus-api";
import type { CampusEnv } from "../../../../lib/campus-types";
export const dynamic = "force-dynamic";
async function route(request: Request) {
    if (!env.DB)
        return Response.json({ error: { code: "DATABASE_UNAVAILABLE", message: "The learning database is not configured." } }, { status: 503, headers: { "cache-control": "no-store" } });
    const user = await getChatGPTUser(), hostname = new URL(request.url).hostname;
    return handleCampus(request, { db: env.DB, bucket: env.BUCKET, env: env as Cloudflare.Env & CampusEnv, teacher: user ? { userId: user.userId, email: user.email } : null, localDevelopment: process.env.NODE_ENV !== "production" && ["127.0.0.1", "localhost", "[::1]"].includes(hostname) });
}
export const GET = route;
export const POST = route;
export const PUT = route;
export const PATCH = route;
export const DELETE = route;
