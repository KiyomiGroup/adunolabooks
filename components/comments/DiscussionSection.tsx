/*
  ── DiscussionSection ─────────────────────────────────────────────────────
  Sprint 4B. Server Component — fetches the first page of comments and the
  signed-in reader's identity, then hands both to the client-side
  CommentsRoot which owns all further interaction. Rendered at the bottom
  of every published chapter (see the chapter reader page).
*/
import { createClient } from "@/lib/supabase/server";
import { getCommentsPage } from "@/lib/supabase/queries";
import CommentsRoot from "./CommentsRoot";
import type { DiscussionUser } from "./CommentThread";

export default async function DiscussionSection({
  chapterId,
  storySlug,
  chapterNumber,
}: {
  chapterId: string;
  storySlug: string;
  chapterNumber: number;
}) {
  const supabase = await createClient();

  const [{ roots, replies, hasMore }, { data: { user } }] = await Promise.all([
    getCommentsPage(chapterId, 0),
    supabase.auth.getUser(),
  ]);

  let currentUser: DiscussionUser | null = null;
  if (user) {
    const { data: profile } = await (supabase.from("profiles") as any)
      .select("username, display_name, avatar_url, is_admin")
      .eq("user_id", user.id)
      .single();

    currentUser = {
      id: user.id,
      isAdmin: !!profile?.is_admin,
      username: profile?.username ?? "",
      displayName: profile?.display_name ?? "",
      avatarUrl: profile?.avatar_url ?? null,
    };
  }

  return (
    <CommentsRoot
      chapterId={chapterId}
      storySlug={storySlug}
      chapterNumber={chapterNumber}
      initialRoots={roots}
      initialReplies={replies}
      initialHasMore={hasMore}
      currentUser={currentUser}
    />
  );
}
