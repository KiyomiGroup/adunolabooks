"use client";

import { useState } from "react";

/* Sprint 3: wire to Supabase Edge Function or third-party email provider */
export default function Newsletter() {
  const [email, setEmail]       = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!email || !email.includes("@")) return;
    /* TODO Sprint 3: POST to /api/subscribe */
    setSubmitted(true);
  };

  return (
    <section style={{ background: "var(--purple)", padding: "5rem 0" }}>
      {/* CSS class `newsletter-grid` controls columns; see globals.css */}
      <div className="container newsletter-grid">
        {/* Left — copy */}
        <div>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.56rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
            marginBottom: "1rem",
          }}>
            Free · Always
          </p>
          <h2
            className="font-display"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.8rem, 2.8vw, 2.5rem)",
              fontWeight: 300,
              color: "white",
              lineHeight: 1.15,
              marginBottom: "1.1rem",
            }}
          >
            Stay inside{" "}
            <em style={{ fontStyle: "italic", color: "var(--gold)" }}>the story.</em>
          </h2>
          <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.75, maxWidth: "32ch" }}>
            New chapters delivered as they're written. No noise — just the next page, when it's ready.
          </p>
        </div>

        {/* Right — form */}
        <div>
          {submitted ? (
            <div style={{ borderLeft: "2px solid var(--gold)", paddingLeft: "1.5rem" }}>
              <p className="font-display" style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.5rem",
                fontStyle: "italic",
                color: "var(--gold)",
                margin: "0 0 0.5rem",
              }}>
                You're in.
              </p>
              <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.55)", margin: 0 }}>
                We'll write to you soon.
              </p>
            </div>
          ) : (
            <div>
              <label
                htmlFor="newsletter-email"
                style={{
                  display: "block",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "0.56rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                  marginBottom: "0.6rem",
                }}
              >
                Your email address
              </label>
              <div style={{ display: "flex" }}>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  placeholder="you@example.com"
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRight: "none",
                    color: "white",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.875rem",
                    padding: "0.8rem 1.1rem",
                    outline: "none",
                    borderRadius: "3px 0 0 3px",
                  }}
                />
                <button
                  onClick={handleSubmit}
                  style={{
                    background: "var(--gold)",
                    border: "none",
                    color: "var(--ink)",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "0.8rem 1.4rem",
                    cursor: "pointer",
                    borderRadius: "0 3px 3px 0",
                    whiteSpace: "nowrap",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  Subscribe
                </button>
              </div>
              <p style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.6rem",
                color: "rgba(255,255,255,0.28)",
                marginTop: "0.6rem",
                letterSpacing: "0.06em",
              }}>
                No spam. Unsubscribe whenever.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
