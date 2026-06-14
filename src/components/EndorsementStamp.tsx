import type { CSSProperties } from "react";

interface EndorsementStampProps {
  variant?: "default" | "medium" | "small";
  onDark?: boolean;
  text?: string;
  style?: CSSProperties;
}

const VARIANTS = {
  default: { grid: 56, gap: 4, textSize: 14, gridTextGap: 24 },
  medium: { grid: 40, gap: 3, textSize: 12, gridTextGap: 16 },
  small: { grid: 28, gap: 2, textSize: 10, gridTextGap: 12 },
};

/**
 * "A Lechner Studios product" endorsement stamp — per Brand v4.1 spec §4.
 * Small 2×2 pillar grid + inline wordmark; used as a sub-product surface
 * boundary marker on every product surface (footer/about/landing).
 *
 * `text` defaults to the EN canonical string; pass a localized string
 * (e.g. "EIN LECHNER STUDIOS PRODUKT") to override.
 */
export default function EndorsementStamp({
  variant = "small",
  onDark = false,
  text = "A LECHNER STUDIOS PRODUCT",
  style,
}: EndorsementStampProps) {
  const v = VARIANTS[variant];
  const ink = onDark ? "#FBFCFC" : "#15171A";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: v.gridTextGap,
        ...style,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: v.gap,
          width: v.grid,
          height: v.grid,
        }}
      >
        <div style={{ background: "#D6CDBE", borderRadius: 1 }} />
        <div style={{ background: "#8FA8C5", borderRadius: 1 }} />
        <div style={{ background: "#254268", borderRadius: 1 }} />
        <div style={{ background: "#5E8263", borderRadius: 1 }} />
      </div>
      <span
        style={{
          fontFamily: "var(--font-sans), 'General Sans', sans-serif",
          fontWeight: 600,
          fontSize: v.textSize,
          letterSpacing: "0.14em",
          color: ink,
          lineHeight: 1,
          whiteSpace: "nowrap",
          textTransform: "uppercase",
        }}
      >
        {text}
      </span>
    </div>
  );
}
