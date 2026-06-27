import Link from "next/link";

export default function MobileBottomBar({
  ctaLabel,
  ctaHref,
  counterLabel,
  homeHref = "/",
}: {
  ctaLabel: string;
  ctaHref: string;
  counterLabel: string;
  homeHref?: string;
}) {
  return (
    <div className="mobile-bottom-bar u-mobile-only" style={{ display: "flex" }}>
      {/* Home circle */}
      <Link href={homeHref} className="mobile-home-btn" aria-label="Home">
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

      {/* Chapter / section counter */}
      <div className="mobile-page-counter" aria-label={counterLabel}>
        {counterLabel}
      </div>
    </div>
  );
}
