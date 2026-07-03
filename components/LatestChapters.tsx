"use client";

/* ── Mock data — Sprint 2/3: replace with real chapter feed ─────────────── */
const MOCK_CHAPTERS = [
  { id: 1, storyTitle: "Dust and Delay",             chapterNumber: 12, chapterTitle: "What the Window Knew",         publishedAt: "June 14, 2025", readTime: "18 min" },
  { id: 2, storyTitle: "The Cartographer's Daughter", chapterNumber: 8,  chapterTitle: "The Lagos Grid",               publishedAt: "June 7, 2025",  readTime: "22 min" },
  { id: 3, storyTitle: "Dust and Delay",             chapterNumber: 11, chapterTitle: "A House in the Middle of Rain", publishedAt: "May 30, 2025",  readTime: "15 min" },
  { id: 4, storyTitle: "Soft Animals",               chapterNumber: 5,  chapterTitle: "How We Leave",                 publishedAt: "May 22, 2025",  readTime: "9 min"  },
];

export default function LatestChapters() {
  return (
    <section style={{ background: "var(--bg-xlight)", padding: "5rem 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p className="section-tag">Recently Published</p>
          <h2 className="section-h2 font-display">Latest Chapters</h2>
        </div>

        {/* Table-of-contents style list */}
        <ol style={{ listStyle: "none", padding: 0, margin: 0 }} role="list">
          {MOCK_CHAPTERS.map((ch) => (
            <li
              key={ch.id}
              className="chapter-row-grid"
              style={{
                borderTop: "1px solid var(--border)",
                padding: "1.5rem 0",
                cursor: "pointer",
                borderRadius: "4px",
                transition: "all 0.15s",
              }}
              /* Sprint 2: replace with Link to /stories/[slug]/chapters/[num] */
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "var(--white)";
                el.style.padding = "1.5rem 1rem";
                /* Only extend beyond padding on desktop — avoids horizontal overflow on mobile */
                if (window.innerWidth > 1024) el.style.margin = "0 -1rem";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "transparent";
                el.style.padding = "1.5rem 0";
                el.style.margin = "0";
              }}
            >
              {/* Chapter number */}
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.6rem",
                  color: "var(--purple)",
                  opacity: 0.5,
                  textAlign: "right",
                  letterSpacing: "0.08em",
                }}
              >
                {String(ch.chapterNumber).padStart(2, "0")}
              </span>

              {/* Title */}
              <div>
                <p style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.56rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: "0.3rem",
                }}>
                  {ch.storyTitle}
                </p>
                <h3 className="font-display" style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.15rem",
                  fontWeight: 400,
                  color: "var(--ink)",
                }}>
                  {ch.chapterTitle}
                </h3>
              </div>

              {/* Meta — hidden on mobile via .chapter-row-meta CSS */}
              <div className="chapter-row-meta" style={{ textAlign: "right" }}>
                <p style={{ fontSize: "0.65rem", color: "var(--muted)", margin: "0 0 0.2rem" }}>{ch.publishedAt}</p>
                <p style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.58rem",
                  color: "var(--purple)",
                  opacity: 0.65,
                  margin: 0,
                }}>
                  {ch.readTime}
                </p>
              </div>
            </li>
          ))}
          {/* Closing rule */}
          <li style={{ borderTop: "1px solid var(--border)" }} aria-hidden="true" />
        </ol>
      </div>
    </section>
  );
}
