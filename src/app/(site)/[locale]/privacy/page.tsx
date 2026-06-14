import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "../../../../i18n/config";
import { dictionaries } from "../../../../i18n/dictionaries";
import { pageMetadata } from "../../../../lib/seo";
import LegalPrivacyDE from "../../../../components/LegalPrivacyDE";
import LegalPrivacyEN from "../../../../components/LegalPrivacyEN";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale: Locale = raw;
  const dict = dictionaries[locale];
  return pageMetadata(locale, "/privacy", dict.meta.privacyTitle, dict.meta.privacyDescription);
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  return locale === "de" ? <LegalPrivacyDE /> : <LegalPrivacyEN />;
}
