import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import BookCover from "@/components/BookCover";
import ChapterList from "@/components/ChapterList";
import MobileBookHero from "@/components/MobileBookHero";
import { getAllStories, getStoryBySlug, getFirstAvailableChapter } from "@/lib/stories";

type Params = { slug: string };

/* Sprint 3: dynamic — data lives in Supabase now */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story) return { title: "Story not found — AdunolaBooks" };
  return {
    title: `${story.title} — AdunolaBooks`,
    description: story.excerpt,
  };
}

export default async function BookDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) notFound();

  const firstChapter = getFirstAvailableChapter(story);
  const continuing = story.readingProgress > 0 && story.readingProgress < 100;

  return (
    <>
      <TopNav />

      <main>
        {/* ── Mobile: decoupled book hero ── */}
        <MobileBookHero story={story} />

        {/* ── Desktop: cinematic hero + manuscript index (hidden on mobile/tablet) ── */}
        <div className="u-desktop-only">
          <section style={{ background: "var(--bg-soft)" }}>
            <div className="container">
              <div style={{ paddingTop: "2rem" }}>
                <Link href="/stories" style={{ fontSize: "0.72rem", color: "var(--muted)", textDecoration: "none", letterSpacing: "0.04em" }}>
                  ← All Stories
                </Link>
              </div>

              <div className="book-hero fade-up">
                <div className="book-hero-cover-wrap">
                  <BookCover title={story.title} accent={story.accent} size="lg" />
                </div>

                <div>
                  <div className="genre-tag-row">
                    <span className="genre-tag">{story.genre}</span>
                    <span className="genre-tag">{story.status}</span>
                  </div>

                  <h1 className="book-hero-title font-display">{story.title}</h1>
                  <p className="book-hero-author">by {story.author}</p>

                  <p className="book-hero-synopsis">{story.synopsis}</p>

                  <div className="book-hero-stats-row">
                    <div>
                      <div className="book-hero-stat-value font-display">{story.chapters.length}</div>
                      <div className="book-hero-stat-label">Chapters</div>
                    </div>
                    <div>
                      <div className="book-hero-stat-value font-display">{story.stats.readers}</div>
                      <div className="book-hero-stat-label">Readers</div>
                    </div>
                    <div>
                      <div className="book-hero-stat-value font-display">{story.stats.avgReadTime}</div>
                      <div className="book-hero-stat-label">Avg. Chapter</div>
                    </div>
                    <div>
                      <div className="book-hero-stat-value font-display">{story.lastUpdated}</div>
                      <div className="book-hero-stat-label">Updated</div>
                    </div>
                  </div>

                  {firstChapter && (
                    <div className="book-hero-cta-row">
                      <Link href={`/stories/${story.slug}/chapters/${firstChapter.number}`} className="btn-primary">
                        {continuing ? "Continue Reading →" : "Start Reading →"}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section style={{ background: "#FFFFFF", padding: "4rem 0 6rem" }}>
            <div className="container">
              <p className="section-tag">Manuscript Index</p>
              <h2 className="section-h2 font-display" style={{ marginBottom: "1.5rem" }}>Chapters</h2>
              <ChapterList story={story} />
            </div>
          </section>

          <Footer />
        </div>
      </main>
    </>
  );
}
