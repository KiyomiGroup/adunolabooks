import Link from "next/link";
import { adminGetAllBooks } from "@/lib/supabase/queries";
import { deleteBook } from "@/lib/actions/books";
import StudioCard from "@/components/admin/StudioCard";

export default async function AdminBooks() {
  const books = await adminGetAllBooks();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--purple)", marginBottom: "0.4rem" }}>Manage</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 400, color: "var(--ink)", margin: 0 }}>Books</h1>
        </div>
        <Link href="/admin/books/new" style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 600,
          color: "white", background: "var(--purple)", textDecoration: "none",
          padding: "0.65rem 1.35rem", borderRadius: "6px",
          boxShadow: "0 2px 12px rgba(123,63,242,0.22)",
        }}>+ New Book</Link>
      </div>

      {/* List */}
      {books.length === 0 ? (
        <div style={{ padding: "3rem", textAlign: "center", border: "1.5px dashed var(--lavender-border)", borderRadius: "10px" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontStyle: "italic", color: "var(--muted)", margin: 0 }}>
            No books yet. Add your first one.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {books.map((book) => (
            <StudioCard
              key={book.id}
              title={book.title}
              meta={`${book.genre} · ${book.status}`}
              status={book.status as "draft" | "published" | "archived"}
              editHref={`/admin/books/${book.id}`}
              accent={
                book.accent === "teal" ? "var(--teal)" :
                book.accent === "coral" ? "var(--coral)" :
                book.accent === "gold" ? "var(--gold)" : "var(--purple)"
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
