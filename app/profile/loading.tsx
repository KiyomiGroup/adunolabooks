import TopNav from "@/components/TopNav";
import SkeletonBlock from "@/components/SkeletonBlock";

export default function ProfileLoading() {
  return (
    <>
      <TopNav />
      <main>
        <section style={{ padding: "4.5rem 0" }}>
          <div className="container" style={{ maxWidth: "560px" }} role="status" aria-label="Loading profile">
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "2.5rem" }}>
              <SkeletonBlock width="88px" height="88px" radius="50%" />
              <div style={{ flex: 1 }}>
                <SkeletonBlock width="55%" height="1.5rem" style={{ marginBottom: "0.6rem" }} />
                <SkeletonBlock width="35%" height="0.85rem" />
              </div>
            </div>
            <SkeletonBlock width="100%" height="0.9rem" style={{ marginBottom: "0.6rem" }} />
            <SkeletonBlock width="80%" height="0.9rem" style={{ marginBottom: "2rem" }} />
            <div style={{ display: "flex", gap: "1rem" }}>
              <SkeletonBlock width="90px" height="2.4rem" radius="6px" />
              <SkeletonBlock width="90px" height="2.4rem" radius="6px" />
              <SkeletonBlock width="90px" height="2.4rem" radius="6px" />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
