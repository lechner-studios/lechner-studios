import type { Metadata } from "next";
import React from "react";
import { notFound } from "next/navigation";
import { LanguageProvider } from "../../../../context/LanguageContext";
import { isLocale, type Locale } from "../../../../i18n/config";
import { dictionaries } from "../../../../i18n/dictionaries";
import Nav from "../../../../components/Nav";
import StartProject from "../../../../components/StartProject";
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
  return {
    title: dict.meta.startTitle,
    description: dict.meta.startDescription,
    alternates: {
      canonical: `/${locale}/start`,
      languages: {
        "de-AT": "/de/start",
        en: "/en/start",
        "x-default": "/de/start",
      },
    },
    robots: { index: true, follow: true },
  };
}

export default async function StartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = dictionaries[locale];
  const s = dict.start;

  return (
    <LanguageProvider locale={locale}>
      <a href="#main" className="skip-link">
        {dict.a11y.skipLink}
      </a>
      <Nav />
      <main id="main" style={{ minHeight: "100vh" }}>
        <section
          className="lc-pad-section"
          style={{
            background: "var(--bg)",
            padding: "120px 48px",
            borderTop: "1px solid var(--border)",
          }}
        >
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            {/* Editorial header */}
            <div style={{ marginBottom: "64px", maxWidth: "640px" }}>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.62rem",
                  fontWeight: 600,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  marginBottom: "2rem",
                }}
              >
                {s.overline}
              </p>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(3rem, 6vw, 5.5rem)",
                  fontWeight: 300,
                  lineHeight: 0.95,
                  letterSpacing: "-0.03em",
                  color: "var(--text)",
                  marginBottom: "32px",
                  fontStyle: "italic",
                }}
              >
                {s.headline}
              </h1>
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.8,
                  maxWidth: "480px",
                }}
              >
                {s.intro}
              </p>
            </div>

            <StartProject />
          </div>
        </section>
        <Footer />
      </main>
    </LanguageProvider>
  );
}
