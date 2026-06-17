import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createHash } from "node:crypto";

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? "";
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? "";

export function isConfigured(): boolean {
  return Boolean(url && token);
}

export function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 24);
}

let _perIp: Ratelimit | null = null;
let _perSession: Ratelimit | null = null;
let _global: Ratelimit | null = null;

function limiters() {
  if (!_perIp) {
    const redis = new Redis({ url, token });
    _perIp = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "60 s"), prefix: "sd:ip" });
    _perSession = new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(25, "1 d"), prefix: "sd:sess" });
    _global = new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(500, "1 d"), prefix: "sd:global" });
  }
  return { perIp: _perIp!, perSession: _perSession!, global: _global! };
}

export type LimitResult = { ok: true } | { ok: false; reason: "rate" | "session" | "global" };

// Per-IP (10/min) → per-session (25/day) → global (500/day). Order matters:
// cheap/abuse checks first, the global cost-ceiling last.
export async function checkLimits(ipHash: string, sessionId: string): Promise<LimitResult> {
  const { perIp, perSession, global } = limiters();
  if (!(await perIp.limit(ipHash)).success) return { ok: false, reason: "rate" };
  if (!(await perSession.limit(sessionId)).success) return { ok: false, reason: "session" };
  if (!(await global.limit("all")).success) return { ok: false, reason: "global" };
  return { ok: true };
}
