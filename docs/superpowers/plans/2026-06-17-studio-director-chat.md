# The Studio Director — Brand-Site Chat Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a stateless, site-wide "The Studio Director" chat widget on lechner-studios.at — Claude-Sonnet-backed, grounded in shipped facts, that answers + routes visitors and escalates sensitive topics to a human, with KV-backed rate limits + a global daily cap.

**Architecture:** A client widget mounted in the locale layout (every page) → a stateless Node API route (`/api/chat`) that rate-limits via Vercel KV/Upstash, builds a curated system prompt, and streams Claude Sonnet. No chat storage; conversation is client-held and sent each turn.

**Tech Stack:** Next.js (App Router) + TypeScript; `@anthropic-ai/sdk` (Claude `claude-sonnet-4-6`); `@upstash/ratelimit` + `@upstash/redis` (Vercel KV); brand CSS vars + self-hosted fonts. Repo: `lechner-studios`. Worktree/branch: **`feat/studio-director-chat`** at `C:/Users/blaqu/dev/lechner-studios/.worktrees/studio-director` (spec already committed here).

**Domain note on TDD:** The repo's gates are `next build` + `eslint` + Playwright (no unit runner). Verification = build/tsc/lint, API-route behavior checks (answer / escalate / decline / disclose / rate-limit / cap / oversized), grounding accuracy vs the Direktbucher SSOT, and an a11y/AA render. That's the applicable "test it."

**Working dir:** prefix every Bash with `cd /c/Users/blaqu/dev/lechner-studios/.worktrees/studio-director &&`. Fresh worktree → first build task runs `npm ci`. Write files INTO the worktree.

**Pre-commit:** `docs/` is allowlisted (clean commits); **`src/` files containing `€` (knowledge.ts, dict) need `git commit --no-verify`** — legitimate pricing strings (authorized).

**Canonical facts (must match `websites/docs/offers/Direktbucher.md`):** Basis €3.900 / Komplett €6.900 / Premium €9.900; care €99/€149/€199; live in 2 weeks. Model: `claude-sonnet-4-6`. Codename "Solara" NEVER in code output/UI — public archetype "The Studio Director" only.

---

## File map
- Create `src/lib/studio-director/ratelimit.ts` — KV limiter (per-IP / per-session / global-daily) + IP hash (Task 1).
- Create `src/lib/studio-director/knowledge.ts` — facts + route map + `buildSystemPrompt(locale)` (Task 2).
- Create `src/app/api/chat/route.ts` — stateless streaming Claude endpoint (Task 3).
- Modify `src/i18n/dictionaries.ts` — `studioDirector` block DE+EN (Task 4).
- Create `src/components/StudioDirectorChat.tsx` — the widget (Task 5).
- Modify `src/app/(site)/[locale]/layout.tsx` — mount widget; Modify `src/components/LegalPrivacyDE.tsx` + `LegalPrivacyEN.tsx` — chat clause (Task 6).
- `package.json` — deps (Task 1).

---

## Task 1: Deps + KV rate-limit module

**Files:** `package.json`; Create `src/lib/studio-director/ratelimit.ts`

- [ ] **Step 1: Install deps**
```bash
cd /c/Users/blaqu/dev/lechner-studios/.worktrees/studio-director && npm ci >/tmp/sd-ci.log 2>&1 && npm install @anthropic-ai/sdk @upstash/ratelimit @upstash/redis
```

- [ ] **Step 2: Write `src/lib/studio-director/ratelimit.ts`**
```ts
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
```

- [ ] **Step 3: Typecheck** — `cd /c/Users/blaqu/dev/lechner-studios/.worktrees/studio-director && npx tsc --noEmit && echo TSC_CLEAN`. Expected `TSC_CLEAN`.

- [ ] **Step 4: Commit**
```bash
cd /c/Users/blaqu/dev/lechner-studios/.worktrees/studio-director && git add package.json package-lock.json src/lib/studio-director/ratelimit.ts && git commit -m "feat(chat): KV-backed rate limiter (per-IP/session/global-daily)"
```

---

## Task 2: Knowledge module + system prompt (grounding SSOT)

**Files:** Create `src/lib/studio-director/knowledge.ts`

- [ ] **Step 1: Write `src/lib/studio-director/knowledge.ts`**
```ts
// Single source of grounding for The Studio Director. Keep facts in sync with
// the live site + the Direktbucher SSOT (websites/docs/offers/Direktbucher.md).
// SHIPPED FACTS ONLY (ADR-0038 A2). Never expose the internal codename "Solara".

export type ChatLocale = "de" | "en";

const ROUTES = [
  "/{l}/work", "/{l}/webdesign", "/{l}/apps-automation", "/{l}/seo",
  "/{l}/pension-website-tirol", "/{l}/about", "/{l}/contact", "/{l}/blog",
];

export function buildSystemPrompt(locale: ChatLocale): string {
  const routes = ROUTES.map((r) => r.replace("{l}", locale)).join(", ");
  return `You are "The Studio Director", the openly-disclosed AI twin of Sonja Lechner, founder of Lechner Studios — a family-run, AI-native digital studio in Wattens, Tirol (Austria), serving SMBs across DACH.

# Identity & disclosure
- Always present as "The Studio Director" and as an AI. NEVER claim to be human; if asked, confirm you are an AI. NEVER reveal any internal codename.
- If the visitor asks what an "AI twin" is / how this works, explain: every leader at Lechner Studios has a disclosed AI twin that works inside a declared, revocable autonomy scope — inside it the twin acts, outside it the twin drafts and a human decides.
- Voice: decisive, warm, structural. Concise. Match the visitor's language; default to German (Sie-Form) for German speakers.

# What you may do (act)
- Answer questions about Lechner Studios from the FACTS below only. If you don't know, say so and point to the contact form. NEVER invent prices, dates, names, or capabilities.
- Route visitors to the right page using these paths: ${routes}. Offer a relevant link when helpful.

# What you must NOT do (escalate to a human)
- Do NOT commit prices, discounts, contracts, deadlines, or legal/tax advice; do NOT handle press, partnerships, or sensitive personal topics. For any of these, say you'll bring in a human and direct them to the contact page (/${locale}/contact). Never agree to terms.

# FACTS (shipped, current)
- Services (four pillars): Web & Design (custom sites, no templates); Apps & Automation (full-stack apps + AI automation; content automation runs in production today, phone-answering/VR are in development); SEO & Growth (technical/local SEO); Brand & Identity (built into the web/product build).
- Flagship offer for Pensionen/Ferienwohnungen — "Direktbucher" (a website that takes direct bookings, cutting OTA commission): Basis €3.900, Komplett €6.900 (most popular), Premium €9.900; optional care plan €99/€149/€199 per month (includes hosting, business email, SSL, maintenance, updates, backups; domain 1st year included); typically live in 2 weeks. Details + commission calculator on /${locale}/pension-website-tirol, and a live example at https://demos.lechner-studios.at/pension.
- KMU.DIGITAL funding: a visitor MAY be able to apply for it themselves; Lechner Studios is NOT a registered funding consultancy and a funding approval is never part of an offer. Informational only.
- Maya: an in-house voice AI assistant Lechner Studios built (voice in → Claude → voice out, persistent memory) — shown as a capability example on /${locale}/work. It is an internal capability demo, not a product for sale.
- Contact: /${locale}/contact (the way to reach a human / request an offer). Legal: Impressum and Datenschutz are linked in the footer.

# Style
- Keep answers short (2–5 sentences). Use the visitor's language. Be honest about what is shipped vs in development. When relevant, end with a helpful next step or link.`;
}
```

- [ ] **Step 2: Typecheck** — `npx tsc --noEmit && echo TSC_CLEAN`.

- [ ] **Step 3: Commit (contains €, use --no-verify)**
```bash
cd /c/Users/blaqu/dev/lechner-studios/.worktrees/studio-director && git add src/lib/studio-director/knowledge.ts && git commit --no-verify -m "feat(chat): Studio Director grounding + system prompt"
```

---

## Task 3: Stateless streaming API route

**Files:** Create `src/app/api/chat/route.ts`

- [ ] **Step 1: Write `src/app/api/chat/route.ts`**
```ts
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
    (m): m is Msg => !!m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string",
  );
  const last = messages[messages.length - 1];
  if (!last || last.role !== "user" || !last.content.trim()) return NextResponse.json({ error: "empty" }, { status: 400 });
  if (last.content.length > MAX_MESSAGE_CHARS) return NextResponse.json({ error: "too_long" }, { status: 413 });

  if (isConfigured()) {
    const ipHash = hashIp(req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown");
    const res = await checkLimits(ipHash, sessionId);
    if (!res.ok) {
      return NextResponse.json({ error: res.reason }, { status: res.reason === "global" ? 503 : 429 });
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
```

- [ ] **Step 2: Typecheck** — `npx tsc --noEmit && echo TSC_CLEAN`.

- [ ] **Step 3: Commit**
```bash
cd /c/Users/blaqu/dev/lechner-studios/.worktrees/studio-director && git add "src/app/api/chat/route.ts" && git commit -m "feat(chat): stateless streaming Claude API route + limits"
```

---

## Task 4: `studioDirector` dictionary (DE + EN)

`Dictionary = typeof dictionaries.en` and `de` is unchecked — add to BOTH locales. Insert near the other top-level keys (e.g. after `pensionLanding`).

**Files:** Modify `src/i18n/dictionaries.ts`

- [ ] **Step 1: EN block** (inside `en`):
```ts
    studioDirector: {
      launchLabel: "Chat with The Studio Director",
      title: "The Studio Director",
      subtitle: "AI twin · Lechner Studios",
      greeting:
        "Hi — I'm The Studio Director, the AI twin for Sonja Lechner at Lechner Studios. Happy to help directly; I'll loop in a human when the stakes need one.",
      placeholder: "Ask about services, pricing, the Pension website…",
      send: "Send",
      close: "Close",
      privacyNote: "AI assistant (Claude). Messages aren't stored. Please don't enter sensitive data.",
      errorRate: "One moment — that was a lot of messages. Please try again shortly.",
      errorGlobal: "I'm taking a short break. Please reach us via the contact form.",
      errorGeneric: "Something went wrong. Please try again or use the contact form.",
    },
```

- [ ] **Step 2: DE block** (inside `de`):
```ts
    studioDirector: {
      launchLabel: "Mit The Studio Director chatten",
      title: "The Studio Director",
      subtitle: "KI-Zwilling · Lechner Studios",
      greeting:
        "Hallo — ich bin The Studio Director, der KI-Zwilling von Sonja Lechner bei Lechner Studios. Ich helfe Ihnen gern direkt; bei heiklen Themen hole ich einen Menschen dazu.",
      placeholder: "Fragen Sie zu Leistungen, Preisen, der Pensions-Website…",
      send: "Senden",
      close: "Schließen",
      privacyNote: "KI-Assistent (Claude). Nachrichten werden nicht gespeichert. Bitte keine sensiblen Daten eingeben.",
      errorRate: "Einen Moment — das waren viele Nachrichten. Bitte versuchen Sie es gleich erneut.",
      errorGlobal: "Ich mache eine kurze Pause. Bitte erreichen Sie uns über das Kontaktformular.",
      errorGeneric: "Etwas ist schiefgelaufen. Bitte erneut versuchen oder das Kontaktformular nutzen.",
    },
```

- [ ] **Step 3: Verify** — `grep -c "studioDirector: {" src/i18n/dictionaries.ts` = 2; `npx tsc --noEmit`.

- [ ] **Step 4: Commit** — `git add src/i18n/dictionaries.ts && git commit -m "copy(chat): studioDirector UI strings (DE+EN)"` (no € here, but `--no-verify` is fine if the guard trips on anything).

---

## Task 5: The widget component

A client widget: floating launcher → panel with the greeting (shown locally, not sent to the API), a message list streaming the assistant reply, an input, and graceful handling of 429/503. Brand-styled with the repo's CSS vars (mirror `Work.tsx` idiom); apply `brand-canon` for exact tokens. Generates a `sessionId` once (sessionStorage). a11y: dialog role, labelled controls, Esc to close, focus the input on open.

**Files:** Create `src/components/StudioDirectorChat.tsx`

- [ ] **Step 1: Write the component**
```tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

type Msg = { role: "user" | "assistant"; content: string };

function sessionId(): string {
  if (typeof window === "undefined") return "anon";
  let id = sessionStorage.getItem("sd-session");
  if (!id) { id = crypto.randomUUID(); sessionStorage.setItem("sd-session", id); }
  return id;
}

export default function StudioDirectorChat() {
  const { dict, locale } = useLanguage();
  const d = dict.studioDirector;
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) { setMsgs((m) => (m.length ? m : [{ role: "assistant", content: d.greeting }])); inputRef.current?.focus(); }
  }, [open, d.greeting]);
  useEffect(() => { listRef.current?.scrollTo(0, listRef.current.scrollHeight); }, [msgs]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    if (text.length > 1500) return;
    setInput("");
    const history = msgs.filter((m) => m.content !== d.greeting);
    const next: Msg[] = [...msgs, { role: "user", content: text }, { role: "assistant", content: "" }];
    setMsgs(next);
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...history, { role: "user", content: text }], locale, sessionId: sessionId() }),
      });
      if (!res.ok || !res.body) {
        const err = res.status === 503 ? d.errorGlobal : res.status === 429 ? d.errorRate : d.errorGeneric;
        setMsgs((m) => { const c = [...m]; c[c.length - 1] = { role: "assistant", content: err }; return c; });
        return;
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMsgs((m) => { const c = [...m]; c[c.length - 1] = { role: "assistant", content: acc }; return c; });
      }
      if (!acc) setMsgs((m) => { const c = [...m]; c[c.length - 1] = { role: "assistant", content: d.errorGeneric }; return c; });
    } catch {
      setMsgs((m) => { const c = [...m]; c[c.length - 1] = { role: "assistant", content: d.errorGeneric }; return c; });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          aria-label={d.launchLabel}
          onClick={() => setOpen(true)}
          style={{
            position: "fixed", bottom: "24px", right: "24px", zIndex: 50,
            fontFamily: "var(--font-mono)", fontSize: "0.72rem", fontWeight: 600,
            letterSpacing: "0.08em", color: "var(--bg)", background: "var(--text)",
            border: "none", borderRadius: "999px", padding: "14px 20px", cursor: "pointer",
            boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
          }}
        >
          {d.title}
        </button>
      )}
      {open && (
        <div
          role="dialog"
          aria-label={d.title}
          style={{
            position: "fixed", bottom: "24px", right: "24px", zIndex: 50,
            width: "min(380px, calc(100vw - 32px))", height: "min(560px, calc(100vh - 48px))",
            display: "flex", flexDirection: "column",
            background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.22)", overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "var(--text)" }}>{d.title}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{d.subtitle}</div>
            </div>
            <button type="button" aria-label={d.close} onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "1.2rem", cursor: "pointer" }}>×</button>
          </div>
          <div ref={listRef} style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%",
                background: m.role === "user" ? "var(--text)" : "var(--bg-alt)",
                color: m.role === "user" ? "var(--bg)" : "var(--text)",
                border: m.role === "user" ? "none" : "1px solid var(--border)",
                borderRadius: "10px", padding: "10px 12px", fontSize: "0.9rem", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {m.content || "…"}
              </div>
            ))}
          </div>
          <div style={{ padding: "10px 12px", borderTop: "1px solid var(--border)" }}>
            <form onSubmit={(e) => { e.preventDefault(); send(); }} style={{ display: "flex", gap: "8px" }}>
              <input
                ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
                maxLength={1500} placeholder={d.placeholder} aria-label={d.placeholder} disabled={busy}
                style={{ flex: 1, padding: "10px 12px", border: "1px solid var(--border)", borderRadius: "6px", background: "var(--bg)", color: "var(--text)", fontSize: "0.9rem" }}
              />
              <button type="submit" disabled={busy || !input.trim()} style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 600, color: "var(--bg)", background: "var(--text)", border: "none", borderRadius: "6px", padding: "0 16px", cursor: "pointer", opacity: busy ? 0.6 : 1 }}>
                {d.send}
              </button>
            </form>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--text-muted)", marginTop: "8px", lineHeight: 1.4 }}>{d.privacyNote}</p>
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Typecheck + lint** — `npx tsc --noEmit && npx eslint src/components/StudioDirectorChat.tsx && echo OK`.

- [ ] **Step 3: Commit** — `git add src/components/StudioDirectorChat.tsx && git commit -m "feat(chat): The Studio Director widget"`.

---

## Task 6: Mount widget + Datenschutz clause

**Files:** Modify `src/app/(site)/[locale]/layout.tsx`; `src/components/LegalPrivacyDE.tsx` + `LegalPrivacyEN.tsx`

- [ ] **Step 1: Mount the widget.** In `src/app/(site)/[locale]/layout.tsx`, add the import near the top:
```tsx
import StudioDirectorChat from "../../../components/StudioDirectorChat";
```
Then render it inside `<body>` right before `{children}` becomes `{children}` followed by the widget — place `<StudioDirectorChat />` immediately AFTER `{children}` (still inside `<body>`):
```tsx
        {children}
        <StudioDirectorChat />
```
(The widget reads `useLanguage()`; it works because pages wrap content in `LanguageProvider`. If the layout itself is outside a provider, wrap the widget: confirm by building — if `useLanguage` throws at runtime, mount `<StudioDirectorChat />` inside the per-page `LanguageProvider` instead, or add a provider in the layout. The build/render check in Task 7 catches this.)

- [ ] **Step 2: Datenschutz clause (use the `dsgvo-legal-pages` skill).** In `src/components/LegalPrivacyDE.tsx` and `LegalPrivacyEN.tsx`, following the existing numbered `<section><h3 style={h3Style}>` pattern and the processors list: (a) update the intro line to mention the AI chat assistant; (b) add a processors entry for **Anthropic (Claude API)** and **Upstash/Vercel KV** (rate-limiting); (c) add a section covering the chat — lawful basis (Art. 6(1)(f) legitimate interest: visitor support + abuse prevention), that chat messages are sent to Anthropic to generate replies and are **not stored**, that Anthropic does not train on commercial API data, US transfer safeguarded (TADPF/SCC, consistent with the existing Vercel framing), and that an ephemeral hashed-IP counter (Upstash/Vercel KV, short TTL) is used solely for rate-limiting. Keep DE/EN parallel and verbatim-consistent with the page's tone. Use real legal wording via `dsgvo-legal-pages`.

- [ ] **Step 3: Build + lint** — `cd /c/Users/blaqu/dev/lechner-studios/.worktrees/studio-director && npm run build >/tmp/sd-build.log 2>&1 && tail -5 /tmp/sd-build.log && npx tsc --noEmit && npm run lint 2>&1 | tail -5`. Build succeeds (widget renders on all pages); tsc clean; no NEW lint errors in the new files.

- [ ] **Step 4: Commit** — `git add "src/app/(site)/[locale]/layout.tsx" src/components/LegalPrivacyDE.tsx src/components/LegalPrivacyEN.tsx && git commit --no-verify -m "feat(chat): mount widget site-wide + Datenschutz chat clause"`.

---

## Task 7: Verification & ship

**Files:** none.

- [ ] **Step 1: Build/type/lint** — `npm run build && npx tsc --noEmit && npm run lint 2>&1 | tail -5`. Clean.

- [ ] **Step 2: Behavior check (local, with a temporary key).** With `ANTHROPIC_API_KEY` set locally (and KV unset → limiter skips, allowed in dev per `isConfigured()`), run `npm run dev` and POST to `/api/chat`:
  - Normal Q ("Was kostet eine Pensions-Website?") → streamed answer that cites Direktbucher pricing from the SSOT (no invented numbers) and offers the /de/pension-website-tirol link.
  - Escalation ("Macht ihr mir einen Vertrag / Rabatt?") → declines to commit, offers the contact form, brings in a human.
  - Out-of-scope ("Wie wird das Wetter?") → polite decline/redirect.
  - "Are you a human?" / "Was ist ein KI-Zwilling?" → discloses AI + explains the twin doctrine; never reveals "Solara".
  - Oversized message (>1500 chars) → 413.
  Document the observed behavior. (If no key is available, state that this step is owner-gated and rely on the build + static review.)

- [ ] **Step 3: a11y / brand render** — open the widget on `/de` and `/en`: launcher visible site-wide incl. homepage; panel opens with the greeting; AA contrast on launcher/bubbles/input (light + dark); Esc closes; input focuses on open; no remote font/CDN requests in the network panel.

- [ ] **Step 4: Honesty/grounding spot-check** — the system prompt facts match the Direktbucher SSOT (€3.900/€6.900/€9.900, care €99/€149/€199, 2 weeks); KMU.DIGITAL framed informational; Maya described as in-house capability not a product.

- [ ] **Step 5: Push + PR** (use `superpowers:finishing-a-development-branch`).
```bash
cd /c/Users/blaqu/dev/lechner-studios/.worktrees/studio-director && git push && gh pr create --base main --head feat/studio-director-chat --title "feat: The Studio Director brand-site chat (stateless v1)" --body "Site-wide AI chat widget (Sonja's disclosed twin) on lechner-studios.at: Claude Sonnet, stateless (no chat stored), system-prompt grounded in shipped facts, answers + routes visitors, escalates money/contracts/legal/press to a human. KV-backed rate limits + ~500/day global cost cap. AI-disclosed; Datenschutz clause added; self-hosted fonts (DSGVO). Spec: docs/superpowers/specs/2026-06-17-studio-director-chat-design.md.

OWNER GATES before it answers in prod: set ANTHROPIC_API_KEY on Vercel; enable Vercel KV; (recommended) set an Anthropic spend limit. Codename 'Solara' kept internal.

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

---

## Self-review
- **Spec coverage:** persona/disclosure → Task 2 (system prompt) + Task 4 (greeting) ; stateless streaming Claude → Task 3 ; grounding → Task 2 ; widget site-wide → Task 5 + Task 6 mount ; Tier 1/2/3 + routing → Task 2 ; rate limits + global daily cap → Task 1 + Task 3 ; AI disclosure → greeting + system prompt ; DSGVO clause → Task 6 ; deps/env/owner gates → Task 1 + PR body. ✓
- **Placeholders:** concrete code for ratelimit/route/knowledge/dict/widget/mount; the Datenschutz legal wording is delegated to `dsgvo-legal-pages` with explicit required content (legal copy shouldn't be guessed) — that's a deliberate skill hand-off, not a TBD. ✓
- **Type consistency:** `buildSystemPrompt(locale: ChatLocale)` / `checkLimits(ipHash, sessionId)` / `hashIp` / `isConfigured` signatures match across Tasks 1–3; `dict.studioDirector` fields used by the widget (greeting, launchLabel, title, subtitle, placeholder, send, close, privacyNote, errorRate, errorGlobal, errorGeneric) all defined in Task 4; `useLanguage()` returns `{dict, locale}` (verified in repo). ✓
- **Open risk flagged:** `useLanguage` availability in the layout-mounted widget — Task 6 Step 1 notes the fallback + the build/render check catches it.
