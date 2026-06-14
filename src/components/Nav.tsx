"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import { alternateLocale, LOCALES, HREFLANG } from "../i18n/config";
import Wordmark from "./Wordmark";

export default function Nav() {
  const { dict, locale } = useLanguage();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hash, setHash] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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

  const alt = alternateLocale(locale);
  const localeRe = new RegExp(`^/(${LOCALES.join("|")})(?=/|$)`);
  const restOfPath = pathname.replace(localeRe, "") || "";
  const altHref = `/${alt}${restOfPath}${hash}`;
  const homeHref = `/${locale}`;

  const navStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: scrolled ? "16px 48px" : "24px 48px",
    background: scrolled ? "rgba(247,248,248,0.96)" : "transparent",
    backdropFilter: scrolled ? "blur(20px)" : "none",
    boxShadow: scrolled ? "0 1px 0 rgba(21,23,26,0.08)" : "none",
    mixBlendMode: scrolled ? "normal" : "difference",
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
    color: scrolled ? "#5B6168" : "#F7F8F8",
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
    borderLeft: `1px solid ${scrolled ? "rgba(21,23,26,0.2)" : "rgba(247,248,248,0.3)"}`,
    marginLeft: "8px",
    color: scrolled ? "#15171A" : "#F7F8F8",
    fontWeight: 700,
  };

  return (
    <nav className="lc-pad-nav" style={navStyle}>
      <Link href={homeHref} style={logoLinkStyle} aria-label="Lechner Studios">
        <Wordmark variant="inline" size={22} onDark={!scrolled} />
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
        <a href="#work"    style={linkStyle}>{dict.nav.work}</a>
        <a href="#about"   style={linkStyle}>{dict.nav.about}</a>
        <a href="#contact" style={linkStyle}>{dict.nav.contact}</a>
        <Link href={altHref} hrefLang={HREFLANG[alt]} style={toggleStyle}>
          {dict.nav.toggle}
        </Link>
      </div>
    </nav>
  );
}
