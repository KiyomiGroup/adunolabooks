import Link from "next/link";
import { adminGetAllBooks, adminGetAllChapters } from "@/lib/supabase/queries";
import StudioCard from "@/components/admin/StudioCard";

export default async function AdminChapters() {
  const [books, chapters] = await Promise.all([adminGetAllBooks(), adminGetAllChapters()]);

  const bookMap = Object.fromEntries(books.map((b) => [b.id, b]));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--purple)", marginBottom: "0.4rem" }}>Manage</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 400, color: "var(--ink)", margin: 0 }}>Chapters</h1>
        </div>
        <Link href="/admin/chapters/new" style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 600,
          color: "white", background: "var(--purple)", textDecoration: "none",
          padding: "0.65rem 1.35rem", borderRadius: "6px",
          boxShadow: "0 2px 12px rgba(123,63,242,0.22)",
        }}>+ New Chapter</Link>
      </div>

      {chapters.length === 0 ? (
        <div style={{ padding: "3rem", textAlign: "center", border: "1.5px dashed var(--lavender-border)", borderRadius: "10px" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontStyle: "italic", color: "var(--muted)", margin: 0 }}>No chapters yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {chapters.map((ch) => {
            const book = bookMap[ch.book_id];
            return (
              <StudioCard
                key={ch.id}
                title={`Ch. ${ch.chapter_number} — ${ch.title}`}
                meta={`${book?.title ?? "Unknown book"} · ${ch.read_time ?? "?"}`}
                status={ch.status as "draft" | "published"}
                editHref={`/admin/chapters/${ch.id}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
