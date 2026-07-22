import TopNav from "@/components/TopNav";
import SkeletonBlock from "@/components/SkeletonBlock";

export default function StoryDetailLoading() {
  return (
    <>
      <TopNav />
      <main>
        <section style={{ padding: "4rem 0" }}>
          <div
            className="container"
            style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap", alignItems: "flex-start" }}
            role="status"
            aria-label="Loading story"
          >
            <SkeletonBlock width="220px" height="320px" radius="10px" />
            <div style={{ flex: 1, minWidth: "260px" }}>
              <SkeletonBlock width="120px" height="0.7rem" style={{ marginBottom: "0.9rem" }} />
              <SkeletonBlock width="65%" height="2.2rem" style={{ marginBottom: "1rem" }} />
              <SkeletonBlock width="100%" height="0.9rem" style={{ marginBottom: "0.6rem" }} />
              <SkeletonBlock width="90%" height="0.9rem" style={{ marginBottom: "0.6rem" }} />
              <SkeletonBlock width="80%" height="0.9rem" style={{ marginBottom: "1.6rem" }} />
              <SkeletonBlock width="160px" height="2.6rem" radius="6px" />
            </div>
          </div>
        </section>

        <section style={{ padding: "0 0 5rem" }}>
          <div className="container" style={{ maxWidth: "720px" }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBlock key={i} height="3.2rem" style={{ marginBottom: "0.85rem" }} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
