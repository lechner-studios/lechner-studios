"use client";
import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import Reveal from "./Reveal";
import Overline from "./Overline";

const DEMOS_BASE = "https://demos.lechner-studios.at";
// Gate: the demos are owner-deployed to demos.lechner-studios.at out-of-band.
// Until they're live, this section renders nothing so no dead links ship.
// Flip by setting NEXT_PUBLIC_DEMOS_LIVE=true after the Vercel deploy + DNS.
const DEMOS_LIVE = process.env.NEXT_PUBLIC_DEMOS_LIVE === "true";

export default function DemoShowcase() {
  const { dict } = useLanguage();
  const d = dict.demos;
  const [hovered, setHovered] = useState<string | null>(null);

  if (!DEMOS_LIVE) return null;

  return (
    <section
      className="lc-pad-section"
      style={{
        background: "var(--bg)",
        padding: "120px 48px",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Reveal>
          <Overline marginBottom="12px">{d.overline}</Overline>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 3vw, 2.8rem)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "var(--text)",
              marginBottom: "20px",
            }}
          >
            {d.headline}
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p
            style={{
              fontSize: "1.05rem",
              color: "var(--text-muted)",
              lineHeight: 1.75,
              maxWidth: "62ch",
              marginBottom: "56px",
            }}
          >
            {d.lead}
          </p>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
          }}
        >
          {d.items.map((it, i) => {
            const url = `${DEMOS_BASE}/${it.slug}`;
            const isHovered = hovered === it.slug;
            return (
              <Reveal key={it.slug} delay={i * 70}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHovered(it.slug)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                    height: "100%",
                    padding: "28px",
                    border: "1px solid var(--border)",
                    borderRadius: "2px",
                    background: isHovered
                      ? "color-mix(in srgb, var(--text) 4%, transparent)"
                      : "var(--bg-alt)",
                    transition: "background 0.2s, transform 0.2s",
                    transform: isHovered ? "translateY(-3px)" : "none",
                    textDecoration: "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6rem",
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "#5B6168",
                      alignSelf: "flex-start",
                      padding: "3px 10px",
                      borderRadius: "2px",
                      background: "rgba(143,168,197,0.14)",
                    }}
                  >
                    {d.conceptLabel}
                  </span>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.5rem",
                      fontWeight: 400,
                      letterSpacing: "-0.01em",
                      color: "var(--text)",
                    }}
                  >
                    {it.title}
                  </h3>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6rem",
                      color: "var(--text-muted)",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                    }}
                  >
                    {it.category}
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.7 }}>
                    {it.desc}
                  </p>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      color: "var(--accent)",
                      marginTop: "auto",
                      opacity: isHovered ? 1 : 0.7,
                      transition: "opacity 0.2s",
                    }}
                  >
                    {d.visit}
                  </span>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
