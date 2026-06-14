import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LanguageProvider } from "../../../../../context/LanguageContext";
import { LOCALES, isLocale, HREFLANG, type Locale } from "../../../../../i18n/config";
import { dictionaries } from "../../../../../i18n/dictionaries";
import Nav from "../../../../../components/Nav";
import Footer from "../../../../../components/Footer";
import { getPost, getAllSlugs } from "../../../../../lib/blog";

export async function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getAllSlugs(locale).map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) return {};
  const locale: Locale = raw;
  const post = getPost(locale, slug);
  if (!post) return {};
  const { meta } = post;
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical: `/${locale}/blog/${slug}`,
      languages: {
        "de-AT": `/de/blog/${slug}`,
        en: `/en/blog/${slug}`,
        "x-default": `/de/blog/${slug}`,
      },
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://lechner-studios.at/${locale}/blog/${slug}`,
      siteName: "Lechner Studios",
      type: "article",
      publishedTime: meta.date,
      locale: dictionaries[locale].meta.ogLocale,
    },
  };
}

function formatDate(date: string, locale: Locale): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(HREFLANG[locale], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = dictionaries[locale];
  const post = getPost(locale, slug);
  if (!post) notFound();
  const { meta, content } = post;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    keywords: meta.keywords.join(", "),
    inLanguage: HREFLANG[locale],
    author: {
      "@type": "Organization",
      name: "Lechner Studios",
    },
    publisher: {
      "@type": "Organization",
      name: "Lechner Studios",
    },
    mainEntityOfPage: `https://lechner-studios.at/${locale}/blog/${slug}`,
  };

  return (
    <LanguageProvider locale={locale}>
      <a href="#main" className="skip-link">
        {dict.a11y.skipLink}
      </a>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Nav />
      <main id="main" style={{ minHeight: "100vh" }}>
        <section
          className="lc-pad-section"
          style={{
            background: "#F7F8F8",
            padding: "160px 48px 120px",
            minHeight: "100vh",
          }}
        >
          <article style={{ maxWidth: "880px", margin: "0 auto" }}>
            <Link
              href={`/${locale}/blog`}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#254268",
                textDecoration: "none",
                display: "inline-block",
                marginBottom: "48px",
              }}
            >
              {dict.blog.backToBlog}
            </Link>

            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.62rem",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#254268",
                marginBottom: "20px",
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <span>{meta.category}</span>
              <span>{formatDate(meta.date, locale)}</span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.4rem, 5vw, 4rem)",
                fontWeight: 300,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                color: "#15171A",
                marginBottom: "56px",
              }}
            >
              {meta.title}
            </h1>

            <div className="blog-prose">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
          </article>
        </section>
        <Footer />
      </main>
    </LanguageProvider>
  );
}
