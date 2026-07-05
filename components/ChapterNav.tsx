import Link from "next/link";
import { Chapter } from "@/lib/stories-types";

export default function ChapterNav({
  storySlug,
  prevChapter,
  nextChapter,
}: {
  storySlug: string;
  prevChapter: Chapter | null;
  nextChapter: Chapter | null;
}) {
  const nextAvailable = nextChapter && nextChapter.status === "available";

  return (
    <nav className="reader-nav-bottom" aria-label="Chapter navigation">
      {prevChapter ? (
        <Link href={`/stories/${storySlug}/chapters/${prevChapter.number}`} className="reader-nav-card prev">
          <p className="reader-nav-direction">← Previous</p>
          <p className="reader-nav-title font-display">{prevChapter.title}</p>
        </Link>
      ) : (
        <span className="reader-nav-card prev disabled">
          <p className="reader-nav-direction">← Previous</p>
          <p className="reader-nav-title font-display">This is where it begins</p>
        </span>
      )}

      {nextAvailable ? (
        <Link href={`/stories/${storySlug}/chapters/${nextChapter!.number}`} className="reader-nav-card next">
          <p className="reader-nav-direction">Next →</p>
          <p className="reader-nav-title font-display">{nextChapter!.title}</p>
        </Link>
      ) : (
        <span className="reader-nav-card next disabled">
          <p className="reader-nav-direction">Next →</p>
          <p className="reader-nav-title font-display">
            {nextChapter ? "Manuscript in progress" : "End of what's written"}
          </p>
        </span>
      )}
    </nav>
  );
}
