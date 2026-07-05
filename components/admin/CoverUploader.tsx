"use client";

/*
  CoverUploader — uploads directly from the browser to Supabase Storage
  via XMLHttpRequest with real onprogress events for a percentage bar.

  Fix: uses the browser Supabase client to get the active session JWT,
  then sends that as the Bearer token — satisfying the authenticated INSERT policy.
  The anon key alone is not enough; the user's session token is required.
*/

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { saveCoverUrl } from "@/lib/actions/books";

interface Props {
  bookId: string;
  currentUrl?: string | null;
}

type UploadState = "idle" | "uploading" | "saving" | "success" | "error";

export default function CoverUploader({ bookId, currentUrl }: Props) {
  const [state, setState]       = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [preview, setPreview]   = useState<string | null>(currentUrl ?? null);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const xhrRef   = useRef<XMLHttpRequest | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
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

    // Get the active session JWT — this is what satisfies the authenticated policy
    const supabase = createClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.access_token) {
      setErrorMsg("Session expired — please refresh the page and log in again.");
      setState("error");
      return;
    }

    // Immediate local preview
    setPreview(URL.createObjectURL(file));
    setProgress(0);
    setState("uploading");
    setErrorMsg("");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const ext         = (file.name.split(".").pop() ?? "jpg").toLowerCase();
    const filePath    = `${bookId}/cover-${Date.now()}.${ext}`;
    const uploadUrl   = `${supabaseUrl}/storage/v1/object/book-covers/${filePath}`;

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    // Real upload progress
    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) {
        setProgress(Math.round((ev.loaded / ev.total) * 100));
      }
    };

    // Upload complete
    xhr.onload = async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setProgress(100);
        setState("saving");

        const publicUrl = `${supabaseUrl}/storage/v1/object/public/book-covers/${filePath}`;

        const result = await saveCoverUrl(bookId, publicUrl);
        if (result.success) {
          setPreview(publicUrl);
          setState("success");
        } else {
          setState("error");
          setErrorMsg(result.error ?? "Saved to storage but could not update the database.");
        }
      } else {
        let msg = `Upload failed (HTTP ${xhr.status}).`;
        try {
          const body = JSON.parse(xhr.responseText);
          if (body?.message) msg = body.message;
          if (body?.error)   msg = body.error;
        } catch { /* ignore */ }
        setState("error");
        setErrorMsg(msg);
        setPreview(currentUrl ?? null);
      }
    };

    xhr.onerror = () => {
      setState("error");
      setErrorMsg("Network error — check your connection and try again.");
      setPreview(currentUrl ?? null);
    };

    xhr.open("POST", uploadUrl);
    // Send the user's session JWT — satisfies the authenticated INSERT policy
    xhr.setRequestHeader("Authorization", `Bearer ${session.access_token}`);
    xhr.setRequestHeader("x-upsert", "true");
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    xhr.send(file);
  }

  function handleCancel() {
    xhrRef.current?.abort();
    setState("idle");
    setProgress(0);
    setPreview(currentUrl ?? null);
  }

  const isUploading = state === "uploading" || state === "saving";

  const barColor =
    state === "success" ? "#2d8a5e" :
    state === "error"   ? "var(--coral)" :
    "var(--purple)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>

      {/* Label */}
      <div>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.3rem" }}>
          Cover Image
        </p>
        <p style={{ fontSize: "0.72rem", color: "var(--muted)", lineHeight: 1.5 }}>
          JPG, PNG or WebP · max 5 MB · recommended 600 × 900 px
        </p>
      </div>

      {/* Preview + controls row */}
      <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>

        {/* Cover preview */}
        <div style={{
          width: "100px", height: "138px", borderRadius: "5px", overflow: "hidden",
          flexShrink: 0, border: "1.5px solid var(--lavender-border)",
          background: "var(--bg-soft)", display: "flex", alignItems: "center",
          justifyContent: "center", position: "relative",
        }}>
          {preview ? (
            <img src={preview} alt="Cover preview" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", color: "var(--purple-light)", fontStyle: "italic" }}>◻</span>
          )}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", flex: 1 }}>

          {/* Progress bar */}
          {(isUploading || state === "success" || state === "error") && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <div style={{ height: "4px", borderRadius: "4px", background: "var(--purple-light)", overflow: "hidden", width: "100%" }}>
                <div style={{
                  height: "100%", width: `${progress}%`, background: barColor,
                  borderRadius: "4px", transition: "width 0.25s ease, background 0.3s ease",
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", letterSpacing: "0.1em", color: state === "error" ? "var(--coral)" : "var(--muted)" }}>
                  {state === "uploading" && "Uploading…"}
                  {state === "saving"    && "Saving…"}
                  {state === "success"   && "✓ Cover saved"}
                  {state === "error"     && "✕ Upload failed"}
                </span>
                {state === "uploading" && (
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", color: "var(--purple)", fontWeight: 600 }}>
                    {progress}%
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Error detail */}
          {state === "error" && (
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", color: "var(--coral)", lineHeight: 1.55 }}>
              {errorMsg}
            </p>
          )}

          {/* Idle with existing cover */}
          {state === "idle" && preview && (
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", letterSpacing: "0.1em", color: "var(--muted)" }}>
              Cover uploaded
            </p>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              type="button"
              disabled={isUploading}
              onClick={() => { if (inputRef.current) { inputRef.current.value = ""; inputRef.current.click(); } }}
              style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: 500,
                color: isUploading ? "var(--muted)" : "var(--purple)",
                background: "transparent", border: "1.5px solid var(--purple-light)",
                borderRadius: "5px", padding: "0.5rem 0.9rem",
                cursor: isUploading ? "not-allowed" : "pointer",
              }}
            >
              {preview && state !== "error" ? "Replace →" : "Choose image →"}
            </button>

            {state === "uploading" && (
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem",
                  color: "var(--muted)", background: "transparent",
                  border: "1.5px solid var(--lavender-border)", borderRadius: "5px",
                  padding: "0.5rem 0.9rem", cursor: "pointer",
                }}
              >
                Cancel
              </button>
            )}
          </div>
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
