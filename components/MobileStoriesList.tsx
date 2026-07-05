import { Story } from "@/lib/stories-types";
import MobileStoryCard from "@/components/MobileStoryCard";

export default function MobileStoriesList({ stories }: { stories: Story[] }) {
  return (
    <div className="u-mobile-only m-library-card">
      <p className="m-library-kicker">The Library</p>
      <p className="m-section-label">All Stories</p>

      <div className="m-story-list">
        {stories.map((story) => (
          <MobileStoryCard key={story.id} story={story} />
        ))}
      </div>

      {stories.length === 0 && (
        <p style={{ color: "var(--muted)", fontSize: "0.82rem", padding: "2rem 0" }}>
          No stories yet — check back soon.
        </p>
      )}
    </div>
  );
}
