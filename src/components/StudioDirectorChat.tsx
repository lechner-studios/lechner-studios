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
          onClick={() => { setMsgs((m) => (m.length ? m : [{ role: "assistant", content: d.greeting }])); setOpen(true); }}
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
