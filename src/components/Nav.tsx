"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import { alternateLocale, LOCALES, HREFLANG } from "../i18n/config";
import Wordmark from "./Wordmark";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  const { dict, locale } = useLanguage();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hash, setHash] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Solidify as soon as the page scrolls at all: on narrow viewports the hero
    // overline sits only ~40px below the nav, so a larger threshold let content
    // scroll up behind the still-transparent bar (logo/overline overlap). A small
    // buffer keeps the at-rest transparent-over-hero look without elastic flicker.
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track the active theme so the (solid) wordmark stays legible in dark mode:
  // its dark ink would otherwise sit invisibly on the now-dark solid nav.
  // The ThemeToggle mutates document.documentElement.dataset.theme; observe it.
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setIsDark(root.dataset.theme === "dark");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  // Track URL hash so the language-toggle Link preserves the user's
  // anchor when they switch locales. usePathname() excludes the hash
  // by design, so we track it in client state and append on render.
  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  // Mobile drawer: lock body scroll + close on Escape while open.
  // Effect is keyed on menuOpen so listeners/styles attach only when needed
  // and tear down cleanly (overflow restored to "") on close/unmount.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const alt = alternateLocale(locale);
  const localeRe = new RegExp(`^/(${LOCALES.join("|")})(?=/|$)`);
  const restOfPath = pathname.replace(localeRe, "") || "";
  const altHref = `/${alt}${restOfPath}${hash}`;
  const homeHref = `/${locale}`;

  // The transparent-until-scroll treatment assumes a dark hero behind the nav,
  // which only holds on the home page. On sub-pages the nav must be solid.
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const solid = scrolled || !isHome;

  const navStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: solid ? "16px 48px" : "24px 48px",
    background: solid ? "color-mix(in srgb, var(--bg) 96%, transparent)" : "transparent",
    backdropFilter: solid ? "blur(20px)" : "none",
    boxShadow: solid ? "0 1px 0 var(--border)" : "none",
    mixBlendMode: "normal",
    transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)",
  };

  const logoLinkStyle: React.CSSProperties = {
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    transition: "opacity 0.4s",
  };

  const linkStyle: React.CSSProperties = {
    fontSize: "0.68rem",
    fontWeight: 600,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: solid ? "var(--text-muted)" : "var(--hero-text-muted)",
    textDecoration: "none",
    transition: "color 0.3s",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: 0,
    fontFamily: "var(--font-sans)",
  };

  const toggleStyle: React.CSSProperties = {
    ...linkStyle,
    paddingLeft: "16px",
    borderLeft: `1px solid ${solid ? "var(--border-strong)" : "var(--contrast-border)"}`,
    marginLeft: "8px",
    color: solid ? "var(--text)" : "var(--hero-text)",
    fontWeight: 700,
  };

  return (
    <nav className="lc-pad-nav" style={navStyle}>
      <Link href={homeHref} style={logoLinkStyle} aria-label="Lechner Studios">
        <Wordmark variant="inline" size={22} onDark={isDark} />
      </Link>
      <div className="lc-nav-desktop" style={{ alignItems: "center", gap: "32px" }}>
        <Link
          href={`/${locale}/work`}
          style={linkStyle}
          onMouseEnter={e => { e.currentTarget.style.color = solid ? "var(--accent)" : "var(--hero-accent)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = solid ? "var(--text-muted)" : "var(--hero-text-muted)"; }}
        >{dict.nav.work}</Link>
        <Link
          href={`/${locale}/about`}
          style={linkStyle}
          onMouseEnter={e => { e.currentTarget.style.color = solid ? "var(--accent)" : "var(--hero-accent)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = solid ? "var(--text-muted)" : "var(--hero-text-muted)"; }}
        >{dict.nav.about}</Link>
        <Link
          href={`/${locale}/blog`}
          style={linkStyle}
          onMouseEnter={e => { e.currentTarget.style.color = solid ? "var(--accent)" : "var(--hero-accent)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = solid ? "var(--text-muted)" : "var(--hero-text-muted)"; }}
        >{dict.nav.journal}</Link>
        <Link
          href={`/${locale}/contact`}
          style={linkStyle}
          onMouseEnter={e => { e.currentTarget.style.color = solid ? "var(--accent)" : "var(--hero-accent)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = solid ? "var(--text-muted)" : "var(--hero-text-muted)"; }}
        >{dict.nav.contact}</Link>
        <span style={{ display: "inline-flex", color: solid ? "var(--text)" : "var(--hero-text)" }}>
          <ThemeToggle />
        </span>
        <Link href={altHref} hrefLang={HREFLANG[alt]} style={toggleStyle}>
          {dict.nav.toggle}
        </Link>
      </div>

      {/* Hamburger — visible only ≤768px (governed by .lc-nav-burger). No inline
          `display`, so the class controls show/hide. Themed via the same solid/hero logic. */}
      <button
        type="button"
        className="lc-nav-burger"
        aria-label={dict.nav.menu}
        aria-expanded={menuOpen}
        aria-controls="lc-mobile-menu"
        onClick={() => setMenuOpen(true)}
        style={{
          alignItems: "center",
          justifyContent: "center",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          color: solid ? "var(--text)" : "var(--hero-text)",
          lineHeight: 0,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      {/* Full-screen themed drawer */}
      {menuOpen && (
        <div
          id="lc-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={dict.nav.menu}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "var(--bg)",
            display: "flex",
            flexDirection: "column",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              aria-label={dict.nav.close}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                color: "var(--text)",
                lineHeight: 0,
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <nav
            aria-label={dict.nav.menu}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "32px",
              marginTop: "auto",
              marginBottom: "auto",
              alignItems: "flex-start",
            }}
          >
            {[
              { href: `/${locale}/work`, label: dict.nav.work },
              { href: `/${locale}/about`, label: dict.nav.about },
              { href: `/${locale}/blog`, label: dict.nav.journal },
              { href: `/${locale}/contact`, label: dict.nav.contact },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: "clamp(2.2rem, 9vw, 3.2rem)",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  color: "var(--text)",
                  textDecoration: "none",
                  lineHeight: 1.1,
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "24px", paddingTop: "16px" }}>
            <span style={{ display: "inline-flex", color: "var(--text)" }}>
              <ThemeToggle />
            </span>
            <Link
              href={altHref}
              hrefLang={HREFLANG[alt]}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--text)",
                textDecoration: "none",
              }}
            >
              {dict.nav.toggle}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
