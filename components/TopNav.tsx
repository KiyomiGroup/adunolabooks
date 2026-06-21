"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Home",    href: "/" },
  { label: "About",   href: "/about" },
  { label: "Stories", href: "/stories" }, /* Sprint 2: chapter system */
  { label: "Poems",   href: "/poems" },   /* Sprint 2: poetry reader  */
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
        Mobile — side index tabs (journal dividers)
        Each tab is a physical index divider with a pointed right edge.
        Slides out slightly on hover like a real tab being pulled.
        Sprint 2: expand into full slide-out panel with reading state.
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
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
