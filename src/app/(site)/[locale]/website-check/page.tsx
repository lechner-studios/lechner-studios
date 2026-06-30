import type { Metadata } from "next";
import React from "react";
import { notFound } from "next/navigation";
import { LanguageProvider } from "../../../../context/LanguageContext";
import { isLocale, type Locale } from "../../../../i18n/config";
import { dictionaries } from "../../../../i18n/dictionaries";
import { pageMetadata } from "../../../../lib/seo";
import Nav from "../../../../components/Nav";
import WebsiteCheck from "../../../../components/WebsiteCheck";
import WebsiteCheckJsonLd from "../../../../components/WebsiteCheckJsonLd";
import WebsiteCheckIntake from "../../../../components/WebsiteCheckIntake";
import Footer from "../../../../components/Footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale: Locale = raw;
  const dict = dictionaries[locale];
  return pageMetadata(
    locale,
    "/website-check",
    dict.websiteCheck.metaTitle,
    dict.websiteCheck.metaDescription,
  );
}

export default async function WebsiteCheckPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const w = dictionaries[locale].websiteCheckIntake;

  return (
    <LanguageProvider locale={locale}>
      <a href="#main" className="skip-link">
        {dictionaries[locale].a11y.skipLink}
      </a>
      <WebsiteCheckJsonLd locale={locale} />
      <Nav />
      <main id="main" style={{ minHeight: "100vh" }}>
        <WebsiteCheck />
        <section
          id="anfrage"
          className="lc-pad-section"
          style={{ background: "var(--bg-alt)", padding: "120px 48px", borderTop: "1px solid var(--border)", scrollMarginTop: "80px" }}
        >
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "1.25rem" }}>
              {w.overline}
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 400, letterSpacing: "-0.02em", color: "var(--text)", marginBottom: "1.25rem", maxWidth: "20ch" }}>
              {w.headline}
            </h2>
            <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", lineHeight: 1.75, maxWidth: "60ch", marginBottom: "48px" }}>
              {w.intro}
            </p>
            <WebsiteCheckIntake />
          </div>
        </section>
        <Footer />
      </main>
    </LanguageProvider>
  );
}
