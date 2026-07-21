/*
  ── Data access layer ─────────────────────────────────────────────────────────
  All Supabase queries live here. Public pages import from this file;
  they don't call Supabase directly. This keeps Sprint 1/2 components
  unchanged — only this file's internals changed from mock → real data.

  Functions preserve the same signatures as lib/stories.ts so call sites
  remain identical.
*/
import { createClient } from "./server";
import type { BookRow, ChapterRow, PoemRow, CommentRow, ProfileRow } from "./types";

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


/* ── Single poem by id ───────────────────────────────────────────────────── */

export async function getPoemById(id: string): Promise<PoemRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("poems")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .single();

  if (error) {
    console.error("[getPoemById]", error.message);
    return null;
  }
  return data;
}

/* ── Discussion / Comments (Sprint 4B) ─────────────────────────────────────
   comments.user_id references auth.users, not profiles directly, so we
   can't ask Supabase to embed the profile automatically — instead we fetch
   commenter profiles separately and merge them in JS. Keeps this file's
   query shape consistent with the simple selects used everywhere else.
*/

export type CommentAuthor =
  Pick<ProfileRow, "username" | "display_name" | "avatar_url" | "is_admin">;

export type CommentWithAuthor = CommentRow & { author: CommentAuthor | null };

const ROOT_COMMENTS_PAGE_SIZE = 10;

async function attachAuthors(
  supabase: Awaited<ReturnType<typeof createClient>>,
  rows: CommentRow[]
): Promise<CommentWithAuthor[]> {
  if (rows.length === 0) return [];

  const userIds = Array.from(new Set(rows.map((r) => r.user_id)));
  const { data: profiles, error } = await (supabase.from("profiles") as any)
    .select("user_id, username, display_name, avatar_url, is_admin")
    .in("user_id", userIds);

  if (error) console.error("[attachAuthors]", error.message);

  const byUserId = new Map<string, CommentAuthor>(
    (profiles ?? []).map((p: any) => [
      p.user_id,
      { username: p.username, display_name: p.display_name, avatar_url: p.avatar_url, is_admin: p.is_admin },
    ])
  );

  return rows.map((row) => ({ ...row, author: byUserId.get(row.user_id) ?? null }));
}

/* Total number of top-level (root) comments on a chapter — used to decide
   whether the "Load more" control should render. */
export async function getRootCommentCount(chapterId: string): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("comments")
    .select("id", { count: "exact", head: true })
    .eq("chapter_id", chapterId)
    .is("parent_comment_id", null);

  if (error) {
    console.error("[getRootCommentCount]", error.message);
    return 0;
  }
  return count ?? 0;
}

/*
  One page of root comments, plus every reply beneath each of them
  (any depth — the UI decides how much of that depth to indent).
  Pinned comment always surfaces first, then oldest-first by default.
*/
export async function getCommentsPage(
  chapterId: string,
  offset: number,
  limit: number = ROOT_COMMENTS_PAGE_SIZE
): Promise<{ roots: CommentWithAuthor[]; replies: CommentWithAuthor[]; hasMore: boolean }> {
  const supabase = await createClient();

  const { data: rootRows, error: rootError } = await (supabase.from("comments") as any)
    .select("*")
    .eq("chapter_id", chapterId)
    .is("parent_comment_id", null)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: true })
    .range(offset, offset + limit - 1);

  if (rootError) {
    console.error("[getCommentsPage] roots:", rootError.message);
    return { roots: [], replies: [], hasMore: false };
  }

  const roots: CommentRow[] = rootRows ?? [];
  if (roots.length === 0) {
    return { roots: [], replies: [], hasMore: false };
  }

  const rootIds = roots.map((r) => r.id);
  const { data: replyRows, error: replyError } = await (supabase.from("comments") as any)
    .select("*")
    .eq("chapter_id", chapterId)
    .in("root_comment_id", rootIds)
    .order("created_at", { ascending: true });

  if (replyError) console.error("[getCommentsPage] replies:", replyError.message);

  const totalRoots = await getRootCommentCount(chapterId);
  const hasMore = offset + roots.length < totalRoots;

  const [rootsWithAuthors, repliesWithAuthors] = await Promise.all([
    attachAuthors(supabase, roots),
    attachAuthors(supabase, replyRows ?? []),
  ]);

  return { roots: rootsWithAuthors, replies: repliesWithAuthors, hasMore };
}
