"use server";
/*
  ── Discussion / Comments server actions (Sprint 4B) ────────────────────────
  Mirrors the shape of lib/actions/profile.ts: every mutation returns
  { success, error? } instead of redirecting, since these are called from
  client components that manage their own local state and never want a
  full navigation on submit. RLS in Supabase is the real enforcement layer
  (see supabase/sql/004_sprint4b_comments.sql) — these checks exist so the
  UI can fail with an elegant message instead of a raw Postgres error.
*/
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCommentsPage, type CommentWithAuthor } from "@/lib/supabase/queries";

const MAX_COMMENT_LENGTH = 4000;
const MIN_REPOST_INTERVAL_MS = 8_000;

type ActionResult<T = undefined> = { success: true; data: T } | { success: false; error: string };

function chapterPath(storySlug: string, chapterNumber: number) {
  return `/stories/${storySlug}/chapters/${chapterNumber}`;
}

/* ── Create (top-level comment or reply) ──────────────────────────────────── */
export async function createComment(input: {
  chapterId: string;
  content: string;
  parentCommentId?: string | null;
  storySlug: string;
  chapterNumber: number;
}): Promise<ActionResult<CommentWithAuthor>> {
  const { chapterId, parentCommentId, storySlug, chapterNumber } = input;
  const content = input.content.trim();

  if (!content) {
    return { success: false, error: "A comment can't be empty." };
  }
  if (content.length > MAX_COMMENT_LENGTH) {
    return { success: false, error: `Comments are limited to ${MAX_COMMENT_LENGTH} characters.` };
  }

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, error: "Please sign in to join the discussion." };
  }

  /* Lightweight spam guard: one post per short cooldown window per reader. */
  const { data: lastComment } = await (supabase.from("comments") as any)
    .select("created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lastComment) {
    const elapsed = Date.now() - new Date(lastComment.created_at).getTime();
    if (elapsed < MIN_REPOST_INTERVAL_MS) {
      return { success: false, error: "Please wait a moment before posting again." };
    }
  }

  const { data: inserted, error } = await (supabase.from("comments") as any)
    .insert({
      chapter_id: chapterId,
      user_id: user.id,
      parent_comment_id: parentCommentId ?? null,
      content,
    })
    .select("*")
    .single();

  if (error) {
    console.error("[createComment]", error.message);
    return { success: false, error: "Unable to post your comment. Please try again." };
  }

  const { data: profile } = await (supabase.from("profiles") as any)
    .select("username, display_name, avatar_url, is_admin")
    .eq("user_id", user.id)
    .single();

  try {
    revalidatePath(chapterPath(storySlug, chapterNumber));
  } catch (e) {
    console.warn("[createComment] revalidatePath warning:", e);
  }

  return { success: true, data: { ...inserted, author: profile ?? null } };
}

/* ── Edit ──────────────────────────────────────────────────────────────────── */
export async function editComment(input: {
  commentId: string;
  content: string;
  storySlug: string;
  chapterNumber: number;
}): Promise<ActionResult> {
  const content = input.content.trim();
  if (!content) {
    return { success: false, error: "A comment can't be empty." };
  }
  if (content.length > MAX_COMMENT_LENGTH) {
    return { success: false, error: `Comments are limited to ${MAX_COMMENT_LENGTH} characters.` };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Please sign in to edit your comment." };

  const { error } = await (supabase.from("comments") as any)
    .update({ content, is_edited: true })
    .eq("id", input.commentId)
    .eq("user_id", user.id);

  if (error) {
    console.error("[editComment]", error.message);
    return { success: false, error: "Unable to update your comment. Please try again." };
  }

  try {
    revalidatePath(chapterPath(input.storySlug, input.chapterNumber));
  } catch (e) {
    console.warn("[editComment] revalidatePath warning:", e);
  }

  return { success: true, data: undefined };
}

/* ── Delete (soft) ─────────────────────────────────────────────────────────
   Content is preserved in the database — only is_deleted flips to true —
   so replies underneath stay intact and the thread doesn't collapse. */
export async function deleteComment(input: {
  commentId: string;
  storySlug: string;
  chapterNumber: number;
}): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Please sign in to delete your comment." };

  const { error } = await (supabase.from("comments") as any)
    .update({ is_deleted: true })
    .eq("id", input.commentId)
    .eq("user_id", user.id);

  if (error) {
    console.error("[deleteComment]", error.message);
    return { success: false, error: "Unable to delete your comment. Please try again." };
  }

  try {
    revalidatePath(chapterPath(input.storySlug, input.chapterNumber));
  } catch (e) {
    console.warn("[deleteComment] revalidatePath warning:", e);
  }

  return { success: true, data: undefined };
}

/* ── Pin (author only, one per chapter) ───────────────────────────────────
   The database enforces the "one pinned comment per chapter" rule via a
   unique partial index, so pinning a new comment first unpins whichever
   one currently holds that spot. RLS + a trigger (see the SQL file) make
   sure only the site author can ever move that flag. */
export async function togglePinComment(input: {
  commentId: string;
  chapterId: string;
  storySlug: string;
  chapterNumber: number;
}): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Please sign in." };

  const { data: profile } = await (supabase.from("profiles") as any)
    .select("is_admin")
    .eq("user_id", user.id)
    .single();

  if (!profile?.is_admin) {
    return { success: false, error: "Only the author can pin a comment." };
  }

  const { data: target } = await (supabase.from("comments") as any)
    .select("is_pinned")
    .eq("id", input.commentId)
    .single();

  if (target?.is_pinned) {
    /* Already pinned — this action unpins it. */
    const { error } = await (supabase.from("comments") as any)
      .update({ is_pinned: false })
      .eq("id", input.commentId);
    if (error) return { success: false, error: "Unable to unpin that comment." };
  } else {
    /* Unpin whatever currently holds the chapter's single pinned slot,
       then pin the requested comment. Two sequential statements — the
       unique index would reject doing this in one combined update. */
    const { error: unpinError } = await (supabase.from("comments") as any)
      .update({ is_pinned: false })
      .eq("chapter_id", input.chapterId)
      .eq("is_pinned", true);
    if (unpinError) {
      console.error("[togglePinComment] unpin:", unpinError.message);
      return { success: false, error: "Unable to update the pinned comment. Please try again." };
    }

    const { error: pinError } = await (supabase.from("comments") as any)
      .update({ is_pinned: true })
      .eq("id", input.commentId);
    if (pinError) {
      console.error("[togglePinComment] pin:", pinError.message);
      return { success: false, error: "Unable to pin that comment. Please try again." };
    }
  }

  try {
    revalidatePath(chapterPath(input.storySlug, input.chapterNumber));
  } catch (e) {
    console.warn("[togglePinComment] revalidatePath warning:", e);
  }

  return { success: true, data: undefined };
}

/* ── Load more (pagination) ───────────────────────────────────────────────── */
export async function loadMoreComments(
  chapterId: string,
  offset: number
): Promise<{ roots: CommentWithAuthor[]; replies: CommentWithAuthor[]; hasMore: boolean }> {
  return getCommentsPage(chapterId, offset);
}
