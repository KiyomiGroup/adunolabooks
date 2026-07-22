import type { Metadata } from "next";
import { SITE_URL } from "./site";

interface PageMetaInput {
  title: string;
  description: string;
  /** Site-relative path, e.g. "/stories/my-slug" */
  path: string;
  type?: "website" | "article";
  /** Set true for signed-in-only pages (profile, settings, library) */
  noIndex?: boolean;
}

/*
  ── buildMetadata ─────────────────────────────────────────────────────────
  One place to generate title/description + canonical + Open Graph +
  Twitter card, so every public page gets consistent, complete metadata
  without repeating the same block six times.

  Sprint 4E — SEO refinement. No visual/behavioural change.
*/
export function buildMetadata({ title, description, path, type = "website", noIndex = false }: PageMetaInput): Metadata {
  const url = `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "AdunolaBooks",
      type,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
