/*
  ── AuthField ─────────────────────────────────────────────────────────────────
  Reusable labelled input for auth and profile forms.
  Matches StudioField aesthetics but tuned for public-facing use.
  Large tap targets, clear labels, generous spacing — dyslexia and
  AuDHD friendly (no clutter, obvious hierarchy).
*/

interface AuthFieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  hint?: string;
  autoComplete?: string;
  minLength?: number;
  maxLength?: number;
}

const base: React.CSSProperties = {
  width: "100%",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.95rem",
  color: "var(--ink)",
  background: "var(--bg)",
  border: "1.5px solid var(--lavender-border)",
  borderRadius: "7px",
  padding: "0.82rem 1rem",
  outline: "none",
  lineHeight: 1.5,
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

export default function AuthField({
  label, name, type = "text", required, placeholder,
  defaultValue, hint, autoComplete, minLength, maxLength,
}: AuthFieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
      <label
        htmlFor={name}
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--muted)",
        }}
      >
        {label}
        {required && <span style={{ color: "var(--purple)", marginLeft: "0.2rem" }}>*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        minLength={minLength}
        maxLength={maxLength}
        style={base}
      />
      {hint && (
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.76rem", color: "var(--muted-light)", margin: 0 }}>
          {hint}
        </p>
      )}
    </div>
  );
}
