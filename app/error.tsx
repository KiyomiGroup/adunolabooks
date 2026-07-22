"use client";

import { useEffect } from "react";
import Link from "next/link";

/*
  ── Root error boundary ───────────────────────────────────────────────────
  Catches any unhandled error in the app that isn't caught by a more
  specific error.tsx closer to the page. Never expose the raw error
  message to readers — log it for diagnostics, show a calm fallback.
*/
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="literary-not-found">
      <p className="not-found-mark font-display">✦</p>
      <h1 className="section-h2 font-display">Something went astray</h1>
      <p style={{ color: "var(--muted)", fontSize: "0.9rem", maxWidth: "40ch" }}>
        We couldn&apos;t load this page. Please try again, or return home.
      </p>
      <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button type="button" onClick={() => reset()} className="btn-primary">
          Try again
        </button>
        <Link href="/" className="btn-primary" style={{ background: "transparent", color: "var(--purple)", border: "1.5px solid var(--purple-light)" }}>
          Return home
        </Link>
      </div>
    </div>
  );
}
