import { createBook } from "@/lib/actions/books";
import StudioField from "@/components/admin/StudioField";
import Link from "next/link";

export default function NewBook() {
  return (
    <div style={{ maxWidth: "640px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link href="/admin/books" style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)", textDecoration: "none" }}>← Books</Link>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 400, color: "var(--ink)", margin: "0.75rem 0 0" }}>New Book</h1>
      </div>

      <form action={createBook} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <StudioField label="Title" name="title" required placeholder="e.g. Dust and Delay" />
        <StudioField label="Synopsis" name="synopsis" type="textarea" rows={5}
          placeholder="A longer description for the book detail page. Take your time with this one."
          hint="This appears on the book's dedicated page, not the library cards." />
        <StudioField label="Genre" name="genre" placeholder="e.g. Literary Fiction, Historical, Poetry" />
        <StudioField label="Accent Colour" name="accent" type="select"
          options={[
            { value: "purple", label: "Purple" },
            { value: "teal",   label: "Teal"   },
            { value: "coral",  label: "Coral"  },
            { value: "gold",   label: "Gold"   },
          ]}
          hint="Sets the card colour on the Stories page." />
        <StudioField label="Status" name="status" type="select"
          options={[
            { value: "draft",     label: "Draft — not visible to readers"    },
            { value: "published", label: "Published — live on the site"      },
            { value: "archived",  label: "Archived — hidden from the library" },
          ]} />

        <div style={{ display: "flex", gap: "1rem", paddingTop: "0.5rem" }}>
          <button type="submit" style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", fontWeight: 600,
            color: "white", background: "var(--purple)", border: "none",
            padding: "0.85rem 2rem", borderRadius: "6px", cursor: "pointer",
            boxShadow: "0 2px 16px rgba(123,63,242,0.25)",
          }}>Save Book</button>
          <Link href="/admin/books" style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem",
            color: "var(--muted)", textDecoration: "none",
            padding: "0.85rem 1.25rem", display: "inline-flex", alignItems: "center",
          }}>Cancel</Link>
        </div>
      </form>
    </div>
  );
}
