import Link from "next/link";
import { Story, getFirstAvailableChapter } from "@/lib/stories-types";
import BookCover from "@/components/BookCover";
import ChapterList from "@/components/ChapterList";
import BookmarkButton from "@/components/engagement/BookmarkButton";

export default function MobileBookHero({
  story,
  storyBookmarked = false,
  signedIn = false,
}: {
  story: Story;
  storyBookmarked?: boolean;
  signedIn?: boolean;
}) {
  const firstChapter = getFirstAvailableChapter(story);
  const continuing = story.readingProgress > 0 && story.readingProgress < 100;

  return (
    <div className="u-mobile-only m-hero-card">
      <p className="m-kicker">AdunolaBooks</p>

      <div className="m-hero-row">
        <div className="m-hero-cover">
          <BookCover
            title={story.title}
            accent={story.accent}
            coverUrl={(story as any).coverUrl ?? null}
            size="sm"
          />
        </div>

        <div className="m-hero-info">
          <p className="m-genre-tag">{story.genre}</p>
          {(continuing || storyBookmarked) && (
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.35rem" }}>
              {continuing && <span className="engagement-indicator is-reading">Reading</span>}
              {storyBookmarked && <span className="engagement-indicator is-bookmarked">Bookmarked</span>}
            </div>
          )}
          <h1 className="m-hero-title font-display">{story.title}</h1>
          <p className="m-hero-author">by {story.author}</p>
          <p className="m-hero-synopsis">{story.excerpt}</p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {firstChapter && (
          <Link
            href={`/stories/${story.slug}/chapters/${firstChapter.number}`}
            className="m-cta-pill"
            style={{ flex: 1 }}
          >
            {continuing ? "Continue Reading →" : "Start Reading →"}
          </Link>
        )}
        <BookmarkButton
          bookId={String(story.id)}
          storySlug={story.slug}
          initialBookmarked={storyBookmarked}
          signedIn={signedIn}
          variant="icon"
        />
      </div>

      <p className="m-manuscript-label">Manuscript Index</p>
      <ChapterList story={story} />
    </div>
  );
}
