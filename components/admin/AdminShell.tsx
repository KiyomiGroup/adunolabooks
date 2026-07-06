"use client";
/*
  ── Admin Shell ───────────────────────────────────────────────────────────────
  Desktop: calm top bar with horizontal nav links (unchanged).
  Mobile:  slim top bar + hamburger → full-screen drawer with large touch targets.
           AuDHD-friendly: uncluttered, generous spacing, one action at a time.
*/
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { signOut } from "@/lib/actions/auth";

const NAV = [
  { label: "Overview",  href: "/admin",          icon: "◎" },
  { label: "Books",     href: "/admin/books",     icon: "◻" },
  { label: "Chapters",  href: "/admin/chapters",  icon: "❧" },
  { label: "Poems",     href: "/admin/poems",     icon: "✦" },
] as const;

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>

      {/* ══════════════════════════════════════════════════════
          TOP BAR — shared across desktop + mobile
          Desktop shows full nav; mobile shows only logo + toggle
         ══════════════════════════════════════════════════════ */}
      <header style={{
        background: "var(--paper)",
        borderBottom: "1.5px solid var(--lavender-border)",
        boxShadow: "0 2px 16px var(--lavender-shadow)",
        position: "sticky", top: 0, zIndex: 200,
        padding: "0 1.5rem",
      }}>
        <div style={{
          maxWidth: "1000px", margin: "0 auto",
          display: "flex", alignItems: "center",
          height: "56px", gap: 0,
        }}>
          {/* Brand */}
          <Link href="/admin" style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1rem", fontWeight: 600,
            color: "var(--purple-dark)", textDecoration: "none",
            letterSpacing: "0.03em", whiteSpace: "nowrap",
            marginRight: "2rem", paddingRight: "2rem",
            borderRight: "1px solid var(--lavender-border)",
          }}>
            AdunolaBooks
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.5rem", letterSpacing: "0.2em",
              textTransform: "uppercase", color: "var(--muted-light)",
              marginLeft: "0.5rem", verticalAlign: "middle",
            }}>Studio</span>
          </Link>

          {/* Desktop nav */}
          <nav className="admin-desktop-nav" style={{ display: "flex", gap: 0, flex: 1 }}>
            {NAV.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href} style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.76rem", fontWeight: isActive ? 600 : 400,
                  color: isActive ? "var(--purple-dark)" : "var(--muted)",
                  textDecoration: "none",
                  padding: "0 1rem", height: "56px",
                  display: "flex", alignItems: "center",
                  borderBottom: isActive ? "2px solid var(--purple)" : "2px solid transparent",
                  transition: "color 0.2s, border-color 0.2s",
                  letterSpacing: "0.04em",
                }}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop: View site + sign out */}
          <div className="admin-desktop-actions" style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Link href="/" target="_blank" style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.58rem",
              letterSpacing: "0.16em", textTransform: "uppercase",
              color: "var(--muted-light)", textDecoration: "none",
            }}>
              View Site ↗
            </Link>
            <form action={signOut}>
              <button type="submit" style={{
                fontFamily: "'DM Mono', monospace", fontSize: "0.58rem",
                letterSpacing: "0.16em", textTransform: "uppercase",
                color: "var(--muted)", background: "none", border: "none",
                cursor: "pointer", padding: "0.4rem 0.75rem", borderRadius: "3px",
              }}>
                Sign Out
              </button>
            </form>
          </div>

          {/* Mobile: hamburger toggle */}
          <button
            className="admin-mobile-toggle"
            onClick={() => setDrawerOpen(!drawerOpen)}
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            aria-expanded={drawerOpen}
            style={{
              display: "none", // shown via CSS below 768px
              marginLeft: "auto",
              background: "none", border: "none", cursor: "pointer",
              padding: "0.5rem",
              color: "var(--purple-dark)",
            }}
          >
            {drawerOpen ? (
              // × close
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <line x1="4" y1="4" x2="18" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="18" y1="4" x2="4" y2="18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            ) : (
              // ☰ open
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <line x1="3" y1="6"  x2="19" y2="6"  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="3" y1="11" x2="19" y2="11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="3" y1="16" x2="19" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════
          MOBILE DRAWER — full-screen overlay
          Large touch targets, generous padding, calm hierarchy
         ══════════════════════════════════════════════════════ */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 190,
            background: "rgba(30, 16, 64, 0.45)",
            backdropFilter: "blur(2px)",
          }}
          aria-hidden="true"
        />
      )}

      <nav
        aria-label="Mobile admin navigation"
        style={{
          position: "fixed",
          top: "56px", right: 0, bottom: 0,
          width: "min(320px, 88vw)",
          background: "var(--paper)",
          borderLeft: "1.5px solid var(--lavender-border)",
          boxShadow: drawerOpen ? "-8px 0 32px rgba(30,16,64,0.14)" : "none",
          zIndex: 195,
          display: "flex",
          flexDirection: "column",
          padding: "1.5rem 0 2rem",
          transform: drawerOpen ? "translateX(0)" : "translateX(110%)",
          transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1), box-shadow 0.3s",
          overflowY: "auto",
        }}
      >
        {/* Section label */}
        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "0.52rem", letterSpacing: "0.24em",
          textTransform: "uppercase", color: "var(--muted-light)",
          padding: "0 1.75rem", marginBottom: "0.5rem",
        }}>
          Studio
        </p>

        {/* Nav items — large touch targets */}
        {NAV.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex", alignItems: "center", gap: "1rem",
                padding: "1rem 1.75rem",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "1.05rem", fontWeight: isActive ? 600 : 400,
                color: isActive ? "var(--purple-dark)" : "var(--ink)",
                textDecoration: "none",
                background: isActive ? "var(--purple-light)" : "transparent",
                borderLeft: isActive ? "3px solid var(--purple)" : "3px solid transparent",
                transition: "background 0.2s, border-color 0.2s",
                letterSpacing: "0.01em",
                minHeight: "52px", // generous tap target
              }}
            >
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.1rem", color: isActive ? "var(--purple)" : "var(--muted-light)",
                width: "20px", textAlign: "center",
                flexShrink: 0,
              }} aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}

        {/* Divider */}
        <div style={{ height: "1px", background: "var(--lavender-border)", margin: "1rem 1.75rem" }} />

        {/* View site */}
        <Link
          href="/"
          target="_blank"
          style={{
            display: "flex", alignItems: "center", gap: "1rem",
            padding: "0.85rem 1.75rem",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.9rem", color: "var(--muted)",
            textDecoration: "none", minHeight: "48px",
          }}
        >
          <span style={{ width: "20px", textAlign: "center", color: "var(--muted-light)", fontSize: "1rem" }} aria-hidden="true">↗</span>
          View Site
        </Link>

        {/* Sign out */}
        <form action={signOut} style={{ padding: "0 1.75rem 0" }}>
          <button
            type="submit"
            style={{
              display: "flex", alignItems: "center", gap: "1rem",
              width: "100%", padding: "0.85rem 0",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.9rem", color: "var(--muted)",
              background: "none", border: "none", cursor: "pointer",
              textAlign: "left", minHeight: "48px",
              letterSpacing: "0.01em",
            }}
          >
            <span style={{ width: "20px", textAlign: "center", color: "var(--muted-light)", fontSize: "1rem" }} aria-hidden="true">⎋</span>
            Sign Out
          </button>
        </form>
      </nav>

      {/* ══════════════════════════════════════════════════════
          CONTENT AREA
         ══════════════════════════════════════════════════════ */}
      <main style={{
        flex: 1, maxWidth: "1000px", margin: "0 auto",
        width: "100%", padding: "2.5rem 2.5rem 5rem",
      }}>
        {children}
      </main>

      {/* Scoped CSS — only affects admin, only at mobile widths */}
      <style>{`
        @media (max-width: 768px) {
          .admin-desktop-nav      { display: none !important; }
          .admin-desktop-actions  { display: none !important; }
          .admin-mobile-toggle    { display: flex !important; }
          main { padding: 1.5rem 1.25rem 5rem !important; }
        }
      `}</style>
    </div>
  );
}
