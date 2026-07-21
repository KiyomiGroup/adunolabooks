"use client";
/*
  ── CommentThread ─────────────────────────────────────────────────────────
  Renders one comment plus its replies, recursively. Visual indentation is
  capped at two levels — any reply deeper than that renders at the same
  indent as level two (with a small "replying to" note for orientation)
  rather than marching further right, per the Sprint 4B spec.
*/
import { useState } from "react";
import type { CommentWithAuthor } from "@/lib/supabase/queries";
import { createComment, editComment, deleteComment, togglePinComment } from "@/lib/actions/comments";
import CommentAvatar from "./CommentAvatar";
import CommentForm from "./CommentForm";

export interface DiscussionUser {
  id: string;
  isAdmin: boolean;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

interface CommentThreadProps {
  comment: CommentWithAuthor;
  childrenByParent: Map<string, CommentWithAuthor[]>;
  depth: number;
  parentAuthorName?: string;
  chapterId: string;
  storySlug: string;
  chapterNumber: number;
  currentUser: DiscussionUser | null;
  onReplyCreated: (reply: CommentWithAuthor) => void;
  onEdited: (id: string, content: string) => void;
  onDeleted: (id: string) => void;
  onPinToggled: (id: string, nextPinned: boolean) => void;
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default function CommentThread({
  comment,
  childrenByParent,
  depth,
  parentAuthorName,
  chapterId,
  storySlug,
  chapterNumber,
  currentUser,
  onReplyCreated,
  onEdited,
  onDeleted,
  onPinToggled,
}: CommentThreadProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const author = comment.author;
  const authorName = author?.display_name || author?.username || "A reader";
  const isOwn = currentUser?.id === comment.user_id;
  const isAuthorComment = !!author?.is_admin;

  const indentDepth = Math.min(depth, 2);
  const showParentNote = depth >= 3 && parentAuthorName;
  const children = childrenByParent.get(comment.id) ?? [];

  async function handleReply(content: string) {
    if (!currentUser) return { success: false, error: "Please sign in to reply." };
    const result = await createComment({
      chapterId,
      content,
      parentCommentId: comment.id,
      storySlug,
      chapterNumber,
    });
    if (result.success) {
      onReplyCreated(result.data);
      setShowReplyForm(false);
      return { success: true };
    }
    return { success: false, error: result.error };
  }

  async function handleEdit(content: string) {
    const result = await editComment({ commentId: comment.id, content, storySlug, chapterNumber });
    if (result.success) {
      onEdited(comment.id, content);
      setIsEditing(false);
      return { success: true };
    }
    return { success: false, error: result.error };
  }

  async function handleDelete() {
    setActionError(null);
    const result = await deleteComment({ commentId: comment.id, storySlug, chapterNumber });
    if (result.success) {
      onDeleted(comment.id);
    } else {
      setActionError(result.error ?? "Unable to delete that comment.");
    }
  }

  async function handlePin() {
    setActionError(null);
    const nextPinned = !comment.is_pinned;
    const result = await togglePinComment({ commentId: comment.id, chapterId, storySlug, chapterNumber });
    if (result.success) {
      onPinToggled(comment.id, nextPinned);
    } else {
      setActionError(result.error ?? "Unable to update the pinned comment.");
    }
  }

  return (
    <div
      style={{
        marginLeft: indentDepth > 0 ? `${indentDepth * 2.25}rem` : 0,
        paddingLeft: indentDepth > 0 ? "1.25rem" : 0,
        borderLeft: indentDepth > 0 ? "1.5px solid var(--purple-light)" : "none",
        marginTop: depth === 0 ? "2rem" : "1.5rem",
      }}
    >
      {comment.is_pinned && (
        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--purple)",
          margin: "0 0 0.5rem",
        }}>
          ✦ Pinned by the author
        </p>
      )}

      {showParentNote && (
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.76rem",
          color: "var(--muted-light)",
          margin: "0 0 0.4rem",
        }}>
          replying to {parentAuthorName}
        </p>
      )}

      <div style={{ display: "flex", gap: "0.85rem" }}>
        <CommentAvatar avatarUrl={author?.avatar_url} name={authorName} size={depth === 0 ? 44 : 36} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.25rem" }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.9rem", color: "var(--ink)" }}>
              {authorName}
            </span>

            {isAuthorComment && (
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.56rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--purple-dark)",
                background: "var(--purple-xlight)",
                border: "1px solid var(--purple-light)",
                borderRadius: "4px",
                padding: "0.15rem 0.45rem",
              }}>
                Author
              </span>
            )}

            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "var(--muted-light)" }}>
              {timeAgo(comment.created_at)}
            </span>

            {comment.is_edited && !comment.is_deleted && (
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", fontStyle: "italic", color: "var(--muted-light)" }}>
                Edited
              </span>
            )}
          </div>

          {comment.is_deleted ? (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", fontStyle: "italic", color: "var(--muted-light)", margin: "0.2rem 0" }}>
              This comment has been deleted.
            </p>
          ) : isEditing ? (
            <div style={{ marginTop: "0.4rem" }}>
              <CommentForm
                placeholder="Edit your comment…"
                submitLabel="Save"
                initialValue={comment.content}
                compact
                autoFocus
                onSubmit={handleEdit}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          ) : (
            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.92rem",
              lineHeight: 1.7,
              color: "var(--ink-soft)",
              margin: "0.2rem 0",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}>
              {comment.content}
            </p>
          )}

          {!comment.is_deleted && !isEditing && (
            <div style={{ display: "flex", gap: "1.1rem", marginTop: "0.5rem" }}>
              {currentUser && (
                <button
                  type="button"
                  onClick={() => setShowReplyForm((v) => !v)}
                  style={quietButtonStyle}
                >
                  Reply
                </button>
              )}
              {isOwn && (
                <button type="button" onClick={() => setIsEditing(true)} style={quietButtonStyle}>
                  Edit
                </button>
              )}
              {isOwn && (
                <button type="button" onClick={handleDelete} style={quietButtonStyle}>
                  Delete
                </button>
              )}
              {currentUser?.isAdmin && (
                <button type="button" onClick={handlePin} style={quietButtonStyle}>
                  {comment.is_pinned ? "Unpin" : "Pin"}
                </button>
              )}
            </div>
          )}

          {actionError && (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "var(--coral)", marginTop: "0.4rem" }}>
              {actionError}
            </p>
          )}

          {showReplyForm && (
            <div style={{ marginTop: "0.75rem" }}>
              <CommentForm
                placeholder={`Reply to ${authorName}…`}
                submitLabel="Reply"
                compact
                autoFocus
                onSubmit={handleReply}
                onCancel={() => setShowReplyForm(false)}
              />
            </div>
          )}
        </div>
      </div>

      {children.map((child) => (
        <CommentThread
          key={child.id}
          comment={child}
          childrenByParent={childrenByParent}
          depth={depth + 1}
          parentAuthorName={authorName}
          chapterId={chapterId}
          storySlug={storySlug}
          chapterNumber={chapterNumber}
          currentUser={currentUser}
          onReplyCreated={onReplyCreated}
          onEdited={onEdited}
          onDeleted={onDeleted}
          onPinToggled={onPinToggled}
        />
      ))}
    </div>
  );
}

const quietButtonStyle: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.78rem",
  fontWeight: 500,
  color: "var(--purple)",
  background: "transparent",
  border: "none",
  padding: 0,
  cursor: "pointer",
};
