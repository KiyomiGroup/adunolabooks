"use server";
/*
  ── Reader auth server actions ─────────────────────────────────────────────
  Completely separate from lib/actions/auth.ts (admin auth).
  Admin auth  → /admin/login   (lib/actions/auth.ts)
  Reader auth → /auth/*        (this file)
*/
import { revalidatePath } from "next/cache";
import { redirect }       from "next/navigation";
import { createClient }   from "@/lib/supabase/server";

function deriveUsername(email: string, userId: string): string {
  const prefix = email.split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 24) || "reader";
  const suffix = userId.replace(/-/g, "").slice(0, 6);
  return `${prefix}_${suffix}`;
}

/* ── Sign Up ────────────────────────────────────────────────────────────── */
export async function readerSignUp(formData: FormData) {
  const supabase = await createClient();

  const email       = (formData.get("email")        as string).trim();
  const password    =  formData.get("password")     as string;
  const displayName = (formData.get("display_name") as string | null)?.trim() ?? "";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
    },
  });

  if (error) {
    redirect(`/auth/signup?error=${encodeURIComponent(error.message)}`);
  }

  /*
    If email confirmation is DISABLED in Supabase, the user has a session
    immediately — create the profile here as a supplement to the DB trigger.
    If email confirmation is ENABLED, the DB trigger fires when the user row
    is inserted, so the profile exists by the time they click the link.
  */
  if (data.session && data.user) {
    const { data: existing } = await (supabase.from("profiles") as any)
      .select("id")
      .eq("user_id", data.user.id)
      .single();

    if (!existing) {
      await (supabase.from("profiles") as any).insert({
        user_id:      data.user.id,
        username:     deriveUsername(email, data.user.id),
        display_name: displayName,
        bio:          "",
      });
    }

    revalidatePath("/", "layout");
    redirect("/profile");
  }

  /* Email confirmation required — send to verify-email holding page */
  redirect("/auth/verify-email");
}

/* ── Sign In ────────────────────────────────────────────────────────────── */
export async function readerSignIn(formData: FormData) {
  const supabase = await createClient();

  const email    = (formData.get("email")    as string).trim();
  const password =  formData.get("password") as string;
  const nextRaw  = (formData.get("next")     as string | null) ?? "";

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const nextParam = nextRaw ? `&next=${encodeURIComponent(nextRaw)}` : "";
    redirect(`/auth/login?error=${encodeURIComponent(error.message)}${nextParam}`);
  }

  revalidatePath("/", "layout");

  /* Only ever redirect to a same-site relative path — never an absolute
     URL — to avoid turning "next" into an open-redirect vector. */
  const destination = nextRaw.startsWith("/") && !nextRaw.startsWith("//")
    ? nextRaw
    : "/profile";

  const separator = destination.includes("?") ? "&" : "?";
  redirect(`${destination}${separator}welcome=1`);
}

/* ── Sign Out ───────────────────────────────────────────────────────────── */
export async function readerSignOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

/* ── Forgot Password ────────────────────────────────────────────────────── */
export async function forgotPassword(formData: FormData) {
  const supabase = await createClient();

  const email = (formData.get("email") as string).trim();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/callback?next=/auth/reset-password`,
  });

  if (error) {
    redirect(`/auth/forgot-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/auth/forgot-password?sent=true");
}

/* ── Reset Password ─────────────────────────────────────────────────────── */
export async function resetPassword(formData: FormData) {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirm  = formData.get("confirm")  as string;

  if (password !== confirm) {
    redirect("/auth/reset-password?error=Passwords+do+not+match");
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/auth/reset-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/auth/login?reset=true");
}
