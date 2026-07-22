import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Lechner Studios";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "nodejs";

// Prerendered at build time, so the file read below happens during the build
// and never on a request. Also means no serverless invocation per crawler hit.
export const dynamic = "force-static";

/**
 * Serves the canonical brand card (public/og-image.png) as the Open Graph and
 * Twitter image.
 *
 * This route used to rebuild a *second* card in Satori, and the two had drifted
 * badly. The generated one set ".studios" in Cormorant rather than Italiana,
 * which breaks the mark spec (ADR-0027) on the single most-seen rendering of
 * the wordmark — every link shared to WhatsApp, LinkedIn or Slack. It also used
 * a dark #101216 ground and #F7F8F8 off-white, neither of which is in the cool
 * Alpine palette (ADR-0037; #F7F8F8 was explicitly rejected as too close to
 * --card), and a "WATTENS · TIROL · ÖSTERREICH" line instead of the canonical
 * "Tirol · Österreich".
 *
 * Serving the rendered card instead of re-implementing it removes the second
 * wordmark implementation entirely, so the two can no longer diverge. The card
 * is produced by scripts/render-brand-card.mjs, which asserts the real faces
 * loaded before it writes.
 *
 * Consequence worth knowing: the card carries the brand tagline
 * "Web, Identity & Growth" in both locales, where the Satori version had a
 * translated tagline per locale. That is intentional — the tagline is a fixed
 * brand asset, not body copy, and is not translated anywhere else either.
 */
export default async function Image() {
  const data = await readFile(join(process.cwd(), "public", "og-image.png"));
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
