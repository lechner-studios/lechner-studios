import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LanguageProvider } from "../../../../context/LanguageContext";
import { isLocale, HREFLANG, type Locale } from "../../../../i18n/config";
import { dictionaries } from "../../../../i18n/dictionaries";
import { pageMetadata } from "../../../../lib/seo";
import Nav from "../../../../components/Nav";
import Footer from "../../../../components/Footer";
import Overline from "../../../../components/Overline";
import PostImage from "../../../../components/PostImage";
import { getAllPosts } from "../../../../lib/blog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale: Locale = raw;
  const dict = dictionaries[locale];
  return pageMetadata(locale, "/blog", dict.meta.blogTitle, dict.meta.blogDescription);
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

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = dictionaries[locale];
  const posts = getAllPosts(locale);

  return (
    <LanguageProvider locale={locale}>
      <a href="#main" className="skip-link">
        {dict.a11y.skipLink}
      </a>
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
          <div style={{ maxWidth: "880px", margin: "0 auto" }}>
            {/* Editorial header */}
            <Overline marginBottom="1.5rem">
              {dict.blog.overline}
            </Overline>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "var(--text)",
                marginBottom: "1.5rem",
              }}
            >
              {dict.blog.headline}
            </h1>
            <p
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.7,
                color: "var(--text-muted)",
                maxWidth: "56ch",
                marginBottom: "80px",
              }}
            >
              {dict.blog.intro}
            </p>

            {/* Post list */}
            {posts.length === 0 ? (
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.85rem",
                  letterSpacing: "0.05em",
                  color: "var(--text-faint)",
                }}
              >
                {dict.blog.empty}
              </p>
            ) : (
              <ul style={{ listStyle: "none", display: "grid", gap: "1px", background: "var(--border)" }}>
                {posts.map((post) => (
                  <li key={post.slug} style={{ background: "var(--bg)" }}>
                    <Link
                      href={`/${locale}/blog/${post.slug}`}
                      style={{
                        display: "flex",
                        gap: "24px",
                        alignItems: "flex-start",
                        padding: "40px 0",
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      <PostImage image={post.image} alt={post.imageAlt} variant="tile" />
                      <div style={{ flexGrow: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.62rem",
                            fontWeight: 600,
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            color: "var(--accent)",
                            marginBottom: "16px",
                            display: "flex",
                            gap: "16px",
                            flexWrap: "wrap",
                          }}
                        >
                          <span>{post.category}</span>
                          <span style={{ color: "var(--text-faint)" }}>{formatDate(post.date, locale)}</span>
                        </div>
                        <h2
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "clamp(1.6rem, 2.6vw, 2.1rem)",
                            fontWeight: 400,
                            lineHeight: 1.2,
                            letterSpacing: "-0.01em",
                            color: "var(--text)",
                            marginBottom: "12px",
                          }}
                        >
                          {post.title}
                        </h2>
                        <p
                          style={{
                            fontSize: "1rem",
                            lineHeight: 1.7,
                            color: "var(--text-muted)",
                            maxWidth: "60ch",
                            marginBottom: "16px",
                          }}
                        >
                          {post.excerpt}
                        </p>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "var(--accent)",
                          }}
                        >
                          {dict.blog.readMore}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
        <Footer />
      </main>
    </LanguageProvider>
  );
}
