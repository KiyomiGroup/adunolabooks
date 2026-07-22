import TopNav from "@/components/TopNav";
import SkeletonBlock from "@/components/SkeletonBlock";

export default function PoemsLoading() {
  return (
    <>
      <TopNav />
      <main>
        <section style={{ padding: "5rem 0" }}>
          <div className="container" style={{ maxWidth: "640px" }} role="status" aria-label="Loading poems">
            <SkeletonBlock width="90px" height="0.7rem" style={{ marginBottom: "1rem" }} />
            <SkeletonBlock width="200px" height="2.2rem" style={{ marginBottom: "3rem" }} />

            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ marginBottom: "3rem" }}>
                <SkeletonBlock width="55%" height="1.4rem" style={{ marginBottom: "0.9rem" }} />
                <SkeletonBlock width="100%" height="0.85rem" style={{ marginBottom: "0.5rem" }} />
                <SkeletonBlock width="90%" height="0.85rem" style={{ marginBottom: "0.5rem" }} />
                <SkeletonBlock width="70%" height="0.85rem" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
