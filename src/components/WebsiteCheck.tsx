"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import Reveal from "./Reveal";

// Price lives here, not in the shared dictionary, so the Layer-0 PII guard
// stays active over all site copy. This single offer component is exempted
// in .layer0-allow — the amount is intentional public marketing content.
const PRICE = "€290";

export default function WebsiteCheck() {
  const { dict, locale } = useLanguage();
  const d = dict.websiteCheck;

  const contactHref =
    `/${locale}/contact?betreff=` + encodeURIComponent("Website-Check");

  const wrap: React.CSSProperties = { maxWidth: "1100px", margin: "0 auto" };
  const section: React.CSSProperties = {
    padding: "96px 48px",
    borderTop: "1px solid var(--border)",
  };
  const overline: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: "0.62rem",
    fontWeight: 600,
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    color: "var(--accent)",
    marginBottom: "12px",
  };
  const h2: React.CSSProperties = {
    fontFamily: "var(--font-display)",
    fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
    fontWeight: 400,
    letterSpacing: "-0.02em",
    color: "var(--text)",
    marginBottom: "20px",
    maxWidth: "24ch",
  };
  const body: React.CSSProperties = {
    fontSize: "1.05rem",
    color: "var(--text-muted)",
    lineHeight: 1.75,
    maxWidth: "62ch",
  };
  const cta: React.CSSProperties = {
    display: "inline-block",
    marginTop: "28px",
    fontFamily: "var(--font-mono)",
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--bg)",
    background: "var(--text)",
    padding: "14px 24px",
    borderRadius: "2px",
    textDecoration: "none",
  };

  return (
    <>
      {/* Hero */}
      <section className="lc-pad-section" style={{ ...section, borderTop: "none", paddingTop: "120px", background: "var(--bg)" }}>
        <div style={wrap}>
          <Reveal>
            <p style={overline}>{d.hero.overline}</p>
            <h1 style={{ ...h2, fontSize: "clamp(2.2rem, 5vw, 3.6rem)", maxWidth: "18ch" }}>{d.hero.headline}</h1>
            <p style={{ ...body, fontSize: "1.15rem" }}>{d.hero.sub}</p>
            <Link href={contactHref} style={cta}>{d.hero.ctaLabel}</Link>
          </Reveal>
        </div>
      </section>

      {/* Value */}
      <section className="lc-pad-section" style={{ ...section, background: "var(--bg-alt)" }}>
        <div style={wrap}>
          <Reveal>
            <h2 style={h2}>{d.value.heading}</h2>
            <p style={body}>{d.value.body}</p>
            <p style={{ ...body, fontFamily: "var(--font-mono)", fontSize: "0.8rem", marginTop: "16px" }}>{d.value.note}</p>
          </Reveal>
        </div>
      </section>

      {/* Scope — four dimensions */}
      <section className="lc-pad-section" style={{ ...section, background: "var(--bg)" }}>
        <div style={wrap}>
          <Reveal>
            <h2 style={h2}>{d.scope.heading}</h2>
            <p style={{ ...body, marginBottom: "40px" }}>{d.scope.intro}</p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
            {d.scope.items.map((it, i) => (
              <Reveal key={it.h} delay={i * 70}>
                <div
                  style={{
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    padding: "28px 24px",
                    height: "100%",
                    background: "var(--bg-alt)",
                  }}
                >
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--accent)", marginBottom: "12px" }}>{String(i + 1).padStart(2, "0")}</p>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--text)", marginBottom: "10px", lineHeight: 1.25 }}>{it.h}</h3>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.65 }}>{it.p}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverable + fixed price */}
      <section className="lc-pad-section" style={{ ...section, background: "var(--bg-alt)" }}>
        <div style={wrap}>
          <Reveal>
            <h2 style={h2}>{d.deliverable.heading}</h2>
            <p style={{ ...body, marginBottom: "40px" }}>{d.deliverable.body}</p>
          </Reveal>
          <Reveal delay={80}>
            <div
              style={{
                border: "2px solid var(--accent)",
                borderRadius: "4px",
                padding: "32px 28px",
                background: "var(--bg)",
                maxWidth: "520px",
              }}
            >
              <p style={overline}>{d.offer.heading}</p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "2.6rem", fontWeight: 400, color: "var(--text)", lineHeight: 1, marginBottom: "4px" }}>{PRICE}</p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "20px" }}>{d.offer.priceNote}</p>
              <p style={{ fontSize: "0.95rem", color: "var(--text)", lineHeight: 1.65, marginBottom: "16px" }}>{d.offer.creditNote}</p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.6 }}>{d.offer.turnaround}</p>
              <Link href={contactHref} style={cta}>{d.offer.ctaLabel}</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="lc-pad-section" style={{ ...section, background: "var(--bg)" }}>
        <div style={wrap}>
          <Reveal>
            <h2 style={h2}>{d.faq.heading}</h2>
          </Reveal>
          <div style={{ maxWidth: "760px" }}>
            {d.faq.items.map((it, i) => (
              <Reveal key={it.q} delay={i * 60}>
                <details style={{ borderBottom: "1px solid var(--border)", padding: "18px 0" }}>
                  <summary style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", color: "var(--text)", cursor: "pointer" }}>{it.q}</summary>
                  <p style={{ ...body, marginTop: "12px" }}>{it.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p style={{ ...body, fontSize: "0.9rem", marginTop: "28px" }}>
              {d.more.lead}{" "}
              <Link href={`/${locale}/webdesign`} style={{ color: "var(--accent)" }}>{d.more.web}</Link>{" "}
              {d.more.and}{" "}
              <Link href={`/${locale}/seo`} style={{ color: "var(--accent)" }}>{d.more.seo}</Link>{d.more.tail}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="lc-pad-section" style={{ ...section, background: "var(--bg-alt)" }}>
        <div style={wrap}>
          <Reveal>
            <h2 style={h2}>{d.cta.heading}</h2>
            <p style={{ ...body, marginBottom: "28px" }}>{d.cta.body}</p>
            <Link href={contactHref} style={cta}>{d.cta.button}</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
