import type { Metadata } from "next";
import React from "react";
import { notFound } from "next/navigation";
import { LanguageProvider } from "../../../../context/LanguageContext";
import { isLocale, type Locale } from "../../../../i18n/config";
import { dictionaries } from "../../../../i18n/dictionaries";
import Nav from "../../../../components/Nav";
import Work from "../../../../components/Work";
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
    title: dict.meta.workTitle,
    description: dict.meta.workDescription,
    alternates: {
      canonical: `/${locale}/work`,
      languages: {
        "de-AT": "/de/work",
        en: "/en/work",
        "x-default": "/de/work",
      },
    },
    robots: { index: true, follow: true },
  };
}

export default async function WorkPage({
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
        <Work />
        <Footer />
      </main>
    </LanguageProvider>
  );
}
