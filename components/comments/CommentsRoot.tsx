"use client";
/*
  ── CommentsRoot ──────────────────────────────────────────────────────────
  Owns all client-side discussion state. Receives the first page already
  rendered server-side (fast first paint, no loading flash for the common
  case), then manages new comments/replies/edits/deletes/pins and "load
  more" pagination locally so the discussion feels immediate rather than
  waiting on a full page revalidation for every interaction.
*/
import { useMemo, useState } from "react";
import Link from "next/link";
import type { CommentWithAuthor } from "@/lib/supabase/queries";
import { createComment, loadMoreComments } from "@/lib/actions/comments";
import CommentForm from "./CommentForm";
import CommentThread, { type DiscussionUser } from "./CommentThread";

export default function CommentsRoot({
  chapterId,
  storySlug,
  chapterNumber,
  initialRoots,
  initialReplies,
  initialHasMore,
  currentUser,
}: {
  chapterId: string;
  storySlug: string;
  chapterNumber: number;
  initialRoots: CommentWithAuthor[];
  initialReplies: CommentWithAuthor[];
  initialHasMore: boolean;
  currentUser: DiscussionUser | null;
}) {
  const [roots, setRoots] = useState(initialRoots);
  const [replies, setReplies] = useState(initialReplies);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);

  const childrenByParent = useMemo(() => {
    const map = new Map<string, CommentWithAuthor[]>();
    for (const reply of replies) {
      if (!reply.parent_comment_id) continue;
      const list = map.get(reply.parent_comment_id) ?? [];
      list.push(reply);
      map.set(reply.parent_comment_id, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }
    return map;
  }, [replies]);

  function appendRootComment(comment: CommentWithAuthor) {
    setRoots((prev) => [...prev, comment]);
  }

  function appendReply(reply: CommentWithAuthor) {
    setReplies((prev) => [...prev, reply]);
  }

  function applyEdit(id: string, content: string) {
    setRoots((prev) => prev.map((c) => (c.id === id ? { ...c, content, is_edited: true } : c)));
    setReplies((prev) => prev.map((c) => (c.id === id ? { ...c, content, is_edited: true } : c)));
  }

  function applyDelete(id: string) {
    setRoots((prev) => prev.map((c) => (c.id === id ? { ...c, is_deleted: true } : c)));
    setReplies((prev) => prev.map((c) => (c.id === id ? { ...c, is_deleted: true } : c)));
  }

  function applyPinToggle(id: string, nextPinned: boolean) {
    setRoots((prev) => prev.map((c) => ({ ...c, is_pinned: c.id === id ? nextPinned : nextPinned ? false : c.is_pinned })));
    setReplies((prev) => prev.map((c) => ({ ...c, is_pinned: c.id === id ? nextPinned : nextPinned ? false : c.is_pinned })));
  }

  async function handleNewComment(content: string) {
    if (!currentUser) return { success: false, error: "Please sign in to join the discussion." };
    const result = await createComment({ chapterId, content, parentCommentId: null, storySlug, chapterNumber });
    if (result.success) {
      appendRootComment(result.data);
      return { success: true };
    }
    return { success: false, error: result.error };
  }

  async function handleLoadMore() {
    setLoadingMore(true);
    setLoadMoreError(null);
    try {
      const page = await loadMoreComments(chapterId, roots.length);
      setRoots((prev) => [...prev, ...page.roots]);
      setReplies((prev) => [...prev, ...page.replies]);
      setHasMore(page.hasMore);
    } catch {
      setLoadMoreError("Unable to load more comments. Please try again.");
    } finally {
      setLoadingMore(false);
    }
  }

  const isEmpty = roots.length === 0;
  const nextParam = encodeURIComponent(`/stories/${storySlug}/chapters/${chapterNumber}`);

  return (
    <section className="discussion-section" aria-labelledby="discussion-heading">
      <p className="section-tag">Discussion</p>
      <h2 id="discussion-heading" className="font-display discussion-heading">
        What did you think about this chapter?
      </h2>

      {isEmpty && (
        <p className="discussion-empty">Be the first reader to share your thoughts.</p>
      )}

      {currentUser ? (
        <div style={{ marginBottom: "2rem" }}>
          <CommentForm placeholder="Share your thoughts on this chapter…" submitLabel="Post Comment" onSubmit={handleNewComment} />
        </div>
      ) : (
        <p className="discussion-signin-prompt">
          <Link href={`/auth/login?next=${nextParam}`}>Sign in</Link> to join the discussion.
        </p>
      )}

      {roots.map((root) => (
        <CommentThread
          key={root.id}
          comment={root}
          childrenByParent={childrenByParent}
          depth={0}
          chapterId={chapterId}
          storySlug={storySlug}
          chapterNumber={chapterNumber}
          currentUser={currentUser}
          onReplyCreated={appendReply}
          onEdited={applyEdit}
          onDeleted={applyDelete}
          onPinToggled={applyPinToggle}
        />
      ))}

      {hasMore && (
        <div style={{ textAlign: "center", marginTop: "2.25rem" }}>
          <button type="button" onClick={handleLoadMore} disabled={loadingMore} className="discussion-load-more">
            {loadingMore ? "Loading…" : "Load more comments"}
          </button>
          {loadMoreError && (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "var(--coral)", marginTop: "0.6rem" }}>
              {loadMoreError}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
