// Shared, bare-node (imported by generate.mjs and backfill-images.mjs).
// Pexels only: Unsplash mandates hotlinking, which breaks DSGVO A4. We download
// and commit; the browser never calls Pexels.

export const CATEGORY_IMAGE_QUERIES = {
  "Web & Design": "minimalist modern architecture interior",
  "Apps & Automation": "abstract geometric architecture lines",
  "SEO & Growth": "alpine mountain landscape mist",
  "Brand & Identity": "minimal design studio still life",
};
const FALLBACK_QUERY = "minimal architecture";

// Per-post override (topics.yaml imageQuery) beats the category theme.
export function queryFor(post) {
  if (post.imageQuery && String(post.imageQuery).trim()) return String(post.imageQuery).trim();
  return CATEGORY_IMAGE_QUERIES[post.category] ?? FALLBACK_QUERY;
}

// FNV-1a, same family as the (removed) art hash. Deterministic pick so a slug
// always resolves to the same photo across rebuilds.
function hash(str) {
  let h = 0x811c_9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x0100_0193) >>> 0; }
  return h >>> 0;
}
export function pickIndex(slug, count) {
  if (count <= 0) return 0;
  return hash(slug) % count;
}

// Deterministic pick with duplicate avoidance: start at the slug's hashed index
// and walk forward (wrapping) to the first photo whose Pexels URL isn't already
// used. Two posts in one category share a query, so without this their hashes
// can collide onto the same photo. Falls back to the hashed index if every
// candidate is already taken.
export function choosePhoto(photos, slug, avoidUrls = new Set()) {
  if (!photos.length) return null;
  const start = pickIndex(slug, photos.length);
  for (let k = 0; k < photos.length; k++) {
    const p = photos[(start + k) % photos.length];
    if (!avoidUrls.has(p.url)) return p;
  }
  return photos[start];
}

// Live: search Pexels, pick a photo, download src.large to disk. Returns the
// frontmatter image fields, or null if nothing usable was found. `avoidUrls`
// lets a batch caller (backfill) dedupe across posts.
export async function fetchPhoto({ post, slug, apiKey, outDir, fetchImpl = fetch, avoidUrls = new Set() }) {
  const query = queryFor(post);
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=landscape&per_page=15`;
  const res = await fetchImpl(url, { headers: { Authorization: apiKey } });
  if (!res.ok) throw new Error(`pexels search ${res.status} for "${query}"`);
  const data = await res.json();
  const photos = (data.photos || []).filter((p) => p.src?.large);
  const photo = choosePhoto(photos, slug, avoidUrls);
  if (!photo) return null;

  const imgRes = await fetchImpl(photo.src.large);
  if (!imgRes.ok) throw new Error(`pexels image download ${imgRes.status}`);
  const buf = Buffer.from(await imgRes.arrayBuffer());
  const fs = await import("node:fs");
  const path = await import("node:path");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, `${slug}.jpg`), buf);

  return {
    image: `/blog/${slug}.jpg`,
    imageAlt: String(photo.alt || query),
    imageCredit: String(photo.photographer || "Pexels"),
    imageCreditUrl: String(photo.photographer_url || photo.url || "https://www.pexels.com"),
    imagePexelsUrl: String(photo.url || "https://www.pexels.com"),
  };
}
