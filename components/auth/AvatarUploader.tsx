"use client";
/*
  ── AvatarUploader ────────────────────────────────────────────────────────────
  Client component for avatar upload + preview.
  Uses two separate forms so the actions are independent:
    1. Upload form  → uploadAvatar action
    2. Remove form  → removeAvatar action (only shown if avatar exists)

  Shows a live preview as soon as the reader selects a file,
  before they submit, so they can confirm before uploading.
*/
import { useState, useRef } from "react";
import { uploadAvatar, removeAvatar } from "@/lib/actions/profile";

interface AvatarUploaderProps {
  currentAvatarUrl: string | null;
  displayName: string;
}

export default function AvatarUploader({ currentAvatarUrl, displayName }: AvatarUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const initials = displayName[0]?.toUpperCase() ?? "?";
  const showImage = preview ?? currentAvatarUrl;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
      {/* Avatar preview */}
      <div style={{ flexShrink: 0 }}>
        {showImage ? (
          <img
            src={showImage}
            alt="Avatar preview"
            width={72}
            height={72}
            style={{ width: "72px", height: "72px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--purple-light)", display: "block" }}
          />
        ) : (
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "var(--purple-light)", border: "2px solid var(--lavender-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 400, color: "var(--purple-dark)", fontStyle: "italic", lineHeight: 1 }}>
              {initials}
            </span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {/* Upload form */}
        <form action={uploadAvatar}>
          <input
            ref={inputRef}
            type="file"
            name="avatar"
            accept="image/jpeg,image/png,image/webp,image/gif"
            style={{ display: "none" }}
            aria-label="Choose avatar image"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setPreview(url);
              }
            }}
          />
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.8rem",
                fontWeight: 500,
                color: "var(--purple)",
                background: "transparent",
                border: "1.5px solid var(--purple-light)",
                borderRadius: "6px",
                padding: "0.5rem 1rem",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {currentAvatarUrl ? "Change Photo" : "Upload Photo"}
            </button>

            {/* Upload submit — appears once a file is selected */}
            {preview && (
              <button
                type="submit"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "white",
                  background: "var(--purple)",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0.5rem 1rem",
                  cursor: "pointer",
                  boxShadow: "0 2px 10px rgba(123,63,242,0.2)",
                }}
              >
                Save Photo
              </button>
            )}
          </div>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", letterSpacing: "0.1em", color: "var(--muted-light)", marginTop: "0.4rem" }}>
            JPEG, PNG, WEBP or GIF · Max 5 MB
          </p>
        </form>

        {/* Remove form — only if avatar exists */}
        {currentAvatarUrl && !preview && (
          <form action={removeAvatar}>
            <button
              type="submit"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.76rem",
                color: "var(--muted)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              Remove photo
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
