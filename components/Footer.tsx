"use client";

const LINKS = ["Stories", "Poems", "About"];

export default function Footer() {
  return (
    <footer className="footer-wrap" style={{ background: "var(--ink)" }}>
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <p
          className="font-display"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1rem",
            color: "var(--purple-mid)",
            letterSpacing: "0.04em",
            margin: 0,
          }}
        >
          AdunolaBooks
        </p>

        <nav style={{ display: "flex", gap: "2rem" }} aria-label="Footer navigation">
          {LINKS.map((l) => (
            <a
              key={l}
              href={`/${l.toLowerCase()}`}
              style={{
                fontSize: "0.72rem",
                color: "rgba(255,255,255,0.35)",
                textDecoration: "none",
                letterSpacing: "0.06em",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
            >
              {l}
            </a>
          ))}
        </nav>

        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.58rem",
          color: "rgba(255,255,255,0.2)",
          margin: 0,
          letterSpacing: "0.1em",
        }}>
          © {new Date().getFullYear()} · Original works
        </p>
      </div>
    </footer>
  );
}
