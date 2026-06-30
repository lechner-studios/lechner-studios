"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import Reveal from "./Reveal";
import Overline from "./Overline";

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  live:    { bg: "rgba(61,74,58,0.12)", color: "#3D4A3A" },
  service: { bg: "rgba(154,160,166,0.15)", color: "#5B6168" },
  dev:     { bg: "rgba(21,23,26,0.07)", color: "#5B6168" },
  paused:  { bg: "rgba(138,144,152,0.1)", color: "#5B6168" },
  planned: { bg: "rgba(138,144,152,0.07)", color: "#5B6168" },
  maintenance: { bg: "rgba(143,168,197,0.14)", color: "#5B6168" },
  comingSoon: { bg: "rgba(143,168,197,0.12)", color: "#5B6168" },
};

const STATUS_LABEL_MAP: Record<string, keyof ReturnType<typeof useLanguage>["dict"]["work"]> = {
  live:    "statusLive",
  dev:     "statusDev",
  paused:  "statusPaused",
  planned: "statusPlanned",
  service: "statusService",
  maintenance: "statusMaintenance",
  comingSoon: "statusComingSoon",
};

// Werk's live demos — rendered inline under the Werk entry as its portfolio,
// so the website work has one home (here) instead of a duplicate hero strip.
const WERK_DEMOS = [
  { slug: "pension", label: "Pension" },
  { slug: "gasthof", label: "Gasthof" },
  { slug: "skischule", label: "Skischule" },
  { slug: "tischlerei", label: "Tischlerei" },
];

// CodeFlash sample cards — rendered inline under the CodeFlash entry. CodeFlash
// IS a flashcards product, so the honest "sample" is real rendered cards (no
// faked screenshot): a topic, the question (front) and the answer (back),
// spanning the product's range — HTML & Git to OWASP & low-level systems.
const CODEFLASH_CARDS = [
  { topic: "Git", hue: "#254268", q: "merge vs. rebase?", a: "merge preserves history; rebase replays commits into one linear line." },
  { topic: "HTML", hue: "#8FA8C5", q: "What is the box model?", a: "content → padding → border → margin." },
  { topic: "OWASP", hue: "#5E8263", q: "How does a CSRF token defend?", a: "a per-session secret a forged cross-site request can’t supply." },
  { topic: "Big-O", hue: "#D6CDBE", q: "Binary search complexity?", a: "O(log n) — it halves the search space each step." },
];

export default function Work({ limit, moreHref, featured }: { limit?: number; moreHref?: string; featured?: string[] }) {
  const { dict } = useLanguage();
  const d = dict.work;
  const [hovered, setHovered] = useState<string | null>(null);
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  // Only surface genuinely live/active work — no dead "coming soon / in maintenance"
  // rows linking to "#". Hidden items stay in the dict and reappear once their
  // status flips to live/service and they get a real URL.
  const ACTIVE_STATUSES = new Set(["live", "service"]);
  const activeItems = d.items.filter((it) => ACTIVE_STATUSES.has(it.status));
  const items =
    featured && featured.length > 0
      ? featured
          .map((id) => activeItems.find((it) => it.id === id))
          .filter((it): it is (typeof d.items)[number] => Boolean(it))
      : typeof limit === "number"
        ? activeItems.slice(0, limit)
        : activeItems;

  return (
    <section
      id="work"
      className="lc-pad-section"
      style={{
        background: "var(--bg-alt)",
        padding: "120px 48px",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header */}
        <Reveal>
        <div className="lc-work-header" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "64px",
          paddingBottom: "32px",
          borderBottom: "1px solid var(--border)",
        }}>
          <div>
            <Overline marginBottom="12px">
              {d.overline}
            </Overline>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 3vw, 2.8rem)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "var(--text)",
            }}>
              {d.headline}
            </h2>
          </div>
        </div>
        </Reveal>

        {/* Lead — products-as-proof framing */}
        <Reveal delay={80}>
        <p style={{
          fontSize: "1.05rem",
          color: "var(--text-muted)",
          lineHeight: 1.75,
          maxWidth: "62ch",
          marginTop: "-32px",
          marginBottom: "56px",
        }}>
          {d.lead}
        </p>
        </Reveal>

        {/* Project list */}
        <div>
          {items.map((item, i) => {
            const isHovered = hovered === item.id;
            const statusStyle = STATUS_STYLES[item.status] || STATUS_STYLES.planned;
            const statusLabel = d[STATUS_LABEL_MAP[item.status] as keyof typeof d] as string;
            const isClickable = item.url !== "#";
            const isWerk = item.id === "websites";
            const isCodeflash = item.id === "codeflash";
            const hasExtra = isWerk || isCodeflash;

            const card = (
              <a
                href={isClickable ? item.url : undefined}
                target={isClickable ? "_blank" : undefined}
                rel="noopener noreferrer"
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                className="lc-work-item"
                style={{
                  display: "grid",
                  gridTemplateColumns: "48px 1fr auto",
                  gap: "32px",
                  alignItems: "start",
                  padding: "32px 0",
                  borderBottom: hasExtra ? "none" : "1px solid var(--border)",
                  textDecoration: "none",
                  cursor: isClickable ? "pointer" : "default",
                  transition: "background 0.2s, transform 0.2s",
                  background: isHovered && isClickable ? "color-mix(in srgb, var(--text) 4%, transparent)" : "transparent",
                  transform: isHovered && isClickable ? "translateX(6px)" : "translateX(0)",
                  margin: "0 -24px",
                  paddingLeft: "24px",
                  paddingRight: "24px",
                  borderRadius: "2px",
                }}
              >
                {/* Index */}
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  color: "var(--accent)",
                  fontWeight: 400,
                  paddingTop: "4px",
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Content */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "8px", flexWrap: "wrap" }}>
                    <h3 style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.7rem",
                      fontWeight: 400,
                      letterSpacing: "-0.01em",
                      color: "var(--text)",
                      transition: "color 0.2s",
                    }}>
                      {item.title}
                    </h3>
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6rem",
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      padding: "3px 10px",
                      borderRadius: "2px",
                      ...statusStyle,
                    }}>
                      {statusLabel}
                    </span>
                  </div>
                  <p style={{
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                    lineHeight: 1.7,
                    maxWidth: "600px",
                  }}>
                    {item.desc}
                  </p>
                </div>

                {/* Meta */}
                <div className="lc-work-meta" style={{ textAlign: "right", paddingTop: "4px", flexShrink: 0 }}>
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                    color: "var(--text-muted)",
                    letterSpacing: "0.15em",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}>
                    {item.category}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                    color: "var(--text-muted)",
                    letterSpacing: "0.1em",
                    marginBottom: "12px",
                  }}>
                    {item.year}
                  </div>
                  {isClickable && (
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      color: "var(--accent)",
                      letterSpacing: "0.08em",
                      opacity: isHovered ? 1 : 0,
                      transition: "opacity 0.2s",
                    }}>
                      {d.visit}
                    </span>
                  )}
                </div>
              </a>
            );

            return (
              <Reveal key={item.id} delay={i * 70}>
                {hasExtra ? (
                  <div style={{ borderBottom: "1px solid var(--border)" }}>
                    {card}
                    {/* Inline portfolio under the entry — Werk demos or CodeFlash sample cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: "32px", paddingBottom: "32px" }}>
                      <span aria-hidden="true" />
                      <div>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-faint)", marginBottom: "14px" }}>
                          {isWerk ? dict.demos.overline : d.sampleCards}
                        </p>
                        {isWerk ? (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" }}>
                            {WERK_DEMOS.map((dm) => (
                              <a
                                key={dm.slug}
                                href={`https://demos.lechner-studios.at/${dm.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hero-proof-card"
                                style={{ display: "block", textDecoration: "none" }}
                              >
                                <div style={{ position: "relative", aspectRatio: "16 / 11", borderRadius: "3px", overflow: "hidden", border: "1px solid var(--border)", backgroundImage: `url(/proof/${dm.slug}.webp)`, backgroundSize: "cover", backgroundPosition: "top center" }}>
                                  <span style={{ position: "absolute", top: "7px", left: "7px", fontFamily: "var(--font-mono)", fontSize: "0.48rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff", background: "rgba(21,23,26,0.66)", padding: "2px 7px", borderRadius: "2px" }}>
                                    {dict.demos.conceptLabel}
                                  </span>
                                </div>
                                <span style={{ display: "block", fontFamily: "var(--font-display)", fontSize: "0.95rem", color: "var(--text)", marginTop: "8px" }}>
                                  {dm.label}
                                </span>
                              </a>
                            ))}
                          </div>
                        ) : (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "12px" }}>
                            {CODEFLASH_CARDS.map((cf) => {
                              const isFlipped = !!flipped[cf.topic];
                              const topicChip = (
                                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)" }}>
                                  {cf.topic}
                                </span>
                              );
                              const hint = (label: string) => (
                                <span style={{ marginTop: "auto", paddingTop: "10px", fontFamily: "var(--font-mono)", fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-faint)" }}>
                                  {label} ↺
                                </span>
                              );
                              return (
                                <button
                                  key={cf.topic}
                                  type="button"
                                  className="cf-flip hero-proof-card"
                                  data-flipped={isFlipped ? "true" : "false"}
                                  aria-pressed={isFlipped}
                                  style={{ "--cf-accent": cf.hue } as React.CSSProperties}
                                  onClick={() => setFlipped((f) => ({ ...f, [cf.topic]: !f[cf.topic] }))}
                                >
                                  <span className="cf-inner">
                                    {/* FRONT — the question */}
                                    <span className="cf-face cf-front">
                                      {topicChip}
                                      <span style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", lineHeight: 1.25, color: "var(--text)" }}>
                                        {cf.q}
                                      </span>
                                      {hint(d.flipFront)}
                                    </span>
                                    {/* BACK — the answer */}
                                    <span className="cf-face cf-back">
                                      {topicChip}
                                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.66rem", lineHeight: 1.55, color: "var(--text-muted)" }}>
                                        {cf.a}
                                      </span>
                                      {hint(d.flipBack)}
                                    </span>
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : card}
              </Reveal>
            );
          })}
        </div>

        {moreHref && (
          <Link
            href={moreHref}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--accent)",
              textDecoration: "none",
              display: "inline-block",
              marginTop: "48px",
              transition: "color 0.2s, opacity 0.2s",
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = "0.7")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            {d.viewAll}
          </Link>
        )}
      </div>
    </section>
  );
}
