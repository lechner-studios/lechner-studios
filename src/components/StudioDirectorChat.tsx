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

// Safe inline markdown for assistant replies: **bold** and [label](url).
// XSS-safe by construction: builds React elements (text auto-escaped), validates
// every href against an allowlist (same-site "/path" or http(s) only — rejects
// javascript:, data:, protocol-relative //), and never uses dangerouslySetInnerHTML.
function renderRich(text: string): React.ReactNode {
  const out: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      out.push(<strong key={key++}>{renderRich(m[1])}</strong>);
    } else {
      const label = m[2];
      const url = m[3];
      const internal = /^\/(?!\/)/.test(url); // same-site path, not protocol-relative
      const external = /^https?:\/\//i.test(url);
      if (internal || external) {
        out.push(
          <a
            key={key++}
            href={url}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            style={{ color: "var(--accent)", textDecoration: "underline" }}
          >
            {label}
          </a>,
        );
      } else {
        out.push(label); // disallowed scheme → drop the link, keep the label text
      }
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
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
    if (open) { inputRef.current?.focus(); }
  }, [open]);
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
    // Drop the opener (always the index-0 assistant greeting) by position/role,
    // not by content — robust if the locale (and thus the greeting string) changed.
    const history = msgs.filter((m, i) => !(i === 0 && m.role === "assistant"));
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
          title={d.title}
          onClick={() => { setMsgs((m) => (m.length ? m : [{ role: "assistant", content: d.greeting }])); setOpen(true); }}
          style={{
            position: "fixed", bottom: "24px", right: "24px", zIndex: 50,
            width: "52px", height: "52px", display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--bg)", background: "var(--text)",
            border: "none", borderRadius: "999px", cursor: "pointer",
            boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
          }}
        >
          {/* Compact icon (was a wide text pill that overlapped content); label via aria-label/title. */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" />
          </svg>
        </button>
      )}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
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
                {m.content ? (m.role === "assistant" ? renderRich(m.content) : m.content) : "…"}
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
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", color: "var(--text-muted)", marginTop: "8px", lineHeight: 1.45 }}>{d.privacyNote}</p>
          </div>
        </div>
      )}
    </>
  );
}
