/*
  ── StudioField ───────────────────────────────────────────────────────────────
  Reusable form field for the admin writing studio.
  Designed for calm, low-friction use by an AuDHD + dyslexic writer:
  — large tap targets
  — clear labels
  — generous spacing
  — no visual clutter
  — helpful placeholder text
*/

interface FieldProps {
  label: string;
  name: string;
  type?: "text" | "textarea" | "select" | "number";
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  hint?: string;
  rows?: number;
  options?: { value: string; label: string }[];
}

const inputBase: React.CSSProperties = {
  width: "100%",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.95rem",
  color: "var(--ink)",
  background: "var(--white)",
  border: "1.5px solid var(--lavender-border)",
  borderRadius: "6px",
  padding: "0.85rem 1rem",
  outline: "none",
  lineHeight: 1.6,
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};

export default function StudioField({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
  hint,
  rows = 6,
  options,
}: FieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {/* Label */}
      <label
        htmlFor={name}
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.62rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--muted)",
          fontWeight: 400,
        }}
      >
        {label}
        {required && <span style={{ color: "var(--purple)", marginLeft: "0.25rem" }}>*</span>}
      </label>

      {/* Input */}
      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          required={required}
          placeholder={placeholder}
          defaultValue={defaultValue}
          style={{
            ...inputBase,
            resize: "vertical",
            minHeight: "160px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.95rem",
            lineHeight: 1.8,
          }}
        />
      ) : type === "select" ? (
        <select
          id={name}
          name={name}
          required={required}
          defaultValue={defaultValue}
          style={{ ...inputBase, cursor: "pointer" }}
        >
          {options?.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          defaultValue={defaultValue}
          style={inputBase}
        />
      )}

      {/* Hint text */}
      {hint && (
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.78rem",
          color: "var(--muted-light)",
          lineHeight: 1.5,
          margin: 0,
        }}>
          {hint}
        </p>
      )}
    </div>
  );
}
