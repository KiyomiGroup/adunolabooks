"use client";

/* ── Mock data — Sprint 3: replace with Supabase published_stories view ─── */
const MOCK_STORIES = [
  {
    id: 1,
    title: "Dust and Delay",
    genre: "Literary Fiction",
    chapterCount: 12,
    lastUpdated: "June 2025",
    excerpt: "A slow, quiet novel about the letters we never send and the ones we shouldn't have.",
    status: "Ongoing",
    accentClass: "purple",
  },
  {
    id: 2,
    title: "The Cartographer's Daughter",
    genre: "Historical",
    chapterCount: 8,
    lastUpdated: "May 2025",
    excerpt: "Set in 1940s Lagos, a woman inherits her father's maps and discovers they were never about geography.",
    status: "Ongoing",
    accentClass: "teal",
  },
  {
    id: 3,
    title: "Soft Animals",
    genre: "Short Stories",
    chapterCount: 5,
    lastUpdated: "April 2025",
    excerpt: "A collection of very short fictions about belonging, hunger, and the specific grief of Sunday evenings.",
    status: "Complete",
    accentClass: "coral",
  },
] as const;

const ACCENT: Record<string, { top: string; badge: string; badgeBg: string }> = {
  purple: { top: "var(--purple)",  badge: "var(--purple-dark)", badgeBg: "var(--purple-light)" },
  teal:   { top: "var(--teal)",    badge: "#1d8a7e",            badgeBg: "rgba(56,201,180,0.14)" },
  coral:  { top: "var(--coral)",   badge: "#c0372c",            badgeBg: "rgba(255,111,97,0.12)" },
};

export default function FeaturedStories() {
  return (
    <section id="stories-section" style={{ padding: "5rem 0" }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem" }}>
          <div>
            <p className="section-tag">Featured</p>
            <h2 className="section-h2 font-display">Stories</h2>
          </div>
          {/* Sprint 2: link to full stories index page */}
          <a
            href="/stories"
            style={{
              fontSize: "0.72rem",
              fontWeight: 500,
              color: "var(--purple)",
              textDecoration: "none",
              letterSpacing: "0.08em",
              borderBottom: "1px solid var(--purple-light)",
              paddingBottom: "2px",
            }}
          >
            View All →
          </a>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem" }}>
          {MOCK_STORIES.map((story) => {
            const a = ACCENT[story.accentClass];
            return (
              <article
                key={story.id}
                style={{
                  background: "var(--white)",
                  border: "1.5px solid var(--border)",
                  borderRadius: "12px",
                  padding: "1.75rem",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "box-shadow 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = "0 12px 32px rgba(123,63,242,0.1)";
                  el.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = "none";
                  el.style.transform = "none";
                }}
              >
                {/* Coloured top accent bar */}
                <div
                  style={{
                    position: "absolute",
                    top: 0, left: 0, right: 0,
                    height: "3px",
                    background: a.top,
                    borderRadius: "12px 12px 0 0",
                  }}
                  aria-hidden="true"
                />

                {/* Genre */}
                <p
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.55rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                    marginBottom: "0.85rem",
                  }}
                >
                  {story.genre}
                </p>

                {/* Title */}
                <h3
                  className="font-display"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.4rem",
                    fontWeight: 400,
                    color: "var(--ink)",
                    lineHeight: 1.25,
                    marginBottom: "0.75rem",
                  }}
                >
                  {story.title}
                </h3>

                {/* Excerpt */}
                <p style={{ fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                  {story.excerpt}
                </p>

                {/* Footer */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid rgba(123,63,242,0.08)",
                    paddingTop: "1rem",
                  }}
                >
                  <span style={{ fontSize: "0.68rem", color: "var(--muted)" }}>
                    {story.chapterCount} ch · {story.lastUpdated}
                  </span>
                  <span
                    style={{
                      fontSize: "0.62rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      padding: "0.25rem 0.6rem",
                      borderRadius: "20px",
                      background: a.badgeBg,
                      color: a.badge,
                    }}
                  >
                    {story.status}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
