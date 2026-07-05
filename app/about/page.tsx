import type { Metadata } from "next";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import MobileBottomBar from "@/components/MobileBottomBar";

export const metadata: Metadata = {
  title: "About — AdunolaBooks",
  description: "Adunola is a writer of serialized fiction and poetry rooted in West African memory, grief, and belonging.",
};

export default function AboutPage() {
  return (
    <>
      <TopNav />
      <main>

        {/* ─── Desktop About ──────────────────────────────────────── */}
        <div className="u-desktop-only">
          {/* Hero band */}
          <section style={{ background: "var(--bg-soft)", borderBottom: "1px solid var(--lavender-border)", padding: "6rem 0 5rem" }}>
            <div className="container fade-up">
              <p className="section-tag">The Writer</p>
              <h1 className="font-display" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.8rem, 5vw, 4.2rem)", fontWeight: 400, color: "var(--ink)", lineHeight: 1.08, marginBottom: "1.5rem", letterSpacing: "-0.015em" }}>
                Adunola Osei
              </h1>
              <p style={{ fontSize: "1.05rem", color: "var(--muted)", lineHeight: 1.85, maxWidth: "52ch" }}>
                Writer of serialized fiction and poetry. Based between Lagos and the page.
                Work that lives at the intersection of grief, home, and the rivers that carry what we cannot hold.
              </p>
            </div>
          </section>

          {/* Bio sections */}
          <section style={{ background: "#fff", padding: "5rem 0" }}>
            <div className="container">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "5rem", alignItems: "start" }}>
                {/* Sidebar */}
                <div>
                  {/* Monogram */}
                  <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--purple-light)", border: "2px solid var(--purple-mid)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "2rem" }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", fontStyle: "italic", color: "var(--purple-dark)" }}>A</span>
                  </div>

                  {/* Stats */}
                  {[
                    { val: "400+", lbl: "Stories Published" },
                    { val: "12k",  lbl: "Readers / Month"   },
                    { val: "3+",   lbl: "Years Writing"      },
                  ].map(({ val, lbl }) => (
                    <div key={lbl} style={{ paddingBottom: "1.5rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--lavender-border)" }}>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", color: "var(--purple-dark)", lineHeight: 1, marginBottom: "0.3rem" }}>{val}</div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)" }}>{lbl}</div>
                    </div>
                  ))}
                </div>

                {/* Main bio */}
                <div>
                  {[
                    {
                      heading: "The Writing",
                      body: "Adunola writes literary fiction and poetry rooted in West African memory — stories about the texture of belonging, and the specific quiet of things left unsaid. Her work explores what it means to carry grief across geographies, to love people who are no longer there, and to build a life out of the fragments they leave behind.",
                    },
                    {
                      heading: "The Work",
                      body: "From serialized novels to single-sitting poems, each piece is its own small world. New chapters arrive weekly, published freely — the way the best things always have been. The stories here are not about resolution. They are about the staying.",
                    },
                    {
                      heading: "The Platform",
                      body: "AdunolaBooks began as a simple question: what if a story could arrive the way a letter does? One chapter at a time. No waiting for a publisher. No algorithm deciding what you see first. Just writing, and the people who want to read it.",
                    },
                  ].map(({ heading, body }) => (
                    <div key={heading} style={{ marginBottom: "3rem" }}>
                      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--purple)", marginBottom: "0.75rem" }}>{heading}</p>
                      <p style={{ fontSize: "1rem", color: "var(--ink-soft)", lineHeight: 1.9 }}>{body}</p>
                    </div>
                  ))}

                  {/* Social links */}
                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1rem" }}>
                    {[
                      { label: "Twitter / X",  icon: "✕" },
                      { label: "Instagram",    icon: "ig" },
                      { label: "LinkedIn",     icon: "in" },
                    ].map(({ label, icon }) => (
                      <button
                        key={label}
                        style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--purple-xlight)", border: "1.5px solid var(--purple-light)", borderRadius: "6px", padding: "0.65rem 1.1rem", fontFamily: "'DM Mono', monospace", fontSize: "0.66rem", letterSpacing: "0.1em", color: "var(--purple-dark)", cursor: "pointer", transition: "all 0.25s var(--ease-paper)" }}
                        onMouseEnter={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.background = "var(--purple)"; el.style.color = "white"; el.style.borderColor = "var(--purple)"; }}
                        onMouseLeave={(e) => { const el = e.currentTarget as HTMLButtonElement; el.style.background = "var(--purple-xlight)"; el.style.color = "var(--purple-dark)"; el.style.borderColor = "var(--purple-light)"; }}
                      >
                        <span style={{ fontSize: "0.75rem" }}>{icon}</span>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Footer />
        </div>

        {/* ─── Mobile About ───────────────────────────────────────── */}
        <div className="u-mobile-only m-about-page">

          {/* Dark header band */}
          <div className="m-about-header">
            <div className="m-about-monogram">A</div>
            <h1 className="m-about-name">Adunola Osei</h1>
            <p className="m-about-role">Writer · Lagos</p>
          </div>

          {/* Stats row */}
          <div className="m-about-stats">
            {[
              { val: "400+", lbl: "Stories" },
              { val: "12k",  lbl: "Readers"  },
              { val: "3+",   lbl: "Years"    },
            ].map(({ val, lbl }) => (
              <div key={lbl} className="m-about-stat">
                <span className="m-about-stat-val">{val}</span>
                <span className="m-about-stat-lbl">{lbl}</span>
              </div>
            ))}
          </div>

          {/* Bio sections */}
          {[
            {
              label: "The Writing",
              body: "Adunola writes literary fiction and poetry rooted in West African memory — stories about the texture of belonging, and the specific quiet of things left unsaid.",
            },
            {
              label: "The Work",
              body: "From serialized novels to single-sitting poems, each piece is its own small world. New chapters arrive weekly, published freely — the way the best things always have been.",
            },
            {
              label: "The Platform",
              body: "AdunolaBooks began as a simple question: what if a story could arrive the way a letter does? One chapter at a time. Just writing, and the people who want to read it.",
            },
          ].map(({ label, body }) => (
            <div key={label} className="m-about-section">
              <p className="m-about-section-label">{label}</p>
              <p className="m-about-section-body">{body}</p>
            </div>
          ))}

          {/* Social */}
          <div className="m-about-socials">
            {[
              { label: "Twitter / X", icon: "✕" },
              { label: "Instagram",   icon: "ig" },
              { label: "LinkedIn",    icon: "in" },
            ].map(({ label, icon }) => (
              <button key={label} className="m-about-social-btn" aria-label={label}>
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div style={{ height: "1.5rem" }} />
        </div>

        {/* Mobile bottom bar */}
        <MobileBottomBar
          ctaLabel="Browse Stories →"
          ctaHref="/stories"
          counterLabel="4 / 4"
        />
      </main>
    </>
  );
}
