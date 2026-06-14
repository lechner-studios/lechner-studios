import type { Metadata } from "next";
import { dictionaries } from "../i18n/dictionaries";
import { alternateLocale, type Locale } from "../i18n/config";

const BASE = "https://lechner-studios.at";

export function pageMetadata(
  locale: Locale,
  path: string,
  title: string,
  description: string,
  opts?: { type?: "website" | "article" },
): Metadata {
  const url = `${BASE}/${locale}${path}`;
  const dict = dictionaries[locale];
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: { "de-AT": `/de${path}`, en: `/en${path}`, "x-default": `/de${path}` },
    },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: "Lechner Studios",
      locale: dict.meta.ogLocale,
      alternateLocale: dictionaries[alternateLocale(locale)].meta.ogLocale,
      type: opts?.type ?? "website",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
  };
}
