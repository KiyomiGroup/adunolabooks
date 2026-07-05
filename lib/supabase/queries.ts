/*
  ── Data access layer ─────────────────────────────────────────────────────────
  All Supabase queries live here. Public pages import from this file;
  they don't call Supabase directly. This keeps Sprint 1/2 components
  unchanged — only this file's internals changed from mock → real data.

  Functions preserve the same signatures as lib/stories.ts so call sites
  remain identical.
*/
import { createClient } from "./server";
import type { BookRow, ChapterRow, PoemRow } from "./types";

/* ── Books ──────────────────────────────────────────────────────────────── */

export async function getAllBooks(): Promise<BookRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getAllBooks]", error.message);
    return [];
  }
  return data ?? [];
}

export async function getBookBySlug(slug: string): Promise<BookRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    console.error("[getBookBySlug]", error.message);
    return null;
  }
  return data;
}

/* ── Chapters ────────────────────────────────────────────────────────────── */

export async function getChaptersForBook(bookId: string): Promise<ChapterRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chapters")
    .select("*")
    .eq("book_id", bookId)
    .order("chapter_number", { ascending: true });

  if (error) {
    console.error("[getChaptersForBook]", error.message);
    return [];
  }
  return data ?? [];
}

export async function getChapterByNumber(
  bookId: string,
  chapterNumber: number
): Promise<ChapterRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chapters")
    .select("*")
    .eq("book_id", bookId)
    .eq("chapter_number", chapterNumber)
    .single();

  if (error) {
    console.error("[getChapterByNumber]", error.message);
    return null;
  }
  return data;
}

export async function getLatestPublishedChapters(limit = 4): Promise<
  (ChapterRow & { books: Pick<BookRow, "title" | "slug"> })[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chapters")
    .select("*, books(title, slug)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getLatestPublishedChapters]", error.message);
    return [];
  }
  return (data ?? []) as (ChapterRow & { books: Pick<BookRow, "title" | "slug"> })[];
}

/* ── Poems ──────────────────────────────────────────────────────────────── */

export async function getAllPoems(): Promise<PoemRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("poems")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[getAllPoems]", error.message);
    return [];
  }
  return data ?? [];
}

export async function getPreviewPoems(limit = 2): Promise<PoemRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("poems")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getPreviewPoems]", error.message);
    return [];
  }
  return data ?? [];
}

/* ── Admin: all books regardless of status ───────────────────────────────── */

export async function adminGetAllBooks(): Promise<BookRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function adminGetAllChapters(bookId?: string): Promise<ChapterRow[]> {
  const supabase = await createClient();
  let query = supabase
    .from("chapters")
    .select("*")
    .order("chapter_number", { ascending: true });

  if (bookId) query = query.eq("book_id", bookId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function adminGetAllPoems(): Promise<PoemRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("poems")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}
