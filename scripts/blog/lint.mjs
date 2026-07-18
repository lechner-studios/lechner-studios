import { isOfferKey } from "../../src/lib/offers.mjs";
import { isGraphicKey } from "../../src/lib/post-graphics.mjs";

// Returns an array of human-readable violation strings; [] means clean.
// Catches the Gewerbe-scope / honesty risks the owner cares about, plus the
// structural contract the blog renderer + sitemap rely on.
export function lintPost({ frontmatter: fm, body, pillarPath, locale }) {
  const v = [];
  const text = `${fm.title} ${fm.description} ${fm.excerpt} ${body}`;

  // --- scope / honesty ---
  if (/(?:€|eur)\s?\d|\d\s?(?:€|eur)\b/i.test(text)) v.push("price: contains a € / EUR amount (no binding prices in posts)");
  if (/\bgarant|\bguarantee/i.test(text)) v.push("guarantee: contains a guarantee claim");
  if (/\d{1,3}\s?%/.test(text)) v.push("metric/percent: contains a % figure (no fabricated metrics)");
  if (/\b(ranking|platz)\s?(?:#?1|eins|one)\b/i.test(text)) v.push("metric: implies a ranking result");
  // Standalone branding is IN scope now (the studio runs a registered Werbeagentur),
  // so brand/identity/content posts no longer need to hedge as "part of a build".

  // --- structure / contract ---
  for (const f of ["title", "description", "excerpt", "date", "category"]) {
    if (!fm[f] || String(fm[f]).trim() === "") v.push(`frontmatter: '${f}' is empty`);
  }
  if (!Array.isArray(fm.keywords) || fm.keywords.length < 5 || fm.keywords.length > 7) {
    v.push("keywords: must be 5–7 entries");
  }
  // `offer` is optional (blog.ts defaults it), but a typo must not ship — a bad
  // key renders no CTA at all, silently.
  if (fm.offer !== undefined && !isOfferKey(fm.offer)) {
    v.push(`offer: '${fm.offer}' is not a known offer key`);
  }
  // `graphic` is optional (PostGraphic falls back to a photo, then a flat
  // band), but a typo must not ship — a bad key renders nothing, silently.
  if (fm.graphic !== undefined && !isGraphicKey(fm.graphic)) v.push("graphic: unknown graphic key");
  // Catches a raw Pexels CDN URL leaking into frontmatter, which would be a
  // DSGVO hotlink (images must be downloaded + self-hosted, never linked live).
  if (fm.image !== undefined && !String(fm.image).startsWith("/blog/")) {
    v.push("image: must be a /blog/ path (self-hosted)");
  }
  if (fm.description && (fm.description.length < 50 || fm.description.length > 160)) {
    v.push("description: must be 50–160 chars");
  }
  if (!body.includes(`/${locale}/${pillarPath}`)) v.push(`link: body must link to /${locale}/${pillarPath}`);
  if (!body.includes(`/${locale}/contact`)) v.push(`link: body must link to /${locale}/contact`);
  if (!/^##\s/m.test(body)) v.push("structure: body needs at least one ## section");

  return v;
}
