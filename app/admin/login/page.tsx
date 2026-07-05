/*
  ── /admin/login ──────────────────────────────────────────────────────────────
  Single-field calm login page. No clutter — just get in and write.
*/
import { signIn } from "@/lib/actions/auth";

interface Props {
  searchParams: Promise<{ error?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-soft)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
    }}>
      <div style={{
        background: "var(--white)",
        border: "1.5px solid var(--lavender-border)",
        borderRadius: "12px",
        padding: "3rem",
        width: "100%",
        maxWidth: "380px",
        boxShadow: "0 4px 32px var(--lavender-shadow)",
      }}>
        {/* Brand */}
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.5rem",
          fontWeight: 500,
          color: "var(--purple-dark)",
          marginBottom: "0.25rem",
        }}>AdunolaBooks</p>
        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.58rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--muted-light)",
          marginBottom: "2.5rem",
        }}>Writing Studio</p>

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(255,111,97,0.1)",
            border: "1px solid rgba(255,111,97,0.25)",
            borderRadius: "6px",
            padding: "0.75rem 1rem",
            marginBottom: "1.5rem",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.82rem",
            color: "var(--coral)",
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form action={signIn} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label htmlFor="email" style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--muted)",
              display: "block",
              marginBottom: "0.5rem",
            }}>Email</label>
            <input id="email" name="email" type="email" required
              placeholder="you@example.com"
              style={{
                width: "100%",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.95rem",
                color: "var(--ink)",
                background: "var(--bg)",
                border: "1.5px solid var(--lavender-border)",
                borderRadius: "6px",
                padding: "0.85rem 1rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label htmlFor="password" style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--muted)",
              display: "block",
              marginBottom: "0.5rem",
            }}>Password</label>
            <input id="password" name="password" type="password" required
              style={{
                width: "100%",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.95rem",
                color: "var(--ink)",
                background: "var(--bg)",
                border: "1.5px solid var(--lavender-border)",
                borderRadius: "6px",
                padding: "0.85rem 1rem",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button type="submit" style={{
            background: "var(--purple)",
            color: "white",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.82rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            padding: "0.9rem",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            marginTop: "0.5rem",
            boxShadow: "0 2px 16px rgba(123,63,242,0.25)",
          }}>
            Enter the studio
          </button>
        </form>
      </div>
    </div>
  );
}
