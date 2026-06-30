"use client";
import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const DRAFT_KEY = "ls-website-check-draft";
const SUBMITTED_KEY = "ls-website-check-submitted";

// Targeted intake for the Website-Check offer. Collects the specifics a review
// needs (URL, concerns, industry, urgency) — not the general name/message form —
// then composes them into one message + subject and posts to the shared
// /api/contact endpoint (ZeptoMail, honeypot, rate-limit, consent all reused).
export default function WebsiteCheckIntake() {
  const { dict, locale } = useLanguage();
  const w = dict.websiteCheckIntake;
  const f = dict.contact.form;

  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorKey, setErrorKey] = useState<"validation" | "rate_limit" | "generic" | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // If a request was already sent (persisted), show the "received" message on
  // revisit instead of an empty form — so re-clicking the CTA gives feedback.
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (localStorage.getItem(SUBMITTED_KEY)) setSubmitted(true);
    } catch { /* ignore */ }
  }, []);

  // Restore a saved draft on mount (uncontrolled inputs set directly; consent is controlled).
  useEffect(() => {
    const formEl = formRef.current;
    if (!formEl) return;
    let draft: Record<string, unknown> | null = null;
    try { draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null"); } catch { return; }
    if (!draft) return;
    const setVal = (name: string, val: unknown) => {
      const el = formEl.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
      if (el && typeof val === "string" && "value" in el) el.value = val;
    };
    setVal("name", draft.name); setVal("email", draft.email); setVal("websiteUrl", draft.websiteUrl);
    setVal("industry", draft.industry); setVal("urgency", draft.urgency); setVal("details", draft.details);
    const cs = Array.isArray(draft.concerns) ? (draft.concerns as string[]) : [];
    formEl.querySelectorAll('input[name="concerns"]').forEach((node) => {
      const cb = node as HTMLInputElement;
      cb.checked = cs.includes(cb.value);
    });
    // One-shot external-store sync (localStorage), same rationale as StartProject.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (draft.consent) setConsentChecked(true);
  }, []);

  function saveDraft() {
    const formEl = formRef.current;
    if (!formEl) return;
    const fd = new FormData(formEl);
    const draft = {
      name: fd.get("name") ?? "", email: fd.get("email") ?? "", websiteUrl: fd.get("websiteUrl") ?? "",
      concerns: fd.getAll("concerns").map(String),
      industry: fd.get("industry") ?? "", urgency: fd.get("urgency") ?? "", details: fd.get("details") ?? "",
      consent: fd.get("consent") === "on",
    };
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch { /* ignore quota/availability */ }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorKey(null);

    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const websiteUrl = String(formData.get("websiteUrl") ?? "").trim();
    const concerns = formData.getAll("concerns").map((v) => String(v));
    const industry = String(formData.get("industry") ?? "").trim();
    const urgencyKey = String(formData.get("urgency") ?? "");
    const details = String(formData.get("details") ?? "").trim();
    const consent = formData.get("consent") === "on";
    const hp = String(formData.get("_hp") ?? "");

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (name.length < 2 || !emailValid || websiteUrl.length < 4 || !consent) {
      setFormState("error");
      setErrorKey("validation");
      return;
    }

    setFormState("submitting");

    // Compose a readable body from the answered fields (name/email are prepended
    // by the API). The URL line guarantees the API's 20-char message minimum.
    const concernLabels = concerns.map((k) => (w.concerns as Record<string, string>)[k] ?? k).join(", ");
    const urgencyLabel = urgencyKey ? (w.urgency as Record<string, string>)[urgencyKey] ?? urgencyKey : "";

    const lines: string[] = [];
    lines.push(`${w.urlLabel}: ${websiteUrl}`);
    if (concernLabels) lines.push(`${w.concernsLabel}: ${concernLabels}`);
    if (industry) lines.push(`${w.industryLabel}: ${industry}`);
    if (urgencyLabel) lines.push(`${w.urgencyLabel}: ${urgencyLabel}`);
    if (details) lines.push(`${w.detailsLabel}\n${details}`);

    const message = lines.join("\n\n");
    const subject = (locale === "de" ? "Website-Check-Anfrage: " : "Website-Check request: ") + websiteUrl;

    const payload = { name, email, message, consent, _hp: hp, subject };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setFormState("success");
        try { localStorage.removeItem(DRAFT_KEY); localStorage.setItem(SUBMITTED_KEY, "1"); } catch { /* ignore */ }
        setSubmitted(true);
      } else if (response.status === 429) {
        setFormState("error"); setErrorKey("rate_limit");
      } else if (response.status === 400) {
        setFormState("error"); setErrorKey("validation");
      } else {
        setFormState("error"); setErrorKey("generic");
      }
    } catch {
      setFormState("error"); setErrorKey("generic");
    }
  }

  const labelStyle: React.CSSProperties = {
    display: "block", fontFamily: "var(--font-mono)", fontSize: "0.6rem", fontWeight: 600,
    textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--text-muted)", marginBottom: "8px",
  };
  const inputStyle: React.CSSProperties = {
    display: "block", width: "100%", background: "transparent", border: "none",
    borderBottom: "1px solid var(--border-strong)", padding: "12px 0", fontSize: "1rem",
    color: "var(--text)", outline: "none", marginBottom: "24px",
  };
  const selectStyle: React.CSSProperties = { ...inputStyle, appearance: "none", WebkitAppearance: "none", MozAppearance: "none", cursor: "pointer" };
  const focusOn = (el: HTMLElement | null) => { if (el) el.style.borderBottom = "1px solid var(--text-muted)"; };
  const focusOff = (el: HTMLElement | null) => { if (el) el.style.borderBottom = "1px solid var(--border-strong)"; };

  const errorMessage = errorKey
    ? errorKey === "validation" ? f.errorValidation
    : errorKey === "rate_limit" ? f.errorRateLimit
    : f.errorGeneric
    : null;

  const concernKeys = ["tooSlow", "outdated", "notFound", "notMobile", "general"] as const;
  const urgencyKeys = ["exploring", "weeks", "asap"] as const;

  if (submitted) {
    return (
      <div style={{ maxWidth: "560px" }}>
        <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.1rem", color: "var(--text)", lineHeight: 1.7 }}>
          {w.alreadySubmitted}
        </p>
        <button
          type="button"
          onClick={() => {
            try { localStorage.removeItem(SUBMITTED_KEY); } catch { /* ignore */ }
            setSubmitted(false);
            setFormState("idle");
          }}
          style={{ marginTop: "20px", background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent)", textDecoration: "underline" }}
        >
          {w.sendAnother} →
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "640px" }}>
      <form ref={formRef} onSubmit={handleSubmit} onChange={saveDraft} noValidate>
        {/* Honeypot */}
        <div style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }} aria-hidden="true">
          <input type="text" name="_hp" tabIndex={-1} autoComplete="off" />
        </div>

        {/* Website URL — the targeted, required field */}
        <div>
          <label htmlFor="wc-url" style={labelStyle}>{w.urlLabel}</label>
          <input id="wc-url" type="text" name="websiteUrl" required maxLength={300} inputMode="url"
            placeholder={w.urlPlaceholder} style={inputStyle}
            onFocus={(e) => focusOn(e.currentTarget)} onBlur={(e) => focusOff(e.currentTarget)} />
        </div>

        {/* Concerns — checkboxes */}
        <div style={{ marginBottom: "24px" }}>
          <span style={labelStyle}>{w.concernsLabel}</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "4px" }}>
            {concernKeys.map((key) => (
              <div key={key} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <input id={`wc-c-${key}`} type="checkbox" name="concerns" value={key} style={{ flexShrink: 0, marginTop: "3px", cursor: "pointer" }} />
                <label htmlFor={`wc-c-${key}`} style={{ fontSize: "0.92rem", lineHeight: 1.5, color: "var(--text)", cursor: "pointer" }}>
                  {w.concerns[key]}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Industry */}
        <div>
          <label htmlFor="wc-industry" style={labelStyle}>{w.industryLabel}</label>
          <input id="wc-industry" type="text" name="industry" maxLength={200} style={inputStyle}
            onFocus={(e) => focusOn(e.currentTarget)} onBlur={(e) => focusOff(e.currentTarget)} />
        </div>

        {/* Urgency */}
        <div>
          <label htmlFor="wc-urgency" style={labelStyle}>{w.urgencyLabel}</label>
          <select id="wc-urgency" name="urgency" defaultValue="" style={selectStyle}
            onFocus={(e) => focusOn(e.currentTarget)} onBlur={(e) => focusOff(e.currentTarget)}>
            <option value=""></option>
            {urgencyKeys.map((k) => <option key={k} value={k}>{w.urgency[k]}</option>)}
          </select>
        </div>

        {/* Details */}
        <div>
          <label htmlFor="wc-details" style={labelStyle}>{w.detailsLabel}</label>
          <textarea id="wc-details" name="details" maxLength={1700} rows={4} style={{ ...inputStyle, resize: "vertical" }}
            onFocus={(e) => focusOn(e.currentTarget)} onBlur={(e) => focusOff(e.currentTarget)} />
        </div>

        {/* Name */}
        <div>
          <label htmlFor="wc-name" style={labelStyle}>{f.nameLabel}</label>
          <input id="wc-name" type="text" name="name" required minLength={2} maxLength={200} style={inputStyle}
            onFocus={(e) => focusOn(e.currentTarget)} onBlur={(e) => focusOff(e.currentTarget)} />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="wc-email" style={labelStyle}>{f.emailLabel}</label>
          <input id="wc-email" type="email" name="email" required style={inputStyle}
            onFocus={(e) => focusOn(e.currentTarget)} onBlur={(e) => focusOff(e.currentTarget)} />
        </div>

        {/* Consent */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "24px" }}>
          <input id="wc-consent" type="checkbox" name="consent" required checked={consentChecked}
            onChange={(e) => setConsentChecked(e.target.checked)} style={{ flexShrink: 0, marginTop: "3px", cursor: "pointer" }} />
          <label htmlFor="wc-consent" style={{ fontSize: "0.72rem", lineHeight: 1.75, color: "var(--text-muted)" }}>
            {f.consent}
          </label>
        </div>

        {formState === "error" && errorMessage && (
          <p style={{ fontSize: "0.85rem", color: "var(--error)", marginBottom: "16px" }}>{errorMessage}</p>
        )}

        <button type="submit" disabled={!consentChecked || formState === "submitting"}
          style={{
            display: "inline-block", fontFamily: "var(--font-mono)", fontSize: "0.72rem", fontWeight: 600,
            letterSpacing: "0.18em", textTransform: "uppercase", background: "transparent", color: "var(--accent)",
            border: "1px solid color-mix(in srgb, var(--accent) 50%, transparent)", borderRadius: "2px",
            padding: "15px 30px", cursor: (!consentChecked || formState === "submitting") ? "not-allowed" : "pointer",
            opacity: (!consentChecked || formState === "submitting") ? 0.45 : 1,
            transition: "background 0.25s, color 0.25s, border-color 0.25s",
          }}
          onMouseEnter={(e) => {
            if (consentChecked && formState !== "submitting") {
              const t = e.currentTarget as HTMLElement;
              t.style.background = "var(--accent)"; t.style.color = "var(--bg)"; t.style.borderColor = "var(--accent)";
            }
          }}
          onMouseLeave={(e) => {
            const t = e.currentTarget as HTMLElement;
            t.style.background = "transparent"; t.style.color = "var(--accent)"; t.style.borderColor = "color-mix(in srgb, var(--accent) 50%, transparent)";
          }}>
          {formState === "submitting" ? f.submitting : w.submit}
        </button>
      </form>

      {/* Mailto fallback */}
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)", letterSpacing: "0.18em", textTransform: "uppercase", marginTop: "32px" }}>
        {f.mailtoFallback}{" "}
        <a href={`mailto:${dict.contact.email}`} style={{ color: "var(--accent)", textDecoration: "underline" }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = "0.7")}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = "1")}>
          {dict.contact.email}
        </a>
      </p>
    </div>
  );
}
