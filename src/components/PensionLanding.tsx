"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import Reveal from "./Reveal";

const DEMO_URL = "https://demos.lechner-studios.at/pension";
const TIER_PRICES = ["€3.900", "€6.900", "€9.900"];
const TIER_CARE = ["€99", "€149", "€199"];

export default function PensionLanding() {
  const { dict, locale } = useLanguage();
  const d = dict.pensionLanding;
  const [pick, setPick] = useState<number | null>(null);
  const PROVISION = ["low", "mid", "high"];

  const contactHref =
    `/${locale}/contact?betreff=` +
    encodeURIComponent("Pension-Website") +
    (pick !== null ? `&provision=${PROVISION[pick]}` : "");

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

      {/* Live demo proof */}
      <section className="lc-pad-section" style={{ ...section, background: "var(--bg)" }}>
        <div style={wrap}>
          <Reveal>
            <h2 style={h2}>{d.demo.heading}</h2>
            <p style={body}>{d.demo.body}</p>
            <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" style={cta}>{d.demo.linkLabel}</a>
            <p style={{ ...body, fontFamily: "var(--font-mono)", fontSize: "0.72rem", marginTop: "14px" }}>{d.demo.note}</p>
          </Reveal>
        </div>
      </section>

      {/* Offer — 3 tiers */}
      <section className="lc-pad-section" style={{ ...section, background: "var(--bg-alt)" }}>
        <div style={wrap}>
          <Reveal>
            <h2 style={h2}>{d.offer.heading}</h2>
            <p style={{ ...body, marginBottom: "40px" }}>{d.offer.intro}</p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
            {d.offer.tiers.map((t, i) => (
              <Reveal key={t.name} delay={i * 80}>
                <div
                  style={{
                    border: t.badge ? "2px solid var(--accent)" : "1px solid var(--border)",
                    borderRadius: "4px",
                    padding: "28px 24px",
                    height: "100%",
                    background: "var(--bg)",
                  }}
                >
                  {t.badge && (
                    <span style={{ ...overline, color: "var(--accent)", marginBottom: "10px" }}>{t.badge}</span>
                  )}
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--text)", marginBottom: "6px" }}>{t.name}</h3>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "1.1rem", color: "var(--text)", marginBottom: "4px" }}>{TIER_PRICES[i]}</p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "16px" }}>+ {TIER_CARE[i]}/Monat</p>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.65 }}>{t.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p style={{ ...body, fontSize: "0.85rem", marginTop: "24px" }}>{d.offer.note}</p>
            <Link href={contactHref} style={cta}>{d.offer.ctaLabel}</Link>
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

      {/* Qualifier + CTA */}
      <section className="lc-pad-section" style={{ ...section, background: "var(--bg-alt)" }}>
        <div style={wrap}>
          <Reveal>
            <h2 style={h2}>{d.cta.heading}</h2>
            <p style={{ ...body, marginBottom: "28px" }}>{d.cta.body}</p>
            <p style={{ ...overline, color: "var(--text-muted)" }}>{d.qualifier.question}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", margin: "12px 0 8px" }}>
              {d.qualifier.options.map((opt, i) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setPick(i)}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    padding: "10px 16px",
                    borderRadius: "2px",
                    cursor: "pointer",
                    border: "1px solid var(--border)",
                    background: pick === i ? "var(--text)" : "transparent",
                    color: pick === i ? "var(--bg)" : "var(--text-muted)",
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
            <Link href={contactHref} style={cta}>{d.cta.button}</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
