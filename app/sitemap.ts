import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getAllBooks, getChaptersForBook, getAllPoems } from "@/lib/supabase/queries";

/* Regenerate at most once an hour — a sitemap doesn't need to be
   real-time, and this avoids hitting Supabase on every crawler request. */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [books, poems] = await Promise.all([getAllBooks(), getAllPoems()]);

  const chapterEntries = (
    await Promise.all(
      books.map(async (book) => {
        const chapters = await getChaptersForBook(book.id);
        return chapters
          .filter((c) => c.status === "published")
          .map((c) => ({
            url: `${SITE_URL}/stories/${book.slug}/chapters/${c.chapter_number}`,
            lastModified: c.published_at ?? c.updated_at,
            changeFrequency: "monthly" as const,
            priority: 0.6,
          }));
      })
    )
  ).flat();

  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/stories`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/poems`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.3 },

    ...books.map((book) => ({
      url: `${SITE_URL}/stories/${book.slug}`,
      lastModified: book.updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

    ...chapterEntries,

    ...poems.map((poem) => ({
      url: `${SITE_URL}/poems/${poem.id}`,
      lastModified: poem.published_at ?? poem.updated_at,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
