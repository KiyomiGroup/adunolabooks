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

  return (
    <>
      {/* Desktop — horizontal bookmark-ribbon nav */}
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
            <Link href="/stories" className="nav-cta">
              Start Reading
            </Link>
          </div>
        </nav>
      </header>

      {/*
        Mobile — side index bookmark tabs
        Fixed to the right edge, vertical text, pointed left notch.
        Each tab is a different purple tint like a coloured index divider.
        Active tab slides out slightly toward the reader.
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
