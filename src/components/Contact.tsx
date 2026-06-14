"use client";
import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

export default function Contact() {
  const { dict } = useLanguage();
  const d = dict.contact;
  const f = d.form;

  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorKey, setErrorKey] = useState<"validation" | "rate_limit" | "generic" | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("submitting");
    setErrorKey(null);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
      consent: formData.get("consent") === "on",
      _hp: String(formData.get("_hp") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setFormState("success");
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
    color: "#5B6168",
    marginBottom: "8px",
  };

  const inputStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(21,23,26,0.15)",
    padding: "12px 0",
    fontSize: "1rem",
    color: "#15171A",
    outline: "none",
    marginBottom: "24px",
  };

  const nameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const messageRef = React.useRef<HTMLTextAreaElement>(null);

  const errorMessage = errorKey
    ? errorKey === "validation"
      ? f.errorValidation
      : errorKey === "rate_limit"
      ? f.errorRateLimit
      : f.errorGeneric
    : null;

  return (
    <section
      id="contact"
      className="lc-pad-section"
      style={{
        background: "#F7F8F8",
        padding: "120px 48px",
        borderTop: "1px solid rgba(21,23,26,0.08)",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div className="lc-stack-2col" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px",
          alignItems: "end",
        }}>
          {/* Left */}
          <div>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.62rem",
              fontWeight: 600,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#254268",
              marginBottom: "2rem",
            }}>
              {d.overline}
            </p>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(3rem, 6vw, 5.5rem)",
              fontWeight: 300,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              color: "#15171A",
              marginBottom: "32px",
              fontStyle: "italic",
            }}>
              {d.headline}
            </h2>
            <p style={{
              fontSize: "0.95rem",
              color: "#5B6168",
              lineHeight: 1.8,
              maxWidth: "420px",
            }}>
              {d.body}
            </p>
          </div>

          {/* Right */}
          <div style={{ paddingBottom: "8px" }}>

            {/* Form area — replaced by success message on success */}
            {formState === "success" ? (
              <p style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "1.1rem",
                color: "#15171A",
                lineHeight: 1.7,
                marginBottom: "32px",
              }}>
                {f.success}
              </p>
            ) : (
              <form onSubmit={handleSubmit} noValidate style={{ marginBottom: "0" }}>
                {/* Honeypot */}
                <div
                  style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}
                  aria-hidden="true"
                >
                  <input
                    type="text"
                    name="_hp"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="contact-name" style={labelStyle}>{f.nameLabel}</label>
                  <input
                    id="contact-name"
                    ref={nameRef}
                    type="text"
                    name="name"
                    required
                    minLength={2}
                    maxLength={200}
                    style={inputStyle}
                    onFocus={() => { if (nameRef.current) nameRef.current.style.borderBottom = "1px solid #5B6168"; }}
                    onBlur={() => { if (nameRef.current) nameRef.current.style.borderBottom = "1px solid rgba(21,23,26,0.15)"; }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="contact-email" style={labelStyle}>{f.emailLabel}</label>
                  <input
                    id="contact-email"
                    ref={emailRef}
                    type="email"
                    name="email"
                    required
                    style={inputStyle}
                    onFocus={() => { if (emailRef.current) emailRef.current.style.borderBottom = "1px solid #5B6168"; }}
                    onBlur={() => { if (emailRef.current) emailRef.current.style.borderBottom = "1px solid rgba(21,23,26,0.15)"; }}
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" style={labelStyle}>{f.messageLabel}</label>
                  <textarea
                    id="contact-message"
                    ref={messageRef}
                    name="message"
                    required
                    minLength={20}
                    maxLength={5000}
                    rows={5}
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={() => { if (messageRef.current) messageRef.current.style.borderBottom = "1px solid #5B6168"; }}
                    onBlur={() => { if (messageRef.current) messageRef.current.style.borderBottom = "1px solid rgba(21,23,26,0.15)"; }}
                  />
                  <p style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.58rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#5B6168",
                    marginTop: "-16px",
                    marginBottom: "24px",
                  }}>
                    {f.messageHint}
                  </p>
                </div>

                {/* Consent */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "24px" }}>
                  <input
                    id="contact-consent"
                    type="checkbox"
                    name="consent"
                    required
                    checked={consentChecked}
                    onChange={e => setConsentChecked(e.target.checked)}
                    style={{ flexShrink: 0, marginTop: "3px", cursor: "pointer" }}
                  />
                  <label htmlFor="contact-consent" style={{
                    fontSize: "0.78rem",
                    lineHeight: 1.6,
                    color: "#5B6168",
                  }}>
                    {f.consent}
                  </label>
                </div>

                {/* Error message */}
                {formState === "error" && errorMessage && (
                  <p style={{
                    fontSize: "0.85rem",
                    color: "#8B2E2E",
                    marginBottom: "16px",
                  }}>
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
                    borderBottom: "1px solid rgba(21,23,26,0.15)",
                    color: "#15171A",
                    padding: "12px 0",
                    cursor: (!consentChecked || formState === "submitting") ? "not-allowed" : "pointer",
                    opacity: (!consentChecked || formState === "submitting") ? 0.45 : 1,
                    width: "100%",
                    textAlign: "left",
                  }}
                  onMouseEnter={e => {
                    if (consentChecked && formState !== "submitting") {
                      (e.currentTarget as HTMLElement).style.borderBottom = "1px solid #254268";
                    }
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderBottom = "1px solid rgba(21,23,26,0.15)";
                  }}
                  onFocus={e => {
                    if (consentChecked && formState !== "submitting") {
                      (e.currentTarget as HTMLElement).style.borderBottom = "1px solid #5B6168";
                    }
                  }}
                  onBlur={e => {
                    (e.currentTarget as HTMLElement).style.borderBottom = "1px solid rgba(21,23,26,0.15)";
                  }}
                >
                  {formState === "submitting" ? f.submitting : f.submit}
                </button>
              </form>
            )}

            {/* Mailto fallback — visible in idle/submitting/error states only */}
            {formState !== "success" && (
              <p style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                color: "#5B6168",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginTop: "32px",
                marginBottom: "32px",
              }}>
                {f.mailtoFallback}{" "}
                <a
                  href={`mailto:${d.email}`}
                  style={{ color: "#254268", textDecoration: "underline" }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = "#1B3252")}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = "#254268")}
                >
                  {d.email}
                </a>
              </p>
            )}

            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              color: "#5B6168",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: "40px",
            }}>
              {d.location}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
