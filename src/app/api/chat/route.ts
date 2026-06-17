import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { checkLimits, isConfigured, hashIp } from "../../../lib/studio-director/ratelimit";
import { buildSystemPrompt, type ChatLocale } from "../../../lib/studio-director/knowledge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_CHARS = 1500;
const MAX_HISTORY = 12;
const MODEL = "claude-sonnet-4-6";

type Msg = { role: "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  let body: { messages?: Msg[]; locale?: string; sessionId?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad_json" }, { status: 400 }); }

  const locale: ChatLocale = body.locale === "en" ? "en" : "de";
  const sessionId = (typeof body.sessionId === "string" ? body.sessionId : "").slice(0, 64) || "anon";
  const messages = (body.messages ?? []).filter(
    (m): m is Msg =>
      !!m && (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string" && m.content.length <= MAX_MESSAGE_CHARS,
  );
  const last = messages[messages.length - 1];
  if (!last || last.role !== "user" || !last.content.trim()) return NextResponse.json({ error: "empty" }, { status: 400 });
  if (last.content.length > MAX_MESSAGE_CHARS) return NextResponse.json({ error: "too_long" }, { status: 413 });

  // Limits: per-IP (10/min) → per-session (25/day, soft — sessionId is client-held,
  // so the global 500/day is the real cost backstop) → global (500/day).
  // Fail OPEN on KV error: a brand-site assistant shouldn't go dark on a KV hiccup;
  // the global cap + the Anthropic spend limit are the hard cost ceilings.
  if (isConfigured()) {
    const ipHash = hashIp(req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown");
    try {
      const res = await checkLimits(ipHash, sessionId);
      if (!res.ok) {
        return NextResponse.json({ error: res.reason }, { status: res.reason === "global" ? 503 : 429 });
      }
    } catch (e) {
      console.error("[chat] rate-limit KV unreachable, proceeding (fail-open):", e);
    }
  }

  const trimmed = messages.slice(-MAX_HISTORY).map((m) => ({ role: m.role, content: m.content }));
  const client = new Anthropic({ apiKey });
  const encoder = new TextEncoder();

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const stream = client.messages.stream({
          model: MODEL,
          max_tokens: 700,
          system: buildSystemPrompt(locale),
          messages: trimmed,
        });
        for await (const ev of stream) {
          if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(ev.delta.text));
          }
        }
      } catch (e) {
        console.error("[chat] stream error:", e);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
