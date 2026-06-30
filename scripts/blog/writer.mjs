import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-sonnet-4-6"; // matches src/app/api/chat/route.ts; swap to claude-opus-4-8 for max prose quality

function systemPrompt({ pillar, category, keyword, intent, slug, date, pillarPath }) {
  return `You write SEO blog posts for Lechner Studios — a solo-founded, AI-native digital studio in Wattens, Tirol, serving SMBs across DACH. Output ONE article in BOTH English and Austrian German (de-AT, Sie-Form).

TOPIC: pillar="${category}", primary keyword="${keyword}", angle="${intent}", canonical slug="${slug}".

Match these existing-post rules EXACTLY:
- Voice: written, professional-but-warm, honest, no hype/buzzwords. ~600–900 words per locale.
- Structure: a short intro paragraph (no heading), then 3–5 "## " H2 sections, including at least one with a concrete example, then a closing paragraph that ends with TWO markdown internal links — to the pillar page and to contact — using FULL locale paths.
  - English links: [text](/en/${pillarPath}) and [text](/en/contact)
  - German links: [text](/de/${pillarPath}) and [text](/de/contact)
- de-AT is a real localization (Sie-Form, Austrian spelling), NOT a literal translation of the English.

HARD scope/honesty rules (a post breaking these is rejected):
- NO prices, € amounts, or binding quotes. NO "guarantee"/"Garantie". NO %/metrics/ranking-result claims. NO fabricated testimonials.
- Brand/identity only ever "as part of a build" — never a standalone offering. SEO framed as TECHNICAL work, never business/marketing consulting (Unternehmensberatung).

Return the finished post by calling the \`submit_post\` tool. \`body\` is the markdown body only (no frontmatter, no H1). Keep slugs/links exactly as specified; the date is added later.`;
}

// One locale's shape — shared by en + de in the tool schema.
const LOCALE_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string", description: "50–160 char meta description" },
    excerpt: { type: "string", description: "60–100 char teaser" },
    keywords: { type: "array", items: { type: "string" }, description: "5 to 7 keywords" },
    body: { type: "string", description: "markdown body (no frontmatter, no H1)" },
  },
  required: ["title", "description", "excerpt", "keywords", "body"],
};

// Tool-use = structured output: the SDK returns `input` as an already-parsed,
// schema-valid object, so a markdown body with stray quotes/newlines can no
// longer break a hand-rolled JSON.parse (the old "unterminated string" failures).
const POST_TOOL = {
  name: "submit_post",
  description: "Submit the finished bilingual blog post (English + Austrian German).",
  input_schema: {
    type: "object",
    properties: { en: LOCALE_SCHEMA, de: LOCALE_SCHEMA },
    required: ["en", "de"],
  },
};

function toEntry(part, category, date) {
  return {
    frontmatter: {
      title: String(part.title),
      description: String(part.description),
      excerpt: String(part.excerpt),
      date,
      category,
      keywords: (part.keywords || []).map(String),
    },
    body: String(part.body).trim(),
  };
}

// Calls Claude (one retry on transient failure) via forced tool-use and returns
// { en, de } entries ready for the linter + emitter.
export async function writePost({ pillar, category, keyword, intent, slug, date, pillarPath, apiKey }) {
  const client = new Anthropic({ apiKey });
  const sys = systemPrompt({ pillar, category, keyword, intent, slug, date, pillarPath });
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await client.messages.create({
        model: MODEL,
        max_tokens: 8192, // two ~800-word bilingual posts + JSON — 4096 risks truncation
        temperature: 0.7,
        system: sys,
        tools: [POST_TOOL],
        tool_choice: { type: "tool", name: "submit_post" },
        messages: [{ role: "user", content: `Write the post for "${keyword}". Call submit_post with both locales.` }],
      });
      const tool = res.content.find((b) => b.type === "tool_use" && b.name === "submit_post");
      if (!tool || !tool.input?.en || !tool.input?.de) {
        throw new Error(`no valid submit_post tool_use (stop_reason=${res.stop_reason})`);
      }
      const obj = tool.input;
      return { en: toEntry(obj.en, category, date), de: toEntry(obj.de, category, date) };
    } catch (e) {
      if (attempt === 1) throw new Error(`writer: failed after 2 tries: ${e.message}`);
    }
  }
}
