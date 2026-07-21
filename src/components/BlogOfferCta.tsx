"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import Overline from "./Overline";
import { OFFERS } from "../lib/offers.mjs";
import type { OfferKey } from "../lib/offers.mjs";

// Renders the matched offer at the end of an article. Prices come from
// offers.mjs, never from the dictionary — see .layer0-allow.
export default function BlogOfferCta({ offer }: { offer: OfferKey }) {
  const { dict, locale } = useLanguage();
  const d = dict.blogOffer;
  const item = d.items[offer];
  const meta = OFFERS[offer];
  // meta.href is an absolute werk URL (#118). Used as-is, no locale prefix.

  return (
    <aside style={{ marginTop: "80px", paddingTop: "48px", borderTop: "1px solid var(--border)" }}>
      <Overline marginBottom="1.5rem">{d.overline}</Overline>
      <Link
        href={meta.href}
        style={{
          display: "block",
          border: "1px solid var(--border)",
          borderRadius: "4px",
          padding: "32px 28px",
          // --card is the brightest of ADR-0037's 3-tier elevation scale, so
          // cards lift off either section band. HomeOffers.tsx:74 does the same.
          background: "var(--card)",
          borderTop: `3px solid ${meta.accent}`,
          textDecoration: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "16px", marginBottom: "12px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 400, color: "var(--text)" }}>
            {meta.title}
          </h2>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.95rem", color: "var(--text)", whiteSpace: "nowrap" }}>
            {meta.price[locale]}
          </span>
        </div>
        <p style={{ fontSize: "0.92rem", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "24px" }}>
          {item.desc}
        </p>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--accent)" }}>
          {item.cta} →
        </span>
      </Link>
    </aside>
  );
}
