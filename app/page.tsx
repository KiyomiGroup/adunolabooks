import TopNav from "@/components/TopNav";
import Hero from "@/components/Hero";
import FeaturedStories from "@/components/FeaturedStories";
import LatestChapters from "@/components/LatestChapters";
import PoetryPreview from "@/components/PoetryPreview";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import MobileHomePage from "@/components/MobileHomePage";
import { getAllStories } from "@/lib/stories";

function WaveDown({ fill = "#FDFBFF" }: { fill?: string }) {
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

export default function Home() {
  const stories = getAllStories();
  // Featured story = first in the list (highest priority / most recent)
  const featured = stories[0];

  return (
    <>
      <TopNav />

      <main>
        {/* ── Mobile homepage: full-screen book hero (hidden on desktop) ── */}
        {featured && <MobileHomePage story={featured} />}

        {/* ── Desktop homepage (hidden on mobile/tablet) ── */}
        <div className="u-desktop-only">
          <Hero />
          <WaveDown fill="#FFFFFF" />

          <div style={{ background: "#FFFFFF", marginTop: "-2px" }}>
            <FeaturedStories />
          </div>

          <div style={{ background: "#FFFFFF" }}>
            <WaveUp fill="#F5F0FF" />
          </div>

          <div style={{ background: "#F5F0FF", marginTop: "-2px" }}>
            <LatestChapters />
          </div>

          <div style={{ background: "#F5F0FF" }}>
            <WaveDown fill="#FFFFFF" />
          </div>

          <div style={{ background: "#FFFFFF", marginTop: "-2px" }}>
            <PoetryPreview />
          </div>

          <div style={{ background: "#FFFFFF" }}>
            <WaveUp fill="#7B3FF2" />
          </div>

          <div style={{ marginTop: "-2px" }}>
            <Newsletter />
          </div>

          <Footer />
        </div>
      </main>
    </>
  );
}
