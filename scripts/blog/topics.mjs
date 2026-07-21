import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import matter from "gray-matter";

const PILLARS = ["webdesign", "apps-automation", "seo", "brand"];
// pillar key → service-page path segment (same here) and the dict category label.
export const PILLAR_CATEGORY = {
  webdesign: "Web & Design",
  "apps-automation": "Apps & Automation",
  seo: "SEO & Growth",
  brand: "Brand & Identity",
};

export function loadTopics(yamlPath) {
  const raw = fs.readFileSync(yamlPath, "utf8");
  const data = yaml.load(raw) || {};
  // normalise: ensure every pillar key exists as an array
  const out = {};
  for (const p of PILLARS) out[p] = Array.isArray(data[p]) ? data[p] : [];
  return out;
}

// Existing published slugs + per-pillar counts, read straight from content/blog.
export function readPublished(blogDir) {
  let files = [];
  try { files = fs.readdirSync(blogDir); } catch { files = []; }
  const slugs = new Set();
  const pillarCounts = { webdesign: 0, "apps-automation": 0, seo: 0, brand: 0 };
  for (const f of files) {
    if (!f.endsWith(".en.md")) continue; // count each post once (via its en file)
    const slug = f.slice(0, -".en.md".length);
    slugs.add(slug);
    try {
      const { data } = matter(fs.readFileSync(path.join(blogDir, f), "utf8"));
      const cat = String(data.category ?? "");
      const pillar = Object.keys(PILLAR_CATEGORY).find((k) => PILLAR_CATEGORY[k] === cat);
      if (pillar) pillarCounts[pillar] += 1;
    } catch { /* ignore unreadable */ }
  }
  return { slugs, pillarCounts };
}

// Most recent `limit` published titles for one locale, newest first — fed into
// the writer prompt so a one-post-at-a-time generator can see (and avoid
// repeating) the shapes it has already used. Resilient: an unreadable or empty
// content/blog directory yields [], never throws.
export function readRecentTitles(blogDir, locale, limit = 8) {
  let files = [];
  try { files = fs.readdirSync(blogDir); } catch { files = []; }
  const suffix = `.${locale}.md`;
  const entries = [];
  for (const f of files) {
    if (!f.endsWith(suffix)) continue;
    try {
      const { data } = matter(fs.readFileSync(path.join(blogDir, f), "utf8"));
      if (data.title && data.date) entries.push({ title: String(data.title), date: String(data.date) });
    } catch { /* ignore unreadable */ }
  }
  entries.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return entries.slice(0, limit).map((e) => e.title);
}

// Choose the pillar with the fewest published posts that still has an uncovered
// topic; within it, the first uncovered topic. Deterministic, no state file.
export function pickTopic({ topics, existingSlugs, pillarCounts, targetSlug }) {
  // Owner override: generate one specific topic by slug (any pillar), as long as
  // it exists and isn't already published — lets us steer pillar balance on demand.
  if (targetSlug) {
    for (const pillar of PILLARS) {
      const topic = (topics[pillar] || []).find((t) => t.slug === targetSlug);
      if (topic) return existingSlugs.has(topic.slug) ? null : { pillar, category: PILLAR_CATEGORY[pillar], ...topic };
    }
    return null;
  }
  const candidates = PILLARS
    .map((pillar) => {
      const next = (topics[pillar] || []).find((t) => !existingSlugs.has(t.slug));
      return next ? { pillar, count: pillarCounts[pillar] ?? 0, topic: next } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.count - b.count);
  if (candidates.length === 0) return null;
  const { pillar, topic } = candidates[0];
  return { pillar, category: PILLAR_CATEGORY[pillar], ...topic };
}
