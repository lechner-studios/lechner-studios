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
    // No IntersectionObserver support → show immediately (never leave content hidden).
    if (typeof IntersectionObserver === "undefined") { setShown(true); return; }
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
