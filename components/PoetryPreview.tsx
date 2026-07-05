/*
  ── PoetryPreview — Sprint 3 ─────────────────────────────────────────────────
  Server Component. Fetches 2 published poems from Supabase.
  Content stored as newline-separated plain text; split on \n for preview lines.
  UI identical to Sprint 2.
*/
import { getPreviewPoems } from "@/lib/supabase/queries";
import type { PoemRow } from "@/lib/supabase/types";

function PoemCard({ poem }: { poem: PoemRow }) {
  /* Show first 3 lines as a preview */
  const lines = poem.content.split("\n").filter(Boolean).slice(0, 3);
  const publishedLabel = poem.published_at
    ? new Date(poem.published_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
    : "";

  return (
    <article style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: "12px", padding: "2rem", position: "relative", overflow: "hidden" }}>
      <div aria-hidden="true" style={{ position: "absolute", top: "-1rem", right: "1rem", fontFamily: "'Cormorant Garamond', serif", fontSize: "8rem", color: "var(--purple)", opacity: 0.06, lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>
        "
      </div>

      <h3 className="font-display" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontStyle: "italic", color: "var(--purple-dark)", marginBottom: "1.25rem", fontWeight: 400 }}>
        {poem.title}
      </h3>

      <div style={{ borderLeft: "2px solid var(--purple-light)", paddingLeft: "1.25rem", marginBottom: "1.5rem" }}>
        {lines.map((line, i) => (
          <span key={i} className="font-display" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontStyle: "italic", color: "var(--ink)", lineHeight: 1.85, display: "block" }}>
            {line}
          </span>
        ))}
        <span className="font-display" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontStyle: "italic", color: "var(--muted)", opacity: 0.5, display: "block" }}>
          …
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "var(--muted)" }}>
          {publishedLabel}
        </span>
        <a href="/poems" style={{ fontSize: "0.72rem", fontWeight: 500, color: "var(--purple)", textDecoration: "none" }}>
          Read →
        </a>
      </div>
    </article>
  );
}

export default async function PoetryPreview() {
  const poems = await getPreviewPoems(2);

  return (
    <section style={{ padding: "5rem 0" }}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem" }}>
          <div>
            <p className="section-tag">From the archive</p>
            <h2 className="section-h2 font-display">Poetry</h2>
          </div>
          <a href="/poems" style={{ fontSize: "0.72rem", fontWeight: 500, color: "var(--purple)", textDecoration: "none", letterSpacing: "0.08em", borderBottom: "1px solid var(--purple-light)", paddingBottom: "2px" }}>
            Read All →
          </a>
        </div>

        <div className="poetry-grid">
          {poems.length === 0 ? (
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontStyle: "italic", color: "var(--muted)" }}>
              The first poems are still being written…
            </p>
          ) : (
            poems.map((poem) => <PoemCard key={poem.id} poem={poem} />)
          )}
        </div>
      </div>
    </section>
  );
}
