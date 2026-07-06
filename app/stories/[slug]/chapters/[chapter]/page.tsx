import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReaderHeader from "@/components/ReaderHeader";
import ChapterNav from "@/components/ChapterNav";
import MobileBottomBar from "@/components/MobileBottomBar";
import { getChapterData } from "@/lib/stories";

type Params = { slug: string; chapter: string };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug, chapter } = await params;
  const lookup = await getChapterData(slug, Number(chapter));
  if (!lookup) return { title: "Chapter not found — AdunolaBooks" };
  return {
    title: `${lookup.chapter.title} · ${lookup.story.title} — AdunolaBooks`,
    description: lookup.story.excerpt,
  };
}

/*
  ── Paragraph renderer ───────────────────────────────────────────────────────
  Each string in ch.content is one visual paragraph.
  If it contains \n (intentional line-breaks — dialogue, poetry, stage
  directions), we split on \n and insert <br /> between lines so the
  author's rhythm is preserved in the browser.

  The drop-cap CSS rule (p:first-of-type::first-letter) still applies to
  the first rendered <p> because we use real <p> tags, not divs.
*/
function Paragraph({ text, isFirst }: { text: string; isFirst: boolean }) {
  const lines = text.split("\n");

  return (
    <p>
      {lines.map((line, i) => (
        <span key={i}>
          {i > 0 && <br />}
          {line}
        </span>
      ))}
    </p>
  );
}

export default async function ChapterReaderPage({ params }: { params: Promise<Params> }) {
  const { slug, chapter } = await params;
  const chapterNumber = Number(chapter);

  if (!Number.isFinite(chapterNumber)) notFound();

  const lookup = await getChapterData(slug, chapterNumber);
  if (!lookup) notFound();

  const { story, chapter: ch, prevChapter, nextChapter } = lookup;

  const nextAvailable  = nextChapter?.status === "available";
  const mobileCtaLabel = nextAvailable ? "Next Chapter →" : "Back to Story →";
  const mobileCtaHref  = nextAvailable
    ? `/stories/${story.slug}/chapters/${nextChapter!.number}`
    : `/stories/${story.slug}`;
  const mobileCounter  = `${ch.number} / ${story.chapters.length}`;

  return (
    <div className="reader-page">
      <ReaderHeader
        storySlug={story.slug}
        storyTitle={story.title}
        chapterNumber={ch.number}
        chapterCount={story.chapters.length}
      />

      <article className="reader-content-wrap fade-up">
        {/* ── Chapter heading ── */}
        <div className="reader-meta-block">
          <p className="reader-eyebrow">{story.title}</p>
          <h1 className="reader-title font-display">{ch.title}</h1>
          {ch.subtitle && <p className="reader-subtitle">{ch.subtitle}</p>}

          {ch.status === "available" && (
            <div className="reader-meta-row">
              <span>{ch.publishedAt}</span>
              <span className="reader-meta-dot" aria-hidden="true" />
              <span>{ch.readTime} read</span>
            </div>
          )}
        </div>

        {ch.status === "available" && ch.content ? (
          <>
            {/* ── Prologue — shown in italics before the chapter body ── */}
            {ch.prologue && (
              <div className="reader-prologue">
                <p className="reader-prologue-text">{ch.prologue}</p>
                <div className="reader-prologue-rule" aria-hidden="true" />
              </div>
            )}

            {/*
              ── Main chapter body ───────────────────────────────────────
              Each element of ch.content is one paragraph.
              \n within an element → <br /> (preserves dialogue/poetry rhythm).
              The first <p> receives the drop-cap via CSS :first-of-type.
            */}
            <div className="reader-body">
              {ch.content.map((paragraph, i) => (
                <Paragraph key={i} text={paragraph} isFirst={i === 0} />
              ))}
            </div>

            {/* ── End ornament ── */}
            <div className="reader-ornament" aria-hidden="true">
              <span>❧</span>
            </div>
          </>
        ) : (
          <div className="reader-drafting">
            <p>These pages are still being inked. Check back soon.</p>
          </div>
        )}
      </article>

      <ChapterNav storySlug={story.slug} prevChapter={prevChapter} nextChapter={nextChapter} />
      <div className="u-desktop-only" style={{ height: "4rem" }} aria-hidden="true" />
      <MobileBottomBar
        ctaLabel={mobileCtaLabel}
        ctaHref={mobileCtaHref}
        counterLabel={mobileCounter}
        homeHref="/"
      />
    </div>
  );
}
