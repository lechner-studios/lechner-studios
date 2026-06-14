"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";
import Reveal from "./Reveal";

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  live:    { bg: "rgba(61,74,58,0.12)", color: "#3D4A3A" },
  service: { bg: "rgba(154,160,166,0.15)", color: "#5B6168" },
  dev:     { bg: "rgba(21,23,26,0.07)", color: "#5B6168" },
  paused:  { bg: "rgba(138,144,152,0.1)", color: "#5B6168" },
  planned: { bg: "rgba(138,144,152,0.07)", color: "#5B6168" },
  maintenance: { bg: "rgba(143,168,197,0.14)", color: "#5B6168" },
};

const STATUS_LABEL_MAP: Record<string, keyof ReturnType<typeof useLanguage>["dict"]["work"]> = {
  live:    "statusLive",
  dev:     "statusDev",
  paused:  "statusPaused",
  planned: "statusPlanned",
  service: "statusService",
  maintenance: "statusMaintenance",
};

export default function Work({ limit, moreHref, featured }: { limit?: number; moreHref?: string; featured?: string[] }) {
  const { dict } = useLanguage();
  const d = dict.work;
  const [hovered, setHovered] = useState<string | null>(null);
  const items =
    featured && featured.length > 0
      ? featured
          .map((id) => d.items.find((it) => it.id === id))
          .filter((it): it is (typeof d.items)[number] => Boolean(it))
      : typeof limit === "number"
        ? d.items.slice(0, limit)
        : d.items;

  return (
    <section
      id="work"
      className="lc-pad-section"
      style={{
        background: "var(--bg-alt)",
        padding: "120px 48px",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header */}
        <Reveal>
        <div className="lc-work-header" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "64px",
          paddingBottom: "32px",
          borderBottom: "1px solid var(--border)",
        }}>
          <div>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.62rem",
              fontWeight: 600,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "12px",
            }}>
              {d.overline}
            </p>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 3vw, 2.8rem)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "var(--text)",
            }}>
              {d.headline}
            </h2>
          </div>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            color: "var(--accent)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}>
            {d.items.length} projects
          </span>
        </div>
        </Reveal>

        {/* Lead — products-as-proof framing */}
        <Reveal delay={80}>
        <p style={{
          fontSize: "1.05rem",
          color: "var(--text-muted)",
          lineHeight: 1.75,
          maxWidth: "62ch",
          marginTop: "-32px",
          marginBottom: "56px",
        }}>
          {d.lead}
        </p>
        </Reveal>

        {/* Project list */}
        <div>
          {items.map((item, i) => {
            const isHovered = hovered === item.id;
            const statusStyle = STATUS_STYLES[item.status] || STATUS_STYLES.planned;
            const statusLabel = d[STATUS_LABEL_MAP[item.status] as keyof typeof d] as string;
            const isClickable = item.url !== "#";

            return (
              <Reveal key={item.id} delay={i * 70}>
              <a
                href={isClickable ? item.url : undefined}
                target={isClickable ? "_blank" : undefined}
                rel="noopener noreferrer"
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                className="lc-work-item"
                style={{
                  display: "grid",
                  gridTemplateColumns: "48px 1fr auto",
                  gap: "32px",
                  alignItems: "start",
                  padding: "32px 0",
                  borderBottom: "1px solid var(--border)",
                  textDecoration: "none",
                  cursor: isClickable ? "pointer" : "default",
                  transition: "background 0.2s, transform 0.2s",
                  background: isHovered && isClickable ? "color-mix(in srgb, var(--text) 4%, transparent)" : "transparent",
                  transform: isHovered && isClickable ? "translateX(6px)" : "translateX(0)",
                  margin: "0 -24px",
                  paddingLeft: "24px",
                  paddingRight: "24px",
                  borderRadius: "2px",
                }}
              >
                {/* Index */}
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  color: "var(--accent)",
                  fontWeight: 400,
                  paddingTop: "4px",
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Content */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "8px", flexWrap: "wrap" }}>
                    <h3 style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.7rem",
                      fontWeight: 400,
                      letterSpacing: "-0.01em",
                      color: "var(--text)",
                      transition: "color 0.2s",
                    }}>
                      {item.title}
                    </h3>
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6rem",
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      padding: "3px 10px",
                      borderRadius: "2px",
                      ...statusStyle,
                    }}>
                      {statusLabel}
                    </span>
                  </div>
                  <p style={{
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                    lineHeight: 1.7,
                    maxWidth: "600px",
                  }}>
                    {item.desc}
                  </p>
                </div>

                {/* Meta */}
                <div className="lc-work-meta" style={{ textAlign: "right", paddingTop: "4px", flexShrink: 0 }}>
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                    color: "var(--text-muted)",
                    letterSpacing: "0.15em",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}>
                    {item.category}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                    color: "var(--text-muted)",
                    letterSpacing: "0.1em",
                    marginBottom: "12px",
                  }}>
                    {item.year}
                  </div>
                  {isClickable && (
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      color: "var(--accent)",
                      letterSpacing: "0.08em",
                      opacity: isHovered ? 1 : 0,
                      transition: "opacity 0.2s",
                    }}>
                      {d.visit}
                    </span>
                  )}
                </div>
              </a>
              </Reveal>
            );
          })}
        </div>

        {moreHref && (
          <Link
            href={moreHref}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--accent)",
              textDecoration: "none",
              display: "inline-block",
              marginTop: "48px",
              transition: "color 0.2s, opacity 0.2s",
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = "0.7")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            {d.viewAll}
          </Link>
        )}
      </div>
    </section>
  );
}
