import type { CSSProperties } from "react";

interface WordmarkProps {
  variant?: "stacked" | "inline";
  size?: number;
  onDark?: boolean;
  style?: CSSProperties;
}

/**
 * Lechner Studios wordmark — per Brand v4.1 spec §2.
 * - inline: single-line, `lechner` (Cormorant 700) + `.studios` (Italiana 400)
 *   with a gold dot bridging them. Use in nav bars and footer signatures.
 * - stacked: two-line SVG, `lechner` over `.studios`. Use in hero / brand card.
 */
export default function Wordmark({
  variant = "stacked",
  size = 100,
  onDark = false,
  style,
}: WordmarkProps) {
  const ink = onDark ? "#FBFCFC" : "#15171A";
  const gold = onDark ? "#9AA0A6" : "#B8944D";

  if (variant === "inline") {
    const studiosSize = size * 0.85;
    return (
      <span
        style={{
          fontFamily: "var(--font-display-bold), Cormorant, serif",
          fontWeight: 700,
          fontSize: size,
          letterSpacing: "-0.025em",
          color: ink,
          ...style,
        }}
      >
        lechner
        <span
          style={{
            color: gold,
            fontFamily: "var(--font-display-bold), Cormorant, serif",
            fontWeight: 700,
            fontSize: "32px",
            lineHeight: 0,
            transform: "translateY(-1px)",
            margin: "0 2px",
          }}
        >
          .
        </span>
        <span
          style={{
            fontFamily: "var(--font-display-italiana), Italiana, serif",
            fontWeight: 400,
            fontSize: studiosSize,
            marginLeft: 0,
          }}
        >
          studios
        </span>
      </span>
    );
  }

  // stacked
  return (
    <svg
      viewBox="0 0 380 165"
      style={{ width: "100%", height: "auto", ...style }}
      aria-label="Lechner Studios"
    >
      <text
        x="0"
        y="90"
        fontFamily="var(--font-display-bold), Cormorant, serif"
        fontSize="100"
        fontWeight="700"
        fill={ink}
        letterSpacing="-0.03em"
      >
        lechner
      </text>
      <text
        x="0"
        y="162"
        fontFamily="var(--font-display-italiana), Italiana, serif"
        fontSize="85"
        fontWeight="400"
        fill={ink}
      >
        <tspan fill={gold}>.</tspan>studios
      </text>
    </svg>
  );
}
