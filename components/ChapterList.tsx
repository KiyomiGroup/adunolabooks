import Link from "next/link";
import { Story } from "@/lib/stories-types";

export default function ChapterList({ story }: { story: Story }) {
  return (
    <div className="manuscript-index" role="list">
      {story.chapters.map((ch) => {
        const isAvailable = ch.status === "available";
        const content = (
          <>
            <span className="manuscript-num">{String(ch.number).padStart(2, "0")}</span>

            <div>
              <p className="manuscript-title font-display">{ch.title}</p>
              {ch.subtitle && <p className="manuscript-subtitle">{ch.subtitle}</p>}
            </div>

            <div className="manuscript-meta">
              {isAvailable ? (
                <>
                  <div>{ch.publishedAt}</div>
                  <div style={{ opacity: 0.65, marginTop: "0.15rem" }}>{ch.readTime}</div>
                </>
              ) : (
                <span className="manuscript-drafting-tag">manuscript in progress</span>
              )}
            </div>
          </>
        );

        return isAvailable ? (
          <Link
            key={ch.number}
            href={`/stories/${story.slug}/chapters/${ch.number}`}
            className="manuscript-row"
            role="listitem"
          >
            {content}
          </Link>
        ) : (
          <div key={ch.number} className="manuscript-row drafting" role="listitem">
            {content}
          </div>
        );
      })}
    </div>
  );
}
