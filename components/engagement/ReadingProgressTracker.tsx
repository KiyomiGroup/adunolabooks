"use client";
/*
  ── ReadingProgressTracker ───────────────────────────────────────────────
  Renders nothing. Mounted once on the chapter reader page; fires a single
  server action on mount to silently record that this reader opened this
  chapter — no button, no save state, no visible UI at all. Re-fires if the
  reader navigates to a different chapter without a full page reload
  (client-side nav keeps this component mounted, so we key off chapterId).

  Signed-out visitors: the server action itself no-ops (see
  lib/actions/engagement.ts) so this is safe to mount unconditionally, but
  we skip the call entirely when we already know there's no reader — no
  reason to round-trip for nothing.
*/
import { useEffect } from "react";
import { recordChapterView } from "@/lib/actions/engagement";

export default function ReadingProgressTracker({
  bookId,
  chapterId,
  chapterNumber,
  totalChapters,
  signedIn,
}: {
  bookId: string;
  chapterId: string;
  chapterNumber: number;
  totalChapters: number;
  signedIn: boolean;
}) {
  useEffect(() => {
    if (!signedIn) return;
    recordChapterView({ bookId, chapterId, chapterNumber, totalChapters }).catch(() => {
      /* Best-effort — a failed progress write should never disrupt reading. */
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterId, signedIn]);

  return null;
}
