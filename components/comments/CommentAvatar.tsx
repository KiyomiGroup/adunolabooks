/*
  ── CommentAvatar ─────────────────────────────────────────────────────────
  Small reader avatar for the discussion list. Mirrors the image-or-monogram
  fallback pattern used on /profile, just sized down for a comment row.
*/
export default function CommentAvatar({
  avatarUrl,
  name,
  size = 40,
}: {
  avatarUrl: string | null | undefined;
  name: string;
  size?: number;
}) {
  const initial = name?.[0]?.toUpperCase() || "?";

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          border: "1.5px solid var(--purple-light)",
          flexShrink: 0,
          display: "block",
        }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "var(--purple-light)",
        border: "1.5px solid var(--lavender-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "italic",
          fontSize: size * 0.42,
          color: "var(--purple-dark)",
          lineHeight: 1,
        }}
      >
        {initial}
      </span>
    </div>
  );
}
