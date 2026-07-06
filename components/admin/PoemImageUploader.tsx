"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { savePoemImageUrl } from "@/lib/actions/poems";

type UploadState = "idle" | "previewing" | "uploading" | "success" | "error";

/*
  PoemImageUploader — optional atmospheric mood image for poems.
  
  Visual direction: quiet, evocative images that feel like
  the visual memory of a line — not illustration, not decoration.
  
  Aspect ratio: 3:1 (panoramic / cinematic letterbox)
  This is narrower than chapter images and keeps the focus on the poem text.
  
  Bucket: book-covers / poems/ subfolder
  Max size: 8 MB
*/
export default function PoemImageUploader({
  poemId,
  currentUrl,
}: {
  poemId: string;
  currentUrl?: string | null;
}) {
  const [liveUrl, setLiveUrl]   = useState<string | null>(currentUrl ?? null);
  const [preview, setPreview]   = useState<string | null>(null);
  const [state, setState]       = useState<UploadState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const fileRef                 = useRef<HTMLInputElement>(null);
  const pendingFile             = useRef<File | null>(null);

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg("");

    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please choose an image file (JPG, PNG, or WebP).");
      setState("error");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg("Image must be under 8 MB.");
      setState("error");
      return;
    }

    pendingFile.current = file;
    setPreview(URL.createObjectURL(file));
    setState("previewing");
  };

  const handleUpload = async () => {
    const file = pendingFile.current;
    if (!file) return;
    setState("uploading");

    try {
      const supabase = createClient();
      const ext      = (file.name.split(".").pop() ?? "jpg").toLowerCase();
      const path     = `poems/${poemId}/mood-${Date.now()}.${ext}`;

      const { error: storageError } = await supabase.storage
        .from("book-covers")
        .upload(path, file, { upsert: true, contentType: file.type });

      if (storageError) throw new Error(storageError.message);

      const { data: { publicUrl } } = supabase.storage
        .from("book-covers")
        .getPublicUrl(path);

      await savePoemImageUrl(poemId, publicUrl);

      if (preview) URL.revokeObjectURL(preview);
      setLiveUrl(publicUrl);
      setPreview(null);
      setState("success");
      pendingFile.current = null;
      if (fileRef.current) fileRef.current.value = "";

    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Upload failed. Please try again.");
      setState("error");
    }
  };

  const handleCancel = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    pendingFile.current = null;
    setState(liveUrl ? "success" : "idle");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleRemove = async () => {
    try {
      await savePoemImageUrl(poemId, "");
      setLiveUrl(null);
      setState("idle");
    } catch {
      setErrorMsg("Could not remove image. Please try again.");
      setState("error");
    }
  };

  const displayUrl = preview ?? liveUrl;
  const isLoading  = state === "uploading";

  return (
    <div style={{ borderTop: "1px solid var(--lavender-border)", paddingTop: "1.75rem" }}>
      {/* Label */}
      <p style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.62rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "var(--muted)",
        marginBottom: "0.4rem",
      }}>
        Mood Image
        <span style={{ color: "var(--muted-light)", fontStyle: "normal", textTransform: "none", letterSpacing: "normal", fontSize: "0.7rem", marginLeft: "0.5rem" }}>
          (optional)
        </span>
      </p>
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.78rem",
        color: "var(--muted-light)",
        lineHeight: 1.55,
        marginBottom: "1.1rem",
        maxWidth: "480px",
      }}>
        A quiet atmospheric image shown above the poem. It should feel like a visual echo — not an illustration. If left empty, the poem opens with text only.
      </p>

      {/* 3:1 panoramic preview */}
      <div style={{
        width: "100%",
        maxWidth: "520px",
        aspectRatio: "3 / 1",
        borderRadius: "8px",
        overflow: "hidden",
        background: "var(--bg-soft)",
        border: "1.5px solid var(--lavender-border)",
        marginBottom: "1rem",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {displayUrl ? (
          <img
            src={displayUrl}
            alt="Poem mood image preview"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
          />
        ) : (
          <p style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.55rem",
            letterSpacing: "0.2em",
            color: "var(--muted-light)",
            textTransform: "uppercase",
          }}>
            No image — poem opens with text
          </p>
        )}

        {isLoading && (
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(30,16,64,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{
              width: "24px",
              height: "24px",
              border: "2.5px solid rgba(255,255,255,0.3)",
              borderTopColor: "white",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
            }} />
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>

        {state === "previewing" && (
          <>
            <Btn label="Upload Image" onClick={handleUpload} primary />
            <Btn label="Cancel" onClick={handleCancel} />
          </>
        )}

        {state === "uploading" && (
          <Status text="Uploading…" color="var(--muted)" />
        )}

        {state === "success" && (
          <>
            <Status text="✓ Image saved" color="var(--teal, #1d8a7e)" />
            <Btn label="Replace" onClick={() => fileRef.current?.click()} />
            <Btn label="Remove" onClick={handleRemove} />
          </>
        )}

        {state === "error" && (
          <>
            <Status text={errorMsg} color="var(--coral, #c0372c)" />
            <Btn label="Try Again" onClick={() => fileRef.current?.click()} />
          </>
        )}

        {(state === "idle") && !liveUrl && (
          <Btn label="Choose Image" onClick={() => fileRef.current?.click()} />
        )}

        {(state === "idle") && liveUrl && (
          <>
            <Btn label="Replace Image" onClick={() => fileRef.current?.click()} />
            <Btn label="Remove" onClick={handleRemove} />
          </>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleSelect}
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
}

function Btn({ label, onClick, primary = false }: { label: string; onClick: () => void; primary?: boolean }) {
  return (
    <button type="button" onClick={onClick} style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "0.78rem",
      fontWeight: primary ? 600 : 400,
      color: primary ? "white" : "var(--muted)",
      background: primary ? "var(--purple)" : "transparent",
      border: primary ? "none" : "1.5px solid var(--lavender-border)",
      padding: "0.55rem 1rem",
      borderRadius: "5px",
      cursor: "pointer",
    }}>
      {label}
    </button>
  );
}

function Status({ text, color }: { text: string; color: string }) {
  return (
    <p style={{
      fontFamily: "'DM Mono', monospace",
      fontSize: "0.6rem",
      letterSpacing: "0.12em",
      color,
      margin: 0,
    }}>
      {text}
    </p>
  );
}
