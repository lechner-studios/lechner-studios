import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import remarkGfm from "remark-gfm";
import { LanguageProvider } from "../../../../../context/LanguageContext";
import { LOCALES, isLocale, HREFLANG, type Locale } from "../../../../../i18n/config";
import { dictionaries, type Dictionary } from "../../../../../i18n/dictionaries";
import { pageMetadata } from "../../../../../lib/seo";
import Nav from "../../../../../components/Nav";
import Footer from "../../../../../components/Footer";
import PostMedia, { pickGraphic } from "../../../../../components/PostMedia";
import PostWidget from "../../../../../components/PostWidget";
import BlogOfferCta from "../../../../../components/BlogOfferCta";
import PostFigure from "../../../../../components/PostFigure";
import { figureKeyFromSrc } from "../../../../../lib/post-figures.mjs";
import type { FigureKey } from "../../../../../lib/post-figures.d.mts";
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
  const base = pageMetadata(locale, `/blog/${slug}`, meta.title, meta.description, { type: "article" });
  return {
    ...base,
    keywords: meta.keywords,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: meta.date,
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

function formatReadingTime(dict: Dictionary, minutes: number): string {
  return dict.blog.readingTime.replace("{n}", String(minutes));
}

// Inline figures are authored as a lone markdown image using the `figure:`
// scheme — `![](figure:type-mood)` on its own line. remark wraps that in a
// paragraph, so the swap happens on `p`: a <figure> nested inside a <p> would
// be hoisted out by the HTML parser and break the layout, so we replace the
// paragraph rather than the image.
//
// The markdown only ever names a key. `figureKeyFromSrc` returns undefined for
// anything unregistered, in which case the paragraph renders normally and the
// image degrades to a plain (broken-src) image rather than vanishing silently.
function isWhitespace(n: { type: string; value?: string }) {
  return n.type === "text" && !(n.value ?? "").trim();
}

function figureInParagraph(node: unknown): FigureKey | undefined {
  const el = node as { children?: Array<Record<string, unknown>> } | undefined;
  const kids = (el?.children ?? []).filter(
    (c) => !isWhitespace(c as { type: string; value?: string }),
  );
  if (kids.length !== 1) return undefined;
  const only = kids[0] as {
    type?: string;
    tagName?: string;
    properties?: { src?: unknown };
  };
  if (only.type !== "element" || only.tagName !== "img") return undefined;
  return figureKeyFromSrc(only.properties?.src);
}

// react-markdown sanitizes URLs by protocol allowlist, which strips the
// `figure:` scheme before any component sees it. Let a URL through only when
// it names a REGISTERED figure, and defer to the stock sanitizer for
// everything else — so the allowlist stays intact for real post content.
function urlTransform(url: string) {
  return figureKeyFromSrc(url) ? url : defaultUrlTransform(url);
}

function markdownComponents(dict: Dictionary) {
  return {
    p({ node, children, ...rest }: { node?: unknown; children?: React.ReactNode }) {
      const key = figureInParagraph(node);
      const labels = key ? dict.blogFigure[key] : undefined;
      if (key && labels) return <PostFigure figure={key} labels={labels} />;
      return <p {...rest}>{children}</p>;
    },
  };
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
  // A crafted graphic has no photographer, so the credit line below is
  // gated on this — it must never render under a graphic.
  const usingGraphic = Boolean(pickGraphic(meta, dict));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.description,
    // Article rich results need an image; posts have no per-post hero, so the
    // brand OG card (1200×630) is the representative fallback.
    image: "https://lechner-studios.at/og-image.png",
    datePublished: meta.date,
    dateModified: meta.date,
    keywords: meta.keywords.join(", "),
    inLanguage: HREFLANG[locale],
    author: {
      "@type": "Organization",
      name: "Lechner Studios",
      url: "https://lechner-studios.at",
    },
    publisher: {
      "@type": "Organization",
      name: "Lechner Studios",
      logo: {
        "@type": "ImageObject",
        // The wordmark. android-chrome-512 is the 2x2 tile, which is the
        // favicon/utility variant of the mark rather than the logo.
        url: "https://lechner-studios.at/logo.png",
        width: 1280,
        height: 400,
      },
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
            background: "var(--bg)",
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
                color: "var(--accent)",
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
                color: "var(--accent)",
                marginBottom: "20px",
                display: "flex",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <span>{meta.category}</span>
              <span>
                {formatDate(meta.date, locale)} · {formatReadingTime(dict, meta.minutes)}
              </span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.4rem, 5vw, 4rem)",
                fontWeight: 300,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                color: "var(--text)",
                marginBottom: "40px",
              }}
            >
              {meta.title}
            </h1>

            <div style={{ marginBottom: "56px" }}>
              <PostMedia meta={meta} dict={dict} variant="hero" />
            </div>

            {!usingGraphic && meta.image && meta.imageCredit && (
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", letterSpacing: "0.04em", color: "var(--text-faint)", marginTop: "-40px", marginBottom: "56px" }}>
                Foto:{" "}
                <a href={meta.imageCreditUrl} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
                  {meta.imageCredit}
                </a>
                {" · "}
                <a href={meta.imagePexelsUrl} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
                  Pexels
                </a>
              </p>
            )}

            <div className="blog-prose">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                urlTransform={urlTransform}
                components={markdownComponents(dict)}
              >
                {content}
              </ReactMarkdown>
            </div>

            <PostWidget widget={meta.widget} dict={dict} />

            <BlogOfferCta offer={meta.offer} />
          </article>
        </section>
        <Footer />
      </main>
    </LanguageProvider>
  );
}
