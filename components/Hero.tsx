"use client";

import { useEffect, useState } from "react";

const FEATURED_BOOK = {
  title: "Dust and Delay",
  author: "Adunola",
  year: "2025",
  chapterCount: 12,
  readTime: "18 min",
};

const STATS = [
  { value: "400+", label: "Stories Published", color: "var(--purple)" },
  { value: "12k",  label: "Readers This Month", color: "var(--teal)"   },
];

const PAGE_LINES = [100, 92, 100, 78, 100, 88, 100, 65, 100, 84, 100, 72];

function PageLines({ opacity = 0.1, color = "var(--purple)" }: { opacity?: number; color?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "7px", flex: 1 }} aria-hidden="true">
      {PAGE_LINES.map((w, i) => (
        <div key={i} style={{ height: "1.5px", width: `${w}%`, background: color, opacity, borderRadius: "1px" }} />
      ))}
    </div>
  );
}

function OpenBook() {
  return (
    <div style={{ position: "relative", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "1rem", paddingBottom: "2rem" }}>
      <div className="fade-up delay-3" style={{ position: "absolute", top: "0%", right: "2%", background: "var(--white)", border: "1.5px solid rgba(56,201,180,0.28)", borderRadius: "8px", padding: "0.45rem 0.8rem", fontSize: "0.68rem", fontWeight: 500, color: "var(--teal)", boxShadow: "0 4px 14px rgba(56,201,180,0.1)", whiteSpace: "nowrap", zIndex: 3 }}>✦ New chapter</div>
      <div className="fade-up delay-4" style={{ position: "absolute", bottom: "6%", left: "2%", background: "var(--white)", border: "1.5px solid rgba(255,111,97,0.22)", borderRadius: "8px", padding: "0.45rem 0.8rem", fontSize: "0.68rem", fontWeight: 500, color: "var(--coral)", boxShadow: "0 4px 14px rgba(255,111,97,0.08)", whiteSpace: "nowrap", zIndex: 3 }}>{FEATURED_BOOK.readTime} read</div>
      <div className="fade-up delay-2" style={{ animation: "bookFloat 7s ease-in-out infinite", position: "relative", filter: "drop-shadow(0 24px 48px rgba(123,63,242,0.18)) drop-shadow(0 8px 20px rgba(93,63,172,0.12))" }}>
        <div aria-hidden="true" style={{ position: "absolute", top: "10%", left: "5%", right: "5%", bottom: "0", background: "radial-gradient(ellipse 80% 60% at 50% 80%, rgba(123,63,242,0.22) 0%, transparent 70%)", filter: "blur(24px)", animation: "glowPulse 5s ease-in-out infinite", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "stretch" }}>
          <div style={{ width: "170px", minHeight: "240px", background: "linear-gradient(135deg, var(--paper-aged) 0%, var(--paper) 100%)", borderRadius: "3px 0 0 3px", padding: "1.5rem 1.25rem 1.5rem 1.5rem", display: "flex", flexDirection: "column", boxShadow: "inset -4px 0 12px rgba(93,63,172,0.06)", position: "relative" }}>
            <div style={{ marginBottom: "1rem" }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.5rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--muted-light)", marginBottom: "0.5rem" }}>Ch. {FEATURED_BOOK.chapterCount}</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.85rem", fontStyle: "italic", fontWeight: 400, color: "var(--purple-dark)", lineHeight: 1.3 }}>{FEATURED_BOOK.title}</p>
            </div>
            <PageLines opacity={0.09} color="var(--ink)" />
            <p aria-hidden="true" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.5rem", color: "var(--muted-light)", opacity: 0.5, marginTop: "0.75rem", textAlign: "center", letterSpacing: "0.1em" }}>— 147 —</p>
          </div>
          <div aria-hidden="true" style={{ width: "14px", background: "linear-gradient(90deg, #3D2080 0%, #5520C8 45%, #3D2080 100%)", position: "relative", overflow: "hidden", flexShrink: 0 }}>
            <div style={{ position: "absolute", top: 0, bottom: 0, left: "3px", width: "2px", background: "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04), rgba(255,255,255,0.08))" }} />
          </div>
          <div style={{ width: "170px", minHeight: "240px", background: "linear-gradient(225deg, var(--paper) 0%, #FEFEFE 100%)", borderRadius: "0 3px 3px 0", padding: "1.5rem 1.5rem 1.5rem 1.25rem", display: "flex", flexDirection: "column", boxShadow: "inset 4px 0 12px rgba(93,63,172,0.04)" }}>
            <div style={{ marginBottom: "1rem", flex: 1 }}>
              <div aria-hidden="true" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "3rem", color: "var(--purple-light)", lineHeight: 0.7, marginBottom: "0.25rem", userSelect: "none" }}>"</div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.78rem", fontStyle: "italic", color: "var(--ink-soft)", lineHeight: 1.7, fontWeight: 300 }}>She kept the letter for eleven years before she understood what it meant.</p>
            </div>
            <PageLines opacity={0.08} color="var(--ink)" />
            <p aria-hidden="true" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.5rem", color: "var(--muted-light)", opacity: 0.5, marginTop: "0.75rem", textAlign: "center", letterSpacing: "0.1em" }}>— 148 —</p>
          </div>
        </div>
        <div aria-hidden="true" style={{ position: "absolute", top: "-2px", left: "calc(50% + 60px)", width: "12px", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", filter: "drop-shadow(1px 2px 4px rgba(123,63,242,0.3))" }}>
          <div style={{ width: "12px", height: "56px", background: "linear-gradient(180deg, var(--purple) 0%, var(--purple-dark) 100%)", clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 8px), 50% 100%, 0 calc(100% - 8px))" }} />
        </div>
        <div aria-hidden="true" style={{ position: "absolute", bottom: "-16px", left: "10%", right: "10%", height: "20px", background: "radial-gradient(ellipse, rgba(93,63,172,0.18) 0%, transparent 70%)", filter: "blur(8px)", pointerEvents: "none" }} />
      </div>
    </div>
  );
}

/* ── Mobile book cover — compact single-page card ── */
function MobileBookCard() {
  return (
    <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", padding: "1.25rem 0 1rem" }}>
      {/* Cover */}
      <div style={{ width: "90px", minWidth: "90px", height: "120px", background: "linear-gradient(145deg, var(--purple) 0%, var(--purple-deep) 100%)", borderRadius: "5px 5px 3px 3px", padding: "10px", display: "flex", flexDirection: "column", justifyContent: "flex-end", boxShadow: "0 8px 22px rgba(61,15,158,0.28), inset 0 1px 0 rgba(255,255,255,0.12)", position: "relative", overflow: "hidden" }}>
        <span style={{ position: "absolute", top: "6px", left: "8px", fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontStyle: "italic", color: "rgba(255,255,255,0.22)", lineHeight: 1 }}>W</span>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <span style={{ display: "block", height: "1.5px", background: "rgba(255,255,255,0.5)", borderRadius: "1px" }} />
          <span style={{ display: "block", height: "1.5px", background: "rgba(255,255,255,0.5)", borderRadius: "1px", width: "70%" }} />
          <span style={{ display: "block", height: "1.5px", background: "rgba(255,255,255,0.5)", borderRadius: "1px", width: "85%" }} />
        </div>
      </div>
      {/* Meta */}
      <div style={{ flex: 1, paddingTop: "2px" }}>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--purple)", marginBottom: "5px" }}>Literary Fiction</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.18rem", fontWeight: 400, color: "var(--ink)", lineHeight: 1.18, marginBottom: "5px" }}>Where the Rivers Remember</h2>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: "8px" }}>by Adunola Osei</p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "var(--muted)", lineHeight: 1.55 }}>A story of memory, loss, and the rivers that carry what we cannot hold…</p>
      </div>
    </div>
  );
}

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) {
    return (
      <section style={{ background: "var(--bg-soft)", borderBottom: "1px solid var(--lavender-border)" }} aria-label="Hero">
        <div className="container">
          {/* Brand label */}
          <div style={{ paddingTop: "1.25rem", marginBottom: "0.25rem" }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.52rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--purple)", background: "var(--purple-light)", padding: "0.3rem 0.75rem", borderRadius: "2px" }}>Literary Platform</span>
          </div>

          {/* Headline */}
          <h1 className="font-display fade-up" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.6rem, 12vw, 3.4rem)", fontWeight: 400, lineHeight: 1.08, color: "var(--ink)", marginBottom: "1rem", letterSpacing: "-0.015em" }}>
            Stories that live
            <em style={{ fontStyle: "italic", color: "var(--purple)", display: "block", textShadow: "0 2px 24px rgba(123,63,242,0.15)" }}>on the page.</em>
          </h1>

          {/* Body copy */}
          <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
            Serialized fiction, poetry, and immersive storytelling — published one chapter at a time.
          </p>

          {/* CTA buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem", marginBottom: "1.5rem" }}>
            <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>View More →</button>
            <button className="btn-ghost" style={{ width: "100%", justifyContent: "center" }}>Continue Reading ↗</button>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "var(--lavender-border)", margin: "0.5rem 0 0" }} />
        </div>
      </section>
    );
  }

  /* ── Desktop layout (unchanged) ── */
  return (
    <section style={{ background: "var(--bg-soft)", borderBottom: "1px solid var(--lavender-border)" }} aria-label="Hero">
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.25fr 1fr", gridTemplateRows: "1fr auto", gap: "2.5rem", alignItems: "center", minHeight: "88vh", paddingTop: "4rem", paddingBottom: "3rem" }}>
          {/* LEFT */}
          <div className="fade-up">
            <span style={{ display: "inline-block", fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--purple)", background: "var(--purple-light)", padding: "0.35rem 0.85rem", borderRadius: "2px", marginBottom: "1.5rem" }}>Literary Platform</span>
            <h1 className="font-display" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.4rem, 4.2vw, 4rem)", fontWeight: 400, lineHeight: 1.08, color: "var(--ink)", marginBottom: "1.25rem", letterSpacing: "-0.015em" }}>
              Stories that live
              <em style={{ fontStyle: "italic", color: "var(--purple)", display: "block", textShadow: "0 2px 24px rgba(123,63,242,0.15)" }}>on the page.</em>
            </h1>
            <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.8, marginBottom: "2.25rem", maxWidth: "26ch" }}>Serialized fiction, poetry, and immersive storytelling — published one chapter at a time.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <button className="btn-primary">View More →</button>
              <button className="btn-ghost">Continue Reading ↗</button>
            </div>
          </div>

          {/* CENTER */}
          <OpenBook />

          {/* RIGHT */}
          <div className="fade-up delay-2" style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "flex-end" }}>
            {STATS.map((stat) => (
              <div key={stat.label} style={{ background: "var(--white)", border: "1.5px solid var(--lavender-border)", borderRadius: "12px", padding: "1.4rem", width: "100%", maxWidth: "188px", boxShadow: "0 2px 12px var(--lavender-shadow)", cursor: "default", transition: "box-shadow 0.4s var(--ease-paper), transform 0.4s var(--ease-paper)" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 8px 28px rgba(123,63,242,0.14)"; el.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 2px 12px var(--lavender-shadow)"; el.style.transform = "none"; }}>
                <div className="font-display" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.4rem", fontWeight: 500, color: stat.color, lineHeight: 1, marginBottom: "0.35rem" }}>{stat.value}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)" }}>{stat.label}</div>
              </div>
            ))}
            <div style={{ background: "var(--purple)", borderRadius: "12px", padding: "1.4rem", width: "100%", maxWidth: "188px", cursor: "pointer", boxShadow: "0 4px 20px rgba(123,63,242,0.28), inset 0 1px 0 rgba(255,255,255,0.12)", transition: "all 0.4s var(--ease-paper)" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--purple-dark)"; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 8px 32px rgba(123,63,242,0.38)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--purple)"; el.style.transform = "none"; el.style.boxShadow = "0 4px 20px rgba(123,63,242,0.28), inset 0 1px 0 rgba(255,255,255,0.12)"; }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.52rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "0.5rem" }}>Ready to connect?</p>
              <p className="font-display" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontStyle: "italic", color: "white", lineHeight: 1.25 }}>Book a Call</p>
              <p style={{ color: "rgba(255,255,255,0.45)", marginTop: "0.5rem", fontSize: "1rem" }}>→</p>
            </div>
            <div style={{ display: "flex", gap: "0.55rem" }}>
              {["✕", "in", "ig"].map((icon) => (
                <button key={icon} style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1.5px solid var(--lavender-border)", background: "var(--white)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "0.68rem", fontWeight: 600, color: "var(--purple)", boxShadow: "0 2px 8px var(--lavender-shadow)", transition: "all 0.35s var(--ease-paper)" }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--purple)"; el.style.color = "white"; el.style.borderColor = "var(--purple)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--white)"; el.style.color = "var(--purple)"; el.style.borderColor = "var(--lavender-border)"; }}
                  aria-label={icon}>{icon}</button>
              ))}
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div className="fade-up delay-3" style={{ gridColumn: "1 / -1", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: "2rem", borderTop: "1px solid var(--lavender-border)", paddingTop: "1.75rem" }}>
            <p style={{ fontSize: "0.72rem", color: "var(--muted-light)", letterSpacing: "0.04em" }}>Scroll to explore the library</p>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", cursor: "pointer" }} onClick={() => document.getElementById("stories-section")?.scrollIntoView({ behavior: "smooth" })}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--muted-light)" }}>See More</span>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", border: "1.5px solid var(--lavender-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--purple)", background: "var(--white)", boxShadow: "0 2px 10px var(--lavender-shadow)", transition: "all 0.35s var(--ease-paper)", fontSize: "0.95rem" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--purple)"; el.style.color = "white"; el.style.borderColor = "var(--purple)"; el.style.transform = "translateY(2px)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--white)"; el.style.color = "var(--purple)"; el.style.borderColor = "var(--lavender-border)"; el.style.transform = "none"; }}>↓</div>
            </div>
            <p style={{ fontSize: "0.72rem", color: "var(--muted-light)", textAlign: "right", letterSpacing: "0.04em" }}>2025 · New chapters weekly</p>
          </div>
        </div>
      </div>
    </section>
  );
}
