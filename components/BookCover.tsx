"use client";

import { useState } from "react";
import { Accent } from "@/lib/stories-types";

const GRADIENTS: Record<Accent, string> = {
  purple: "linear-gradient(155deg, #6B2FE0 0%, #3D0F9E 100%)",
  teal:   "linear-gradient(155deg, #38C9B4 0%, #1d7a6e 100%)",
  coral:  "linear-gradient(155deg, #FF8A7E 0%, #C0372C 100%)",
  gold:   "linear-gradient(155deg, #F5C968 0%, #B9871A 100%)",
};

const LINE_WIDTHS = [88, 64, 76, 52, 70];

/*
  BookCover renders in two modes:
  
  1. Real image (coverUrl provided + not broken):
     — img is position:absolute; inset:0 so it fills the container
       regardless of the parent's flex/padding/justify-content rules.
     — onError falls back to the gradient placeholder silently.
  
  2. Gradient placeholder (no coverUrl, or image failed to load):
     — Same visual as Sprint 1/2.
     — Never shows a broken-image icon.
*/
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
  const [imgFailed, setImgFailed] = useState(false);

  const showImage = !!coverUrl && !imgFailed;
  const monogram  = title.trim().charAt(0).toUpperCase();

  return (
    <div
      className={`book-cover book-cover-${size}`}
      style={{
        background: showImage ? "#1a1040" : GRADIENTS[accent],
        /* Zero out flex-padding so the absolutely-positioned img fills edge-to-edge */
        padding: showImage ? 0 : undefined,
      }}
    >
      {showImage ? (
        /*
          position:absolute + inset:0 fills the .book-cover container
          (which already has position:relative in globals.css) regardless
          of the parent flex layout. This is the fix for images not
          stretching to fill the cover.
        */
        <img
          src={coverUrl!}
          alt={`Cover of ${title}`}
          onError={() => setImgFailed(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            display: "block",
            borderRadius: "inherit",
          }}
        />
      ) : (
        /* Gradient placeholder — identical to Sprint 1/2 */
        <>
          <span className="book-cover-fold" aria-hidden="true" />
          <div className="book-cover-lines" aria-hidden="true">
            {LINE_WIDTHS.map((w, i) => (
              <span key={i} style={{ width: `${w}%` }} />
            ))}
          </div>
          <span className="book-cover-monogram font-display" aria-hidden="true">
            {monogram}
          </span>
        </>
      )}
    </div>
  );
}
