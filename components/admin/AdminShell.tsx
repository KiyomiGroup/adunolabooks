"use client";
/*
  ── Admin Shell ───────────────────────────────────────────────────────────────
  The quiet writing studio wrapper for all /admin/* pages.
  Deliberately calm: no sidebar clutter, just a soft top bar with the
  current section and a sign-out link. The content area breathes.
*/
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/actions/auth";

const NAV = [
  { label: "Overview",  href: "/admin" },
  { label: "Books",     href: "/admin/books" },
  { label: "Chapters",  href: "/admin/chapters" },
  { label: "Poems",     href: "/admin/poems" },
] as const;

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header style={{
        background: "var(--paper)",
        borderBottom: "1.5px solid var(--lavender-border)",
        boxShadow: "0 2px 16px var(--lavender-shadow)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        padding: "0 2.5rem",
      }}>
        <div style={{
          maxWidth: "1000px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: "0",
          height: "56px",
        }}>
          {/* Brand */}
          <Link href="/admin" style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1rem",
            fontWeight: 600,
            color: "var(--purple-dark)",
            textDecoration: "none",
            letterSpacing: "0.03em",
            marginRight: "2rem",
            paddingRight: "2rem",
            borderRight: "1px solid var(--lavender-border)",
            whiteSpace: "nowrap",
          }}>
            AdunolaBooks
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.5rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--muted-light)",
              marginLeft: "0.5rem",
              verticalAlign: "middle",
            }}>Studio</span>
          </Link>

          {/* Nav links */}
          <nav style={{ display: "flex", gap: "0", flex: 1 }}>
            {NAV.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.76rem",
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "var(--purple-dark)" : "var(--muted)",
                    textDecoration: "none",
                    padding: "0 1rem",
                    height: "56px",
                    display: "flex",
                    alignItems: "center",
                    borderBottom: isActive ? "2px solid var(--purple)" : "2px solid transparent",
                    transition: "color 0.2s, border-color 0.2s",
                    letterSpacing: "0.04em",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* View site + sign out */}
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Link href="/" target="_blank" style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.58rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--muted-light)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}>
              View Site ↗
            </Link>
            <form action={signOut}>
              <button type="submit" style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.58rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "var(--muted)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.4rem 0.75rem",
                borderRadius: "3px",
                transition: "background 0.2s, color 0.2s",
              }}>
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* ── Content area ────────────────────────────────────────── */}
      <main style={{ flex: 1, maxWidth: "1000px", margin: "0 auto", width: "100%", padding: "2.5rem 2.5rem 5rem" }}>
        {children}
      </main>
    </div>
  );
}
