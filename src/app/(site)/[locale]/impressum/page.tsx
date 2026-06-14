import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "../../../../i18n/config";
import { dictionaries } from "../../../../i18n/dictionaries";
import { pageMetadata } from "../../../../lib/seo";
import LegalImpressumDE from "../../../../components/LegalImpressumDE";
import LegalImpressumEN from "../../../../components/LegalImpressumEN";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale: Locale = raw;
  const dict = dictionaries[locale];
  return pageMetadata(locale, "/impressum", dict.meta.impressumTitle, dict.meta.impressumDescription);
}

export default async function ImpressumPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  return locale === "de" ? <LegalImpressumDE /> : <LegalImpressumEN />;
}
