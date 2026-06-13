import type { Metadata } from "next";
import localFont from "next/font/local";
import { Cormorant } from "next/font/google";
import { notFound } from "next/navigation";
import "../../globals.css";
import { dictionaries } from "../../../i18n/dictionaries";
import { LOCALES, isLocale, HREFLANG, alternateLocale, type Locale } from "../../../i18n/config";

// Brand v4.2 typography — display unchanged from v4.1.
// Body sans: General Sans (replaces Manrope). Mono: IBM Plex Mono (replaces JetBrains Mono).
// Cormorant pruned to display midweights only — body serif retired per spec §3.
// Spec: websites/docs/superpowers/specs/2026-05-01-brand-v4.2-typography-design.md
// Companion ADR: ai-brain/decisions/0027-lechner-brand-guidelines-v4.2-typography.md

const cormorantBold = localFont({
  src: "../../../../public/fonts/cormorant-700.woff2",
  weight: "700",
  style: "normal",
  display: "swap",
  variable: "--font-display-bold",
});

const italiana = localFont({
  src: "../../../../public/fonts/italiana-400.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-display-italiana",
});

// Display weights 300/400 are what the section headlines actually request
// (LegalStyles headlineStyle 300, h3Style 400; Hero/Services h2 300; About/Founder
// h2 400). Loading 500/600 only forced the browser to substitute the nearest
// face — so load the full 300–600 range the UI uses.
const cormorant = Cormorant({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const generalSans = localFont({
  variable: "--font-sans",
  display: "swap",
  src: [
    { path: "../../../../public/fonts/general-sans-400.woff2", weight: "400", style: "normal" },
    { path: "../../../../public/fonts/general-sans-500.woff2", weight: "500", style: "normal" },
    { path: "../../../../public/fonts/general-sans-600.woff2", weight: "600", style: "normal" },
  ],
});

const ibmPlexMono = localFont({
  variable: "--font-mono",
  display: "swap",
  src: [
    { path: "../../../../public/fonts/ibm-plex-mono-400.woff2", weight: "400", style: "normal" },
    { path: "../../../../public/fonts/ibm-plex-mono-500.woff2", weight: "500", style: "normal" },
  ],
});

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

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
    metadataBase: new URL("https://lechner-studios.at"),
    title: {
      default: dict.meta.homeTitle,
      template: "%s · Lechner Studios",
    },
    description: dict.meta.homeDescription,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        "de-AT": "/de",
        en: "/en",
        "x-default": "/de",
      },
    },
    authors: [{ name: "Lechner Studios" }],
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: dict.meta.homeTitle,
      description: dict.meta.homeDescription,
      url: `https://lechner-studios.at/${locale}`,
      siteName: "Lechner Studios",
      locale: dict.meta.ogLocale,
      alternateLocale: dictionaries[alternateLocale(locale)].meta.ogLocale,
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: dict.meta.homeTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.homeTitle,
      description: dict.meta.homeDescription,
      images: ["/og-image.png"],
    },
  };
}

function buildJsonLd(locale: Locale) {
  const dict = dictionaries[locale];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://lechner-studios.at#organization",
        name: "Lechner Studios",
        url: `https://lechner-studios.at/${locale}`,
        logo: "https://lechner-studios.at/og-image.png",
        email: "hallo@lechner-studios.at",
        description: dict.meta.orgDescription,
        founder: { "@id": "https://lechner-studios.at#sonja" },
        address: {
          "@type": "PostalAddress",
          streetAddress: "Wattenbachgasse 29",
          addressLocality: "Wattens",
          postalCode: "6112",
          addressCountry: "AT",
        },
        inLanguage: HREFLANG[locale],
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://lechner-studios.at#localbusiness",
        name: "Lechner Studios",
        url: `https://lechner-studios.at/${locale}`,
        email: "hallo@lechner-studios.at",
        image: "https://lechner-studios.at/og-image.png",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Wattenbachgasse 29",
          addressLocality: "Wattens",
          postalCode: "6112",
          addressCountry: "AT",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 47.293,
          longitude: 11.601,
        },
        areaServed: ["AT", "DE", "CH"],
      },
      {
        "@type": "Person",
        "@id": "https://lechner-studios.at#sonja",
        name: "Sonja Lechner",
        jobTitle: locale === "de" ? "Gründerin" : "Founder",
        worksFor: { "@id": "https://lechner-studios.at#organization" },
      },
    ],
  };
}

export default async function LocaleRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const jsonLd = buildJsonLd(locale);

  return (
    <html lang={HREFLANG[locale]}>
      <body
        className={`${cormorantBold.variable} ${italiana.variable} ${cormorant.variable} ${generalSans.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
