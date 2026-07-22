/*
  ── Site URL ──────────────────────────────────────────────────────────────
  Single source of truth for the site's canonical origin. Used by
  metadataBase, per-page canonical/OG URLs, robots.ts, and sitemap.ts —
  so there's exactly one place to update if the domain ever changes.
*/
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://adunolabooks.com").replace(/\/+$/, "");
