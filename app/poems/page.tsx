import type { Metadata } from "next";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { getAllPoems } from "@/lib/supabase/queries";
import type { PoemRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Poems — AdunolaBooks",
  description: "Poetry by Adunola — serialized verse, published one poem at a time.",
};

function PoemFull({ poem }: { poem: PoemRow }) {
  const lines = poem.content.split("\n");
  const publishedLabel = poem.published_at
    ? new Date(poem.published_at).toLocaleDateString("en-GB", {
        day: "numeric", month: "long", year: "numeric",
      })
    : "";

  return (
    <article style={{
      background: "var(--white)",
      border: "1.5px solid var(--lavender-border)",
      borderRadius: "12px",
      padding: "2.5rem 2rem",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative quote mark */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "-1rem", right: "1.25rem",
        fontFamily: "'Cormorant Garamond', serif", fontSize: "9rem",
        color: "var(--purple)", opacity: 0.05, lineHeight: 1,
        pointerEvents: "none", userSelect: "none",
      }}>"</div>

      <h2 className="font-display" style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "1.45rem", fontStyle: "italic",
        color: "var(--purple-dark)", marginBottom: "1.5rem", fontWeight: 400,
      }}>
        {poem.title}
      </h2>

      <div style={{
        borderLeft: "2px solid var(--purple-light)",
        paddingLeft: "1.5rem", marginBottom: "1.75rem",
      }}>
        {lines.map((line, i) => (
          line.trim() === "" ? (
            <div key={i} style={{ height: "1em" }} />
          ) : (
            <span key={i} className="font-display" style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.05rem", fontStyle: "italic",
              color: "var(--ink)", lineHeight: 1.85, display: "block",
            }}>
              {line}
            </span>
          )
        ))}
      </div>

      {/* Footer row */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        {publishedLabel && (
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "var(--muted)", letterSpacing: "0.1em" }}>
            {publishedLabel}
          </span>
        )}
        {poem.tags?.length > 0 && (
          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {poem.tags.map((tag) => (
              <span key={tag} style={{
                fontFamily: "'DM Mono', monospace", fontSize: "0.52rem",
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: "var(--purple)", background: "var(--purple-light)",
                padding: "0.2rem 0.6rem", borderRadius: "2px",
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default async function PoemsPage() {
  const poems = await getAllPoems();

  return (
    <>
      <TopNav />
      <main>
        <section style={{ background: "var(--bg-soft)", borderBottom: "1px solid var(--lavender-border)", padding: "3.5rem 0 2.5rem" }}>
          <div className="container">
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--purple)", marginBottom: "0.75rem" }}>
              From the archive
            </p>
            <h1 className="font-display" style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
              fontWeight: 400, color: "var(--ink)", lineHeight: 1.1,
              marginBottom: "1rem",
            }}>
              Poetry
            </h1>
            <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.8, maxWidth: "42ch" }}>
              Verse published one poem at a time — grief, place, memory, and the quiet spaces between.
            </p>
          </div>
        </section>

        <section style={{ padding: "4rem 0 6rem" }}>
          <div className="container">
            {poems.length === 0 ? (
              <div style={{ padding: "5rem 0", textAlign: "center" }}>
                <p className="font-display" style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.3rem", fontStyle: "italic",
                  color: "var(--muted)", margin: 0,
                }}>
                  The first poems are still being written…
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "680px" }}>
                {poems.map((poem) => (
                  <PoemFull key={poem.id} poem={poem} />
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
