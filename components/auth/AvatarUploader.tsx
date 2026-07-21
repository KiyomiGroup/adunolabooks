"use client";

/*
  ── AvatarUploader (Sprint 4A.3) ─────────────────────────────────────────────
  Uploads directly from the browser to Supabase Storage via XMLHttpRequest,
  with real onprogress events — mirrors CoverUploader's pattern so avatar
  uploads behave consistently with cover uploads across the app.

  Flow:
    1. Reader picks a file → validated client-side (type + size) → instant
       local preview via an object URL.
    2. Browser uploads the file straight to the `reader-avatars` bucket,
       authenticated with the reader's session JWT (satisfies the storage
       RLS policy — only the signed-in user may write to their own folder).
    3. On success, saveAvatarUrl() (server action) writes the public URL to
       profiles.avatar_url and best-effort deletes the previous avatar file.

  No page navigation or refresh — all state updates happen in place.
*/

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { saveAvatarUrl, removeAvatar } from "@/lib/actions/profile";

interface AvatarUploaderProps {
  currentAvatarUrl: string | null;
  displayName: string;
}

type UploadState = "idle" | "uploading" | "saving" | "success" | "error";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export default function AvatarUploader({ currentAvatarUrl, displayName }: AvatarUploaderProps) {
  const [state, setState]       = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [preview, setPreview]   = useState<string | null>(currentAvatarUrl ?? null);
  const [errorMsg, setErrorMsg] = useState("");
  const [removing, setRemoving] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const xhrRef   = useRef<XMLHttpRequest | null>(null);

  const initials = (displayName[0] ?? "?").toUpperCase();
  const isUploading = state === "uploading" || state === "saving";

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    /* Client-side validation — JPG, JPEG, PNG, WEBP only */
    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      setErrorMsg("Unsupported image format. Please use JPG, PNG, or WEBP.");
      setState("error");
      return;
    }
    if (file.size > MAX_SIZE) {
      setErrorMsg("File exceeds the 5 MB maximum size.");
      setState("error");
      return;
    }

    /* Session JWT — required to satisfy the authenticated-upload RLS policy */
    const supabase = createClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      setErrorMsg("Session expired — please refresh the page and log in again.");
      setState("error");
      return;
    }

    /* Instant local preview, before the upload even starts */
    setPreview(URL.createObjectURL(file));
    setProgress(0);
    setState("uploading");
    setErrorMsg("");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    /* Unique filename per upload: {user_id}/{timestamp}.{ext} — avoids
       collisions, never overwrites another reader's file, and busts any
       CDN/browser cache so the new avatar shows immediately everywhere. */
    const filePath  = `${session.user.id}/${Date.now()}.${ext}`;
    const uploadUrl = `${supabaseUrl}/storage/v1/object/reader-avatars/${filePath}`;

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) {
        setProgress(Math.round((ev.loaded / ev.total) * 100));
      }
    };

    xhr.onload = async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setProgress(100);
        setState("saving");

        const publicUrl = `${supabaseUrl}/storage/v1/object/public/reader-avatars/${filePath}`;
        const result = await saveAvatarUrl(publicUrl);

        if (result.success) {
          setPreview(publicUrl);
          setState("success");
        } else {
          setState("error");
          setErrorMsg(result.error ?? "Uploaded, but couldn't update your profile.");
          setPreview(currentAvatarUrl ?? null);
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
        setPreview(currentAvatarUrl ?? null);
      }
    };

    xhr.onerror = () => {
      setState("error");
      setErrorMsg("Network error — check your connection and try again.");
      setPreview(currentAvatarUrl ?? null);
    };

    xhr.open("POST", uploadUrl);
    xhr.setRequestHeader("Authorization", `Bearer ${session.access_token}`);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  }

  function handleCancel() {
    xhrRef.current?.abort();
    setState("idle");
    setProgress(0);
    setErrorMsg("");
    setPreview(currentAvatarUrl ?? null);
  }

  async function handleRemove() {
    setRemoving(true);
    setErrorMsg("");
    const result = await removeAvatar();
    setRemoving(false);

    if (result.success) {
      setPreview(null);
      setState("idle");
    } else {
      setErrorMsg(result.error ?? "Couldn't remove your avatar. Please try again.");
      setState("error");
    }
  }

  const barColor =
    state === "success" ? "#2d8a5e" :
    state === "error"   ? "var(--coral)" :
    "var(--purple)";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
      {/* Avatar preview — small portrait, soft border, circular */}
      <div style={{ flexShrink: 0 }}>
        {preview ? (
          <img
            src={preview}
            alt="Avatar preview"
            width={72}
            height={72}
            loading="lazy"
            style={{
              width: "72px", height: "72px", borderRadius: "50%", objectFit: "cover",
              border: "2px solid var(--purple-light)", display: "block",
            }}
          />
        ) : (
          <div style={{
            width: "72px", height: "72px", borderRadius: "50%",
            background: "var(--purple-light)", border: "2px solid var(--lavender-border)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 400,
              color: "var(--purple-dark)", fontStyle: "italic", lineHeight: 1,
            }}>
              {initials}
            </span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", flex: 1, minWidth: "220px" }}>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", letterSpacing: "0.1em", color: "var(--muted-light)", margin: 0 }}>
          JPG, PNG or WEBP · Max 5 MB
        </p>

        {/* Progress bar — shown while uploading/saving, and to hold the result state */}
        {(isUploading || state === "success" || state === "error") && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <div style={{ height: "4px", borderRadius: "4px", background: "var(--purple-light)", overflow: "hidden", width: "100%", maxWidth: "260px" }}>
              <div style={{
                height: "100%", width: `${progress}%`, background: barColor,
                borderRadius: "4px", transition: "width 0.25s ease, background 0.3s ease",
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "260px" }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", letterSpacing: "0.06em", color: state === "error" ? "var(--coral)" : "var(--muted)" }}>
                {state === "uploading" && "Uploading…"}
                {state === "saving"    && "Saving…"}
                {state === "success"   && "✓ Avatar updated successfully."}
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

        {state === "error" && errorMsg && (
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.54rem", color: "var(--coral)", lineHeight: 1.55, margin: 0 }}>
            {errorMsg}
          </p>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            type="button"
            disabled={isUploading || removing}
            onClick={() => { if (inputRef.current) { inputRef.current.value = ""; inputRef.current.click(); } }}
            style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", fontWeight: 500,
              color: (isUploading || removing) ? "var(--muted)" : "var(--purple)",
              background: "transparent", border: "1.5px solid var(--purple-light)",
              borderRadius: "6px", padding: "0.5rem 1rem",
              cursor: (isUploading || removing) ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {preview ? "Replace Photo" : "Upload Photo"}
          </button>

          {isUploading && (
            <button
              type="button"
              onClick={handleCancel}
              style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem",
                color: "var(--muted)", background: "transparent",
                border: "1.5px solid var(--lavender-border)", borderRadius: "6px",
                padding: "0.5rem 1rem", cursor: "pointer",
              }}
            >
              Cancel
            </button>
          )}

          {preview && !isUploading && (
            <button
              type="button"
              disabled={removing}
              onClick={handleRemove}
              style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.76rem",
                color: "var(--muted)", background: "none", border: "none",
                cursor: removing ? "not-allowed" : "pointer", padding: "0.5rem 0",
                textDecoration: "underline", textUnderlineOffset: "3px",
              }}
            >
              {removing ? "Removing…" : "Remove photo"}
            </button>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        aria-label="Choose avatar image"
        onChange={handleFileChange}
      />
    </div>
  );
}
