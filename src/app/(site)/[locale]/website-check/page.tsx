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

  return (
    <LanguageProvider locale={locale}>
      <a href="#main" className="skip-link">
        {dictionaries[locale].a11y.skipLink}
      </a>
      <WebsiteCheckJsonLd locale={locale} />
      <Nav />
      <main id="main" style={{ minHeight: "100vh" }}>
        <WebsiteCheck />
        <Footer />
      </main>
    </LanguageProvider>
  );
}
