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

  const isStoryDetail  = pathname.startsWith("/stories/") && !pathname.includes("/chapters/");
  const isStoriesPage  = pathname === "/stories";

  // Derive slug from /stories/[slug] for direct chapter-1 link
  const slug = isStoryDetail ? pathname.split("/")[2] : null;

  const ctaLabel = isStoryDetail  ? "Start Reading →"
                 : isStoriesPage  ? "Browse →"
                 : "Browse Stories →";

  const ctaHref = isStoryDetail && slug
    ? `/stories/${slug}/chapters/1`
    : "/stories";

  // Counter: position of active section (HOME=1, STORIES=2, POEMS=3, ABOUT=4)
  const navIndex = (() => {
    if (pathname === "/")                            return 1;
    if (pathname.startsWith("/stories"))             return 2;
    if (pathname.startsWith("/poems"))               return 3;
    if (pathname.startsWith("/about"))               return 4;
    return 1;
  })();
  const counterLabel = `${navIndex} / 4`;

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

      {/* ── Mobile: side bookmark index tabs (right edge) ── */}
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {NAV_ITEMS.map((item) => {
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
        {/* Home circle */}
        <Link href="/" className="mobile-home-btn" aria-label="Home">
          <svg
            width="17"
            height="17"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M3 9.5L10 3l7 6.5V17a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z"
              stroke="var(--purple-dark)"
              strokeWidth="1.6"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M7.5 18v-5h5v5"
              stroke="var(--purple-dark)"
              strokeWidth="1.6"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </Link>

        {/* Context CTA */}
        <Link href={ctaHref} className="mobile-cta-btn">
          {ctaLabel}
        </Link>

        {/* Section counter */}
        <div className="mobile-page-counter" aria-hidden="true">
          {counterLabel}
        </div>
      </div>
    </>
  );
}
