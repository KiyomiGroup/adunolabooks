/*
  ── Wave dividers ─────────────────────────────────────────────────────
  Same curved-paper pattern used between sections on the homepage
  (see app/page.tsx). Pulled into a shared component so the new Sprint 2
  pages can reuse it without duplicating the SVG paths inline, and
  without touching the Sprint 1 homepage file.
*/

export function WaveDown({ fill = "#FDFBFF" }: { fill?: string }) {
  // Concave wave — the paper scoops downward, next sheet rises beneath
  return (
    <div className="wave-divider" aria-hidden="true">
      <svg viewBox="0 0 1440 64" preserveAspectRatio="none" style={{ height: "64px" }}>
        <path
          d="M0,0 C240,64 480,64 720,32 C960,0 1200,0 1440,40 L1440,64 L0,64 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

export function WaveUp({ fill = "#FDFBFF" }: { fill?: string }) {
  // Convex wave — the current sheet curls upward at its bottom
  return (
    <div className="wave-divider" aria-hidden="true">
      <svg viewBox="0 0 1440 64" preserveAspectRatio="none" style={{ height: "64px" }}>
        <path
          d="M0,40 C240,0 480,0 720,32 C960,64 1200,64 1440,24 L1440,64 L0,64 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
