/**
 * Production origin, e.g. `https://www.example-clinic.com` (no trailing slash).
 * Set NEXT_PUBLIC_SITE_URL in `.env.production.local` before `npm run build`.
 *
 * Until it is set, the build still works but canonical/OG URLs point at the
 * local preview server, the sitemap is empty and robots.txt + meta robots ask
 * search engines not to index the site — so a test upload is never indexed.
 */
const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");

export const siteUrl = configured || "http://localhost:4173";
export const hasProductionUrl = Boolean(configured);
export const allowIndexing = hasProductionUrl && process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "false";
