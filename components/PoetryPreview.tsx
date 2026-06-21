"use client";

/* ── Mock poems — Sprint 3: replace with Supabase poetry feed ───────────── */
const MOCK_POEMS = [
  {
    id: 1,
    title: "Inventory",
    lines: [
      "Eleven plates. A daughter's coat.",
      "The specific quiet of a house",
      "that still holds the shape of someone.",
    ],
    publishedAt: "June 2025",
  },
  {
    id: 2,
    title: "What the Rain Means in Lagos",
    lines: [
      "Not sorrow. Not renewal.",
      "More like a sentence",
      "the sky keeps starting over.",
    ],
    publishedAt: "May 2025",
  },
];

export default function PoetryPreview() {
  return (
    <section style={{ padding: "5rem 0" }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem" }}>
          <div>
            <p className="section-tag">From the archive</p>
            <h2 className="section-h2 font-display">Poetry</h2>
          </div>
          {/* Sprint 2: link to poetry index */}
          <a href="/poems" style={{ fontSize: "0.72rem", fontWeight: 500, color: "var(--purple)", textDecoration: "none", letterSpacing: "0.08em", borderBottom: "1px solid var(--purple-light)", paddingBottom: "2px" }}>
            Read All →
          </a>
        </div>

        {/* Two poem cards side-by-side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          {MOCK_POEMS.map((poem) => (
            <article
              key={poem.id}
              style={{
                background: "var(--white)",
                border: "1.5px solid var(--border)",
                borderRadius: "12px",
                padding: "2rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Decorative large quote mark */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "-1rem",
                  right: "1rem",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "8rem",
                  color: "var(--purple)",
                  opacity: 0.06,
                  lineHeight: 1,
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                "
              </div>

              {/* Title */}
              <h3
                className="font-display"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.3rem",
                  fontStyle: "italic",
                  color: "var(--purple-dark)",
                  marginBottom: "1.25rem",
                  fontWeight: 400,
                }}
              >
                {poem.title}
              </h3>

              {/* Lines */}
              <div style={{ borderLeft: "2px solid var(--purple-light)", paddingLeft: "1.25rem", marginBottom: "1.5rem" }}>
                {poem.lines.map((line, i) => (
                  <span
                    key={i}
                    className="font-display"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1rem",
                      fontStyle: "italic",
                      color: "var(--ink)",
                      lineHeight: 1.85,
                      display: "block",
                    }}
                  >
                    {line}
                  </span>
                ))}
                <span
                  className="font-display"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1rem",
                    fontStyle: "italic",
                    color: "var(--muted)",
                    opacity: 0.5,
                    display: "block",
                  }}
                >
                  …
                </span>
              </div>

              {/* Footer */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "var(--muted)" }}>
                  {poem.publishedAt}
                </span>
                {/* Sprint 2: link to full poem reader */}
                <a
                  href="/poems"
                  style={{ fontSize: "0.72rem", fontWeight: 500, color: "var(--purple)", textDecoration: "none" }}
                >
                  Read →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
