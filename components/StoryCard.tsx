import Link from "next/link";
import { Story, ACCENT_COLORS, getFirstAvailableChapter } from "@/lib/stories-types";
import BookCover from "@/components/BookCover";

export default function StoryCard({ story }: { story: Story }) {
  const a = ACCENT_COLORS[story.accent];
  const firstChapter = getFirstAvailableChapter(story);
  const continuing = story.readingProgress > 0 && story.readingProgress < 100;

  return (
    <Link href={`/stories/${story.slug}`} className="story-card">
      <div className="story-card-cover-wrap">
        <BookCover title={story.title} accent={story.accent} size="sm" />
      </div>

      <div className="story-card-body">
        {/* Genre */}
        <p
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.55rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginTop: "1rem",
            marginBottom: "0.75rem",
          }}
        >
          {story.genre}
        </p>

        {/* Title */}
        <h3
          className="font-display"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.3rem",
            fontWeight: 400,
            color: "var(--ink)",
            lineHeight: 1.25,
            marginBottom: "0.65rem",
          }}
        >
          {story.title}
        </h3>

        {/* Excerpt */}
        <p style={{ fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: "1.25rem", flex: 1 }}>
          {story.excerpt}
        </p>

        {/* Reading status placeholder — Sprint 3: real per-reader progress */}
        <div className="reading-status-pill" style={{ marginBottom: "1.1rem" }}>
          <span className="reading-status-track">
            <span className="reading-status-fill" style={{ width: `${story.readingProgress}%` }} />
          </span>
          {story.readingProgress === 0 && "Not started"}
          {continuing && `${story.readingProgress}% read`}
          {story.readingProgress === 100 && "Finished"}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid var(--lavender-border)",
            paddingTop: "1rem",
          }}
        >
          <span style={{ fontSize: "0.66rem", color: "var(--muted)" }}>
            {story.chapters.length} ch · {story.lastUpdated}
          </span>
          <span className="status-badge" style={{ background: a.badgeBg, color: a.badge }}>
            {story.status}
          </span>
        </div>

        {firstChapter && (
          <span
            style={{
              marginTop: "1rem",
              fontSize: "0.72rem",
              fontWeight: 500,
              color: "var(--purple)",
              letterSpacing: "0.04em",
            }}
          >
            {continuing ? "Continue reading" : "Start reading"} →
          </span>
        )}
      </div>
    </Link>
  );
}
