import Link from "next/link";
import { Story } from "@/lib/stories";
import BookCover from "@/components/BookCover";

export default function MobileStoryCard({ story }: { story: Story }) {
  return (
    <Link href={`/stories/${story.slug}`} className="m-story-card">
      <div className="m-story-cover">
        <BookCover title={story.title} accent={story.accent} size="sm" />
      </div>

      <div className="m-story-info">
        <p className="m-story-genre">{story.genre}</p>
        <h3 className="m-story-title font-display">{story.title}</h3>
        <p className="m-story-excerpt">{story.excerpt}</p>
      </div>
    </Link>
  );
}
