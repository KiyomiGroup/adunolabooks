"use client";
/*
  ── CommentForm ───────────────────────────────────────────────────────────
  One reusable textarea + submit control for three contexts: a new
  top-level comment, a reply, and editing an existing comment. The parent
  decides what "submit" means via onSubmit; this component only owns the
  input state, pending state, and inline validation/error message.
*/
import { useState } from "react";

const MAX_LENGTH = 4000;

export default function CommentForm({
  placeholder,
  submitLabel = "Post",
  initialValue = "",
  autoFocus = false,
  compact = false,
  onSubmit,
  onCancel,
}: {
  placeholder: string;
  submitLabel?: string;
  initialValue?: string;
  autoFocus?: boolean;
  compact?: boolean;
  onSubmit: (content: string) => Promise<{ success: boolean; error?: string }>;
  onCancel?: () => void;
}) {
  const [value, setValue] = useState(initialValue);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmed = value.trim();
  const disabled = pending || trimmed.length === 0 || trimmed.length > MAX_LENGTH;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (disabled) return;
    setPending(true);
    setError(null);

    const result = await onSubmit(trimmed);

    if (!result.success) {
      setError(result.error ?? "Something went wrong. Please try again.");
      setPending(false);
      return;
    }

    setPending(false);
    if (initialValue) {
      /* Edit form — parent unmounts/collapses this on success, nothing else to do. */
      return;
    }
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label={placeholder}
        rows={compact ? 2 : 3}
        maxLength={MAX_LENGTH + 200}
        style={{
          width: "100%",
          resize: "vertical",
          minHeight: compact ? "3.2rem" : "4.5rem",
          padding: "0.85rem 1rem",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.92rem",
          lineHeight: 1.65,
          color: "var(--ink)",
          background: "var(--paper)",
          border: "1.5px solid var(--lavender-border)",
          borderRadius: "10px",
          outline: "none",
          transition: "border-color 0.2s var(--ease-paper)",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.6rem", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          {error && (
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: "var(--coral)" }}>
              {error}
            </span>
          )}
          {trimmed.length > MAX_LENGTH && (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: "var(--coral)" }}>
              {trimmed.length} / {MAX_LENGTH}
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: "0.6rem", flexShrink: 0 }}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={pending}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.8rem",
                fontWeight: 500,
                color: "var(--muted)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "0.55rem 0.75rem",
              }}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={disabled}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.82rem",
              fontWeight: 500,
              color: "var(--white)",
              background: disabled ? "var(--muted-light)" : "var(--purple)",
              border: "none",
              borderRadius: "7px",
              padding: "0.6rem 1.4rem",
              cursor: disabled ? "not-allowed" : "pointer",
              transition: "background 0.2s var(--ease-paper)",
            }}
          >
            {pending ? "Posting…" : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
