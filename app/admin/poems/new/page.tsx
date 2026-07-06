import { createPoem } from "@/lib/actions/poems";
import StudioField from "@/components/admin/StudioField";
import Link from "next/link";

export default function NewPoem() {
  return (
    <div style={{ maxWidth: "640px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/admin/poems" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", textDecoration: "none" }}>← Poems</Link>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 400, color: "var(--ink)", margin: "0.75rem 0 0" }}>New Poem</h1>
      </div>

      <form action={createPoem} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <StudioField label="Title" name="title" required placeholder="e.g. Inventory" />
        <StudioField label="Content" name="content" type="textarea" rows={14} required
          placeholder={"Eleven plates. A daughter's coat.\nThe specific quiet of a house\nthat still holds the shape of someone."}
          hint="Write each line as its own line. The reader will preserve your line breaks." />
        <StudioField label="Tags" name="tags"
          placeholder="grief, Lagos, home"
          hint="Comma-separated. Used for future filtering (Sprint 4)." />
        <StudioField label="Status" name="status" type="select"
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
          }}>Save Poem</button>
          <Link href="/admin/poems" style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem",
            color: "var(--muted)", textDecoration: "none",
            padding: "0.85rem 1.25rem", display: "inline-flex", alignItems: "center",
          }}>Cancel</Link>
        </div>
      </form>

      {/* Image upload note */}
      <div style={{
        marginTop: "2rem",
        padding: "1rem 1.25rem",
        background: "var(--bg-soft)",
        borderRadius: "8px",
        border: "1px solid var(--lavender-border)",
      }}>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--purple)", marginBottom: "0.35rem" }}>
          Mood Image
        </p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.6, margin: 0 }}>
          Save the poem first, then open it to add an optional atmospheric image.
        </p>
      </div>
    </div>
  );
}
