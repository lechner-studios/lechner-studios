import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { DEFAULT_OFFER, isOfferKey } from "./offers.mjs";
import type { OfferKey } from "./offers.mjs";

export type BlogMeta = {
  slug: string;
  locale: string;
  title: string;
  description: string;
  excerpt: string;
  date: string;
  category: string;
  keywords: string[];
  /** Which productized offer this post's CTA points at. */
  offer: OfferKey;
  /** Self-hosted photo path (/blog/<slug>.jpg) and its Pexels attribution. All optional; a post without a photo is still valid. */
  image?: string | undefined;
  imageAlt?: string | undefined;
  imageCredit?: string | undefined;
  imageCreditUrl?: string | undefined;
  imagePexelsUrl?: string | undefined;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

// Filenames look like "<slug>.<locale>.md". This derives the slug for a given
// locale, returning null when the file isn't an article for that locale.
function slugForLocale(filename: string, locale: string): string | null {
  const suffix = `.${locale}.md`;
  if (!filename.endsWith(suffix)) return null;
  return filename.slice(0, -suffix.length);
}

// Single builder for both read paths, so a new frontmatter field only has to be
// added in one place.
function toMeta(data: Record<string, unknown>, slug: string, locale: string): BlogMeta {
  return {
    slug,
    locale,
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    excerpt: String(data.excerpt ?? ""),
    date: String(data.date ?? ""),
    category: String(data.category ?? ""),
    keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : [],
    // Posts published before offers existed carry no `offer` key. Defaulting
    // here is what retrofits them with no file edits.
    offer: isOfferKey(data.offer) ? data.offer : DEFAULT_OFFER,
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
  const { data } = matter(raw);
  return toMeta(data, slug, locale);
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
  const filename = `${slug}.${locale}.md`;
  const filePath = path.join(BLOG_DIR, filename);
  let raw: string;
  try {
    raw = fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
  const { data, content } = matter(raw);
  return { meta: toMeta(data, slug, locale), content };
}

export function getAllSlugs(locale: string): string[] {
  return getAllPosts(locale).map((p) => p.slug);
}
