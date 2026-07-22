/*
  ── SkeletonBlock ─────────────────────────────────────────────────────────
  A single shimmering placeholder rectangle, composed into page-specific
  skeletons inside loading.tsx files. Kept intentionally tiny and prop-only
  so it never needs client-side state.
*/
export default function SkeletonBlock({
  width = "100%",
  height = "1rem",
  radius = "8px",
  style,
}: {
  width?: string;
  height?: string;
  radius?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className="skeleton"
      aria-hidden="true"
      style={{ width, height, borderRadius: radius, ...style }}
    />
  );
}
