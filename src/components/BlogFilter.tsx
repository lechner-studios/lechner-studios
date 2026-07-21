"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import PostMedia from "./PostMedia";
import { HREFLANG, type Locale } from "../i18n/config";
import type { Dictionary } from "../i18n/dictionaries";
import type { BlogMeta } from "../lib/blog";

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

// Sentinel, not a real category name, so it can never collide with a post's
// actual `category` string.
const ALL = "__all__";

// Data fetching stays server-side (BlogIndexPage calls getAllPosts and passes
// the full, already-sorted list down); this component only filters in
// memory. That keeps the index a static server render with a small client
// island for interactivity, rather than a client-fetched page.
export default function BlogFilter({
  posts,
  dict,
  locale,
}: {
  posts: BlogMeta[];
  dict: Dictionary;
  locale: Locale;
}) {
  // Server-rendered default is "all" — with JS disabled this state never
  // changes, so the full list still renders (progressive enhancement, not a
  // requirement for the list to appear at all).
  const [active, setActive] = useState<string>(ALL);

  // Derived from the posts actually present, never a hardcoded array — a
  // hardcoded map is exactly what silently dropped the old art system's 4th
  // pillar when it was added. Map preserves first-seen order, which (since
  // `posts` is already newest-first) surfaces the most recently active
  // category first.
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
    return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
  }, [posts]);

  const visible = active === ALL ? posts : posts.filter((post) => post.category === active);

  const chipBase: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: "0.7rem",
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    // 44px is the a11y hit-area floor (WCAG 2.5.5-adjacent guidance); the
    // chip's visual height can look smaller because of the border, but the
    // clickable box itself meets it.
    minHeight: "44px",
    padding: "0 18px",
    border: "1px solid var(--border)",
    borderRadius: "999px",
    background: "transparent",
    color: "var(--text-muted)",
    cursor: "pointer",
  };

  const chipActive: React.CSSProperties = {
    borderColor: "var(--accent)",
    color: "var(--accent)",
    background: "color-mix(in srgb, var(--accent) 12%, transparent)",
  };

  return (
    <div>
      <div
        role="group"
        aria-label={dict.blog.filterAriaLabel}
        style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "56px" }}
      >
        <button
          type="button"
          aria-pressed={active === ALL}
          onClick={() => setActive(ALL)}
          style={active === ALL ? { ...chipBase, ...chipActive } : chipBase}
        >
          {dict.blog.filterAll}
          <span style={{ opacity: 0.6 }}>{posts.length}</span>
        </button>
        {categories.map(({ name, count }) => (
          <button
            key={name}
            type="button"
            aria-pressed={active === name}
            onClick={() => setActive(name)}
            style={active === name ? { ...chipBase, ...chipActive } : chipBase}
          >
            {name}
            <span style={{ opacity: 0.6 }}>{count}</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
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
          {visible.map((post) => (
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
                <PostMedia meta={post} dict={dict} variant="tile" />
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
                    <span style={{ color: "var(--text-faint)" }}>
                      {formatDate(post.date, locale)} · {formatReadingTime(dict, post.minutes)}
                    </span>
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
  );
}
