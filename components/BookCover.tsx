"use client";

import { Accent } from "@/lib/stories-types";

const GRADIENTS: Record<Accent, string> = {
  purple: "linear-gradient(155deg, #6B2FE0 0%, #3D0F9E 100%)",
  teal:   "linear-gradient(155deg, #38C9B4 0%, #1d7a6e 100%)",
  coral:  "linear-gradient(155deg, #FF8A7E 0%, #C0372C 100%)",
  gold:   "linear-gradient(155deg, #F5C968 0%, #B9871A 100%)",
};

const LINE_WIDTHS = [88, 64, 76, 52, 70];

export default function BookCover({
  title,
  accent,
  coverUrl,
  size = "md",
}: {
  title: string;
  accent: Accent;
  coverUrl?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  // If a real cover image exists, render it directly
  if (coverUrl) {
    return (
      <div className={`book-cover book-cover-${size}`} style={{ background: "#1a1040", padding: 0 }}>
        <img
          src={coverUrl}
          alt={`${title} cover`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            borderRadius: "inherit",
          }}
        />
      </div>
    );
  }

  // Fallback: gradient placeholder with monogram + manuscript lines
  const monogram = title.trim().charAt(0).toUpperCase();

  return (
    <div className={`book-cover book-cover-${size}`} style={{ background: GRADIENTS[accent] }}>
      <span className="book-cover-fold" aria-hidden="true" />
      <div className="book-cover-lines" aria-hidden="true">
        {LINE_WIDTHS.map((w, i) => (
          <span key={i} style={{ width: `${w}%` }} />
        ))}
      </div>
      <span className="book-cover-monogram font-display" aria-hidden="true">
        {monogram}
      </span>
    </div>
  );
}
