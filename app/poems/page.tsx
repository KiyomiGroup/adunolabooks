import type { Metadata } from "next";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { WaveDown } from "@/components/WaveDivider";
import { getAllPoems } from "@/lib/supabase/queries";
import type { PoemRow } from "@/lib/supabase/types";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Poems — AdunolaBooks",
  description: "Poetry by Adunola — serialized verse, published one poem at a time.",
  path: "/poems",
});

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

/* Returns up to `count` non-empty lines for a card preview */
function previewLines(content: string, count: number): string[] {
  return content
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, count);
}

/* ── Featured poem card (full-width, first/latest poem) ──────────────────── */
function PoemCardFeatured({ poem }: { poem: PoemRow }) {
  const lines = previewLines(poem.content, 5);
  const date  = formatDate(poem.published_at);

  return (
    <Link href={`/poems/${poem.id}`} className="poem-card-featured">
      {/* Left side: title + label */}
      <div>
        <span className="poem-featured-chip">Latest Poem</span>
        <h2 className="poem-card-title">{poem.title}</h2>

        <div className="poem-card-footer">
          {date && <span className="poem-card-date">{date}</span>}
          {poem.tags?.slice(0, 3).map((tag) => (
            <span key={tag} className="poem-card-tag">{tag}</span>
          ))}
          <span className="poem-card-read-link">Read poem →</span>
        </div>
      </div>

      {/* Right side: lines preview */}
      <div className="poem-card-lines" style={{ marginBottom: 0 }}>
        {lines.map((line, i) => (
          <span key={i} className="poem-card-line">{line}</span>
        ))}
        <span className="poem-card-ellipsis">…</span>
      </div>
    </Link>
  );
}

/* ── Regular poem card ────────────────────────────────────────────────────── */
function PoemCard({ poem }: { poem: PoemRow }) {
  const lines = previewLines(poem.content, 3);
  const date  = formatDate(poem.published_at);

  return (
    <Link href={`/poems/${poem.id}`} className="poem-card">
      <div aria-hidden="true" className="poem-card-quote-mark">"</div>

      <h2 className="poem-card-title">{poem.title}</h2>

      <div className="poem-card-lines">
        {lines.map((line, i) => (
          <span key={i} className="poem-card-line">{line}</span>
        ))}
        <span className="poem-card-ellipsis">…</span>
      </div>

      <div className="poem-card-footer">
        {date && <span className="poem-card-date">{date}</span>}
        {poem.tags?.slice(0, 2).map((tag) => (
          <span key={tag} className="poem-card-tag">{tag}</span>
        ))}
        <span className="poem-card-read-link">Read →</span>
      </div>
    </Link>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default async function PoemsPage() {
  const poems = await getAllPoems();

  /* First poem is featured; the rest fill the grid */
  const [featured, ...rest] = poems;

  return (
    <>
      <TopNav />
      <main>
        {/* Header */}
        <section style={{
          background: "var(--bg-soft)",
          borderBottom: "1px solid var(--lavender-border)",
          padding: "3.5rem 0 2.5rem",
        }}>
          <div className="container fade-up">
            <p className="section-tag">From the archive</p>
            <h1
              className="font-display"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                fontWeight: 400,
                color: "var(--ink)",
                lineHeight: 1.1,
                marginBottom: "1rem",
              }}
            >
              Poetry
            </h1>
            <p className="lede-text">
              Verse published one poem at a time —{" "}
              grief, place, memory, and the quiet spaces between.
            </p>
          </div>
        </section>

        <WaveDown fill="#FFFFFF" />

        <section style={{ padding: "1rem 0 6rem", background: "#FFFFFF", marginTop: "-2px" }}>
          <div className="container">
            {poems.length === 0 ? (
              <div style={{ padding: "5rem 0", textAlign: "center" }}>
                <p
                  className="font-display"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.3rem",
                    fontStyle: "italic",
                    color: "var(--muted)",
                    margin: 0,
                  }}
                >
                  The first poems are still being written…
                </p>
              </div>
            ) : (
              <div className="poems-library-grid">
                {/* Latest poem — featured full-width */}
                {featured && <PoemCardFeatured poem={featured} />}

                {/* Remaining poems — two-column cards */}
                {rest.map((poem) => (
                  <PoemCard key={poem.id} poem={poem} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
