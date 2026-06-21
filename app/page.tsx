import TopNav from "@/components/TopNav";
import Hero from "@/components/Hero";
import FeaturedStories from "@/components/FeaturedStories";
import LatestChapters from "@/components/LatestChapters";
import PoetryPreview from "@/components/PoetryPreview";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

/* ── Homepage ───────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      {/*
        Desktop: horizontal book-tab nav (top)
        Mobile:  side bookmark tabs (right edge)
        Sprint 2: expand mobile tabs into a full slide-out panel
      */}
      <TopNav />

      <main>
        {/* Sprint 1: Hero — 3-column layout */}
        <Hero />

        {/* Sprint 1: Featured Stories — Sprint 3: Supabase published_stories */}
        <FeaturedStories />

        {/* Sprint 1: Latest Chapters — Sprint 2/3: real chapter feed */}
        <LatestChapters />

        {/* Sprint 1: Poetry Preview — Sprint 2: full poem reader */}
        <PoetryPreview />

        {/* Sprint 1: Newsletter — Sprint 3: Supabase Edge Function */}
        <Newsletter />

        <Footer />
      </main>
    </>
  );
}
