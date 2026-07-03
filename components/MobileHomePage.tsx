import Link from "next/link";
import { Story, getFirstAvailableChapter } from "@/lib/stories";
import BookCover from "@/components/BookCover";

/*
  Mobile homepage hero — matches the sketch:
  · "ADUNOLABOOKS" brand kicker at top
  · Large book cover dominating the screen
  · Genre / title / author / excerpt below
  · Side tabs (from TopNav) float over the right edge
  · Bottom bar (from TopNav) handles navigation
*/
export default function MobileHomePage({ story }: { story: Story }) {
  const firstChapter = getFirstAvailableChapter(story);
  const readingUrl = firstChapter
    ? `/stories/${story.slug}/chapters/${firstChapter.number}`
    : `/stories/${story.slug}`;

  return (
    <div className="u-mobile-only m-home-page">
      {/* Brand kicker */}
      <p className="m-home-kicker">AdunolaBooks</p>

      {/* Featured cover — large, dominant */}
      <div className="m-home-cover-wrap">
        <BookCover title={story.title} accent={story.accent} size="lg" />
      </div>

      {/* Story info */}
      <div className="m-home-info">
        <p className="m-home-genre">{story.genre}</p>
        <h1 className="m-home-title font-display">{story.title}</h1>
        <p className="m-home-author">by {story.author}</p>
        <p className="m-home-excerpt">{story.excerpt}</p>
      </div>
    </div>
  );
}
