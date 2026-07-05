/*
  ── FeaturedStories — Sprint 3 ───────────────────────────────────────────────
  Now a Server Component. Fetches published books from Supabase.
  UI is preserved exactly from Sprint 2. Mock data removed.
  Mouse interactions moved to a thin Client wrapper below.
*/
import Link from "next/link";
import { getAllStories } from "@/lib/stories";
import type { Story, Accent } from "@/lib/stories";
import FeaturedCard from "./FeaturedCard";

const ACCENT: Record<Accent, { top: string; badge: string; badgeBg: string }> = {
  purple: { top: "var(--purple)",  badge: "var(--purple-dark)", badgeBg: "var(--purple-light)" },
  teal:   { top: "var(--teal)",    badge: "#1d8a7e",            badgeBg: "rgba(56,201,180,0.14)" },
  coral:  { top: "var(--coral)",   badge: "#c0372c",            badgeBg: "rgba(255,111,97,0.12)" },
  gold:   { top: "var(--gold)",    badge: "#9a7212",            badgeBg: "rgba(245,185,66,0.16)" },
};

export default async function FeaturedStories() {
  const allStories = await getAllStories();
  /* Show up to 3 featured stories — first 3 published */
  const stories = allStories.slice(0, 3);

  return (
    <section id="stories-section" style={{ padding: "5rem 0" }}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem" }}>
          <div>
            <p className="section-tag">Featured</p>
            <h2 className="section-h2 font-display">Stories</h2>
          </div>
          <Link href="/stories" style={{ fontSize: "0.72rem", fontWeight: 500, color: "var(--purple)", textDecoration: "none", letterSpacing: "0.08em", borderBottom: "1px solid var(--purple-light)", paddingBottom: "2px" }}>
            View All →
          </Link>
        </div>

        <div className="featured-grid">
          {stories.length === 0 ? (
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontStyle: "italic", color: "var(--muted)" }}>
              The first stories are being prepared…
            </p>
          ) : (
            stories.map((story) => {
              const a = ACCENT[story.accent] ?? ACCENT.purple;
              return <FeaturedCard key={String(story.id)} story={story} accent={a} />;
            })
          )}
        </div>
      </div>
    </section>
  );
}
