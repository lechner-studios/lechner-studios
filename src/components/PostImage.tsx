import React from "react";

// Renders a post's self-hosted Pexels photo. Replaces the generated SVG art.
// Image files live in /public/blog and are committed (DSGVO: no runtime fetch
// from Pexels). Credit is rendered by the post page, not here.
export default function PostImage({
  image,
  alt,
  variant,
}: {
  image?: string;
  alt?: string;
  variant: "hero" | "tile";
}) {
  const isHero = variant === "hero";
  const box: React.CSSProperties = isHero
    ? { width: "100%", height: "200px" }
    : { width: "72px", height: "72px", flexShrink: 0 };

  // Graceful fallback when a post has no photo: a flat band in the section-B
  // tone. Never an identicon.
  if (!image) {
    return (
      <div
        aria-hidden="true"
        style={{ ...box, borderRadius: "4px", border: "1px solid var(--border)", background: "var(--bg-alt)" }}
      />
    );
  }

  return (
    <div style={{ ...box, position: "relative", borderRadius: "4px", border: "1px solid var(--border)", overflow: "hidden" }}>
      <img
        src={image}
        alt={alt || ""}
        loading="lazy"
        decoding="async"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "saturate(0.82) contrast(1.02)" }}
      />
      {/* Light cool wash so photos sit with the Alpine palette (A1: a wash, not a duotone). */}
      <span
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, background: "var(--accent)", opacity: 0.1, mixBlendMode: "multiply", pointerEvents: "none" }}
      />
    </div>
  );
}
