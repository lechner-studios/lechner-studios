"use client";
import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const DRAFT_KEY = "ls-start-draft";

export default function StartProject() {
  const { dict, locale } = useLanguage();
  const s = dict.start;
  const f = dict.contact.form;

  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorKey, setErrorKey] = useState<"validation" | "rate_limit" | "generic" | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Restore a saved draft on mount so an accidental navigation away doesn't
  // wipe a partly-filled form. Inputs are uncontrolled, so we set their values
  // directly; consent is controlled, so it goes through state.
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
    setVal("name", draft.name); setVal("email", draft.email); setVal("company", draft.company);
    setVal("goal", draft.goal); setVal("timeline", draft.timeline); setVal("budget", draft.budget);
    setVal("currentSite", draft.currentSite); setVal("details", draft.details);
    const pts = Array.isArray(draft.projectType) ? (draft.projectType as string[]) : [];
    formEl.querySelectorAll('input[name="projectType"]').forEach((node) => {
      const cb = node as HTMLInputElement;
      cb.checked = pts.includes(cb.value);
    });
    if (draft.consent) setConsentChecked(true);
  }, []);

  // Persist the current form state on every change.
  function saveDraft() {
    const formEl = formRef.current;
    if (!formEl) return;
    const fd = new FormData(formEl);
    const draft = {
      name: fd.get("name") ?? "", email: fd.get("email") ?? "", company: fd.get("company") ?? "",
      projectType: fd.getAll("projectType").map(String),
      goal: fd.get("goal") ?? "", timeline: fd.get("timeline") ?? "", budget: fd.get("budget") ?? "",
      currentSite: fd.get("currentSite") ?? "", details: fd.get("details") ?? "",
      consent: fd.get("consent") === "on",
    };
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch { /* ignore quota/availability */ }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorKey(null);

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const company = String(formData.get("company") ?? "").trim();
    const projectTypes = formData.getAll("projectType").map((v) => String(v));
    const goal = String(formData.get("goal") ?? "").trim();
    const timelineKey = String(formData.get("timeline") ?? "");
    const budgetKey = String(formData.get("budget") ?? "");
    const currentSite = String(formData.get("currentSite") ?? "").trim();
    const details = String(formData.get("details") ?? "").trim();
    const consent = formData.get("consent") === "on";
    const hp = String(formData.get("_hp") ?? "");

    // Client-side gate — mirrors the API validation plus the intake requirements.
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (
      name.length < 2 ||
      !emailValid ||
      projectTypes.length < 1 ||
      goal.length < 20 ||
      !consent
    ) {
      setFormState("error");
      setErrorKey("validation");
      return;
    }

    setFormState("submitting");

    // Compose a single, human-readable message body from the answered fields.
    // Name/email are intentionally omitted — the API prepends them already.
    const projectTypeLabels = projectTypes
      .map((k) => (s.projectType as Record<string, string>)[k] ?? k)
      .join(", ");
    const timelineLabel = timelineKey
      ? (s.timeline as Record<string, string>)[timelineKey] ?? timelineKey
      : "";
    const budgetLabel = budgetKey
      ? (s.budget as Record<string, string>)[budgetKey] ?? budgetKey
      : "";

    const lines: string[] = [];
    if (company) lines.push(`${s.companyLabel}: ${company}`);
    lines.push(`${s.projectTypeLabel}: ${projectTypeLabels}`);
    lines.push(`${s.goalLabel}\n${goal}`);
    if (timelineLabel) lines.push(`${s.timelineLabel}: ${timelineLabel}`);
    if (budgetLabel) lines.push(`${s.budgetLabel}: ${budgetLabel}`);
    if (currentSite) lines.push(`${s.currentSiteLabel}: ${currentSite}`);
    if (details) lines.push(`${s.detailsLabel}\n${details}`);

    const message = lines.join("\n\n");
    const subject = (locale === "de" ? "Projektanfrage: " : "Project enquiry: ") + name;

    const payload = { name, email, message, consent, _hp: hp, subject };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setFormState("success");
        try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
      } else if (response.status === 429) {
        setFormState("error");
        setErrorKey("rate_limit");
      } else if (response.status === 400) {
        setFormState("error");
        setErrorKey("validation");
      } else {
        setFormState("error");
        setErrorKey("generic");
      }
    } catch {
      setFormState("error");
      setErrorKey("generic");
    }
  }

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "var(--font-mono)",
    fontSize: "0.6rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    color: "var(--text-muted)",
    marginBottom: "8px",
  };

  const inputStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid var(--border-strong)",
    padding: "12px 0",
    fontSize: "1rem",
    color: "var(--text)",
    outline: "none",
    marginBottom: "24px",
  };

  // Native select styled to fit the underline-input language.
  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    cursor: "pointer",
  };

  const focusOn = (el: HTMLElement | null) => {
    if (el) el.style.borderBottom = "1px solid var(--text-muted)";
  };
  const focusOff = (el: HTMLElement | null) => {
    if (el) el.style.borderBottom = "1px solid var(--border-strong)";
  };

  const errorMessage = errorKey
    ? errorKey === "validation"
      ? f.errorValidation
      : errorKey === "rate_limit"
      ? f.errorRateLimit
      : f.errorGeneric
    : null;

  const projectTypeKeys = ["web", "apps", "seo", "brand", "unsure"] as const;

  if (formState === "success") {
    return (
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "1.1rem",
          color: "var(--text)",
          lineHeight: 1.7,
          maxWidth: "560px",
        }}
      >
        {f.success}
      </p>
    );
  }

  return (
    <div style={{ maxWidth: "640px" }}>
      <form ref={formRef} onSubmit={handleSubmit} onChange={saveDraft} noValidate>
        {/* Honeypot */}
        <div
          style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}
          aria-hidden="true"
        >
          <input type="text" name="_hp" tabIndex={-1} autoComplete="off" />
        </div>

        {/* Name */}
        <div>
          <label htmlFor="start-name" style={labelStyle}>{s.nameLabel}</label>
          <input
            id="start-name"
            type="text"
            name="name"
            required
            minLength={2}
            maxLength={200}
            style={inputStyle}
            onFocus={(e) => focusOn(e.currentTarget)}
            onBlur={(e) => focusOff(e.currentTarget)}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="start-email" style={labelStyle}>{s.emailLabel}</label>
          <input
            id="start-email"
            type="email"
            name="email"
            required
            style={inputStyle}
            onFocus={(e) => focusOn(e.currentTarget)}
            onBlur={(e) => focusOff(e.currentTarget)}
          />
        </div>

        {/* Company */}
        <div>
          <label htmlFor="start-company" style={labelStyle}>{s.companyLabel}</label>
          <input
            id="start-company"
            type="text"
            name="company"
            maxLength={200}
            style={inputStyle}
            onFocus={(e) => focusOn(e.currentTarget)}
            onBlur={(e) => focusOff(e.currentTarget)}
          />
        </div>

        {/* Project type — checkboxes */}
        <div style={{ marginBottom: "24px" }}>
          <span style={labelStyle}>{s.projectTypeLabel}</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "4px" }}>
            {projectTypeKeys.map((key) => (
              <div key={key} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <input
                  id={`start-pt-${key}`}
                  type="checkbox"
                  name="projectType"
                  value={key}
                  style={{ flexShrink: 0, marginTop: "3px", cursor: "pointer" }}
                />
                <label
                  htmlFor={`start-pt-${key}`}
                  style={{ fontSize: "0.92rem", lineHeight: 1.5, color: "var(--text)", cursor: "pointer" }}
                >
                  {s.projectType[key]}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Goal */}
        <div>
          <label htmlFor="start-goal" style={labelStyle}>{s.goalLabel}</label>
          <textarea
            id="start-goal"
            name="goal"
            required
            minLength={20}
            maxLength={1700}
            rows={4}
            style={{ ...inputStyle, resize: "vertical" }}
            onFocus={(e) => focusOn(e.currentTarget)}
            onBlur={(e) => focusOff(e.currentTarget)}
          />
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.58rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginTop: "-16px",
              marginBottom: "24px",
            }}
          >
            {f.messageHint}
          </p>
        </div>

        {/* Timeline */}
        <div>
          <label htmlFor="start-timeline" style={labelStyle}>{s.timelineLabel}</label>
          <select
            id="start-timeline"
            name="timeline"
            defaultValue=""
            style={selectStyle}
            onFocus={(e) => focusOn(e.currentTarget)}
            onBlur={(e) => focusOff(e.currentTarget)}
          >
            <option value=""></option>
            {(["asap", "q1_3", "q3_6", "flexible"] as const).map((k) => (
              <option key={k} value={k}>{s.timeline[k]}</option>
            ))}
          </select>
        </div>

        {/* Budget */}
        <div>
          <label htmlFor="start-budget" style={labelStyle}>{s.budgetLabel}</label>
          <select
            id="start-budget"
            name="budget"
            defaultValue=""
            style={selectStyle}
            onFocus={(e) => focusOn(e.currentTarget)}
            onBlur={(e) => focusOff(e.currentTarget)}
          >
            <option value=""></option>
            {(["unsure", "low", "mid", "high"] as const).map((k) => (
              <option key={k} value={k}>{s.budget[k]}</option>
            ))}
          </select>
        </div>

        {/* Current site */}
        <div>
          <label htmlFor="start-currentSite" style={labelStyle}>{s.currentSiteLabel}</label>
          <input
            id="start-currentSite"
            type="text"
            name="currentSite"
            maxLength={300}
            style={inputStyle}
            onFocus={(e) => focusOn(e.currentTarget)}
            onBlur={(e) => focusOff(e.currentTarget)}
          />
        </div>

        {/* Details */}
        <div>
          <label htmlFor="start-details" style={labelStyle}>{s.detailsLabel}</label>
          <textarea
            id="start-details"
            name="details"
            maxLength={1700}
            rows={4}
            style={{ ...inputStyle, resize: "vertical" }}
            onFocus={(e) => focusOn(e.currentTarget)}
            onBlur={(e) => focusOff(e.currentTarget)}
          />
        </div>

        {/* Consent */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "24px" }}>
          <input
            id="start-consent"
            type="checkbox"
            name="consent"
            required
            checked={consentChecked}
            onChange={(e) => setConsentChecked(e.target.checked)}
            style={{ flexShrink: 0, marginTop: "3px", cursor: "pointer" }}
          />
          <label
            htmlFor="start-consent"
            style={{ fontSize: "0.78rem", lineHeight: 1.6, color: "var(--text-muted)" }}
          >
            {f.consent}
          </label>
        </div>

        {/* Error message */}
        {formState === "error" && errorMessage && (
          <p style={{ fontSize: "0.85rem", color: "#8B2E2E", marginBottom: "16px" }}>
            {errorMessage}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!consentChecked || formState === "submitting"}
          style={{
            display: "block",
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(1.1rem, 1.6vw, 1.4rem)",
            background: "transparent",
            border: "none",
            borderBottom: "1px solid var(--border-strong)",
            color: "var(--text)",
            padding: "12px 0",
            cursor: (!consentChecked || formState === "submitting") ? "not-allowed" : "pointer",
            opacity: (!consentChecked || formState === "submitting") ? 0.45 : 1,
            width: "100%",
            textAlign: "left",
          }}
          onMouseEnter={(e) => {
            if (consentChecked && formState !== "submitting") {
              (e.currentTarget as HTMLElement).style.borderBottom = "1px solid var(--accent)";
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderBottom = "1px solid var(--border-strong)";
          }}
          onFocus={(e) => {
            if (consentChecked && formState !== "submitting") {
              (e.currentTarget as HTMLElement).style.borderBottom = "1px solid var(--text-muted)";
            }
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLElement).style.borderBottom = "1px solid var(--border-strong)";
          }}
        >
          {formState === "submitting" ? f.submitting : s.submit}
        </button>
      </form>

      {/* Mailto fallback */}
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          color: "var(--text-muted)",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          marginTop: "32px",
        }}
      >
        {f.mailtoFallback}{" "}
        <a
          href={`mailto:${dict.contact.email}`}
          style={{ color: "var(--accent)", textDecoration: "underline" }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = "0.7")}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = "1")}
        >
          {dict.contact.email}
        </a>
      </p>
    </div>
  );
}
