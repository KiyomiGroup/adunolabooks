import Link from "next/link";
import { Story, getFirstAvailableChapter } from "@/lib/stories-types";
import BookCover from "@/components/BookCover";
import MobileStoryCard from "@/components/MobileStoryCard";

/*
  Mobile homepage — matches Image 2 layout exactly:
  · "ADUNOLABOOKS" centered kicker
  · Cover (left 108px) + genre / title / author / excerpt (right)
  · Full-width "Start Reading →" pill button
  · Divider
  · "More from the Library" — rest of stories as MobileStoryCard rows
*/
export default function MobileHomePage({
  featured,
  rest,
}: {
  featured: Story;
  rest: Story[];
}) {
  const firstChapter = getFirstAvailableChapter(featured);
  const continuing =
    featured.readingProgress > 0 && featured.readingProgress < 100;

  return (
    <div className="u-mobile-only m-home-page">
      {/* Brand kicker */}
      <p className="m-home-kicker">AdunolaBooks</p>

      {/* Featured book — cover + info row */}
      <div className="m-home-hero-row">
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

      {/* Primary CTA */}
      {firstChapter && (
        <Link
          href={`/stories/${featured.slug}/chapters/${firstChapter.number}`}
          className="m-cta-pill"
        >
          {continuing ? "Continue Reading →" : "Start Reading →"}
        </Link>
      )}

      {/* More stories */}
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
    </div>
  );
}
