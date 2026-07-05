import { createClient } from "@/lib/supabase/server";
import { updateBook } from "@/lib/actions/books";
import StudioField from "@/components/admin/StudioField";
import CoverUploader from "@/components/admin/CoverUploader";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { BookRow } from "@/lib/supabase/types";

interface Props { params: Promise<{ id: string }> }

export default async function EditBook({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await (supabase.from("books") as any).select("*").eq("id", id).single();
  const book = data as BookRow | null;
  if (!book) notFound();

  const updateWithId = updateBook.bind(null, id);

  return (
    <div style={{ maxWidth: "640px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/admin/books" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", textDecoration: "none" }}>← Books</Link>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 400, color: "var(--ink)", margin: "0.75rem 0 0" }}>Edit Book</h1>
      </div>

      {/* ── Cover upload — wired to Supabase Storage ── */}
      <div style={{
        background: "var(--white)",
        border: "1.5px solid var(--lavender-border)",
        borderRadius: "8px",
        padding: "1.4rem",
        marginBottom: "2rem",
      }}>
        <CoverUploader bookId={id} currentUrl={book.cover_url} />
      </div>

      <form action={updateWithId} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <StudioField label="Title" name="title" required defaultValue={book.title} />
        <StudioField label="Synopsis" name="synopsis" type="textarea" rows={5} defaultValue={book.synopsis} />
        <StudioField label="Genre" name="genre" defaultValue={book.genre} />
        <StudioField label="Accent Colour" name="accent" type="select" defaultValue={book.accent}
          options={[{ value: "purple", label: "Purple" }, { value: "teal", label: "Teal" }, { value: "coral", label: "Coral" }, { value: "gold", label: "Gold" }]} />
        <StudioField label="Status" name="status" type="select" defaultValue={book.status}
          options={[{ value: "draft", label: "Draft — not visible to readers" }, { value: "published", label: "Published — live on the site" }, { value: "archived", label: "Archived — hidden from the library" }]} />

        <div style={{ display: "flex", gap: "1rem", paddingTop: "0.5rem" }}>
          <button type="submit" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: 600, color: "white", background: "var(--purple)", border: "none", padding: "0.85rem 2rem", borderRadius: "6px", cursor: "pointer", boxShadow: "0 2px 16px rgba(123,63,242,0.25)" }}>Save Changes</button>
          <Link href="/admin/books" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "var(--muted)", textDecoration: "none", padding: "0.85rem 1.25rem", display: "inline-flex", alignItems: "center" }}>Cancel</Link>
        </div>
      </form>
    </div>
  );
}
