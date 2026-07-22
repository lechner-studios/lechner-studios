import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { DEFAULT_OFFER, isOfferKey } from "./offers.mjs";
import type { OfferKey } from "./offers.mjs";
import { readingTime } from "./reading-time.mjs";

export type BlogMeta = {
  slug: string;
  locale: string;
  title: string;
  description: string;
  excerpt: string;
  date: string;
  category: string;
  keywords: string[];
  /** Estimated reading time in whole minutes, derived from the body at read time (never stored). */
  minutes: number;
  /** Which productized offer this post's CTA points at. */
  offer: OfferKey;
  /** Crafted technical graphic key (src/lib/post-graphics.mjs). Optional; falls back to a photo, then a flat band. */
  graphic?: string | undefined;
  /** Interactive widget key (src/lib/post-widgets.mjs). Optional; absent means no widget renders. */
  widget?: string | undefined;
  /** Self-hosted photo path (/blog/<slug>.jpg) and its Pexels attribution. All optional; a post without a photo is still valid. */
  image?: string | undefined;
  imageAlt?: string | undefined;
  imageCredit?: string | undefined;
  imageCreditUrl?: string | undefined;
  imagePexelsUrl?: string | undefined;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

// A slug becomes a URL path segment, a route param and a link target, so it is
// held to the kebab-case contract topics.yaml documents. Enforcing it here, at
// the single boundary where a filename turns into a slug, means no consumer
// downstream can be handed anything else: a stray or hand-dropped file with an
// odd name is simply not a post rather than becoming part of a href.
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

// Filenames look like "<slug>.<locale>.md". This derives the slug for a given
// locale, returning null when the file isn't an article for that locale or the
// derived slug does not satisfy the contract above.
function slugForLocale(filename: string, locale: string): string | null {
  const suffix = `.${locale}.md`;
  if (!filename.endsWith(suffix)) return null;
  const slug = filename.slice(0, -suffix.length);
  return isValidSlug(slug) ? slug : null;
}

// Single builder for both read paths, so a new frontmatter field only has to be
// added in one place. `content` is the post body (markdown, frontmatter
// already stripped by gray-matter) — required to derive `minutes`.
function toMeta(data: Record<string, unknown>, content: string, slug: string, locale: string): BlogMeta {
  return {
    slug,
    locale,
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    excerpt: String(data.excerpt ?? ""),
    date: String(data.date ?? ""),
    category: String(data.category ?? ""),
    keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : [],
    minutes: readingTime(content),
    // Posts published before offers existed carry no `offer` key. Defaulting
    // here is what retrofits them with no file edits.
    offer: isOfferKey(data.offer) ? data.offer : DEFAULT_OFFER,
    // Not defaulted (unlike offer): an absent graphic is a valid state — the
    // renderer falls back to the post's photo, then a flat band.
    graphic: typeof data.graphic === "string" ? data.graphic : undefined,
    // Not defaulted, same reasoning as graphic: an absent widget is a valid
    // state — no widget renders.
    widget: typeof data.widget === "string" ? data.widget : undefined,
    // Image fields are NOT defaulted (unlike offer): an absent photo is a
    // valid, expected state (PostImage renders a plain fallback block).
    image: typeof data.image === "string" ? data.image : undefined,
    imageAlt: typeof data.imageAlt === "string" ? data.imageAlt : undefined,
    imageCredit: typeof data.imageCredit === "string" ? data.imageCredit : undefined,
    imageCreditUrl: typeof data.imageCreditUrl === "string" ? data.imageCreditUrl : undefined,
    imagePexelsUrl: typeof data.imagePexelsUrl === "string" ? data.imagePexelsUrl : undefined,
  };
}

function readMetaForFile(filename: string, locale: string, slug: string): BlogMeta | null {
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8");
  // Previously destructured only `{ data }` — the index page had no way to
  // compute reading time because the body was parsed by gray-matter but then
  // discarded. Capturing `content` here is what makes `minutes` available on
  // BlogMeta for both getAllPosts and getPost.
  const { data, content } = matter(raw);
  return toMeta(data, content, slug, locale);
}

export function getAllPosts(locale: string): BlogMeta[] {
  let files: string[];
  try {
    files = fs.readdirSync(BLOG_DIR);
  } catch {
    return [];
  }

  const posts: BlogMeta[] = [];
  for (const filename of files) {
    const slug = slugForLocale(filename, locale);
    if (!slug) continue;
    const meta = readMetaForFile(filename, locale, slug);
    if (meta) posts.push(meta);
  }

  // Newest first.
  return posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getPost(
  locale: string,
  slug: string,
): { meta: BlogMeta; content: string } | null {
  // The slug arrives as a route param and is concatenated into a filesystem
  // path below, so it is validated before it can traverse out of BLOG_DIR.
  if (!isValidSlug(slug)) return null;
  const filename = `${slug}.${locale}.md`;
  const filePath = path.join(BLOG_DIR, filename);
  let raw: string;
  try {
    raw = fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
  const { data, content } = matter(raw);
  return { meta: toMeta(data, content, slug, locale), content };
}

export function getAllSlugs(locale: string): string[] {
  return getAllPosts(locale).map((p) => p.slug);
}
