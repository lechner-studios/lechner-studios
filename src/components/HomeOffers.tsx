"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import Reveal from "./Reveal";
import Overline from "./Overline";

// Hrefs, brand titles and prices live here, not in the shared dictionary, so
// the Layer-0 PII/currency guard stays active over all site copy. This
// component is exempted in .layer0-allow — the amounts are intentional public
// marketing figures, matching the offer pages they link to. Ordered to mirror
// dict.homeOffers.items (check, then direkt).
const OFFERS: { href: string; title: string; price: { de: string; en: string } }[] = [
  { href: "/website-check", title: "Website-Check", price: { de: "€290", en: "€290" } },
  { href: "/pension-website-tirol", title: "Direktbucher", price: { de: "ab €3.900", en: "from €3,900" } },
];

export default function HomeOffers() {
  const { dict, locale } = useLanguage();
  const d = dict.homeOffers;
  const [hovered, setHovered] = useState<number | null>(null);

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
          <Overline marginBottom="1.5rem">{d.overline}</Overline>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 3vw, 2.8rem)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "var(--text)",
              marginBottom: "1.25rem",
              maxWidth: "20ch",
            }}
          >
            {d.headline}
          </h2>
          <p
            style={{
              fontSize: "1.05rem",
              color: "var(--text-muted)",
              lineHeight: 1.75,
              maxWidth: "62ch",
              marginBottom: "48px",
            }}
          >
            {d.lead}
          </p>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
          {d.items.map((item, i) => {
            const meta = OFFERS[i];
            const isHovered = hovered === i;
            return (
              <Reveal key={meta.title} delay={i * 80}>
                <Link
                  href={`/${locale}${meta.href}`}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    padding: "32px 28px",
                    background: "var(--bg-alt)",
                    textDecoration: "none",
                    transition: "border-color 0.25s, transform 0.25s",
                    borderColor: isHovered ? "var(--accent)" : "var(--border)",
                    transform: isHovered ? "translateY(-3px)" : "translateY(0)",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-faint)", marginBottom: "16px" }}>
                    {item.label}
                  </span>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "16px", marginBottom: "12px" }}>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 400, color: "var(--text)" }}>
                      {meta.title}
                    </h3>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.95rem", color: "var(--text)", whiteSpace: "nowrap" }}>
                      {meta.price[locale]}
                    </span>
                  </div>
                  <p style={{ fontSize: "0.92rem", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "24px", flexGrow: 1 }}>
                    {item.desc}
                  </p>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)" }}>
                    {item.cta} →
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
