import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { getMyLibrary } from "@/lib/stories";
import {
  LibraryProgressCard,
  LibraryBookmarkCard,
  LibraryChapterBookmarkRow,
} from "@/components/engagement/LibraryCards";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My Library — AdunolaBooks", robots: { index: false, follow: false } };

function SectionHeading({ tag, title }: { tag: string; title: string }) {
  return (
    <div style={{ marginBottom: "1.35rem" }}>
      <p className="section-tag">{tag}</p>
      <h2 className="section-h2 font-display" style={{ margin: "0.25rem 0 0" }}>{title}</h2>
    </div>
  );
}

function EmptySection({ message, cta, ctaHref }: { message: string; cta?: string; ctaHref?: string }) {
  return (
    <div className="library-empty">
      <p>{message}</p>
      {cta && ctaHref && (
        <Link href={ctaHref} className="library-empty-cta">{cta} →</Link>
      )}
    </div>
  );
}

/* Route protection is also enforced in proxy.ts; this check is a fallback
   so the page never renders content for a signed-out visitor even if
   reached in an unusual way. */
export default async function LibraryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/library");

  const library = await getMyLibrary(user.id);
  const isEntirelyEmpty =
    library.currentlyReading.length === 0 &&
    library.bookmarkedStories.length === 0 &&
    library.bookmarkedChapters.length === 0 &&
    library.completed.length === 0;

  return (
    <>
      <TopNav />
      <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
        {isEntirelyEmpty ? (
          <section style={{ padding: "7rem 0 6rem", textAlign: "center" }}>
            <div className="container fade-up" style={{ maxWidth: "440px", margin: "0 auto" }}>
              <p className="section-tag" style={{ marginBottom: "1rem" }}>My Library</p>

              <div style={{
                width: "64px", height: "64px", borderRadius: "50%",
                background: "var(--purple-light)", border: "1.5px solid var(--lavender-border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1.75rem",
              }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", fontStyle: "italic", color: "var(--purple-dark)" }}>
                  ◻
                </span>
              </div>

              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)",
                fontWeight: 400,
                color: "var(--ink)",
                lineHeight: 1.2,
                margin: "0 0 0.85rem",
              }}>
                Your personal library is waiting for your first story.
              </h1>

              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.95rem",
                color: "var(--muted)",
                lineHeight: 1.75,
                margin: "0 0 2rem",
              }}>
                Start reading or bookmark a story and it will appear here.
              </p>

              <Link href="/stories" className="btn-primary">Browse Stories →</Link>
            </div>
          </section>
        ) : (
          <div className="container" style={{ padding: "3rem 0 5rem" }}>
            <div className="fade-up" style={{ marginBottom: "2.5rem" }}>
              <p className="section-tag" style={{ marginBottom: "0.35rem" }}>My Library</p>
              <h1 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.9rem, 4vw, 2.6rem)",
                fontWeight: 400,
                color: "var(--ink)",
                margin: 0,
              }}>
                Your personal bookshelf.
              </h1>
            </div>

            {/* ── Currently Reading ── */}
            <section style={{ marginBottom: "3.25rem" }}>
              <SectionHeading tag="In Progress" title="Currently Reading" />
              {library.currentlyReading.length > 0 ? (
                <div className="library-grid">
                  {library.currentlyReading.map((entry) => (
                    <LibraryProgressCard key={entry.bookId} entry={entry} />
                  ))}
                </div>
              ) : (
                <EmptySection
                  message="You haven't started a story yet."
                  cta="Browse Stories"
                  ctaHref="/stories"
                />
              )}
            </section>

            {/* ── Bookmarked Stories ── */}
            <section style={{ marginBottom: "3.25rem" }}>
              <SectionHeading tag="Saved" title="Bookmarked Stories" />
              {library.bookmarkedStories.length > 0 ? (
                <div className="library-grid">
                  {library.bookmarkedStories.map((entry) => (
                    <LibraryBookmarkCard key={entry.bookId} entry={entry} />
                  ))}
                </div>
              ) : (
                <EmptySection message="Bookmark a story and it will appear here." />
              )}

              {library.bookmarkedChapters.length > 0 && (
                <div style={{ marginTop: "1.25rem" }}>
                  <p className="library-subtag">Bookmarked chapters</p>
                  <div className="library-chapter-list">
                    {library.bookmarkedChapters.map((entry) => (
                      <LibraryChapterBookmarkRow key={`${entry.bookId}-${entry.chapterNumber}`} entry={entry} />
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* ── Completed Stories (placeholder-ready: real once a book is finished) ── */}
            <section style={{ marginBottom: "3.25rem" }}>
              <SectionHeading tag="Finished" title="Completed Stories" />
              {library.completed.length > 0 ? (
                <div className="library-grid">
                  {library.completed.map((entry) => (
                    <LibraryProgressCard key={entry.bookId} entry={entry} />
                  ))}
                </div>
              ) : (
                <EmptySection message="Stories you finish will be collected here." />
              )}
            </section>

            {/* ── Recently Read ── */}
            {library.recentlyRead.length > 0 && (
              <section>
                <SectionHeading tag="History" title="Recently Read" />
                <div className="library-grid">
                  {library.recentlyRead.map((entry) => (
                    <LibraryProgressCard key={`recent-${entry.bookId}`} entry={entry} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        <Footer />
      </main>
    </>
  );
}
