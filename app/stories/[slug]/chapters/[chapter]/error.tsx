"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ChapterError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ChapterError]", error);
  }, [error]);

  return (
    <div className="reader-page">
      <div className="literary-not-found">
        <p className="not-found-mark font-display">✦</p>
        <h1 className="section-h2 font-display">Unable to load this chapter</h1>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem", maxWidth: "40ch" }}>
          Something interrupted the page. Please try again.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button type="button" onClick={() => reset()} className="btn-primary">
            Try again
          </button>
          <Link href="/stories" className="btn-primary" style={{ background: "transparent", color: "var(--purple)", border: "1.5px solid var(--purple-light)" }}>
            Back to the Library →
          </Link>
        </div>
      </div>
    </div>
  );
}
