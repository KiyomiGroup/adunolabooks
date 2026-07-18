/*
  ── ErrorBanner ───────────────────────────────────────────────────────────────
  Soft error and success banners for auth and profile pages.
  Never crashes the page — just renders nothing if message is falsy.
*/

interface BannerProps {
  message: string | null | undefined;
  type?: "error" | "success";
}

export default function Banner({ message, type = "error" }: BannerProps) {
  if (!message) return null;

  const isSuccess = type === "success";
  return (
    <div style={{
      background: isSuccess ? "rgba(56,201,180,0.1)"  : "rgba(255,111,97,0.1)",
      border:     `1px solid ${isSuccess ? "rgba(56,201,180,0.3)" : "rgba(255,111,97,0.3)"}`,
      borderRadius: "7px",
      padding: "0.75rem 1rem",
      marginBottom: "1.25rem",
      fontFamily: "'DM Sans', sans-serif",
      fontSize: "0.84rem",
      color: isSuccess ? "#1d8a7e" : "var(--coral)",
      lineHeight: 1.5,
    }}>
      {message}
    </div>
  );
}
