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

/* ── Upload avatar ───────────────────────────────────────────────────────── */
export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const file = formData.get("avatar") as File;
  if (!file || file.size === 0) {
    redirect("/profile/edit?error=No+file+selected");
  }

  /* Enforce 5MB limit */
  if (file.size > 5 * 1024 * 1024) {
    redirect("/profile/edit?error=Image+must+be+under+5MB");
  }

  const ext      = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filePath = `${user.id}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("reader-avatars")
    .upload(filePath, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    redirect(`/profile/edit?error=${encodeURIComponent(uploadError.message)}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from("reader-avatars")
    .getPublicUrl(filePath);

  const { error: updateError } = await (supabase.from("profiles") as any)
    .update({ avatar_url: publicUrl })
    .eq("user_id", user.id);

  if (updateError) {
    redirect(`/profile/edit?error=${encodeURIComponent(updateError.message)}`);
  }

  revalidatePath("/profile");
  revalidatePath("/profile/edit");
  redirect("/profile?saved=true");
}

/* ── Remove avatar ───────────────────────────────────────────────────────── */
export async function removeAvatar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { error } = await (supabase.from("profiles") as any)
    .update({ avatar_url: null })
    .eq("user_id", user.id);

  if (error) {
    redirect(`/profile/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/profile");
  revalidatePath("/profile/edit");
  redirect("/profile?saved=true");
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
