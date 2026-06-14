import React from "react";
import { notFound } from "next/navigation";
import { LanguageProvider } from "../../../context/LanguageContext";
import { isLocale, type Locale } from "../../../i18n/config";
import { dictionaries } from "../../../i18n/dictionaries";
import Nav from "../../../components/Nav";
import Hero from "../../../components/Hero";
import Work from "../../../components/Work";
import Services from "../../../components/Services";
import ContactCta from "../../../components/ContactCta";
import Footer from "../../../components/Footer";

export default async function Home({
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
        <Hero />
        <Services />
        <Work featured={["websites", "vistera"]} moreHref={`/${locale}/work`} />
        <ContactCta />
        <Footer />
      </main>
    </LanguageProvider>
  );
}
