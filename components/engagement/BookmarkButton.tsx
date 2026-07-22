"use client";
/*
  ── BookmarkButton ────────────────────────────────────────────────────────
  Optimistic bookmark/unbookmark toggle, reused for both story-level and
  chapter-level bookmarks (pass chapterId for the latter). Flips the icon
  and label immediately on click, then reconciles with the server action's
  result — on failure it rolls back and shows an inline message, matching
  the pattern in CommentForm/CommentThread.

  Two visual variants:
    "pill"  — labelled button (story hero, mobile hero)
    "icon"  — compact icon-only button (chapter header)
*/
import { useState, useTransition } from "react";
import { toggleBookmark } from "@/lib/actions/engagement";

function BookmarkGlyph({ filled }: { filled: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.5 2.5A1.5 1.5 0 0 1 5 1h6a1.5 1.5 0 0 1 1.5 1.5v12L8 11.2l-4.5 3.3v-12Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill={filled ? "currentColor" : "none"}
      />
    </svg>
  );
}

export default function BookmarkButton({
  bookId,
  chapterId = null,
  storySlug,
  initialBookmarked,
  variant = "pill",
  labels,
  signedIn,
}: {
  bookId: string;
  chapterId?: string | null;
  storySlug: string;
  initialBookmarked: boolean;
  variant?: "pill" | "icon";
  labels?: { onLabel: string; offLabel: string };
  signedIn: boolean;
}) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [justChanged, setJustChanged] = useState(false);

  const onLabel  = labels?.onLabel  ?? "Bookmarked";
  const offLabel = labels?.offLabel ?? "Bookmark";

  function handleClick() {
    if (!signedIn) {
      window.location.href = `/auth/login?next=${encodeURIComponent(`/stories/${storySlug}`)}`;
      return;
    }
    if (pending) return;

    const next = !bookmarked;
    setBookmarked(next);      /* optimistic flip */
    setError(null);

    startTransition(async () => {
      const result = await toggleBookmark({ bookId, chapterId, storySlug });
      if (!result.success) {
        setBookmarked(!next);  /* roll back */
        setError(result.error);
        return;
      }
      setJustChanged(true);
      setTimeout(() => setJustChanged(false), 420);
    });
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-pressed={bookmarked}
        aria-label={bookmarked ? "Remove chapter bookmark" : "Bookmark this chapter"}
        title={bookmarked ? "Remove chapter bookmark" : "Bookmark this chapter"}
        className={`bookmark-icon-btn ${bookmarked ? "is-active" : ""} ${justChanged ? "bookmark-pop" : ""}`}
      >
        <BookmarkGlyph filled={bookmarked} />
      </button>
    );
  }

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", gap: "0.35rem" }}>
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-pressed={bookmarked}
        className={`bookmark-pill-btn ${bookmarked ? "is-active" : ""} ${justChanged ? "bookmark-pop" : ""}`}
      >
        <BookmarkGlyph filled={bookmarked} />
        {bookmarked ? onLabel : offLabel}
      </button>
      {error && <span className="bookmark-error-text">{error}</span>}
    </div>
  );
}
