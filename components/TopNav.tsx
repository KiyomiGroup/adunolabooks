"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Home",    href: "/" },
  { label: "Stories", href: "/stories" },
  { label: "Poems",   href: "/poems" },
  { label: "About",   href: "/about" },
] as const;

export default function TopNav() {
  const pathname = usePathname();

  // Context-aware CTA label for the bottom bar
  const isStoryPage = pathname.startsWith("/stories/") && !pathname.includes("/chapters/");
  const isChapterPage = pathname.includes("/chapters/");
  const ctaLabel = isChapterPage ? "Continue Reading →" : isStoryPage ? "Start Reading →" : "Browse Stories →";
  const ctaHref = isChapterPage ? pathname : "/stories";

  return (
    <>
      {/* ── Desktop: horizontal bookmark-ribbon nav ── */}
      <header className="top-nav-wrap">
        <nav className="top-nav" aria-label="Main navigation">
          <span className="nav-logo">AdunolaBooks</span>

          {NAV_ITEMS.map((item) => {
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

      {/* ── Mobile layer 1: Top brand strip ── */}
      <div className="mobile-top-bar" aria-hidden="true">
        <span className="mobile-top-bar-logo">AdunolaBooks</span>
      </div>

      {/* ── Mobile layer 2: Side bookmark index tabs ── */}
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
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

      {/* ── Mobile layer 3: Bottom action bar ── */}
      <div className="mobile-bottom-bar">
        {/* Home circle */}
        <Link href="/" className="mobile-home-btn" aria-label="Home">
          ⌂
        </Link>

        {/* Context CTA */}
        <Link href={ctaHref} className="mobile-cta-btn">
          {ctaLabel}
        </Link>

        {/* Page indicator — shows current section */}
        <div className="mobile-page-counter" aria-hidden="true">
          {NAV_ITEMS.findIndex(i => i.href !== "/" && pathname.startsWith(i.href)) >= 0
            ? `${NAV_ITEMS.findIndex(i => i.href !== "/" && pathname.startsWith(i.href)) + 1}/${NAV_ITEMS.length}`
            : "1/4"
          }
        </div>
      </div>
    </>
  );
}
