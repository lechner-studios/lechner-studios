import { isOfferKey } from "../../src/lib/offers.mjs";
import { isGraphicKey } from "../../src/lib/post-graphics.mjs";
import { isWidgetKey } from "../../src/lib/post-widgets.mjs";
import { pillarLink } from "./pillar-links.mjs";

// The prompt requires every post to carry one worked example. The studio has no
// client data to draw on, so that example is always invented — which is fine as
// an illustration and misleading as a case study. The difference is whether the
// reader is told. An unmarked past-tense narrative ("Eine Pension in Tirol
// hatte … nach dem Relaunch kamen die ersten Direktanfragen") reads as a real
// engagement; under UWG §2 that is an irreführende Geschäftspraktik, not a
// matter of taste. "Ein konkretes Beispiel:" is NOT a marker — it is what the
// offending draft used.
const HYPOTHETICAL_MARKERS = {
  en: /\b(?:consider|imagine|suppose|picture|say)\s+(?:a|an)\b|\bhypothetical/i,
  de: /\b(?:angenommen|nehmen wir an|stellen sie sich vor|denken sie an|beispielhaft|fiktiv|hypothetisch)\b/i,
};

// The two rhetorical moves the prompt already bans and the model produces
// anyway. Deliberately narrow: German "nicht … sondern" and English "not … but"
// are ordinary constructions, so these match only the contrastive-definition
// shape ("These are not cosmetic concerns — they are the difference…",
// "Das ist keine Frage der Optik, sondern der Technik").
const NOT_X_BUT_Y = {
  en: /\b(?:is|are)\s+not\b[^.!?]{0,80}?[—–]\s*(?:they|it|that|these|this)\s+(?:is|are)\b/i,
  de: /\bist\s+kein(?:e|er|es|en)?\b[^.!?]{0,80}?,\s*sondern\b/i,
};

// Intensifier padding, same list the prompt carries. German "einfach" is
// excluded on purpose — "eine einfache Website" is ordinary de-AT, and banning
// it would burn the three-attempt budget on a false positive.
const BODY_INTENSIFIERS = /\b(?:really|actually|truly|genuinely|simply|wirklich|tatsächlich)\b/i;

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
  // `widget` is optional (PostWidget renders nothing when absent), but a typo
  // must not ship — a bad key renders nothing, silently.
  if (fm.widget !== undefined && !isWidgetKey(fm.widget)) v.push("widget: unknown widget key");
  // Catches a raw Pexels CDN URL leaking into frontmatter, which would be a
  // DSGVO hotlink (images must be downloaded + self-hosted, never linked live).
  if (fm.image !== undefined && !String(fm.image).startsWith("/blog/")) {
    v.push("image: must be a /blog/ path (self-hosted)");
  }
  if (fm.description && (fm.description.length < 50 || fm.description.length > 160)) {
    v.push("description: must be 50–160 chars");
  }
  // The pillar link comes from PILLAR_LINKS, not from the pillar name. Web &
  // Design has no on-site page since #118, and this rule used to demand the
  // /:locale/webdesign route that next.config.ts 301s to the werk storefront.
  const wantLink = pillarLink(pillarPath, locale);
  if (!wantLink) v.push(`pillar: '${pillarPath}' has no link target (see scripts/blog/pillar-links.mjs)`);
  else if (!body.includes(wantLink)) v.push(`link: body must link to ${wantLink}`);
  if (!body.includes(`/${locale}/contact`)) v.push(`link: body must link to /${locale}/contact`);
  if (!/^##\s/m.test(body)) v.push("structure: body needs at least one ## section");

  // Dash budget. German uses the Gedankenstrich legitimately, so this is a cap,
  // not a ban. Published posts averaged ~35 per post; natural prose is 2-5 per
  // 1000 words.
  const dashes = (body.match(/[—–]/g) || []).length;
  // States the arithmetic, not just the verdict. A blind retry moved 10 → 8 → 7
  // and never landed; "remove at least 4" is a target the model can hit.
  if (dashes > 6) v.push(`cadence: ${dashes} dashes in the body (max 6) — remove at least ${dashes - 6}, using commas, colons or shorter sentences`);

  // Intensifier padding in the title reads as machine-written and was the single
  // most repeated tell across the published posts.
  if (/\b(wirklich|really|actually|truly|genuinely)\b/i.test(String(fm.title))) {
    v.push("title: drop the intensifier (wirklich/really/actually) — the claim is stronger without it");
  }

  // The "X - und wann/warum nicht" title formula, repeated six times across the
  // published posts.
  if (/[—–]\s*(und|and)\s+(wo|wann|warum|why|when|what|how)\b/i.test(String(fm.title))) {
    v.push("title: avoid the 'X – und wann/warum nicht' formula; vary the shape");
  }

  const marker = HYPOTHETICAL_MARKERS[locale];
  if (marker && !marker.test(body)) {
    v.push("example: mark the worked example as hypothetical (Consider a… / Angenommen, …) — an unmarked one reads as a real client");
  }

  // Quote the offending clause. These messages are fed back to the model on
  // retry, and "you used the banned contrast" is not actionable — the exact
  // sentence is.
  const contrast = body.match(NOT_X_BUT_Y[locale] ?? /(?!)/);
  if (contrast) {
    v.push(`cadence: rewrite "${contrast[0].trim()}" — drop the 'not X, it's Y' contrast and state the point directly`);
  }

  const padding = body.match(BODY_INTENSIFIERS);
  if (padding) v.push(`cadence: intensifier padding in the body ("${padding[0]}") — the sentence is stronger without it`);

  return v;
}
