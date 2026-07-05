/*
  ── lib/stories.ts — Sprint 3 ────────────────────────────────────────────────
  Server-only data access façade. Import ONLY in Server Components and pages.
  Client components should import types from lib/stories-types.ts instead.
*/

/* Re-export all types so existing import paths still work in server contexts */
export type { Accent, Chapter, Story, ChapterLookup } from "./stories-types";
export { ACCENT_COLORS, getFirstAvailableChapter } from "./stories-types";

import type { Story } from "./stories-types";
import type { BookRow, ChapterRow } from "./supabase/types";
import { getAllBooks, getBookBySlug, getChaptersForBook } from "./supabase/queries";

/* ── Supabase → Story adapter ──────────────────────────────────────────── */

function chapterRowToChapter(row: ChapterRow) {
  let paragraphs: string[] = [];
  try { paragraphs = JSON.parse(row.content); } catch { paragraphs = []; }

  return {
    number: row.chapter_number,
    title: row.title,
    subtitle: row.subtitle ?? undefined,
    prologue: row.prologue ?? undefined,
    publishedAt: row.published_at
      ? new Date(row.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
      : undefined,
    readTime: row.read_time ?? undefined,
    status: (row.status === "published" ? "available" : "drafting") as "available" | "drafting",
    content: paragraphs.length > 0 ? paragraphs : undefined,
  };
}

async function bookRowToStory(book: BookRow): Promise<Story> {
  const chapterRows = await getChaptersForBook(book.id);
  const chapters = chapterRows.map(chapterRowToChapter);

  const lastPublished = chapterRows
    .filter((c) => c.status === "published" && c.published_at)
    .sort((a, b) => new Date(b.published_at!).getTime() - new Date(a.published_at!).getTime())[0];

  const lastUpdated = lastPublished?.published_at
    ? new Date(lastPublished.published_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    : new Date(book.updated_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  const publishedCount = chapterRows.filter((c) => c.status === "published").length;
  const totalCount     = chapterRows.length;

  return {
    id: book.id,
    slug: book.slug,
    title: book.title,
    author: book.author,
    genre: book.genre,
    status: (publishedCount > 0 && publishedCount === totalCount ? "Complete" : "Ongoing") as "Ongoing" | "Complete",
    accent: book.accent as import("./stories-types").Accent,
    excerpt: book.synopsis.split(". ").slice(0, 2).join(". ") + ".",
    synopsis: book.synopsis,
    lastUpdated,
    stats: { readers: "—", avgReadTime: "—" }, /* Sprint 4: real stats */
    readingProgress: 0,                          /* Sprint 4: per-user  */
    chapters,
    coverUrl: book.cover_url ?? null,            /* Supabase Storage public URL */
  } as Story & { coverUrl: string | null };
}

export async function getAllStories(): Promise<Story[]> {
  const books = await getAllBooks();
  return Promise.all(books.map(bookRowToStory));
}

export async function getStoryBySlug(slug: string): Promise<Story | undefined> {
  const book = await getBookBySlug(slug);
  if (!book) return undefined;
  return bookRowToStory(book);
}

export async function getChapterData(slug: string, chapterNumber: number) {
  const story = await getStoryBySlug(slug);
  if (!story) return undefined;

  const chapter     = story.chapters.find((c) => c.number === chapterNumber);
  if (!chapter) return undefined;

  const prevChapter = story.chapters.find((c) => c.number === chapterNumber - 1) ?? null;
  const nextChapter = story.chapters.find((c) => c.number === chapterNumber + 1) ?? null;

  return { story, chapter, prevChapter, nextChapter };
}
