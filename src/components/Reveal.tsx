"use client";
import React, { useEffect, useRef, useState } from "react";

export default function Reveal({
  children, delay = 0, style, className,
}: { children: React.ReactNode; delay?: number; style?: React.CSSProperties; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // No IntersectionObserver support → show immediately (never leave content
    // hidden). setShown is deferred via a 0ms timer rather than called
    // synchronously in the effect body, so it doesn't trigger a cascading
    // render (react-hooks/set-state-in-effect) — and, being client-only, it
    // can't cause a hydration mismatch.
    if (typeof IntersectionObserver === "undefined") {
      const immediate = window.setTimeout(() => setShown(true), 0);
      return () => window.clearTimeout(immediate);
    }
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    // Safety net: if the observer never fires (fast/programmatic scroll, bfcache
    // restore, odd viewport), reveal anyway so a section can't stay blank.
    const fallback = window.setTimeout(() => setShown(true), 1200);
    return () => { io.disconnect(); window.clearTimeout(fallback); };
  }, []);
  return (
    <div
      ref={ref}
      className={`sr${shown ? " is-in" : ""}${className ? " " + className : ""}`}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined, ...style }}
    >
      {children}
    </div>
  );
}
