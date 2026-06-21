"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ReaderHeader({
  storySlug,
  storyTitle,
  chapterNumber,
  chapterCount,
}: {
  storySlug: string;
  storyTitle: string;
  chapterNumber: number;
  chapterCount: number;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
      setProgress(pct);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="reader-header">
      <div className="reader-header-inner">
        <Link href={`/stories/${storySlug}`} className="reader-back-link">
          ← {storyTitle}
        </Link>

        <span className="reader-chapter-tag">
          Ch. {chapterNumber} / {chapterCount}
        </span>
      </div>

      {/* Reading progress placeholder — Sprint 3: persist per-reader position */}
      <div className="reader-progress-track" aria-hidden="true">
        <div className="reader-progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </header>
  );
}
