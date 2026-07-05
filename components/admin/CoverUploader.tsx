"use client";

import { useRef, useState, useTransition } from "react";
import { uploadCover } from "@/lib/actions/books";

interface Props {
  bookId: string;
  currentUrl?: string | null;
}

type UploadState = "idle" | "uploading" | "success" | "error";

export default function CoverUploader({ bookId, currentUrl }: Props) {
  const [state, setState] = useState<UploadState>("idle");
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type + size (max 5 MB)
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please select an image file (JPG, PNG, WebP).");
      setState("error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image must be under 5 MB.");
      setState("error");
      return;
    }

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setState("uploading");
    setErrorMsg("");

    const fd = new FormData();
    fd.append("cover", file);

    startTransition(async () => {
      try {
        await uploadCover(bookId, fd);
        setState("success");
      } catch (err: any) {
        setState("error");
        setErrorMsg(err?.message ?? "Upload failed. Please try again.");
        setPreview(currentUrl ?? null);
      }
    });
  }

  const isUploading = state === "uploading" || isPending;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>

      {/* Label */}
      <div>
        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: "0.35rem",
        }}>
          Cover Image
        </p>
        <p style={{ fontSize: "0.72rem", color: "var(--muted)", lineHeight: 1.5 }}>
          JPG, PNG or WebP · max 5 MB · recommended 600 × 900 px
        </p>
      </div>

      {/* Preview + upload zone */}
      <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>

        {/* Cover preview */}
        <div
          style={{
            width: "100px",
            height: "138px",
            borderRadius: "5px",
            overflow: "hidden",
            flexShrink: 0,
            border: "1.5px solid var(--lavender-border)",
            background: "var(--bg-soft)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {preview ? (
            <img
              src={preview}
              alt="Cover preview"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <span style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2rem",
              color: "var(--purple-light)",
              fontStyle: "italic",
            }}>
              ◻
            </span>
          )}

          {/* Uploading overlay */}
          {isUploading && (
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(255,255,255,0.78)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.5rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--purple)",
                animation: "pulse 1.4s ease-in-out infinite",
              }}>
                Uploading…
              </span>
            </div>
          )}
        </div>

        {/* Upload controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", flex: 1 }}>
          <button
            type="button"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.78rem",
              fontWeight: 500,
              color: isUploading ? "var(--muted)" : "var(--purple)",
              background: "transparent",
              border: "1.5px solid var(--purple-light)",
              borderRadius: "5px",
              padding: "0.55rem 1rem",
              cursor: isUploading ? "not-allowed" : "pointer",
              transition: "all 0.25s",
              textAlign: "left",
            }}
          >
            {preview ? "Replace cover →" : "Choose image →"}
          </button>

          {/* State feedback */}
          {state === "success" && (
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.56rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#2d8a5e",
            }}>
              ✓ Cover saved
            </p>
          )}
          {state === "error" && (
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.56rem",
              letterSpacing: "0.14em",
              color: "var(--coral)",
              lineHeight: 1.5,
            }}>
              ✕ {errorMsg}
            </p>
          )}
          {state === "idle" && preview && (
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.54rem",
              letterSpacing: "0.1em",
              color: "var(--muted)",
            }}>
              Cover uploaded
            </p>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}
