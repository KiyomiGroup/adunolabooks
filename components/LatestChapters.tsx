/*
  ── LatestChapters — Sprint 3 ────────────────────────────────────────────────
  Server Component. Fetches 4 most recently published chapters from Supabase.
  Hover interactions preserved via onMouseEnter/Leave (still valid in RSC
  because the li has no state — it's a pure style toggle).
  UI identical to Sprint 2. Mock data removed.
*/
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ChapterRow, BookRow } from "@/lib/supabase/types";

type ChapterWithBook = ChapterRow & { books: Pick<BookRow, "title" | "slug"> | null };

export default function LatestChapters() {
  const [chapters, setChapters] = useState<ChapterWithBook[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("chapters")
      .select("*, books(title, slug)")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(4)
      .then(({ data }) => {
        if (data) setChapters(data as ChapterWithBook[]);
      });
  }, []);

  /* Show mock skeleton rows while loading, real data once fetched */
  const displayChapters = chapters.length > 0 ? chapters : [];

  return (
    <section style={{ background: "var(--bg-xlight)", padding: "5rem 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="container">
        <div style={{ marginBottom: "2.5rem" }}>
          <p className="section-tag">Recently Published</p>
          <h2 className="section-h2 font-display">Latest Chapters</h2>
        </div>

        <ol style={{ listStyle: "none", padding: 0, margin: 0 }} role="list">
          {displayChapters.length === 0 ? (
            /* Skeleton rows while awaiting data */
            [1,2,3,4].map((i) => (
              <li key={i} style={{ borderTop: "1px solid var(--border)", padding: "1.5rem 0" }}>
                <div style={{ height: "1rem", width: `${60 + i * 7}%`, background: "var(--purple-light)", borderRadius: "4px", opacity: 0.4 }} />
              </li>
            ))
          ) : (
            displayChapters.map((ch) => (
              <li
                key={ch.id}
                className="chapter-row-grid"
                style={{ borderTop: "1px solid var(--border)", padding: "1.5rem 0", cursor: "pointer", borderRadius: "4px", transition: "all 0.15s" }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "var(--white)";
                  el.style.padding = "1.5rem 1rem";
                  if (window.innerWidth > 1024) el.style.margin = "0 -1rem";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "transparent";
                  el.style.padding = "1.5rem 0";
                  el.style.margin = "0";
                }}
              >
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "var(--purple)", opacity: 0.5, textAlign: "right", letterSpacing: "0.08em" }}>
                  {String(ch.chapter_number).padStart(2, "0")}
                </span>

                <Link href={`/stories/${ch.books?.slug ?? "#"}/chapters/${ch.chapter_number}`} style={{ textDecoration: "none" }}>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.3rem" }}>
                    {ch.books?.title ?? ""}
                  </p>
                  <h3 className="font-display" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.15rem", fontWeight: 400, color: "var(--ink)" }}>
                    {ch.title}
                  </h3>
                </Link>

                <div className="chapter-row-meta" style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "0.65rem", color: "var(--muted)", margin: "0 0 0.2rem" }}>
                    {ch.published_at ? new Date(ch.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : ""}
                  </p>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: "var(--purple)", opacity: 0.65, margin: 0 }}>
                    {ch.read_time ?? ""}
                  </p>
                </div>
              </li>
            ))
          )}
          <li style={{ borderTop: "1px solid var(--border)" }} aria-hidden="true" />
        </ol>
      </div>
    </section>
  );
}
