"use server";
/*
  ── Reader engagement server actions (Sprint 4C) ────────────────────────────
  Bookmarks + reading progress. Mirrors the shape of lib/actions/comments.ts:
  every mutation returns { success, error? } instead of redirecting, since
  these are called from client components that manage their own local
  state for instant, optimistic UI. RLS in Supabase is the real enforcement
  layer (see supabase/sql/005_sprint4c_engagement.sql) — these checks exist
  so the UI can fail with an elegant message instead of a raw Postgres error.
*/
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ActionResult<T = undefined> = { success: true; data: T } | { success: false; error: string };

function safeRevalidate(path: string) {
  try {
    revalidatePath(path);
  } catch (e) {
    console.warn(`[engagement] revalidatePath warning for ${path}:`, e);
  }
}

/* ── Bookmarks ────────────────────────────────────────────────────────────
   toggleBookmark handles both story-level (chapterId omitted/null) and
   chapter-level bookmarks. The unique partial indexes in the SQL file make
   a duplicate insert impossible, so "already bookmarked" just means the
   row exists — we look it up and delete/insert accordingly.
*/
export async function toggleBookmark(input: {
  bookId: string;
  chapterId?: string | null;
  storySlug: string;
}): Promise<ActionResult<{ bookmarked: boolean }>> {
  const { bookId, storySlug } = input;
  const chapterId = input.chapterId ?? null;

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "Please sign in to save bookmarks." };
  }

  let existingQuery = (supabase.from("bookmarks") as any)
    .select("id")
    .eq("user_id", user.id)
    .eq("book_id", bookId);
  existingQuery = chapterId ? existingQuery.eq("chapter_id", chapterId) : existingQuery.is("chapter_id", null);

  const { data: existing, error: lookupError } = await existingQuery.maybeSingle();

  if (lookupError) {
    console.error("[toggleBookmark] lookup:", lookupError.message);
    return { success: false, error: "Unable to save bookmark. Please try again." };
  }

  if (existing) {
    const { error } = await (supabase.from("bookmarks") as any).delete().eq("id", existing.id);
    if (error) {
      console.error("[toggleBookmark] delete:", error.message);
      return { success: false, error: "Unable to remove bookmark. Please try again." };
    }
    safeRevalidate(`/stories/${storySlug}`);
    safeRevalidate("/library");
    safeRevalidate("/");
    return { success: true, data: { bookmarked: false } };
  }

  const { error } = await (supabase.from("bookmarks") as any).insert({
    user_id: user.id,
    book_id: bookId,
    chapter_id: chapterId,
  });

  if (error) {
    console.error("[toggleBookmark] insert:", error.message);
    return { success: false, error: "Unable to save bookmark. Please try again." };
  }

  safeRevalidate(`/stories/${storySlug}`);
  safeRevalidate("/library");
  safeRevalidate("/");
  return { success: true, data: { bookmarked: true } };
}

/* ── Reading progress ─────────────────────────────────────────────────────
   Called silently whenever a reader opens a chapter (see
   ReadingProgressTracker). Upserts on the (user_id, book_id) unique key so
   there's always exactly one row per book — it always reflects the reader's
   most recent position, never a history of every chapter visited.
*/
export async function recordChapterView(input: {
  bookId: string;
  chapterId: string;
  chapterNumber: number;
  totalChapters: number;
}): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Not signed in." }; /* silent no-op for visitors */

  const progressPercentage = input.totalChapters > 0
    ? Math.min(100, Math.round((input.chapterNumber / input.totalChapters) * 100))
    : 0;

  const { error } = await (supabase.from("reading_progress") as any)
    .upsert(
      {
        user_id: user.id,
        book_id: input.bookId,
        current_chapter_id: input.chapterId,
        last_read_at: new Date().toISOString(),
        progress_percentage: progressPercentage,
      },
      { onConflict: "user_id,book_id" }
    );

  if (error) {
    console.error("[recordChapterView]", error.message);
    return { success: false, error: "Unable to save reading progress." };
  }

  return { success: true, data: undefined };
}
