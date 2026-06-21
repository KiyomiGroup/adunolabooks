import TopNav from "@/components/TopNav";
import Hero from "@/components/Hero";
import FeaturedStories from "@/components/FeaturedStories";
import LatestChapters from "@/components/LatestChapters";
import PoetryPreview from "@/components/PoetryPreview";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

/*
  Paper wave dividers — the key to the curved paper layering effect.

  Each divider is an SVG path that creates a gentle concave/convex curve
  between two sections, mimicking the curved edge of a page being turned
  or a sheet of paper lifting off the one below it.

  The `fill` matches the NEXT section's background colour.
  Both sections use `position: relative` with the divider pulling up
  via negative margin, so the wave appears to "emerge" from beneath.
*/

function WaveDown({ fill = "#FDFBFF" }: { fill?: string }) {
  // Concave wave — the paper scoops downward, next sheet rises beneath
  return (
    <div className="wave-divider" aria-hidden="true">
      <svg viewBox="0 0 1440 64" preserveAspectRatio="none" style={{ height: "64px" }}>
        <path
          d="M0,0 C240,64 480,64 720,32 C960,0 1200,0 1440,40 L1440,64 L0,64 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

function WaveUp({ fill = "#FDFBFF" }: { fill?: string }) {
  // Convex wave — the current sheet curls upward at its bottom
  return (
    <div className="wave-divider" aria-hidden="true">
      <svg viewBox="0 0 1440 64" preserveAspectRatio="none" style={{ height: "64px" }}>
        <path
          d="M0,40 C240,0 480,0 720,32 C960,64 1200,64 1440,24 L1440,64 L0,64 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

/* ── Homepage ───────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      {/*
        Desktop: horizontal bookmark-ribbon nav (top)
        Mobile:  pointed index-tab side nav (right edge)
        Sprint 2: expand mobile tabs into full slide-out panel
      */}
      <TopNav />

      <main>
        {/* ── Hero ──────────────────────────────────────────────── */}
        {/* bg: var(--bg-soft) = #F3EEFF */}
        <Hero />

        {/*
          Paper wave: #F3EEFF → white
          The hero's soft purple fades through a curved edge
          into the brighter white of the stories section below.
        */}
        <WaveDown fill="#FFFFFF" />

        {/* ── Featured Stories ───────────────────────────────────── */}
        {/* Sprint 3: Supabase published_stories view */}
        <div style={{ background: "#FFFFFF", marginTop: "-2px" }}>
          <FeaturedStories />
        </div>

        {/*
          Paper wave: white → var(--bg-xlight) = #F5F0FF
          The stories sheet curls at its edge, revealing the
          lighter lavender chapter-list sheet beneath.
        */}
        <div style={{ background: "#FFFFFF" }}>
          <WaveUp fill="#F5F0FF" />
        </div>

        {/* ── Latest Chapters ────────────────────────────────────── */}
        {/* Sprint 2/3: real chapter feed */}
        <div style={{ background: "#F5F0FF", marginTop: "-2px" }}>
          <LatestChapters />
        </div>

        {/*
          Paper wave: #F5F0FF → white
          The chapter list sheet recedes, next poetry page emerges.
        */}
        <div style={{ background: "#F5F0FF" }}>
          <WaveDown fill="#FFFFFF" />
        </div>

        {/* ── Poetry Preview ─────────────────────────────────────── */}
        {/* Sprint 2: full poem reader experience */}
        <div style={{ background: "#FFFFFF", marginTop: "-2px" }}>
          <PoetryPreview />
        </div>

        {/*
          Wave into Newsletter: white → purple (var(--purple) = #7B3FF2)
          More pronounced visual shift — the page turns dramatically
          to the ink-soaked newsletter section.
        */}
        <div style={{ background: "#FFFFFF" }}>
          <WaveUp fill="#7B3FF2" />
        </div>

        {/* ── Newsletter ─────────────────────────────────────────── */}
        {/* Sprint 3: Supabase Edge Function / email provider */}
        <div style={{ marginTop: "-2px" }}>
          <Newsletter />
        </div>

        {/* ── Footer ────────────────────────────────────────────── */}
        <Footer />
      </main>
    </>
  );
}
