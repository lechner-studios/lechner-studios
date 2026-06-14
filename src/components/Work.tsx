"use client";
import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  live:    { bg: "rgba(61,74,58,0.12)", color: "#3D4A3A" },
  service: { bg: "rgba(154,160,166,0.15)", color: "#5B6168" },
  dev:     { bg: "rgba(21,23,26,0.07)", color: "#5B6168" },
  paused:  { bg: "rgba(138,144,152,0.1)", color: "#5B6168" },
  planned: { bg: "rgba(138,144,152,0.07)", color: "#5B6168" },
};

const STATUS_LABEL_MAP: Record<string, keyof ReturnType<typeof useLanguage>["dict"]["work"]> = {
  live:    "statusLive",
  dev:     "statusDev",
  paused:  "statusPaused",
  planned: "statusPlanned",
  service: "statusService",
};

export default function Work() {
  const { dict } = useLanguage();
  const d = dict.work;
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section
      id="work"
      className="lc-pad-section"
      style={{
        background: "#FBFCFC",
        padding: "120px 48px",
        borderTop: "1px solid rgba(21,23,26,0.06)",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header */}
        <div className="lc-work-header" style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "64px",
          paddingBottom: "32px",
          borderBottom: "1px solid rgba(21,23,26,0.1)",
        }}>
          <div>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.62rem",
              fontWeight: 600,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#254268",
              marginBottom: "12px",
            }}>
              {d.overline}
            </p>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 3vw, 2.8rem)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "#15171A",
            }}>
              {d.headline}
            </h2>
          </div>
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            color: "#254268",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}>
            {d.items.length} projects
          </span>
        </div>

        {/* Lead — products-as-proof framing */}
        <p style={{
          fontSize: "1.05rem",
          color: "#5B6168",
          lineHeight: 1.75,
          maxWidth: "62ch",
          marginTop: "-32px",
          marginBottom: "56px",
        }}>
          {d.lead}
        </p>

        {/* Project list */}
        <div>
          {d.items.map((item, i) => {
            const isHovered = hovered === item.id;
            const statusStyle = STATUS_STYLES[item.status] || STATUS_STYLES.planned;
            const statusLabel = d[STATUS_LABEL_MAP[item.status] as keyof typeof d] as string;
            const isClickable = item.url !== "#";

            return (
              <a
                key={item.id}
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
                  borderBottom: "1px solid rgba(21,23,26,0.06)",
                  textDecoration: "none",
                  cursor: isClickable ? "pointer" : "default",
                  transition: "background 0.2s",
                  background: isHovered && isClickable ? "rgba(21,23,26,0.02)" : "transparent",
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
                  color: "#254268",
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
                      color: isHovered && isClickable ? "#15171A" : "#1B1E22",
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
                    color: "#5B6168",
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
                    color: "#5B6168",
                    letterSpacing: "0.15em",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                  }}>
                    {item.category}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                    color: "#5B6168",
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
                      color: "#254268",
                      letterSpacing: "0.08em",
                      opacity: isHovered ? 1 : 0,
                      transition: "opacity 0.2s",
                    }}>
                      {d.visit}
                    </span>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
