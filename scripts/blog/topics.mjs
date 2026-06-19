import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import matter from "gray-matter";

const PILLARS = ["webdesign", "apps-automation", "seo"];
// pillar key → service-page path segment (same here) and the dict category label.
export const PILLAR_CATEGORY = {
  webdesign: "Web & Design",
  "apps-automation": "Apps & Automation",
  seo: "SEO & Growth",
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
  const pillarCounts = { webdesign: 0, "apps-automation": 0, seo: 0 };
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

// Choose the pillar with the fewest published posts that still has an uncovered
// topic; within it, the first uncovered topic. Deterministic, no state file.
export function pickTopic({ topics, existingSlugs, pillarCounts }) {
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
