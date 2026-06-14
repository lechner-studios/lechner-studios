"use client";
import React from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

export default function Breadcrumb({ current }: { current: string }) {
  const { locale } = useLanguage();

  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.6rem",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        marginBottom: "2rem",
      }}
    >
      <Link
        href={`/${locale}`}
        style={{
          color: "var(--text-muted)",
          textDecoration: "none",
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--accent)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-muted)")}
      >
        Lechner Studios
      </Link>
      <span style={{ color: "var(--text-faint)" }}> / </span>
      <span style={{ color: "var(--text-faint)" }}>{current}</span>
    </div>
  );
}
