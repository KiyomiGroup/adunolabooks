"use client";

import { useMemo, useState } from "react";
import { Story } from "@/lib/stories";
import StoryCard from "@/components/StoryCard";

export default function StoriesGrid({ stories }: { stories: Story[] }) {
  const genres = useMemo(() => {
    const unique = Array.from(new Set(stories.map((s) => s.genre)));
    return ["All", ...unique];
  }, [stories]);

  const [activeGenre, setActiveGenre] = useState("All");

  const visible =
    activeGenre === "All" ? stories : stories.filter((s) => s.genre === activeGenre);

  return (
    <>
      <div className="genre-filter-row" role="tablist" aria-label="Filter stories by genre">
        {genres.map((genre) => (
          <button
            key={genre}
            type="button"
            role="tab"
            aria-selected={activeGenre === genre}
            className={`genre-pill ${activeGenre === genre ? "active" : ""}`}
            onClick={() => setActiveGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>

      <div className="stories-grid fade-up">
        {visible.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>

      {visible.length === 0 && (
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", padding: "3rem 0" }}>
          No stories in this genre yet — check back soon.
        </p>
      )}
    </>
  );
}
