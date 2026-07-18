/*
  ── AuthCard ──────────────────────────────────────────────────────────────────
  Shared wrapper for all auth pages (login, signup, forgot-password, reset).
  Keeps the literary atmosphere consistent with the admin login page.
  Centred on a soft lavender background with a warm white card.
*/
import Link from "next/link";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-soft)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem",
    }}>
      {/* Logo link back to site */}
      <Link
        href="/"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.1rem",
          fontWeight: 600,
          color: "var(--purple-dark)",
          textDecoration: "none",
          letterSpacing: "0.04em",
          marginBottom: "2rem",
        }}
      >
        AdunolaBooks
      </Link>

      {/* Card */}
      <div style={{
        background: "var(--white)",
        border: "1.5px solid var(--lavender-border)",
        borderRadius: "14px",
        padding: "2.5rem 2rem",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 4px 40px var(--lavender-shadow)",
      }}>
        {/* Title */}
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.65rem",
          fontWeight: 400,
          color: "var(--ink)",
          margin: "0 0 0.35rem",
          letterSpacing: "-0.01em",
          lineHeight: 1.2,
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.84rem",
            color: "var(--muted)",
            margin: "0 0 2rem",
            lineHeight: 1.6,
          }}>
            {subtitle}
          </p>
        )}

        {children}
      </div>

      {/* Below-card link */}
      {footer && (
        <div style={{
          marginTop: "1.25rem",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.82rem",
          color: "var(--muted)",
          textAlign: "center",
        }}>
          {footer}
        </div>
      )}
    </div>
  );
}
