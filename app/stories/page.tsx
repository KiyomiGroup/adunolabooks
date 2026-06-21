import type { Metadata } from "next";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import StoriesGrid from "@/components/StoriesGrid";
import { WaveDown } from "@/components/WaveDivider";
import { getAllStories } from "@/lib/stories";

export const metadata: Metadata = {
  title: "Stories — AdunolaBooks",
  description: "Browse the full library of serialized fiction, one quiet shelf at a time.",
};

/* Sprint 3: getAllStories() will read from the published_stories Supabase view */
export default function StoriesPage() {
  const stories = getAllStories();

  return (
    <>
      <TopNav />

      <main>
        {/* ── Intro band ────────────────────────────────────────── */}
        <section style={{ background: "var(--bg-soft)", padding: "5.5rem 0 4rem" }}>
          <div className="container fade-up">
            <p className="section-tag">The Library</p>
            <h1 className="section-h2 font-display" style={{ fontSize: "clamp(2.2rem, 4.5vw, 3rem)" }}>
              Stories
            </h1>
            <p className="lede-text">
              Every serialized world published here, gathered on one shelf. New chapters
              arrive a little at a time — the way the best ones always have.
            </p>
          </div>
        </section>

        <WaveDown fill="#FFFFFF" />

        {/* ── Grid + filters ────────────────────────────────────── */}
        <section style={{ background: "#FFFFFF", padding: "1rem 0 6rem", marginTop: "-2px" }}>
          <div className="container">
            <StoriesGrid stories={stories} />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
