"use client";
/*
  ── TopNav — Sprint 4A ───────────────────────────────────────────────────────
  NavAuthSection injected into nav-right, left of the existing "Start Reading"
  CTA. All Sprint 1/2/3 structure preserved exactly.
*/
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import NavAuthSection from "@/components/auth/NavAuthSection";

const NAV_LINKS = [
  { label: "Home",    href: "/" },
  { label: "Stories", href: "/stories" },
  { label: "Poems",   href: "/poems" },
  { label: "About",   href: "/about" },
] as const;

const SIDE_TABS = [
  { label: "Home",    href: "/" },
  { label: "Stories", href: "/stories" },
  { label: "Poems",   href: "/poems" },
  { label: "Menu",    href: null },
] as const;

const MENU_ITEMS = [
  { label: "Home",    href: "/",        num: "01" },
  { label: "Stories", href: "/stories", num: "02" },
  { label: "Poems",   href: "/poems",   num: "03" },
  { label: "About",   href: "/about",   num: "04" },
] as const;

export default function TopNav() {
  const pathname  = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const panelRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isStoryDetail = pathname.startsWith("/stories/") && !pathname.includes("/chapters/");
  const isStoriesPage = pathname === "/stories";
  const slug = isStoryDetail ? pathname.split("/")[2] : null;

  const ctaLabel =
    isStoryDetail  ? "Start Reading →" :
    isStoriesPage  ? "Browse →"         :
    "Browse Stories →";

  const ctaHref = isStoryDetail && slug
    ? `/stories/${slug}/chapters/1`
    : "/stories";

  const navIndex = (() => {
    if (pathname === "/")                return 1;
    if (pathname.startsWith("/stories")) return 2;
    if (pathname.startsWith("/poems"))   return 3;
    if (pathname.startsWith("/about"))   return 4;
    return 1;
  })();

  return (
    <>
      {/* ── Desktop nav ── */}
      <header className="top-nav-wrap">
        <nav className="top-nav" aria-label="Main navigation">
          <span className="nav-logo">AdunolaBooks</span>

          {NAV_LINKS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`tab-item ${isActive ? "active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}

          {/* nav-right: auth section + existing CTA */}
          <div className="nav-right">
            {/* Sprint 4A: reader auth state */}
            <NavAuthSection />
            <Link href="/stories" className="nav-cta">Start Reading</Link>
          </div>
        </nav>
      </header>

      {/* ── Mobile: side tabs ── */}
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {SIDE_TABS.map((item) => {
          if (item.href === null) {
            return (
              <button
                key="menu"
                className={`mobile-tab ${menuOpen ? "active" : ""}`}
                onClick={() => setMenuOpen(true)}
                aria-expanded={menuOpen}
                aria-label="Open menu"
              >
                Menu
              </button>
            );
          }
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-tab ${isActive ? "active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* ── Mobile: bottom bar ── */}
      <div className="mobile-bottom-bar">
        <Link href="/" className="mobile-home-btn" aria-label="Home">
          <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M3 9.5L10 3l7 6.5V17a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z"
              stroke="var(--purple-dark)" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M7.5 18v-5h5v5"
              stroke="var(--purple-dark)" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        </Link>
        <Link href={ctaHref} className="mobile-cta-btn">{ctaLabel}</Link>
        <div className="mobile-page-counter" aria-hidden="true">{navIndex} / 4</div>
      </div>

      {/* ── Mobile: full-screen overlay menu ── */}
      {menuOpen && (
        <div
          className={`mobile-menu-overlay ${menuOpen ? "is-open" : ""}`}
          onClick={() => setMenuOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div
            ref={panelRef}
            className="mobile-menu-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-menu-header">
              <span className="mobile-menu-logo">AdunolaBooks</span>
              <button
                className="mobile-menu-close"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <nav className="mobile-menu-nav" aria-label="Menu navigation">
              {MENU_ITEMS.map((item, i) => {
                const isActive =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`mobile-menu-link ${isActive ? "is-active" : ""}`}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    style={{ animationDelay: `${0.06 + i * 0.07}s` }}
                  >
                    <span className="mobile-menu-link-num">{item.num}</span>
                    <span className="mobile-menu-link-label">{item.label}</span>
                    <span className="mobile-menu-link-arrow" aria-hidden="true">→</span>
                  </Link>
                );
              })}

              {/* Sprint 4A: auth links inside mobile menu */}
              <MobileAuthLinks pathname={pathname} onClose={() => setMenuOpen(false)} />
            </nav>

            <div className="mobile-menu-footer">
              <p className="mobile-menu-footer-label">Literary Fiction Platform</p>
              <p className="mobile-menu-footer-copy">Serialized stories, one chapter at a time.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Mobile auth links inside overlay ── */
import { useEffect as useEffectMobile, useState as useStateMobile } from "react";
import { createClient } from "@/lib/supabase/client";
import { readerSignOut } from "@/lib/actions/reader-auth";

function MobileAuthLinks({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [ready, setReady]       = useState(false);

  useEffect(() => {
    createClient().auth.getUser().then(({ data: { user } }) => {
      setLoggedIn(!!user);
      setReady(true);
    });
  }, [pathname]);

  if (!ready) return null;

  const dividerStyle: React.CSSProperties = {
    borderTop: "1px solid var(--lavender-border)",
    margin: "0.5rem 0",
  };

  const linkStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 0",
    textDecoration: "none",
    color: "var(--muted)",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.9rem",
    fontWeight: 500,
    letterSpacing: "0.02em",
    borderTop: "1px solid var(--lavender-border)",
    transition: "color 0.2s",
  };

  if (!loggedIn) {
    return (
      <>
        <div style={dividerStyle} />
        <Link href="/auth/login"  style={linkStyle} onClick={onClose}>Sign In</Link>
        <Link href="/auth/signup" style={{ ...linkStyle, color: "var(--purple)" }} onClick={onClose}>
          Create Account
        </Link>
      </>
    );
  }

  return (
    <>
      <div style={dividerStyle} />
      <Link href="/profile"      style={linkStyle} onClick={onClose}>My Profile</Link>
      <Link href="/profile/edit" style={linkStyle} onClick={onClose}>Settings</Link>
      <form action={readerSignOut}>
        <button
          type="submit"
          style={{
            ...linkStyle,
            width: "100%",
            background: "none",
            border: "none",
            borderTop: "1px solid var(--lavender-border)",
            cursor: "pointer",
            textAlign: "left",
            padding: "1rem 0",
          }}
          onClick={onClose}
        >
          Sign Out
        </button>
      </form>
    </>
  );
}
