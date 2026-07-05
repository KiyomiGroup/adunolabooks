/*
  ── StudioCard ────────────────────────────────────────────────────────────────
  Content row/card for admin list views (books, chapters, poems).
  Keeps the studio feeling clean — no unnecessary columns or data.
*/
import Link from "next/link";

interface StudioCardProps {
  title: string;
  meta: string;
  status: "draft" | "published" | "archived";
  editHref: string;
  onDelete?: () => void;
  accent?: string;
}

const STATUS_STYLE: Record<string, React.CSSProperties> = {
  published: { background: "rgba(56,201,180,0.12)", color: "#1d8a7e" },
  draft:     { background: "var(--purple-light)",   color: "var(--purple-dark)" },
  archived:  { background: "rgba(125,112,96,0.1)",  color: "var(--muted)" },
};

export default function StudioCard({ title, meta, status, editHref, accent }: StudioCardProps) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "1.25rem",
      padding: "1.1rem 1.25rem",
      background: "var(--white)",
      border: "1.5px solid var(--lavender-border)",
      borderRadius: "8px",
      borderLeft: `3px solid ${accent || "var(--purple)"}`,
      transition: "box-shadow 0.2s",
    }}>
      {/* Title + meta */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.1rem",
          fontWeight: 400,
          color: "var(--ink)",
          margin: "0 0 0.2rem",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>{title}</p>
        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.58rem",
          color: "var(--muted-light)",
          letterSpacing: "0.1em",
          margin: 0,
        }}>{meta}</p>
      </div>

      {/* Status badge */}
      <span style={{
        ...STATUS_STYLE[status] || STATUS_STYLE.draft,
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.55rem",
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        padding: "0.25rem 0.65rem",
        borderRadius: "20px",
        whiteSpace: "nowrap",
        flexShrink: 0,
      }}>{status}</span>

      {/* Edit link */}
      <Link href={editHref} style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.74rem",
        fontWeight: 500,
        color: "var(--purple)",
        textDecoration: "none",
        padding: "0.4rem 0.85rem",
        border: "1.5px solid var(--purple-light)",
        borderRadius: "4px",
        whiteSpace: "nowrap",
        flexShrink: 0,
        transition: "all 0.2s",
      }}>Edit</Link>
    </div>
  );
}
