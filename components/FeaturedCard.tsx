"use client";
/*
  ── FeaturedCard — thin client wrapper ───────────────────────────────────────
  Handles the hover interaction that needs browser events.
  Keeps FeaturedStories a pure Server Component.
*/
import Link from "next/link";
import type { Story } from "@/lib/stories-types";

interface Props {
  story: Story;
  accent: { top: string; badge: string; badgeBg: string };
}

export default function FeaturedCard({ story, accent: a }: Props) {
  return (
    <Link
      href={`/stories/${story.slug}`}
      style={{ textDecoration: "none" }}
    >
      <article
        style={{
          background: "var(--white)",
          border: "1.5px solid var(--border)",
          borderRadius: "12px",
          padding: "1.75rem",
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
          transition: "box-shadow 0.35s var(--ease-paper), transform 0.35s var(--ease-paper)",
          height: "100%",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.boxShadow = "0 12px 32px rgba(123,63,242,0.1)";
          el.style.transform = "translateY(-3px)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.boxShadow = "none";
          el.style.transform = "none";
        }}
      >
        {/* Coloured accent bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: a.top, borderRadius: "12px 12px 0 0" }} aria-hidden="true" />

        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.85rem" }}>
          {story.genre}
        </p>

        <h3 className="font-display" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.4rem", fontWeight: 400, color: "var(--ink)", lineHeight: 1.25, marginBottom: "0.75rem" }}>
          {story.title}
        </h3>

        <p style={{ fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
          {story.excerpt}
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(123,63,242,0.08)", paddingTop: "1rem" }}>
          <span style={{ fontSize: "0.68rem", color: "var(--muted)" }}>
            {story.chapters.filter(c => c.status === "available").length} ch · {story.lastUpdated}
          </span>
          <span style={{ fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.08em", padding: "0.25rem 0.6rem", borderRadius: "20px", background: a.badgeBg, color: a.badge }}>
            {story.status}
          </span>
        </div>
      </article>
    </Link>
  );
}
