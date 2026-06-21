import Link from "next/link";

export default function ChapterNotFound() {
  return (
    <div className="reader-page">
      <div className="literary-not-found">
        <p className="not-found-mark font-display">✦</p>
        <h1 className="section-h2 font-display">This page hasn&apos;t been written</h1>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem", maxWidth: "40ch" }}>
          That chapter doesn&apos;t exist yet, or the link has gone astray. Let&apos;s get
          you back to the library.
        </p>
        <Link href="/stories" className="btn-primary" style={{ marginTop: "0.75rem" }}>
          Back to the Library →
        </Link>
      </div>
    </div>
  );
}
