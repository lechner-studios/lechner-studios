import type { Metadata } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import "../../globals.css";
import { dictionaries } from "../../../i18n/dictionaries";
import { LOCALES, isLocale, HREFLANG, alternateLocale, type Locale } from "../../../i18n/config";
import { LanguageProvider } from "../../../context/LanguageContext";
import StudioDirectorChat from "../../../components/StudioDirectorChat";
import SentryInit from "../../../components/SentryInit";
import { Analytics } from "@vercel/analytics/next";

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
// face — so cover the full 300–600 range the UI uses.
// Self-hosted from /public for build-time reproducibility + supply-chain parity
// with the other three local faces (no gstatic fetch at build). Cormorant ships
// as a latin-subset variable font (weight axis 300–700) — one upright woff2 +
// one italic woff2 cover every weight/style the UI requests. OFL-licensed
// (public/fonts/OFL.txt). Files are the same binaries next/font/google fetched.
const cormorant = localFont({
  variable: "--font-display",
  display: "swap",
  src: [
    { path: "../../../../public/fonts/cormorant-variable.woff2", weight: "300 700", style: "normal" },
    { path: "../../../../public/fonts/cormorant-italic-variable.woff2", weight: "300 700", style: "italic" },
  ],
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
        // 48px raster: Google Search wants a multiple of 48px and ignores
        // smaller rasters when picking the SERP site icon.
        { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
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
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.homeTitle,
      description: dict.meta.homeDescription,
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
        // The wordmark, not the OG card: Google renders this as the
        // organization's logo (knowledge panel), so it needs to read as a logo
        // on a white background rather than as a social share image.
        logo: "https://lechner-studios.at/logo.png",
        email: "hallo@lechner-studios.at",
        telephone: "+43 664 153 4653",
        description: dict.meta.orgDescription,
        founder: { "@id": "https://lechner-studios.at#sonja" },
        address: {
          "@type": "PostalAddress",
          streetAddress: "Wattenbachgasse 29",
          addressLocality: "Wattens",
          postalCode: "6112",
          addressCountry: "AT",
        },
        // Entity reconciliation: confirms the GitHub org and this domain are
        // the same entity. Add further verified profiles here as they exist —
        // only URLs we actually control belong in sameAs.
        sameAs: ["https://github.com/lechner-studios"],
        // Competencies, scoped to what ADR-0011 puts in the four pillars.
        // Deliberately excludes anything the ADR marks out of scope, so this
        // stays a claim we can stand behind rather than a keyword list.
        knowsAbout: [
          "Webdesign",
          "Web Development",
          "Brand & Identity",
          "SEO",
          "Business Process Automation",
          "API Integrations",
          "Next.js",
          "Supabase",
          "GDPR Compliant Architecture",
        ],
        inLanguage: HREFLANG[locale],
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://lechner-studios.at#localbusiness",
        name: "Lechner Studios",
        url: `https://lechner-studios.at/${locale}`,
        email: "hallo@lechner-studios.at",
        telephone: "+43 664 153 4653",
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
        // No areaServed on purpose. It used to read ["AT","DE","CH"], which
        // encoded a ceiling the business does not apply: a client in Italy or
        // England is a client. Omitting the property makes no claim at all,
        // which is both accurate and better for local relevance than a broad
        // region competing with the address and geo above. The "areaServed":
        // "Tirol" line in the /seo schema artifact is unaffected — that one is
        // backed by the Service node live on werk.lechner-studios.at.
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
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('ls-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;}catch(e){}})();",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <SentryInit />
        {children}
        <LanguageProvider locale={locale}>
          <StudioDirectorChat />
        </LanguageProvider>
        {/* Cookieless, first-party reach measurement (disclosed in /[locale]/privacy). */}
        <Analytics />
      </body>
    </html>
  );
}
