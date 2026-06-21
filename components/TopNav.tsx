"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Home",    href: "/",        icon: "⌂" },
  { label: "Stories", href: "/stories", icon: "📖" },
  { label: "Poems",   href: "/poems",   icon: "✦" },
  { label: "About",   href: "/about",   icon: "◎" },
] as const;

export default function TopNav() {
  const pathname = usePathname();

  return (
    <>
      {/*
        Desktop — horizontal bookmark-ribbon nav
        Feels like a paper ribbon placed across the top of the page,
        with tab dividers that feel lifted and folded at the edges.
      */}
      <header className="top-nav-wrap">
        <nav className="top-nav" aria-label="Main navigation">

          {/* Logo — also acts as the bookmark head */}
          <span className="nav-logo">AdunolaBooks</span>

          {/* Book-divider tabs */}
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
            <Link href="/stories" className="nav-cta">
              Start Reading
            </Link>
          </div>
        </nav>
      </header>

      {/*
        Mobile — bottom navigation bar (journal-paper style)
        Follows the sketch: horizontal tabs at the bottom of the screen,
        each with a small icon and label. Active tab shows a bookmark notch.
      */}
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-tab ${isActive ? "active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="mobile-tab-icon" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
