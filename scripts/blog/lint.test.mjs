import { test } from "node:test";
import assert from "node:assert/strict";
import { lintPost } from "./lint.mjs";

const goodFm = {
  title: "Title here that is reasonable",
  description: "A meta description that is comfortably between fifty and a hundred and sixty characters long for SEO purposes here.",
  excerpt: "A short teaser that sits in the sixty to a hundred character window nicely.",
  date: "2026-06-19",
  category: "SEO & Growth",
  keywords: ["a", "b", "c", "d", "e"],
};
// Carries a marked hypothetical example, because every post must — the prompt
// mandates one and the studio has no client data to draw a real one from.
const goodBody = "Intro paragraph.\n\n## A section\n\nConsider a joinery with one page. Text. See [how we do SEO](/en/seo) or [get in touch](/en/contact).";

test("clean post passes", () => {
  assert.deepEqual(lintPost({ frontmatter: goodFm, body: goodBody, pillarPath: "seo", locale: "en" }), []);
});

test("flags a price", () => {
  const v = lintPost({ frontmatter: goodFm, body: goodBody + " It costs €3.900.", pillarPath: "seo", locale: "en" });
  assert.ok(v.some((x) => /price/i.test(x)));
});

test("flags a guarantee", () => {
  const v = lintPost({ frontmatter: goodFm, body: goodBody + " We guarantee results.", pillarPath: "seo", locale: "en" });
  assert.ok(v.some((x) => /guarantee/i.test(x)));
});

test("flags a percent/metric claim", () => {
  const v = lintPost({ frontmatter: goodFm, body: goodBody + " Traffic grew 40% in a month.", pillarPath: "seo", locale: "en" });
  assert.ok(v.some((x) => /metric|percent/i.test(x)));
});

test("flags missing internal links", () => {
  const v = lintPost({ frontmatter: goodFm, body: "Intro.\n\n## H\n\nNo links here at all.", pillarPath: "seo", locale: "en" });
  assert.ok(v.some((x) => /link/i.test(x)));
});

test("flags incomplete frontmatter", () => {
  const v = lintPost({ frontmatter: { ...goodFm, keywords: ["only", "three", "kw"] }, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.ok(v.some((x) => /keywords/i.test(x)));
});

test("accepts a valid offer key", () => {
  const v = lintPost({ frontmatter: { ...goodFm, offer: "direktbucher" }, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.deepEqual(v, []);
});

test("accepts an absent offer key", () => {
  const v = lintPost({ frontmatter: goodFm, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.deepEqual(v, []);
});

test("rejects an unknown offer key", () => {
  const v = lintPost({ frontmatter: { ...goodFm, offer: "websitecheck" }, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.ok(v.some((x) => /offer/i.test(x)));
});

test("accepts a valid /blog/ image path", () => {
  const v = lintPost({ frontmatter: { ...goodFm, image: "/blog/x.jpg" }, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.deepEqual(v, []);
});
test("accepts an absent image", () => {
  const v = lintPost({ frontmatter: goodFm, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.deepEqual(v, []);
});
test("rejects an image that is a remote hotlink, not a /blog/ path", () => {
  const v = lintPost({ frontmatter: { ...goodFm, image: "https://images.pexels.com/x.jpg" }, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.ok(v.some((x) => /image/i.test(x)));
});

test("accepts a valid graphic key", () => {
  const v = lintPost({ frontmatter: { ...goodFm, graphic: "dom-diff" }, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.deepEqual(v, []);
});
test("rejects an unknown graphic key", () => {
  const v = lintPost({ frontmatter: { ...goodFm, graphic: "nope" }, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.ok(v.some((x) => /graphic/i.test(x)));
});

test("accepts a valid widget key", () => {
  const v = lintPost({ frontmatter: { ...goodFm, widget: "portal-commission" }, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.deepEqual(v, []);
});
test("accepts an absent widget key", () => {
  const v = lintPost({ frontmatter: goodFm, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.deepEqual(v, []);
});
test("rejects an unknown widget key", () => {
  const v = lintPost({ frontmatter: { ...goodFm, widget: "nope" }, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.ok(v.some((x) => /widget/i.test(x)));
});

test("accepts a body with 0 dashes", () => {
  const v = lintPost({ frontmatter: goodFm, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.deepEqual(v, []);
});

test("accepts a body with 6 dashes (at the cap)", () => {
  const dashy = goodBody + " A – b – c – d – e – f – g.";
  assert.equal((dashy.match(/[—–]/g) || []).length, 6);
  const v = lintPost({ frontmatter: goodFm, body: dashy, pillarPath: "seo", locale: "en" });
  assert.deepEqual(v, []);
});

test("rejects a body with 7 dashes (over the cap)", () => {
  const dashy = goodBody + " A – b – c – d – e – f – g – h.";
  assert.equal((dashy.match(/[—–]/g) || []).length, 7);
  const v = lintPost({ frontmatter: goodFm, body: dashy, pillarPath: "seo", locale: "en" });
  assert.ok(v.some((x) => /cadence/i.test(x)));
});

test("accepts the clean goodFm title (no intensifier)", () => {
  const v = lintPost({ frontmatter: goodFm, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.deepEqual(v, []);
});

test("rejects a title containing 'wirklich'", () => {
  const v = lintPost({ frontmatter: { ...goodFm, title: "Braucht Ihr Unternehmen wirklich eine neue Website?" }, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.ok(v.some((x) => /title/i.test(x) && /intensifier/i.test(x)));
});

test("rejects a title with the 'X – und warum nicht' formula", () => {
  const v = lintPost({ frontmatter: { ...goodFm, title: "Ein neues Logo – und warum nicht" }, body: goodBody, pillarPath: "seo", locale: "en" });
  assert.ok(v.some((x) => /title/i.test(x) && /formula/i.test(x)));
});

// --- pillar link target (#118 consolidation) ---

test("a Web & Design post must link to the werk storefront, not the dead on-site route", () => {
  // /:locale/webdesign only 301-redirects since #118. The old rule REQUIRED it.
  const body = goodBody.replace("/en/seo", "/en/webdesign");
  const v = lintPost({ frontmatter: goodFm, body, pillarPath: "webdesign", locale: "en" });
  assert.deepEqual(v, ["link: body must link to https://werk.lechner-studios.at"]);
});

test("a Web & Design post linking to werk passes", () => {
  const body = goodBody.replace("/en/seo", "https://werk.lechner-studios.at");
  assert.deepEqual(lintPost({ frontmatter: goodFm, body, pillarPath: "webdesign", locale: "en" }), []);
});

test("the three on-site pillars still want their locale-prefixed route", () => {
  for (const [pillar, path] of [["apps-automation", "/en/apps-automation"], ["seo", "/en/seo"], ["brand", "/en/brand"]]) {
    const body = goodBody.replace("/en/seo", path);
    assert.deepEqual(lintPost({ frontmatter: goodFm, body, pillarPath: pillar, locale: "en" }), [], pillar);
  }
});

test("an unknown pillar is a config error, not a silently skipped rule", () => {
  const v = lintPost({ frontmatter: goodFm, body: goodBody, pillarPath: "nope", locale: "en" });
  assert.ok(v.some((x) => x.startsWith("pillar:")), v.join("; "));
});

// --- invented examples ---

test("an unmarked example is rejected (the de draft that prompted this)", () => {
  const body = "Intro.\n\n## H\n\nEin konkretes Beispiel: Eine kleine Pension in Tirol mit sechs Zimmern hatte nur eine einseitige Website. Nach dem Relaunch kamen die ersten Direktanfragen. Mehr unter https://werk.lechner-studios.at und /de/contact.";
  const v = lintPost({ frontmatter: goodFm, body, pillarPath: "webdesign", locale: "de" });
  assert.ok(v.some((x) => x.startsWith("example:")), v.join("; "));
});

test("'Ein konkretes Beispiel' alone does not count as a marker", () => {
  const body = goodBody.replace("Consider a joinery with one page.", "Ein konkretes Beispiel: eine Tischlerei.").replace("/en/seo", "/de/seo").replace("/en/contact", "/de/contact");
  const v = lintPost({ frontmatter: goodFm, body, pillarPath: "seo", locale: "de" });
  assert.ok(v.some((x) => x.startsWith("example:")), v.join("; "));
});

test("Angenommen / Stellen Sie sich vor mark it properly", () => {
  for (const marker of ["Angenommen, eine Tischlerei hat eine Seite.", "Stellen Sie sich vor, eine Tischlerei wächst."]) {
    const body = goodBody.replace("Consider a joinery with one page.", marker).replace("/en/seo", "/de/seo").replace("/en/contact", "/de/contact");
    assert.deepEqual(lintPost({ frontmatter: goodFm, body, pillarPath: "seo", locale: "de" }), [], marker);
  }
});

// --- prose tells the prompt bans and the model produced anyway ---

test("flags the not-X-it's-Y contrast in both locales", () => {
  const en = lintPost({ frontmatter: goodFm, body: goodBody + " These are not cosmetic concerns — they are the difference.", pillarPath: "seo", locale: "en" });
  assert.ok(en.some((x) => x.includes("not X")), en.join("; "));
  const deBody = goodBody.replace("Consider a joinery with one page.", "Angenommen, eine Tischlerei.").replace("/en/seo", "/de/seo").replace("/en/contact", "/de/contact");
  const de = lintPost({ frontmatter: goodFm, body: deBody + " Das ist keine Frage der Optik, sondern der Technik.", pillarPath: "seo", locale: "de" });
  assert.ok(de.some((x) => x.includes("not X")), de.join("; "));
});

test("flags intensifier padding in the body, and names the word", () => {
  const v = lintPost({ frontmatter: goodFm, body: goodBody + " That is simply how portals work.", pillarPath: "seo", locale: "en" });
  assert.ok(v.some((x) => x.includes('"simply"')), v.join("; "));
});

test("German 'einfach' is not treated as padding", () => {
  // "eine einfache Website" is ordinary de-AT; banning it would fail good posts.
  const body = goodBody.replace("Consider a joinery with one page.", "Angenommen, eine Tischlerei hat eine einfache Website.").replace("/en/seo", "/de/seo").replace("/en/contact", "/de/contact");
  assert.deepEqual(lintPost({ frontmatter: goodFm, body, pillarPath: "seo", locale: "de" }), []);
});
