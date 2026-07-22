import Link from "next/link";
import BookCover from "@/components/BookCover";
import type { LibraryProgressEntry, LibraryBookmarkEntry, LibraryChapterBookmarkEntry } from "@/lib/stories";

/* ── Currently Reading / Recently Read card ─────────────────────────────── */
export function LibraryProgressCard({ entry }: { entry: LibraryProgressEntry }) {
  const chapterHref = entry.currentChapterNumber
    ? `/stories/${entry.slug}/chapters/${entry.currentChapterNumber}`
    : `/stories/${entry.slug}`;

  return (
    <Link href={chapterHref} className="library-card">
      <div className="library-card-cover">
        <BookCover title={entry.title} accent={entry.accent} coverUrl={entry.coverUrl} size="sm" />
      </div>
      <div className="library-card-body">
        <p className="library-card-genre">{entry.genre}</p>
        <h3 className="library-card-title font-display">{entry.title}</h3>
        {entry.currentChapterTitle && (
          <p className="library-card-chapter">
            Ch. {entry.currentChapterNumber} — {entry.currentChapterTitle}
          </p>
        )}
        <div className="reading-status-pill" style={{ margin: "0.6rem 0 0" }}>
          <span className="reading-status-track">
            <span className="reading-status-fill" style={{ width: `${entry.progressPercentage}%` }} />
          </span>
          {entry.progressPercentage}% read
        </div>
        <span className="library-card-cta">
          {entry.progressPercentage >= 100 ? "Read again" : "Continue"} →
        </span>
      </div>
    </Link>
  );
}

/* ── Bookmarked story card ───────────────────────────────────────────────── */
export function LibraryBookmarkCard({ entry }: { entry: LibraryBookmarkEntry }) {
  return (
    <Link href={`/stories/${entry.slug}`} className="library-card">
      <div className="library-card-cover">
        <BookCover title={entry.title} accent={entry.accent} coverUrl={entry.coverUrl} size="sm" />
      </div>
      <div className="library-card-body">
        <p className="library-card-genre">{entry.genre}</p>
        <h3 className="library-card-title font-display">{entry.title}</h3>
        <p className="library-card-chapter">by {entry.author}</p>
        <span className="library-card-cta">View story →</span>
      </div>
    </Link>
  );
}

/* ── Bookmarked chapter row — compact list item, not a full card ──────────
   Chapters are a lightweight "come back to this exact page" marker, so
   they render as a slim list rather than duplicating the card treatment
   used for whole stories (keeps the page from feeling cluttered). */
export function LibraryChapterBookmarkRow({ entry }: { entry: LibraryChapterBookmarkEntry }) {
  return (
    <Link href={`/stories/${entry.slug}/chapters/${entry.chapterNumber}`} className="library-chapter-row">
      <span className="library-chapter-row-book">{entry.title}</span>
      <span className="library-chapter-row-dot" aria-hidden="true" />
      <span className="library-chapter-row-chapter">Ch. {entry.chapterNumber} — {entry.chapterTitle}</span>
      <span className="library-chapter-row-arrow" aria-hidden="true">→</span>
    </Link>
  );
}
