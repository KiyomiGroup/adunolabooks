/*
  ── Shared types + pure utilities ────────────────────────────────────────────
  Importable by both Server and Client Components.
  Contains NO server-only imports (no next/headers, no Supabase server client).
  
  Client components (StoryCard, ChapterNav, etc.) import from here.
  Server pages import async accessors from lib/stories.ts.
*/

export type Accent = "purple" | "teal" | "coral" | "gold";

export interface Chapter {
  id: string;            /* DB row id — needed to scope discussion comments */
  number: number;
  title: string;
  subtitle?: string;
  prologue?: string;     /* Optional intro/epigraph before main content */
  publishedAt?: string;
  readTime?: string;
  status: "available" | "drafting";
  content?: string[];
}

export interface Story {
  id: number | string;
  slug: string;
  title: string;
  author: string;
  genre: string;
  status: "Ongoing" | "Complete";
  accent: Accent;
  excerpt: string;
  synopsis: string;
  lastUpdated: string;
  stats: { readers: string; avgReadTime: string };
  readingProgress: number;
  chapters: Chapter[];
}

export interface ChapterLookup {
  story: Story;
  chapter: Chapter;
  prevChapter: Chapter | null;
  nextChapter: Chapter | null;
}

export const ACCENT_COLORS: Record<Accent, { top: string; badge: string; badgeBg: string }> = {
  purple: { top: "var(--purple)", badge: "var(--purple-dark)", badgeBg: "var(--purple-light)" },
  teal:   { top: "var(--teal)",   badge: "#1d8a7e",            badgeBg: "rgba(56,201,180,0.14)" },
  coral:  { top: "var(--coral)",  badge: "#c0372c",            badgeBg: "rgba(255,111,97,0.12)" },
  gold:   { top: "var(--gold)",   badge: "#9a7212",            badgeBg: "rgba(245,185,66,0.16)" },
};

/* Pure sync utility — safe in client components */
export function getFirstAvailableChapter(story: Story): Chapter | undefined {
  return story.chapters.find((c) => c.status === "available");
}
