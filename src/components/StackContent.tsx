"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import Reveal from "./Reveal";
import Overline from "./Overline";

// "Stack & Philosophy" — the deep version of the Stance section's one-line
// claim. Every statement here is provable from the codebase (self-hosted fonts,
// zero third-party requests, hand-written token CSS, no builder). Layout is
// typographic only: hairline rules + hierarchy, no icon-tile grid / gradient /
// numbered-step connector (surface-audit A1).

const sectionBase: React.CSSProperties = {
  padding: "112px 48px",
  borderTop: "1px solid var(--border)",
};
const inner: React.CSSProperties = { maxWidth: "1100px", margin: "0 auto" };
const display = "var(--font-display)";
const mono = "var(--font-mono)";

export default function StackContent() {
  const { dict, locale } = useLanguage();
  const d = dict.stack;
  const blog = `/${locale}/blog`;

  return (
    <>
      {/* Hero */}
      <section className="lc-pad-section" style={{ ...sectionBase, background: "var(--bg)", paddingTop: "148px" }}>
        <div style={inner}>
          <Reveal>
            <Overline marginBottom="20px">{d.overline}</Overline>
          </Reveal>
          <Reveal delay={80}>
            <h1
              style={{
                fontFamily: display,
                fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                lineHeight: 1.04,
                color: "var(--text)",
                maxWidth: "16ch",
                marginBottom: "28px",
              }}
            >
              {d.headline}
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p style={{ fontSize: "1.15rem", lineHeight: 1.75, color: "var(--text-muted)", maxWidth: "60ch" }}>
              {d.intro}
            </p>
          </Reveal>
        </div>
      </section>

      {/* The stack — name + why, hairline-separated rows */}
      <section className="lc-pad-section" style={{ ...sectionBase, background: "var(--bg-alt)" }}>
        <div style={inner}>
          <Reveal>
            <Overline marginBottom="40px">{d.stackOverline}</Overline>
          </Reveal>
          <div>
            {d.items.map((it, i) => (
              <Reveal key={it.name} delay={i * 60}>
                <div
                  className="lc-stack-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(180px, 240px) 1fr",
                    gap: "32px",
                    alignItems: "baseline",
                    padding: "26px 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <span style={{ fontFamily: mono, fontSize: "0.9rem", fontWeight: 500, letterSpacing: "0.01em", color: "var(--text)" }}>
                    {it.name}
                  </span>
                  <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--text-muted)" }}>{it.why}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="lc-pad-section" style={{ ...sectionBase, background: "var(--bg)" }}>
        <div style={inner}>
          <Reveal>
            <Overline marginBottom="40px">{d.principlesOverline}</Overline>
          </Reveal>
          <div
            className="lc-stack-2col"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px 64px" }}
          >
            {d.principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 60}>
                <div>
                  <h2
                    style={{
                      fontFamily: display,
                      fontSize: "1.5rem",
                      fontWeight: 400,
                      letterSpacing: "-0.01em",
                      color: "var(--text)",
                      marginBottom: "12px",
                    }}
                  >
                    {p.title}
                  </h2>
                  <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--text-muted)" }}>{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why not a builder — with the two blog posts as proof */}
      <section className="lc-pad-section" style={{ ...sectionBase, background: "var(--bg-alt)" }}>
        <div style={{ ...inner, maxWidth: "760px" }}>
          <Reveal>
            <h2
              style={{
                fontFamily: display,
                fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                color: "var(--text)",
                marginBottom: "20px",
              }}
            >
              {d.buildersTitle}
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p style={{ fontSize: "1.1rem", lineHeight: 1.75, color: "var(--text-muted)", marginBottom: "24px" }}>
              {d.buildersBody}
            </p>
          </Reveal>
          <Reveal delay={140}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 28px" }}>
              <Link href={`${blog}/custom-website-vs-website-builder`} style={proofLink}>
                {d.buildersLink1} →
              </Link>
              <Link href={`${blog}/website-without-page-builder`} style={proofLink}>
                {d.buildersLink2} →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="lc-pad-section" style={{ ...sectionBase, background: "var(--bg)" }}>
        <div style={{ ...inner, display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "20px" }}>
          <Reveal>
            <span style={{ fontFamily: display, fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 400, letterSpacing: "-0.01em", color: "var(--text)" }}>
              {d.ctaText}
            </span>
          </Reveal>
          <Reveal delay={80}>
            <Link
              href={`/${locale}/start`}
              style={{
                fontFamily: mono,
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--accent)",
                textDecoration: "none",
                borderBottom: "1px solid color-mix(in srgb, var(--accent) 40%, transparent)",
                paddingBottom: "3px",
              }}
            >
              {d.ctaLabel} →
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

const proofLink: React.CSSProperties = {
  fontFamily: mono,
  fontSize: "0.8rem",
  fontWeight: 600,
  letterSpacing: "0.04em",
  color: "var(--accent)",
  textDecoration: "none",
  borderBottom: "1px solid color-mix(in srgb, var(--accent) 35%, transparent)",
  paddingBottom: "2px",
};
