"use client";
import React, { useEffect, useState } from "react";

// Toggles document.documentElement.dataset.theme between "light"/"dark",
// persists the choice in localStorage('ls-theme'), and shows the icon of the
// mode you'll switch TO (moon in light → go dark, sun in dark → go light) so
// the glyph agrees with the aria-label. The no-flash init script in the locale
// layout sets the initial dataset.theme before paint; on mount we read it in.
export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    // Sync React state to the theme the no-flash script set before paint.
    // Can't lazy-init (server renders "light", client may be "dark" →
    // hydration mismatch); the one-shot setState here can't cascade (empty deps).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(current === "dark" ? "dark" : "light");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("ls-theme", next);
    } catch {
      /* storage unavailable (private mode) — theme still applies for the session */
    }
    setTheme(next);
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        color: "currentColor",
        lineHeight: 0,
      }}
    >
      {isDark ? (
        // Sun — shown in dark mode; click to go light
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
        </svg>
      ) : (
        // Moon — shown in light mode; click to go dark
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"
            fill="currentColor"
          />
        </svg>
      )}
    </button>
  );
}
