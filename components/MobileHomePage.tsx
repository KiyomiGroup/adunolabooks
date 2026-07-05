import Link from "next/link";
import { Story, getFirstAvailableChapter } from "@/lib/stories-types";
import BookCover from "@/components/BookCover";
import MobileStoryCard from "@/components/MobileStoryCard";

/*
  Mobile homepage — matching the sketch:
  · Centered "ADUNOLABOOKS" kicker (mono, spaced)
  · Big cover (left, 120px) + genre / title / author / excerpt (right)
  · Full-width "Start Reading →" CTA button
  · Divider + "More from the Library" stacked story cards
*/
export default function MobileHomePage({
  featured,
  rest,
}: {
  featured: Story;
  rest: Story[];
}) {
  const firstChapter = getFirstAvailableChapter(featured);
  const continuing = featured.readingProgress > 0 && featured.readingProgress < 100;

  return (
    <div className="u-mobile-only m-home-page">
      {/* Brand kicker */}
      <p className="m-home-kicker">AdunolaBooks</p>

      {/* Divider above card */}
      <div className="m-home-divider" />

      {/* Featured book — cover left, meta right */}
      <div className="m-home-hero-row">
        {/* Book cover — larger, with shadow */}
        <div className="m-home-cover">
          <BookCover title={featured.title} accent={featured.accent} size="sm" />
        </div>

        <div className="m-home-info">
          <p className="m-home-genre">{featured.genre}</p>
          <h1 className="m-home-title font-display">{featured.title}</h1>
          <p className="m-home-author">by {featured.author}</p>
          <p className="m-home-excerpt">{featured.excerpt}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="m-home-divider" />

      {/* Primary CTA — full width */}
      {firstChapter && (
        <Link
          href={`/stories/${featured.slug}/chapters/${firstChapter.number}`}
          className="m-cta-pill"
        >
          {continuing ? "Continue Reading →" : "Start Reading →"}
        </Link>
      )}

      {/* More stories section */}
      {rest.length > 0 && (
        <>
          <p className="m-home-more-label">More from the Library</p>
          <div className="m-story-list">
            {rest.map((story) => (
              <MobileStoryCard key={story.id} story={story} />
            ))}
          </div>
        </>
      )}

      {/* Bottom breathing room (above fixed bottom bar) */}
      <div style={{ height: "1.5rem" }} />
    </div>
  );
}
