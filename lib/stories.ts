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

/* ── Content deserialiser ────────────────────────────────────────────────────
  Converts the raw `content` column value into a clean string[] where each
  element is one visual paragraph (or a block of intentional line-breaks).

  Handles every realistic storage format:
    A) Correct: JSON array of paragraph strings  → use as-is after flattening
    B) Old/pasted: plain text with \n\n breaks   → split into paragraphs
    C) Pasted: plain text with \n breaks only    → split on single newlines
    D) JSON array with a single huge element     → split that element further

  Single \n within an element is preserved: the renderer turns them into
  <br /> so poetry-style line breaks and dialogue are rendered correctly.
*/
function parseContent(raw: string): string[] {
  if (!raw || !raw.trim()) return [];

  // ── Try JSON parse first ─────────────────────────────────────────────────
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Not JSON — treat as plain text and fall through
    parsed = null;
  }

  if (Array.isArray(parsed)) {
    // Flatten: some elements may themselves contain \n\n (old serialiser bug)
    const paragraphs: string[] = [];
    for (const item of parsed) {
      if (typeof item !== "string") continue;
      const trimmed = item.trim();
      if (!trimmed) continue;

      if (trimmed.includes("\n\n")) {
        // Element has double-newline sub-blocks — split it
        const subBlocks = trimmed.split(/\n{2,}/);
        for (const b of subBlocks) {
          const t = b.trim();
          if (t) paragraphs.push(t);
        }
      } else {
        // Single element (may have intentional \n line-breaks inside) — keep whole
        paragraphs.push(trimmed);
      }
    }
    // If we ended up with exactly one very long element that has single
    // newlines, and those newlines look like paragraph breaks (capital
    // letter after sentence-ending punctuation), split them further.
    if (paragraphs.length === 1 && paragraphs[0].includes("\n")) {
      return splitOnSentenceBoundaries(paragraphs[0]);
    }
    return paragraphs.length > 0 ? paragraphs : [];
  }

  // ── Plain text fallback ───────────────────────────────────────────────────
  const text = (typeof parsed === "string" ? parsed : raw).trim();
  if (text.includes("\n\n")) {
    // Double-newline separated → split into paragraph array
    return text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  }
  // Only single newlines — try sentence-boundary detection
  return splitOnSentenceBoundaries(text);
}

/*
  Heuristic: split a block of single-newline text into paragraphs where
  each newline that follows sentence-ending punctuation and precedes a
  capital letter is treated as a paragraph break.
  Newlines that don't match this pattern are kept (intentional line breaks).
*/
function splitOnSentenceBoundaries(text: string): string[] {
  const lines = text.split("\n");
  const groups: string[] = [];
  let current: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const next = lines[i + 1]?.trim() ?? "";

    current.push(line);

    const endsWithSentence = /[.!?"'\u2019\u201d]\s*$/.test(line.trim());
    const nextStartsCapital = /^[A-Z\u201c\u2018"]/.test(next);

    if (endsWithSentence && nextStartsCapital && next.length > 0) {
      // Paragraph boundary — flush current group
      const joined = current.join("\n").trim();
      if (joined) groups.push(joined);
      current = [];
    }
  }

  // Flush remaining lines
  const tail = current.join("\n").trim();
  if (tail) groups.push(tail);

  return groups.length > 0 ? groups : [text.trim()];
}

/* ── Supabase → Story adapter ──────────────────────────────────────────── */

function chapterRowToChapter(row: ChapterRow) {
  const paragraphs = parseContent(row.content);

  return {
    id: row.id,
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
    coverUrl: book.cover_url ?? null,
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
