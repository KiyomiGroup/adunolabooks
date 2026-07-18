"use client";
/*
  ── AuthButton ────────────────────────────────────────────────────────────────
  Submit button with pending state for auth forms.
  Uses React 19 useFormStatus for native form pending detection.
*/
import { useFormStatus } from "react-dom";

interface AuthButtonProps {
  label: string;
  pendingLabel?: string;
}

export default function AuthButton({ label, pendingLabel }: AuthButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        width: "100%",
        background: pending ? "var(--purple-mid)" : "var(--purple)",
        color: "white",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.88rem",
        fontWeight: 600,
        letterSpacing: "0.06em",
        padding: "0.88rem",
        border: "none",
        borderRadius: "7px",
        cursor: pending ? "not-allowed" : "pointer",
        marginTop: "0.5rem",
        boxShadow: pending ? "none" : "0 2px 16px rgba(123,63,242,0.25)",
        transition: "background 0.2s, box-shadow 0.2s",
      }}
    >
      {pending ? (pendingLabel ?? "Please wait…") : label}
    </button>
  );
}
