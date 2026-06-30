"use client";
import React from "react";
import { useLanguage } from "../context/LanguageContext";
import Reveal from "./Reveal";
import Overline from "./Overline";

// Positioning / trust statement (few clients, founder-stage terms). The contact
// CTA lives in ContactCta directly below, so this section carries no button of
// its own — it used to duplicate the same "/start" CTA back-to-back.
export default function FoundationPartner() {
  const { dict } = useLanguage();
  const d = dict.foundation;

  return (
    <section
      className="lc-pad-section"
      style={{
        background: "var(--bg-alt)",
        padding: "120px 48px",
        borderTop: "1px solid var(--border)",
      }}
    >
      <Reveal style={{ maxWidth: "760px", margin: "0 auto" }}>
        <Overline marginBottom="1.5rem">
          {d.overline}
        </Overline>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: 300,
            color: "var(--text)",
            marginBottom: "1.5rem",
          }}
        >
          {d.headline}
        </h2>
        <p
          style={{
            fontSize: "1rem",
            color: "var(--text-muted)",
            lineHeight: 1.8,
            maxWidth: "60ch",
            margin: 0,
          }}
        >
          {d.body}
        </p>
      </Reveal>
    </section>
  );
}
