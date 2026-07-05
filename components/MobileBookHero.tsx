import Link from "next/link";
import { Story, getFirstAvailableChapter } from "@/lib/stories-types";
import BookCover from "@/components/BookCover";
import ChapterList from "@/components/ChapterList";

export default function MobileBookHero({ story }: { story: Story }) {
  const firstChapter = getFirstAvailableChapter(story);
  const continuing = story.readingProgress > 0 && story.readingProgress < 100;

  return (
    <div className="u-mobile-only m-hero-card">
      {/* Brand kicker */}
      <p className="m-kicker">AdunolaBooks</p>

      {/* Cover + metadata row */}
      <div className="m-hero-row">
        <div className="m-hero-cover">
          <BookCover title={story.title} accent={story.accent} size="sm" />
        </div>

        <div className="m-hero-info">
          <p className="m-genre-tag">{story.genre}</p>
          <h1 className="m-hero-title font-display">{story.title}</h1>
          <p className="m-hero-author">by {story.author}</p>
          <p className="m-hero-synopsis">{story.excerpt}</p>
        </div>
      </div>

      {/* Primary CTA */}
      {firstChapter && (
        <Link
          href={`/stories/${story.slug}/chapters/${firstChapter.number}`}
          className="m-cta-pill"
        >
          {continuing ? "Continue Reading →" : "Start Reading →"}
        </Link>
      )}

      {/* Chapter list */}
      <p className="m-manuscript-label">Manuscript Index</p>
      <ChapterList story={story} />
    </div>
  );
}
