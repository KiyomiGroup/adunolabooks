"use server";
/*
  ── Profile server actions ─────────────────────────────────────────────────────
  All profile mutations. RLS in Supabase enforces that users can only
  modify their own profile — the server action just calls the DB.
*/
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/* ── Update profile text fields ─────────────────────────────────────────── */
export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const displayName = (formData.get("display_name") as string).trim();
  const username    = (formData.get("username")    as string).trim().toLowerCase();
  const bio         = (formData.get("bio")          as string).trim();

  /* Validate username format client-side too, but double-check here */
  if (!/^[a-z0-9_]{3,30}$/.test(username)) {
    redirect("/profile/edit?error=Username+must+be+3-30+characters%2C+lowercase+letters%2C+numbers+or+underscores");
  }

  const { error } = await (supabase.from("profiles") as any)
    .update({ display_name: displayName, username, bio })
    .eq("user_id", user.id);

  if (error) {
    const msg = error.message.includes("unique")
      ? "That+username+is+already+taken"
      : encodeURIComponent(error.message);
    redirect(`/profile/edit?error=${msg}`);
  }

  revalidatePath("/profile");
  revalidatePath("/profile/edit");
  redirect("/profile?saved=true");
}

/* ── Save avatar URL (Sprint 4A.3) ───────────────────────────────────────────
   Mirrors saveCoverUrl: the browser uploads the file directly to Supabase
   Storage via XHR (see AvatarUploader), then this action's only job is to
   write the resulting public URL into profiles.avatar_url. Never handles
   file bytes itself — no server timeout, no stuck upload state.
   Also best-effort deletes the reader's previous avatar file so storage
   doesn't accumulate orphaned images. */
export async function saveAvatarUrl(
  publicUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Not authenticated." };
    }

    const { data: existing } = await (supabase.from("profiles") as any)
      .select("avatar_url")
      .eq("user_id", user.id)
      .single();

    const { error: dbError } = await (supabase.from("profiles") as any)
      .update({ avatar_url: publicUrl })
      .eq("user_id", user.id);

    if (dbError) {
      console.error("[saveAvatarUrl] db error:", dbError.message);
      return { success: false, error: `Could not save avatar: ${dbError.message}` };
    }

    await cleanupOldAvatar(supabase, existing?.avatar_url, user.id);

    try {
      revalidatePath("/profile");
      revalidatePath("/profile/edit");
    } catch (e) {
      console.warn("[saveAvatarUrl] revalidatePath warning:", e);
    }

    return { success: true };
  } catch (err: any) {
    console.error("[saveAvatarUrl] unexpected error:", err?.message);
    return { success: false, error: err?.message ?? "Unexpected error." };
  }
}

/* ── Remove avatar ───────────────────────────────────────────────────────── */
export async function removeAvatar(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Not authenticated." };
    }

    const { data: existing } = await (supabase.from("profiles") as any)
      .select("avatar_url")
      .eq("user_id", user.id)
      .single();

    const { error } = await (supabase.from("profiles") as any)
      .update({ avatar_url: null })
      .eq("user_id", user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    await cleanupOldAvatar(supabase, existing?.avatar_url, user.id);

    try {
      revalidatePath("/profile");
      revalidatePath("/profile/edit");
    } catch (e) {
      console.warn("[removeAvatar] revalidatePath warning:", e);
    }

    return { success: true };
  } catch (err: any) {
    console.error("[removeAvatar] unexpected error:", err?.message);
    return { success: false, error: err?.message ?? "Unexpected error." };
  }
}

/* Best-effort delete of a reader's previous avatar file. Scoped to the
   reader's own storage folder ({user_id}/...) so this can never touch —
   or even reference — another user's file. Failures are swallowed; a
   stray orphaned file is harmless and should never block the save. */
async function cleanupOldAvatar(
  supabase: Awaited<ReturnType<typeof createClient>>,
  oldUrl: string | null | undefined,
  userId: string
) {
  if (!oldUrl) return;
  const marker = "/reader-avatars/";
  const idx = oldUrl.indexOf(marker);
  if (idx === -1) return;

  const path = oldUrl.slice(idx + marker.length).split("?")[0];
  if (!path.startsWith(`${userId}/`)) return;

  try {
    await supabase.storage.from("reader-avatars").remove([path]);
  } catch (e) {
    console.warn("[cleanupOldAvatar] could not remove old avatar:", e);
  }
}

/* ── Get current reader's profile (server) ───────────────────────────────── */
export async function getMyProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await (supabase.from("profiles") as any)
    .select("*")
    .eq("user_id", user.id)
    .single();

  return data ?? null;
}
