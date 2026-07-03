"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { label: "Home",    href: "/" },
  { label: "Stories", href: "/stories" },
  { label: "Poems",   href: "/poems" },
  { label: "About",   href: "/about" },
] as const;

// Side tabs: first 3 are nav links, 4th opens the menu overlay
const SIDE_TABS = [
  { label: "Home",    href: "/" },
  { label: "Stories", href: "/stories" },
  { label: "Poems",   href: "/poems" },
  { label: "Menu",    href: null },  // null = opens overlay
] as const;

const MENU_ITEMS = [
  { label: "Home",      href: "/" },
  { label: "Stories",   href: "/stories" },
  { label: "Poems",     href: "/poems" },
  { label: "About",     href: "/about" },
] as const;

export default function TopNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isStoryDetail = pathname.startsWith("/stories/") && !pathname.includes("/chapters/");
  const isStoriesPage = pathname === "/stories";
  const slug = isStoryDetail ? pathname.split("/")[2] : null;

  const ctaLabel =
    isStoryDetail  ? "Start Reading →" :
    isStoriesPage  ? "Browse →" :
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
      {/* ── Desktop: horizontal bookmark-ribbon nav ── */}
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

          <div className="nav-right">
            <Link href="/stories" className="nav-cta">Start Reading</Link>
          </div>
        </nav>
      </header>

      {/* ── Mobile: side bookmark tabs (right edge) ── */}
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {SIDE_TABS.map((item) => {
          if (item.href === null) {
            // Menu button — opens overlay
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
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
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

      {/* ── Mobile: bottom action bar ── */}
      <div className="mobile-bottom-bar">
        <Link href="/" className="mobile-home-btn" aria-label="Home">
          <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M3 9.5L10 3l7 6.5V17a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z"
              stroke="var(--purple-dark)" strokeWidth="1.6" strokeLinejoin="round"
            />
            <path
              d="M7.5 18v-5h5v5"
              stroke="var(--purple-dark)" strokeWidth="1.6" strokeLinejoin="round"
            />
          </svg>
        </Link>

        <Link href={ctaHref} className="mobile-cta-btn">
          {ctaLabel}
        </Link>

        <div className="mobile-page-counter" aria-hidden="true">
          {navIndex} / 4
        </div>
      </div>

      {/* ── Mobile: menu overlay ── */}
      {menuOpen && (
        <div
          className="mobile-menu-overlay"
          onClick={() => setMenuOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div
            className="mobile-menu-panel"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mobile-menu-header">
              <span className="mobile-menu-logo">AdunolaBooks</span>
              <button
                className="mobile-menu-close"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            {/* Nav links */}
            <nav className="mobile-menu-nav" aria-label="Menu navigation">
              {MENU_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="mobile-menu-link"
                  onClick={() => setMenuOpen(false)}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.label}
                  <span className="mobile-menu-link-arrow" aria-hidden="true">→</span>
                </Link>
              ))}
            </nav>

            {/* Footer */}
            <div className="mobile-menu-footer">
              <p className="mobile-menu-footer-label">Literary Fiction Platform</p>
              <p className="mobile-menu-footer-copy">
                Serialized stories, one chapter at a time.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
