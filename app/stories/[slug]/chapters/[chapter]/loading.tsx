import SkeletonBlock from "@/components/SkeletonBlock";

export default function ChapterLoading() {
  return (
    <div className="reader-page">
      {/* Lightweight header placeholder — real ReaderHeader needs chapter
          data we don't have yet, so this just holds the space it occupies. */}
      <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--lavender-border)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <SkeletonBlock width="160px" height="1rem" />
          <SkeletonBlock width="90px" height="1rem" />
        </div>
      </div>

      <article className="reader-content-wrap" role="status" aria-label="Loading chapter">
        <div className="reader-meta-block">
          <SkeletonBlock width="140px" height="0.7rem" style={{ marginBottom: "0.9rem" }} />
          <SkeletonBlock width="70%" height="2.4rem" style={{ marginBottom: "1.1rem" }} />
          <SkeletonBlock width="200px" height="0.85rem" />
        </div>

        <div style={{ marginTop: "2.5rem", display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonBlock key={i} width={i % 3 === 2 ? "80%" : "100%"} height="1rem" />
          ))}
        </div>
      </article>
    </div>
  );
}
