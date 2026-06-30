"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

// Pillar hues + page slugs, indexed to match dict.services.items grid order
// (TL, TR, BL, BR): Apps(sky) · Web(stone) / Identity(lake) · SEO(pine).
const PILLAR_HUES = ["#8FA8C5", "#D6CDBE", "#254268", "#5E8263"]; // sky, stone, lake, pine
const PILLAR_SLUGS: (string | null)[] = ["apps-automation", "webdesign", "brand", "seo"];

export default function Hero() {
  const { dict, locale } = useLanguage();
  const lines = dict.hero.tagline.split("\n");
  const [active, setActive] = useState<number | null>(null);

  const pillars = dict.services.items.map((it, i) => ({
    label: it.title,
    hue: PILLAR_HUES[i] ?? PILLAR_HUES[0],
    slug: PILLAR_SLUGS[i],
    proof: dict.hero.pillars.proofs[i] ?? "",
  }));

  const chipBase: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "9px",
    fontFamily: "var(--font-mono)",
    fontSize: "0.62rem",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    background: "none",
    padding: "7px 0",
    cursor: "pointer",
    textDecoration: "none",
    transition: "color 0.2s, border-color 0.2s",
  };

  return (
    <section
      className="grain lc-pad-hero"
      style={{
        position: "relative",
        background: "var(--hero-bg)",
        display: "flex",
        flexDirection: "column",
        padding: "150px 48px 110px",
        overflow: "hidden",
      }}
    >
      {/* Editorial column grid — faint vertical hairlines for structure. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ borderRight: i < 3 ? "1px solid var(--hero-border)" : "none" }} />
        ))}
      </div>

      <div
        className="lc-stack-2col"
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: "1200px",
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: "56px",
          alignItems: "center",
        }}
      >
        {/* LEFT: overline + headline + rule + pillar chips + CTAs */}
        <div>
          <p
            className="reveal reveal-1"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              fontWeight: 500,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "var(--hero-accent)",
              marginBottom: "2rem",
            }}
          >
            {dict.hero.overline}
          </p>

          {/* Wordmark — masked, line-by-line rise */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.6rem, 6vw, 5.25rem)",
              fontWeight: 300,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "var(--hero-text)",
              marginBottom: "2.5rem",
            }}
          >
            {lines.map((ln, i) => (
              <span key={i} className="hero-line-mask">
                <span className="hero-line-inner" style={{ animationDelay: `${0.2 + i * 0.13}s` }}>
                  {ln}
                </span>
              </span>
            ))}
          </h1>

          {/* Accent rule */}
          <div
            className="hero-rule"
            style={{ width: "56px", height: "1px", background: "var(--hero-accent)", animationDelay: "0.62s" }}
          />

          {/* Pillar chips — hover/focus morphs the panel; the ones with a page
              link there, Brand & Identity (no page) is a preview-only button. */}
          <div
            className="reveal"
            role="list"
            aria-label={dict.hero.pillars.eyebrow}
            onMouseLeave={() => setActive(null)}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "22px",
              marginTop: "2.5rem",
              animationDelay: "0.8s",
            }}
          >
            {pillars.map((p, i) => {
              const isActive = active === i;
              const style: React.CSSProperties = {
                ...chipBase,
                color: isActive ? "var(--hero-text)" : "var(--hero-text-muted)",
                borderBottom: `2px solid ${isActive ? p.hue : "transparent"}`,
              };
              const inner = (
                <>
                  <span
                    aria-hidden="true"
                    style={{ width: "11px", height: "11px", borderRadius: "3px", background: p.hue, flexShrink: 0, boxSizing: "border-box", border: "1px solid var(--hero-border)", boxShadow: isActive ? `0 0 0 3px color-mix(in srgb, ${p.hue} 28%, transparent), 0 2px 6px -1px rgba(16,18,22,0.3)` : "0 2px 6px -1px rgba(16,18,22,0.3)", transition: "box-shadow 0.2s" }}
                  />
                  {p.label}
                </>
              );
              const handlers = {
                onMouseEnter: () => setActive(i),
                onFocus: () => setActive(i),
              };
              return p.slug ? (
                <Link key={i} role="listitem" href={`/${locale}/${p.slug}`} style={style} {...handlers}>
                  {inner}
                </Link>
              ) : (
                <button key={i} role="listitem" type="button" style={{ ...style, border: "none", borderBottom: style.borderBottom }} onClick={() => setActive(i)} {...handlers}>
                  {inner}
                </button>
              );
            })}
          </div>

          {/* CTAs + location */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2rem", marginTop: "2.5rem" }}>
            <div className="reveal" style={{ display: "flex", alignItems: "center", gap: "28px", flexWrap: "wrap", animationDelay: "0.92s" }}>
              <a
                href={`/${locale}/start`}
                style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.18em",
                  textTransform: "uppercase", color: "var(--hero-accent)",
                  border: "1px solid color-mix(in srgb, var(--hero-accent) 50%, transparent)", borderRadius: "2px",
                  padding: "14px 26px", textDecoration: "none", transition: "background 0.25s, color 0.25s, border-color 0.25s",
                }}
                onMouseEnter={(e) => { const t = e.currentTarget as HTMLElement; t.style.background = "var(--hero-accent)"; t.style.color = "var(--hero-accent-text)"; t.style.borderColor = "var(--hero-accent)"; }}
                onMouseLeave={(e) => { const t = e.currentTarget as HTMLElement; t.style.background = "transparent"; t.style.color = "var(--hero-accent)"; t.style.borderColor = "color-mix(in srgb, var(--hero-accent) 50%, transparent)"; }}
              >
                {dict.hero.ctaPrimary} →
              </a>
              <a
                href={`/${locale}/work`}
                style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.18em",
                  textTransform: "uppercase", color: "var(--hero-text-muted)", textDecoration: "none",
                  borderBottom: "1px solid var(--hero-border)", paddingBottom: "3px", transition: "color 0.25s, border-color 0.25s",
                }}
                onMouseEnter={(e) => { const t = e.currentTarget as HTMLElement; t.style.color = "var(--hero-text)"; t.style.borderColor = "var(--hero-accent)"; }}
                onMouseLeave={(e) => { const t = e.currentTarget as HTMLElement; t.style.color = "var(--hero-text-muted)"; t.style.borderColor = "var(--hero-border)"; }}
              >
                {dict.hero.ctaSecondary}
              </a>
            </div>

            <p
              className="reveal"
              style={{
                fontFamily: "var(--font-mono)", fontSize: "0.62rem", fontWeight: 500, letterSpacing: "0.28em",
                textTransform: "uppercase", color: "var(--hero-text-faint)", animationDelay: "1.05s",
              }}
            >
              {dict.hero.location}
            </p>
          </div>
        </div>

        {/* RIGHT: live pillar panel — morphs as a chip is hovered/focused */}
        <div className="reveal" style={{ display: "flex", justifyContent: "flex-end", animationDelay: "0.9s" }}>
          <div
            aria-hidden="true"
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "440px",
              minHeight: "clamp(240px, 28vw, 300px)",
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              padding: "34px 36px 34px 40px",
              boxShadow: "0 36px 72px -34px rgba(16,18,22,0.5)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {/* decorative colour bar — takes the active pillar's hue */}
            <div
              style={{
                position: "absolute", top: 0, bottom: 0, left: 0, width: "6px",
                background: active === null ? "var(--border)" : pillars[active].hue,
                transition: "background 0.3s ease",
              }}
            />

            {active === null ? (
              <>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  {dict.hero.pillars.eyebrow}
                </span>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 2.4vw, 1.75rem)", fontWeight: 400, lineHeight: 1.2, color: "var(--text)", margin: "16px 0 0" }}>
                  {dict.hero.pillars.rest}
                </p>
                {/* palette strip — the four hues at rest */}
                <div style={{ display: "flex", gap: "7px", marginTop: "22px" }}>
                  {pillars.map((p, i) => (
                    <span key={i} style={{ width: "26px", height: "8px", borderRadius: "2px", background: p.hue, border: "1px solid var(--border)", boxSizing: "border-box", boxShadow: "0 2px 6px -1px rgba(16,18,22,0.28)" }} />
                  ))}
                </div>
              </>
            ) : (
              <>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  {`0${active + 1} / 0${pillars.length}`}
                </span>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.9rem, 3.2vw, 2.5rem)", fontWeight: 400, lineHeight: 1.05, color: "var(--text)", margin: "12px 0 14px" }}>
                  {pillars[active].label}
                </h2>
                <div style={{ width: "34px", height: "2px", background: pillars[active].hue, marginBottom: "16px" }} />
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", lineHeight: 1.7, letterSpacing: "0.01em", color: "var(--text-muted)", margin: 0 }}>
                  {pillars[active].proof}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
