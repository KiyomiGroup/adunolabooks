import { createClient } from "@/lib/supabase/server";
import { updatePoem } from "@/lib/actions/poems";
import StudioField from "@/components/admin/StudioField";
import PoemImageUploader from "@/components/admin/PoemImageUploader";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { PoemRow } from "@/lib/supabase/types";

interface Props { params: Promise<{ id: string }> }

export default async function EditPoem({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await (supabase.from("poems") as any).select("*").eq("id", id).single();
  const poem = data as PoemRow | null;
  if (!poem) notFound();

  const updateWithId = updatePoem.bind(null, id);

  return (
    <div style={{ maxWidth: "640px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/admin/poems" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", textDecoration: "none" }}>
          ← Poems
        </Link>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 400, color: "var(--ink)", margin: "0.75rem 0 0" }}>
          {poem.title}
        </h1>
      </div>

      {/* ── Text content form ──────────────────────────────────────────── */}
      <form action={updateWithId} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <StudioField label="Title" name="title" required defaultValue={poem.title} />
        <StudioField
          label="Content"
          name="content"
          type="textarea"
          rows={14}
          required
          defaultValue={poem.content}
          hint="Write each line as its own line. Leave a blank line between stanzas."
        />
        <StudioField
          label="Tags"
          name="tags"
          defaultValue={poem.tags?.join(", ") ?? ""}
          placeholder="grief, Lagos, home"
          hint="Comma-separated. Used for filtering and discovery."
        />
        <StudioField label="Status" name="status" type="select" defaultValue={poem.status}
          options={[
            { value: "draft",     label: "Draft — not visible yet"   },
            { value: "published", label: "Published — live on site"  },
          ]} />

        <div style={{ display: "flex", gap: "1rem", paddingTop: "0.5rem" }}>
          <button type="submit" style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: 600,
            color: "white", background: "var(--purple)", border: "none",
            padding: "0.85rem 2rem", borderRadius: "6px", cursor: "pointer",
            boxShadow: "0 2px 16px rgba(123,63,242,0.25)",
          }}>
            Save Changes
          </button>
          <Link href="/admin/poems" style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem",
            color: "var(--muted)", textDecoration: "none",
            padding: "0.85rem 1.25rem", display: "inline-flex", alignItems: "center",
          }}>
            Cancel
          </Link>
        </div>
      </form>

      {/* ── Mood image upload (operates independently) ─────────────────── */}
      <div style={{ marginTop: "2.5rem" }}>
        <PoemImageUploader
          poemId={poem.id}
          currentUrl={poem.image_url}
        />
      </div>
    </div>
  );
}
