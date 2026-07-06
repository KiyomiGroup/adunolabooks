import Link from "next/link";
import TopNav from "@/components/TopNav";

export default function PoemNotFound() {
  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <TopNav />
      <div className="literary-not-found">
        <div className="not-found-mark">"</div>
        <h1
          className="font-display"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.6rem",
            fontWeight: 400,
            color: "var(--ink)",
            margin: "0.5rem 0",
          }}
        >
          This poem has gone missing
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--muted)", maxWidth: "30ch", textAlign: "center" }}>
          It may have been moved or unpublished.
        </p>
        <Link
          href="/poems"
          style={{
            marginTop: "1.5rem",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.8rem",
            fontWeight: 500,
            color: "var(--purple)",
            textDecoration: "none",
            borderBottom: "1px solid var(--purple-light)",
            paddingBottom: "2px",
          }}
        >
          ← Return to the archive
        </Link>
      </div>
    </div>
  );
}
