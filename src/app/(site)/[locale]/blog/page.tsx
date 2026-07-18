import type { Metadata } from "next";
import React from "react";
import { notFound } from "next/navigation";
import { LanguageProvider } from "../../../../context/LanguageContext";
import { isLocale, type Locale } from "../../../../i18n/config";
import { dictionaries } from "../../../../i18n/dictionaries";
import { pageMetadata } from "../../../../lib/seo";
import Nav from "../../../../components/Nav";
import Footer from "../../../../components/Footer";
import Overline from "../../../../components/Overline";
import BlogFilter from "../../../../components/BlogFilter";
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

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = dictionaries[locale];
  // Data fetching stays server-side. The full, already-sorted list is handed
  // to BlogFilter (a client component) which filters it in memory — the
  // client never re-fetches.
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

            <BlogFilter posts={posts} dict={dict} locale={locale} />
          </div>
        </section>
        <Footer />
      </main>
    </LanguageProvider>
  );
}
