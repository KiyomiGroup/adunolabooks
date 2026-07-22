import TopNav from "@/components/TopNav";
import Hero from "@/components/Hero";
import FeaturedStories from "@/components/FeaturedStories";
import LatestChapters from "@/components/LatestChapters";
import PoetryPreview from "@/components/PoetryPreview";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import MobileHomePage from "@/components/MobileHomePage";
import HomePersonalization from "@/components/engagement/HomePersonalization";
import { WaveDown, WaveUp } from "@/components/WaveDivider";
import { getAllStories } from "@/lib/stories";

/* Sprint 3: dynamic — homepage reflects latest published content */
export const dynamic = "force-dynamic";

export default async function Home() {
  const stories = await getAllStories();
  const [featured, ...rest] = stories;

  return (
    <>
      <TopNav />
      <main>
        {/* Sprint 4C: renders nothing for signed-out visitors */}
        <HomePersonalization />

        {/* ── Mobile / tablet: featured book card + library list ── */}
        {featured && <MobileHomePage featured={featured} rest={rest} />}

        {/* ── Desktop: full editorial homepage (hidden ≤ 1024px) ── */}
        <div className="u-desktop-only">
          <Hero />
          <WaveDown fill="#FFFFFF" />
          <section style={{ background: "#FFFFFF", marginTop: "-2px" }}>
            <FeaturedStories />
          </section>
          <WaveUp fill="#F5F0FF" />
          <section style={{ background: "#F5F0FF", marginTop: "-2px" }}>
            <LatestChapters />
          </section>
          <WaveDown fill="#FFFFFF" />
          <section style={{ background: "#FFFFFF", marginTop: "-2px" }}>
            <PoetryPreview />
          </section>
          <WaveUp fill="#7B3FF2" />
          <section style={{ marginTop: "-2px" }}>
            <Newsletter />
          </section>
          <Footer />
        </div>
      </main>
    </>
  );
}
