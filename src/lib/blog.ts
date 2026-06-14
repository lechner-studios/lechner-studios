import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type BlogMeta = {
  slug: string;
  locale: string;
  title: string;
  description: string;
  excerpt: string;
  date: string;
  category: string;
  keywords: string[];
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

// Filenames look like "<slug>.<locale>.md". This derives the slug for a given
// locale, returning null when the file isn't an article for that locale.
function slugForLocale(filename: string, locale: string): string | null {
  const suffix = `.${locale}.md`;
  if (!filename.endsWith(suffix)) return null;
  return filename.slice(0, -suffix.length);
}

function readMetaForFile(filename: string, locale: string, slug: string): BlogMeta | null {
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8");
  const { data } = matter(raw);
  return {
    slug,
    locale,
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    excerpt: String(data.excerpt ?? ""),
    date: String(data.date ?? ""),
    category: String(data.category ?? ""),
    keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : [],
  };
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
  const meta: BlogMeta = {
    slug,
    locale,
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    excerpt: String(data.excerpt ?? ""),
    date: String(data.date ?? ""),
    category: String(data.category ?? ""),
    keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : [],
  };
  return { meta, content };
}

export function getAllSlugs(locale: string): string[] {
  return getAllPosts(locale).map((p) => p.slug);
}
