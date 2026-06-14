import type { MetadataRoute } from "next";
import { getAllSlugs } from "../lib/blog";

const BASE = "https://lechner-studios.at";

const routes = ["", "/work", "/about", "/blog", "/contact", "/impressum", "/privacy"] as const;

function priorityFor(route: string): number {
  if (route === "") return 1.0;
  if (route === "/blog") return 0.7;
  if (route === "/impressum" || route === "/privacy") return 0.5;
  return 0.8;
}

function entry(route: string, lastModified: Date): MetadataRoute.Sitemap {
  return ["de", "en"].map((locale) => ({
    url: `${BASE}/${locale}${route}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: priorityFor(route),
    alternates: {
      languages: {
        "de-AT": `${BASE}/de${route}`,
        en: `${BASE}/en${route}`,
        "x-default": `${BASE}/de${route}`,
      },
    },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries = routes.flatMap((route) => entry(route, lastModified));

  // One entry per blog post per locale. Slugs are shared across locales (same
  // file basename), so deriving from the de set covers both — but read each
  // locale independently to stay correct if a translation is ever missing.
  const postEntries: MetadataRoute.Sitemap = [];
  for (const locale of ["de", "en"] as const) {
    for (const slug of getAllSlugs(locale)) {
      postEntries.push({
        url: `${BASE}/${locale}/blog/${slug}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.6,
        alternates: {
          languages: {
            "de-AT": `${BASE}/de/blog/${slug}`,
            en: `${BASE}/en/blog/${slug}`,
            "x-default": `${BASE}/de/blog/${slug}`,
          },
        },
      });
    }
  }

  return [...staticEntries, ...postEntries];
}
