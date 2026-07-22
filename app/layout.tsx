import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

/* ── Metadata ───────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AdunolaBooks — A Literary World",
    template: "%s",
  },
  description:
    "Enter the page. Serialized fiction, poetry, and immersive storytelling.",
  openGraph: {
    title: "AdunolaBooks",
    description: "A living book you can enter.",
    url: SITE_URL,
    siteName: "AdunolaBooks",
    type: "website",
    locale: "en_US",
    /* TODO: add a real social preview image at /public/og-image.jpg, then
       set images: ["/og-image.jpg"] here — left out rather than pointing
       to an asset that doesn't exist yet. */
  },
  twitter: {
    card: "summary_large_image",
    title: "AdunolaBooks",
    description: "A living book you can enter.",
  },
  robots: { index: true, follow: true },
};

/* ── Root Layout ────────────────────────────────────────────────────────── */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Mobile viewport — 100% width, no zoom, respects device width */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />

        {/* Google Fonts — Cormorant Garamond (display), DM Sans (body), DM Mono (utility) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
