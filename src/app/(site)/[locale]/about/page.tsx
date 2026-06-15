import type { Metadata } from "next";
import React from "react";
import { notFound } from "next/navigation";
import { LanguageProvider } from "../../../../context/LanguageContext";
import { isLocale, type Locale } from "../../../../i18n/config";
import { dictionaries } from "../../../../i18n/dictionaries";
import { pageMetadata } from "../../../../lib/seo";
import Nav from "../../../../components/Nav";
import About from "../../../../components/About";
import Founder from "../../../../components/Founder";
import HowWeWork from "../../../../components/HowWeWork";
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
  return pageMetadata(locale, "/about", dict.meta.aboutTitle, dict.meta.aboutDescription);
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;

  return (
    <LanguageProvider locale={locale}>
      <a href="#main" className="skip-link">
        {dictionaries[locale].a11y.skipLink}
      </a>
      <Nav />
      <main id="main" style={{ minHeight: "100vh" }}>
        <About />
        <Founder />
        {/*
          "Wie wir arbeiten / KI-Zwilling" doctrine — STAGED OFF until the AI-twin
          autonomy system is actually implemented. Publishing it before then is a
          premature public claim (A2 honesty, ADR-0038). The component + DE/EN copy
          (dict.howWeWork) are kept ready to flip on.
          REVISIT ON IMPLEMENTATION: set NEXT_PUBLIC_SHOW_HOW_WE_WORK=1 in the
          umbrella's Vercel env once the declared, revocable autonomy scopes are real.
        */}
        {process.env.NEXT_PUBLIC_SHOW_HOW_WE_WORK === "1" && <HowWeWork />}
        <Footer />
      </main>
    </LanguageProvider>
  );
}
