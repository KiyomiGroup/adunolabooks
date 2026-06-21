"use client";

import { Accent } from "@/lib/stories";

/*
  ── Book cover placeholder ────────────────────────────────────────────
  Sprint 3: replace the gradient/monogram render with an <img> once real
  cover uploads exist (admin dashboard). The visual language here echoes
  the open-book centerpiece on the homepage (manuscript lines, paper
  layering, soft purple family) so a real cover image can later drop in
  without breaking the surrounding rhythm of the page.
*/

const GRADIENTS: Record<Accent, string> = {
  purple: "linear-gradient(155deg, #6B2FE0 0%, #3D0F9E 100%)",
  teal: "linear-gradient(155deg, #38C9B4 0%, #1d7a6e 100%)",
  coral: "linear-gradient(155deg, #FF8A7E 0%, #C0372C 100%)",
  gold: "linear-gradient(155deg, #F5C968 0%, #B9871A 100%)",
};

const LINE_WIDTHS = [88, 64, 76, 52, 70];

export default function BookCover({
  title,
  accent,
  size = "md",
}: {
  title: string;
  accent: Accent;
  size?: "sm" | "md" | "lg";
}) {
  const monogram = title.trim().charAt(0).toUpperCase();

  return (
    <div className={`book-cover book-cover-${size}`} style={{ background: GRADIENTS[accent] }}>
      {/* Page-corner fold */}
      <span className="book-cover-fold" aria-hidden="true" />

      {/* Faint manuscript lines, lower portion */}
      <div className="book-cover-lines" aria-hidden="true">
        {LINE_WIDTHS.map((w, i) => (
          <span key={i} style={{ width: `${w}%` }} />
        ))}
      </div>

      {/* Monogram */}
      <span className="book-cover-monogram font-display" aria-hidden="true">
        {monogram}
      </span>
    </div>
  );
}
