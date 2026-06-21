import Link from "next/link";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";

export default function StoryNotFound() {
  return (
    <>
      <TopNav />
      <main>
        <div className="literary-not-found">
          <p className="not-found-mark font-display">✦</p>
          <h1 className="section-h2 font-display">This story hasn&apos;t been shelved yet</h1>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", maxWidth: "40ch" }}>
            We couldn&apos;t find that title in the library. It may still be drafting, or the
            link may have wandered off somewhere.
          </p>
          <Link href="/stories" className="btn-primary" style={{ marginTop: "0.75rem" }}>
            Back to the Library →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
