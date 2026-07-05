import Link from "next/link";
import { adminGetAllPoems } from "@/lib/supabase/queries";
import StudioCard from "@/components/admin/StudioCard";

export default async function AdminPoems() {
  const poems = await adminGetAllPoems();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--purple)", marginBottom: "0.4rem" }}>Manage</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 400, color: "var(--ink)", margin: 0 }}>Poems</h1>
        </div>
        <Link href="/admin/poems/new" style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 600,
          color: "white", background: "var(--purple)", textDecoration: "none",
          padding: "0.65rem 1.35rem", borderRadius: "6px",
          boxShadow: "0 2px 12px rgba(123,63,242,0.22)",
        }}>+ New Poem</Link>
      </div>

      {poems.length === 0 ? (
        <div style={{ padding: "3rem", textAlign: "center", border: "1.5px dashed var(--lavender-border)", borderRadius: "10px" }}>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.2rem", fontStyle: "italic", color: "var(--muted)", margin: 0 }}>No poems yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {poems.map((poem) => (
            <StudioCard
              key={poem.id}
              title={poem.title}
              meta={poem.tags.join(", ") || "No tags"}
              status={poem.status as "draft" | "published"}
              editHref={`/admin/poems/${poem.id}`}
              accent="var(--purple-mid)"
            />
          ))}
        </div>
      )}
    </div>
  );
}
