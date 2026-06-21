"use client";

/* ── Mock data — Sprint 3: replace with Supabase featured book ──────────── */
const FEATURED_BOOK = {
  title: "Dust and Delay",
  author: "Adunola",
  year: "2025",
  chapterCount: 12,
  currentChapter: "What the Window Knew",
  readTime: "18 min",
};

const STATS = [
  { value: "400+", label: "Stories Published", accent: "var(--purple)" },
  { value: "12k",  label: "Readers This Month", accent: "var(--teal)" },
];

export default function Hero() {
  return (
    <section
      style={{ background: "var(--bg-soft)", borderBottom: "1px solid var(--border)" }}
      aria-label="Hero"
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.3fr 1fr",
            gridTemplateRows: "1fr auto",
            gap: "2.5rem",
            alignItems: "center",
            minHeight: "88vh",
            paddingTop: "4rem",
            paddingBottom: "3rem",
          }}
        >
          {/* ── LEFT: headline + CTAs ──────────────────────────────── */}
          <div className="fade-up">
            <span
              style={{
                display: "inline-block",
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.58rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "var(--purple)",
                background: "var(--purple-light)",
                padding: "0.35rem 0.85rem",
                borderRadius: "2px",
                marginBottom: "1.5rem",
              }}
            >
              Literary Platform
            </span>

            <h1
              className="font-display"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.4rem, 4.5vw, 4rem)",
                fontWeight: 400,
                lineHeight: 1.1,
                color: "var(--ink)",
                marginBottom: "1.25rem",
                letterSpacing: "-0.01em",
              }}
            >
              Stories that live
              <em
                style={{
                  fontStyle: "italic",
                  color: "var(--purple)",
                  display: "block",
                }}
              >
                on the page.
              </em>
            </h1>

            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--muted)",
                lineHeight: 1.75,
                marginBottom: "2.25rem",
                maxWidth: "26ch",
              }}
            >
              Serialized fiction, poetry, and immersive storytelling —
              published one chapter at a time.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {/* Sprint 2: link to stories index */}
              <button className="btn-primary">View More →</button>
              {/* Sprint 2: link to last-read chapter (reading state in localStorage) */}
              <button className="btn-ghost">Continue Reading ↗</button>
            </div>
          </div>

          {/* ── CENTER: book visual ────────────────────────────────── */}
          <div
            className="fade-up delay-1"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}
          >
            {/* Floating chip — top right */}
            <div
              style={{
                position: "absolute",
                top: "10%",
                right: "-5%",
                background: "var(--white)",
                border: "1.5px solid rgba(56,201,180,0.3)",
                borderRadius: "8px",
                padding: "0.45rem 0.75rem",
                fontSize: "0.7rem",
                fontWeight: 500,
                color: "var(--teal)",
                boxShadow: "0 4px 12px rgba(56,201,180,0.1)",
                whiteSpace: "nowrap",
                zIndex: 2,
              }}
            >
              ✦ New chapter
            </div>

            {/* Floating chip — bottom left */}
            <div
              style={{
                position: "absolute",
                bottom: "12%",
                left: "-8%",
                background: "var(--white)",
                border: "1.5px solid rgba(255,111,97,0.25)",
                borderRadius: "8px",
                padding: "0.45rem 0.75rem",
                fontSize: "0.7rem",
                fontWeight: 500,
                color: "var(--coral)",
                boxShadow: "0 4px 12px rgba(255,111,97,0.08)",
                whiteSpace: "nowrap",
                zIndex: 2,
              }}
            >
              {FEATURED_BOOK.readTime} read
            </div>

            {/* Book cover */}
            <div
              style={{
                width: "100%",
                maxWidth: "260px",
                aspectRatio: "3/4",
                background: "linear-gradient(145deg, var(--purple-light) 0%, var(--bg-xlight) 100%)",
                borderRadius: "4px 12px 12px 4px",
                position: "relative",
                boxShadow:
                  "-6px 0 0 var(--purple-dark), 0 20px 60px rgba(123,63,242,0.18), 0 4px 16px rgba(123,63,242,0.08)",
                overflow: "hidden",
                cursor: "pointer",
                transition: "transform 0.35s ease, box-shadow 0.35s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-6px) rotate(1deg)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "-6px 0 0 var(--purple-dark), 0 32px 80px rgba(123,63,242,0.28)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "none";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "-6px 0 0 var(--purple-dark), 0 20px 60px rgba(123,63,242,0.18), 0 4px 16px rgba(123,63,242,0.08)";
              }}
            >
              {/* Spine strip */}
              <div
                style={{
                  position: "absolute",
                  left: 0, top: 0, bottom: 0,
                  width: "6px",
                  background: "var(--purple-dark)",
                }}
                aria-hidden="true"
              />

              {/* Book interior */}
              <div
                style={{
                  padding: "2rem 1.5rem 2rem 2rem",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <p
                    className="font-display"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.3rem",
                      fontWeight: 500,
                      fontStyle: "italic",
                      color: "var(--purple-dark)",
                      lineHeight: 1.3,
                    }}
                  >
                    {FEATURED_BOOK.title}
                  </p>
                  <p
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.58rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                      marginTop: "0.4rem",
                    }}
                  >
                    {FEATURED_BOOK.author} · {FEATURED_BOOK.year}
                  </p>
                </div>

                {/* Page lines */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1, margin: "1.5rem 0" }}
                  aria-hidden="true"
                >
                  {[100, 100, 70, 100, 85, 100, 60, 100, 90].map((w, i) => (
                    <div
                      key={i}
                      style={{
                        height: "2px",
                        width: `${w}%`,
                        background: "rgba(123,63,242,0.1)",
                        borderRadius: "1px",
                      }}
                    />
                  ))}
                </div>

                <span
                  style={{
                    display: "inline-block",
                    background: "var(--purple)",
                    color: "white",
                    fontSize: "0.58rem",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    padding: "0.3rem 0.65rem",
                    borderRadius: "2px",
                  }}
                >
                  Ch. {FEATURED_BOOK.chapterCount}
                </span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: stats + call card + socials ────────────────── */}
          <div
            className="fade-up delay-2"
            style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-end" }}
          >
            {STATS.map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: "var(--white)",
                  border: "1.5px solid var(--border)",
                  borderRadius: "10px",
                  padding: "1.5rem",
                  width: "100%",
                  maxWidth: "200px",
                  transition: "box-shadow 0.2s, transform 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(123,63,242,0.1)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLElement).style.transform = "none";
                }}
              >
                <div
                  className="font-display"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "2.4rem",
                    fontWeight: 500,
                    color: stat.accent,
                    lineHeight: 1,
                    marginBottom: "0.35rem",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.58rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}

            {/* Book a call card — Sprint 3: connect to calendar/booking */}
            <div
              style={{
                background: "var(--purple)",
                borderRadius: "10px",
                padding: "1.5rem",
                width: "100%",
                maxWidth: "200px",
                cursor: "pointer",
                transition: "background 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--purple-dark)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--purple)";
                (e.currentTarget as HTMLElement).style.transform = "none";
              }}
            >
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.55rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: "0.5rem",
                }}
              >
                Ready to connect?
              </p>
              <p
                className="font-display"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.25rem",
                  fontStyle: "italic",
                  color: "white",
                  lineHeight: 1.25,
                }}
              >
                Book a Call
              </p>
              <p style={{ color: "rgba(255,255,255,0.5)", marginTop: "0.5rem", fontSize: "1.1rem" }}>→</p>
            </div>

            {/* Social links — Sprint 4: link to actual profiles */}
            <div style={{ display: "flex", gap: "0.6rem" }}>
              {["✕", "in", "ig"].map((icon) => (
                <button
                  key={icon}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    border: "1.5px solid var(--border)",
                    background: "var(--white)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    color: "var(--purple)",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--purple)";
                    (e.currentTarget as HTMLElement).style.color = "white";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--purple)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--white)";
                    (e.currentTarget as HTMLElement).style.color = "var(--purple)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                  }}
                  aria-label={icon}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* ── BOTTOM FOLD: "see more" row spanning all 3 columns ─── */}
          <div
            className="fade-up delay-3"
            style={{
              gridColumn: "1 / -1",
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              alignItems: "center",
              gap: "2rem",
              borderTop: "1px solid var(--border)",
              paddingTop: "1.75rem",
            }}
          >
            <p style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
              Scroll to explore the library
            </p>

            {/* Centre: see more */}
            <div
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}
              onClick={() => document.getElementById("stories-section")?.scrollIntoView({ behavior: "smooth" })}
            >
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.58rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                }}
              >
                See More
              </span>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "1.5px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--purple)",
                  fontSize: "1rem",
                  background: "var(--white)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "var(--purple)";
                  el.style.color = "white";
                  el.style.borderColor = "var(--purple)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "var(--white)";
                  el.style.color = "var(--purple)";
                  el.style.borderColor = "var(--border)";
                }}
              >
                ↓
              </div>
            </div>

            <p style={{ fontSize: "0.72rem", color: "var(--muted)", textAlign: "right" }}>
              2025 · New chapters weekly
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
