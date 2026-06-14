import type { CSSProperties } from "react";

interface MarkProps {
  size?: number;
  onDark?: boolean;
  style?: CSSProperties;
}

/**
 * Lechner Studios `l.s` mark — per Brand v4.1 spec §1.
 * Abbreviated wordmark: ink `l` (Cormorant 700) + ink `s` (Italiana 400)
 * with a gold dot signature. Used where the full wordmark won't fit
 * (footer signatures, document corners, email headers, app icons).
 */
export default function Mark({ size = 48, onDark = false, style }: MarkProps) {
  const ink = onDark ? "#FBFCFC" : "#15171A";
  const gold = onDark ? "#9AA0A6" : "#B8944D";

  return (
    <svg
      viewBox="0 0 90 110"
      width={size}
      style={style}
      aria-label="lechner.studios"
    >
      <text
        x="22"
        y="100"
        fontFamily="var(--font-display-bold), Cormorant, serif"
        fontSize="100"
        fontWeight="700"
        fill={ink}
      >
        l
      </text>
      <text
        x="50"
        y="100"
        fontFamily="var(--font-display-italiana), Italiana, serif"
        fontSize="100"
        fontWeight="400"
        fill={ink}
      >
        s
      </text>
      <circle cx="44" cy="88" r="5" fill={gold} />
    </svg>
  );
}
