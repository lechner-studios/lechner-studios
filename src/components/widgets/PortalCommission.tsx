"use client";
import React, { useId, useState } from "react";

// Arithmetic only, never a claim. A guesthouse enters its own numbers; this
// component multiplies them and formats the result. It must never assert a
// saving or a conversion outcome — direct booking does not eliminate portal
// commission, some guests will always book through a portal — so the copy
// (dict.postWidget["portal-commission"], set by the caller) frames the output
// as "what portal commission costs at this rate", never "what you would save".
//
// currency: "EUR" trips the Layer-0 currency-code scan; this file is exempted
// in .layer0-allow for the same reason offers.mjs is — a calculator that
// outputs money cannot avoid a currency token.
const currency = new Intl.NumberFormat("de-AT", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

// Empty or non-numeric input renders a neutral zero state rather than NaN.
function toNumber(raw: string): number {
  const n = Number(raw);
  return raw.trim() === "" || !Number.isFinite(n) ? 0 : n;
}

export type PortalCommissionLabels = {
  heading: string;
  revenueLabel: string;
  rateLabel: string;
  rateNote: string;
  annualLabel: string;
  monthlyLabel: string;
};

export default function PortalCommission({ labels }: { labels: PortalCommissionLabels }) {
  const [revenue, setRevenue] = useState("");
  // 15% is the werk storefront's stated typical rate ("Buchungsportale nehmen
  // rund 15 % je Buchung") — a sourced default, not a fabricated figure. The
  // guesthouse can change it to match their own portal agreements.
  const [rate, setRate] = useState("15");

  const headingId = useId();
  const revenueId = useId();
  const rateId = useId();

  const revenueValue = Math.max(0, toNumber(revenue));
  const rateValue = Math.min(100, Math.max(0, toNumber(rate)));
  const annual = revenueValue * (rateValue / 100);
  const monthly = annual / 12;

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "var(--font-mono)",
    fontSize: "0.68rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "var(--text-muted)",
    marginBottom: "8px",
  };

  const fieldStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    minHeight: "44px",
    boxSizing: "border-box",
    background: "transparent",
    border: "1px solid var(--border)",
    borderRadius: "4px",
    padding: "10px 12px",
    fontFamily: "var(--font-mono)",
    fontSize: "1rem",
    color: "var(--text)",
  };

  const resultLabelStyle: React.CSSProperties = { ...labelStyle, marginBottom: "4px" };

  return (
    <aside
      aria-labelledby={headingId}
      style={{
        marginTop: "48px",
        marginBottom: "48px",
        padding: "32px 28px",
        border: "1px solid var(--border)",
        borderRadius: "4px",
        background: "var(--card)",
      }}
    >
      <h2
        id={headingId}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.4rem",
          fontWeight: 400,
          color: "var(--text)",
          marginBottom: "24px",
        }}
      >
        {labels.heading}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <div>
          <label htmlFor={revenueId} style={labelStyle}>
            {labels.revenueLabel}
          </label>
          <input
            id={revenueId}
            type="number"
            inputMode="numeric"
            min={0}
            step={1000}
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
            style={fieldStyle}
          />
        </div>
        <div>
          <label htmlFor={rateId} style={labelStyle}>
            {labels.rateLabel}
          </label>
          <input
            id={rateId}
            type="number"
            inputMode="numeric"
            min={0}
            max={100}
            step={0.5}
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            style={fieldStyle}
          />
        </div>
      </div>

      <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "24px" }}>
        {labels.rateNote}
      </p>

      <div
        aria-live="polite"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "20px",
          paddingTop: "20px",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div>
          <span style={resultLabelStyle}>{labels.annualLabel}</span>
          <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "1.5rem", color: "var(--accent)" }}>
            {currency.format(annual)}
          </span>
        </div>
        <div>
          <span style={resultLabelStyle}>{labels.monthlyLabel}</span>
          <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: "1.5rem", color: "var(--text)" }}>
            {currency.format(monthly)}
          </span>
        </div>
      </div>
    </aside>
  );
}
