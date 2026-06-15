import type { CSSProperties } from "react";

interface BrandMarkProps {
  size?: number;
  style?: CSSProperties;
}

/**
 * The Lechner Studios brand mark — the 2×2 Alpine-pillar tile grid with the
 * gold founder-signature dot, identical to favicon.svg. Used as a parent-brand
 * signature (e.g. in the umbrella-site footer).
 *
 * NOTE: this is the brand mark, NOT the "A Lechner Studios product" endorsement
 * stamp (see EndorsementStamp.tsx). The endorsement stamp belongs on sub-product
 * surfaces; the umbrella site is the parent, so it carries the mark alone.
 */
export default function BrandMark({ size = 28, style }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Lechner Studios"
      style={style}
    >
      <rect x="0" y="0" width="48" height="48" fill="#D6CDBE" />
      <rect x="52" y="0" width="48" height="48" fill="#8FA8C5" />
      <rect x="0" y="52" width="48" height="48" fill="#254268" />
      <rect x="52" y="52" width="48" height="48" fill="#5E8263" />
      <circle cx="50" cy="50" r="13" fill="#B8944D" />
    </svg>
  );
}
