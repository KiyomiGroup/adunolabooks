/*
  ── /admin — Dashboard overview ───────────────────────────────────────────────
  Calm, minimal. Shows counts and quick actions. No charts or analytics.
*/
import Link from "next/link";
import { adminGetAllBooks, adminGetAllChapters, adminGetAllPoems } from "@/lib/supabase/queries";

export default async function AdminDashboard() {
  const [books, chapters, poems] = await Promise.all([
    adminGetAllBooks(),
    adminGetAllChapters(),
    adminGetAllPoems(),
  ]);

  const publishedBooks    = books.filter((b) => b.status === "published").length;
  const publishedChapters = chapters.filter((c) => c.status === "published").length;
  const draftChapters     = chapters.filter((c) => c.status === "draft").length;
  const publishedPoems    = poems.filter((p) => p.status === "published").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>

      {/* Header */}
      <div style={{ paddingTop: "0.5rem" }}>
        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "var(--purple)",
          marginBottom: "0.5rem",
        }}>Good to see you</p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "2.25rem",
          fontWeight: 400,
          color: "var(--ink)",
          margin: 0,
          lineHeight: 1.1,
        }}>
          Writing Studio
        </h1>
      </div>

      {/* Stat tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        {[
          { value: publishedBooks,    label: "Published Books",    sub: `${books.length} total`,    href: "/admin/books"    },
          { value: publishedChapters, label: "Published Chapters", sub: `${draftChapters} drafts`,  href: "/admin/chapters" },
          { value: draftChapters,     label: "Chapters in Draft",  sub: "ready to publish",         href: "/admin/chapters" },
          { value: publishedPoems,    label: "Published Poems",    sub: `${poems.length} total`,    href: "/admin/poems"    },
        ].map((tile) => (
          <Link key={tile.label} href={tile.href} style={{ textDecoration: "none" }}>
            <div style={{
              background: "var(--white)",
              border: "1.5px solid var(--lavender-border)",
              borderRadius: "10px",
              padding: "1.5rem",
              transition: "box-shadow 0.2s",
            }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "2.5rem",
                fontWeight: 500,
                color: "var(--purple)",
                margin: "0 0 0.25rem",
                lineHeight: 1,
              }}>{tile.value}</p>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.8rem",
                color: "var(--ink)",
                margin: "0 0 0.2rem",
                fontWeight: 500,
              }}>{tile.label}</p>
              <p style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.58rem",
                color: "var(--muted-light)",
                margin: 0,
                letterSpacing: "0.1em",
              }}>{tile.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: "1rem",
        }}>Quick actions</p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {[
            { label: "New chapter",  href: "/admin/chapters/new", primary: true  },
            { label: "New book",     href: "/admin/books/new",    primary: false  },
            { label: "New poem",     href: "/admin/poems/new",    primary: false  },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.82rem",
                fontWeight: 500,
                color: action.primary ? "white" : "var(--purple)",
                background: action.primary ? "var(--purple)" : "transparent",
                textDecoration: "none",
                padding: "0.65rem 1.35rem",
                borderRadius: "6px",
                border: "1.5px solid",
                borderColor: action.primary ? "var(--purple)" : "var(--purple-light)",
                boxShadow: action.primary ? "0 2px 12px rgba(123,63,242,0.22)" : "none",
                transition: "all 0.2s",
              }}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent drafts */}
      {draftChapters > 0 && (
        <div>
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: "0.75rem",
          }}>Chapters waiting to publish</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {chapters
              .filter((c) => c.status === "draft")
              .slice(0, 5)
              .map((c) => (
                <Link
                  key={c.id}
                  href={`/admin/chapters/${c.id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.9rem 1.1rem",
                    background: "var(--white)",
                    border: "1.5px solid var(--lavender-border)",
                    borderRadius: "6px",
                    borderLeft: "3px solid var(--purple-light)",
                    textDecoration: "none",
                    transition: "border-left-color 0.2s",
                  }}
                >
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1rem",
                    color: "var(--ink)",
                  }}>
                    Ch. {c.chapter_number} — {c.title}
                  </span>
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.56rem",
                    color: "var(--purple)",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}>Edit →</span>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
