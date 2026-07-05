import { createClient } from "@/lib/supabase/server";
import { adminGetAllBooks } from "@/lib/supabase/queries";
import { updateChapter } from "@/lib/actions/chapters";
import StudioField from "@/components/admin/StudioField";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ChapterRow } from "@/lib/supabase/types";

interface Props { params: Promise<{ id: string }> }

export default async function EditChapter({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data }, books] = await Promise.all([
    (supabase.from("chapters") as any).select("*").eq("id", id).single(),
    adminGetAllBooks(),
  ]);
  const chapter = data as ChapterRow | null;
  if (!chapter) notFound();

  let contentText = "";
  try {
    contentText = (JSON.parse(chapter.content) as string[]).join("\n\n");
  } catch {
    contentText = chapter.content;
  }

  const updateWithId = updateChapter.bind(null, id);

  return (
    <div style={{ maxWidth: "720px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/admin/chapters" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", textDecoration: "none" }}>← Chapters</Link>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 400, color: "var(--ink)", margin: "0.75rem 0 0" }}>
          Ch. {chapter.chapter_number} — {chapter.title}
        </h1>
        {chapter.status === "published" && (
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: "var(--teal)", letterSpacing: "0.16em", textTransform: "uppercase", marginTop: "0.4rem" }}>
            ✓ Published {chapter.published_at ? new Date(chapter.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : ""}
          </p>
        )}
      </div>

      <form action={updateWithId} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <StudioField label="Chapter Title" name="title" required defaultValue={chapter.title} />
        <StudioField label="Subtitle (optional)" name="subtitle" defaultValue={chapter.subtitle ?? ""} />
        <StudioField label="Estimated Read Time" name="read_time" defaultValue={chapter.read_time ?? ""} placeholder="e.g. 12 min" />

        {/* ── Prologue — optional ── */}
        <StudioField
          label="Prologue (optional)"
          name="prologue"
          type="textarea"
          rows={5}
          defaultValue={chapter.prologue ?? ""}
          placeholder={"An epigraph, a note, or a short scene before the main body.\n\nLeave blank if this chapter has no prologue."}
          hint="Displayed in italics before the main chapter content. Leave empty to skip."
        />

        <StudioField
          label="Content"
          name="content"
          type="textarea"
          rows={24}
          required
          defaultValue={contentText}
          hint="Separate paragraphs with a blank line."
        />

        <StudioField label="Status" name="status" type="select" defaultValue={chapter.status}
          options={[
            { value: "draft",     label: "Draft — not visible to readers" },
            { value: "published", label: "Published — live on the site" },
          ]} />

        <div style={{ display: "flex", gap: "1rem", paddingTop: "0.5rem" }}>
          <button type="submit" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: 600, color: "white", background: "var(--purple)", border: "none", padding: "0.85rem 2rem", borderRadius: "6px", cursor: "pointer", boxShadow: "0 2px 16px rgba(123,63,242,0.25)" }}>Save Changes</button>
          <Link href="/admin/chapters" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "var(--muted)", textDecoration: "none", padding: "0.85rem 1.25rem", display: "inline-flex", alignItems: "center" }}>Cancel</Link>
        </div>
      </form>
    </div>
  );
}
