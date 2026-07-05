import { createChapter } from "@/lib/actions/chapters";
import { adminGetAllBooks } from "@/lib/supabase/queries";
import StudioField from "@/components/admin/StudioField";
import Link from "next/link";

export default async function NewChapter() {
  const books = await adminGetAllBooks();

  return (
    <div style={{ maxWidth: "720px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/admin/chapters" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", textDecoration: "none" }}>← Chapters</Link>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 400, color: "var(--ink)", margin: "0.75rem 0 0" }}>New Chapter</h1>
      </div>

      <form action={createChapter} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <StudioField label="Book" name="book_id" type="select"
          options={books.map((b) => ({ value: b.id, label: b.title }))}
          hint="Which book does this chapter belong to?" />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "1rem" }}>
          <StudioField label="Chapter Number" name="chapter_number" type="number"
            placeholder="1" required />
          <StudioField label="Chapter Title" name="title" required
            placeholder="e.g. The Weight of Unsent Things" />
        </div>

        <StudioField label="Subtitle (optional)" name="subtitle"
          placeholder="e.g. In which a drawer is opened for the first time in nine years." />

        <StudioField label="Estimated Read Time" name="read_time"
          placeholder="e.g. 12 min"
          hint="Displayed to readers before they start." />

        {/* ── Prologue — optional ── */}
        <div>
          <StudioField
            label="Prologue (optional)"
            name="prologue"
            type="textarea"
            rows={5}
            placeholder={"An epigraph, a note, or a short scene that opens the chapter before the main body.\n\nLeave blank if this chapter has no prologue."}
            hint="Displayed in italics before the main chapter content. Not required — leave empty to skip."
          />
        </div>

        <StudioField
          label="Content"
          name="content"
          type="textarea"
          rows={20}
          required
          placeholder={"Write your chapter here. Separate paragraphs with a blank line.\n\nLike this.\n\nEach double-line-break becomes a new paragraph in the reader."}
          hint="Separate paragraphs with a blank line (press Enter twice). No markdown needed."
        />

        <StudioField label="Status" name="status" type="select"
          options={[
            { value: "draft",     label: "Save as Draft — not visible to readers yet" },
            { value: "published", label: "Publish now — readers can see this immediately" },
          ]} />

        <div style={{ display: "flex", gap: "1rem", paddingTop: "0.5rem" }}>
          <button type="submit" style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: 600,
            color: "white", background: "var(--purple)", border: "none",
            padding: "0.85rem 2rem", borderRadius: "6px", cursor: "pointer",
            boxShadow: "0 2px 16px rgba(123,63,242,0.25)",
          }}>Save Chapter</button>
          <Link href="/admin/chapters" style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem",
            color: "var(--muted)", textDecoration: "none",
            padding: "0.85rem 1.25rem", display: "inline-flex", alignItems: "center",
          }}>Cancel</Link>
        </div>
      </form>
    </div>
  );
}
