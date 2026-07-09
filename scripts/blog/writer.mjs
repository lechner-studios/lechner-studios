import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-sonnet-4-6"; // matches src/app/api/chat/route.ts; swap to claude-opus-4-8 for max prose quality

const LOCALES = {
  en: { label: "English", lang: "English", note: "Write the post in clear, natural English." },
  de: { label: "Austrian German", lang: "Austrian German (de-AT)", note: "Write the post in Austrian German (de-AT, Sie-Form), spelled and phrased for an Austrian reader — a real localization, NOT a literal translation of any English version." },
};

// One locale, generated in its own focused call (cramming both into one response
// made the model under-produce the second locale → lint failures).
function systemPrompt({ category, keyword, intent, slug, date, pillarPath, locale }) {
  const L = LOCALES[locale];
  return `You write one SEO blog post for Lechner Studios — a family-run, AI-native digital studio in Wattens, Tirol, serving SMBs across DACH. ${L.note}

TOPIC: pillar="${category}", primary keyword="${keyword}", angle="${intent}", canonical slug="${slug}".

REQUIRED — a post missing any of these is rejected:
- LANGUAGE: write EVERY field — title, description, excerpt, keywords AND body — in ${L.lang}. The primary keyword above may be in another language; translate/adapt it. NEVER copy a foreign-language keyword or phrase verbatim as the ${L.lang} title (e.g. an English post must have an English title, not the German keyword).
- ~600–900 words. Voice: written, professional-but-warm, honest, NO hype/buzzwords.
- Start with a short intro paragraph (no heading), then **at least three "## " H2 sections** (one with a concrete example), then a closing paragraph.
- The closing paragraph MUST end with exactly TWO markdown internal links, using these FULL paths:
  [text](/${locale}/${pillarPath}) and [text](/${locale}/contact)
- description: 50–160 characters. excerpt: 60–100 characters. keywords: exactly 5 to 7 entries.

HARD scope/honesty rules (also rejected if broken):
- NO prices, € amounts, or binding quotes. NO the words "guarantee"/"Garantie" (or any guarantee claim). NO %/metrics/ranking-result claims. NO fabricated testimonials.
- Brand & Identity may be presented EITHER standalone (branding, visual identity, content) OR as part of a web/product build — both are in scope, so a brand post can stand on its own. SEO stays TECHNICAL work, never business/marketing consulting (Unternehmensberatung — out of scope).

Return the post by calling the \`submit_post\` tool. \`body\` is the markdown body only (no frontmatter, no H1). The date is added later.`;
}

const LOCALE_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string", description: "50–160 char meta description" },
    excerpt: { type: "string", description: "60–100 char teaser" },
    keywords: { type: "array", items: { type: "string" }, description: "exactly 5 to 7 keywords" },
    body: { type: "string", description: "markdown body (no frontmatter, no H1); 3+ H2 sections; ends with the two internal links" },
  },
  required: ["title", "description", "excerpt", "keywords", "body"],
};

// Tool-use = structured output: the SDK returns `input` as an already-parsed,
// schema-valid object, so a markdown body with stray quotes/newlines can no
// longer break a hand-rolled JSON.parse (the old "unterminated string" failures).
const POST_TOOL = {
  name: "submit_post",
  description: "Submit the finished blog post.",
  input_schema: LOCALE_SCHEMA,
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

async function writeLocale(client, args) {
  const sys = systemPrompt(args);
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await client.messages.create({
        model: MODEL,
        max_tokens: 8192, // one ~800-word post as tool-use JSON — comfortable headroom
        temperature: 0.7,
        system: sys,
        tools: [POST_TOOL],
        tool_choice: { type: "tool", name: "submit_post" },
        messages: [{ role: "user", content: `Write the ${LOCALES[args.locale].label} post for "${args.keyword}". Call submit_post.` }],
      });
      const tool = res.content.find((b) => b.type === "tool_use" && b.name === "submit_post");
      if (!tool || !tool.input?.body) throw new Error(`no valid submit_post (stop_reason=${res.stop_reason})`);
      return tool.input;
    } catch (e) {
      if (attempt === 1) throw new Error(`writer[${args.locale}]: failed after 2 tries: ${e.message}`);
    }
  }
}

// Generates each locale in its own focused tool-use call and returns { en, de }
// entries ready for the linter + emitter.
export async function writePost({ pillar, category, keyword, intent, slug, date, pillarPath, apiKey }) {
  const client = new Anthropic({ apiKey });
  const base = { pillar, category, keyword, intent, slug, date, pillarPath };
  const en = await writeLocale(client, { ...base, locale: "en" });
  const de = await writeLocale(client, { ...base, locale: "de" });
  return { en: toEntry(en, category, date), de: toEntry(de, category, date) };
}
