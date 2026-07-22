import TopNav from "@/components/TopNav";
import SkeletonBlock from "@/components/SkeletonBlock";

export default function StoriesLoading() {
  return (
    <>
      <TopNav />
      <main>
        <div className="u-desktop-only">
          <section style={{ background: "var(--bg-soft)", padding: "5.5rem 0 4rem" }}>
            <div className="container">
              <SkeletonBlock width="90px" height="0.7rem" style={{ marginBottom: "1rem" }} />
              <SkeletonBlock width="240px" height="2.4rem" style={{ marginBottom: "1rem" }} />
              <SkeletonBlock width="60%" height="1rem" />
            </div>
          </section>

          <section style={{ background: "#FFFFFF", padding: "3rem 0 6rem" }}>
            <div
              className="container"
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "2rem" }}
              aria-label="Loading stories"
              role="status"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <SkeletonBlock height="280px" radius="10px" style={{ marginBottom: "0.85rem" }} />
                  <SkeletonBlock width="70%" height="1rem" style={{ marginBottom: "0.5rem" }} />
                  <SkeletonBlock width="45%" height="0.8rem" />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Mobile skeleton */}
        <div className="u-mobile-only" style={{ padding: "1.5rem 1.25rem" }} role="status" aria-label="Loading stories">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
              <SkeletonBlock width="72px" height="100px" radius="8px" />
              <div style={{ flex: 1 }}>
                <SkeletonBlock width="80%" height="1rem" style={{ marginBottom: "0.6rem" }} />
                <SkeletonBlock width="55%" height="0.8rem" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
