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

Return ONLY a single JSON object, no prose around it, shaped exactly:
{
  "en": { "title": "...", "description": "50–160 char meta", "excerpt": "60–100 char teaser", "keywords": ["5 to 7 keywords"], "body": "markdown body (no frontmatter, no H1)" },
  "de": { "title": "...", "description": "...", "excerpt": "...", "keywords": ["..."], "body": "..." }
}
Set date for both to "${date}" is NOT needed (added later). Keep slugs/links exactly as specified.`;
}

function extractJson(text) {
  // Tolerate ```json fences or leading prose.
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fenced ? fenced[1] : text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  return JSON.parse(raw);
}

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

// Calls Claude once (one retry on parse failure) and returns { en, de } entries
// ready for the linter + emitter.
export async function writePost({ pillar, category, keyword, intent, slug, date, pillarPath, apiKey }) {
  const client = new Anthropic({ apiKey });
  const sys = systemPrompt({ pillar, category, keyword, intent, slug, date, pillarPath });
  for (let attempt = 0; attempt < 2; attempt++) {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 8192, // two ~800-word bilingual posts + JSON — 4096 risks truncation
      system: sys,
      messages: [{ role: "user", content: `Write the post for "${keyword}". Return only the JSON object.` }],
    });
    const text = res.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    try {
      const obj = extractJson(text);
      return { en: toEntry(obj.en, category, date), de: toEntry(obj.de, category, date) };
    } catch (e) {
      if (attempt === 1) throw new Error(`writer: could not parse JSON after 2 tries: ${e.message}`);
    }
  }
}
