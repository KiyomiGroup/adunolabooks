"use server";
/*
  ── Reader auth actions ────────────────────────────────────────────────────────
  Separate from lib/actions/auth.ts (admin auth) — never mix the two.
  Admin auth → /admin/login  (lib/actions/auth.ts)
  Reader auth → /auth/*      (this file)
*/
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/* ── Sign Up ─────────────────────────────────────────────────────────────── */
export async function readerSignUp(formData: FormData) {
  const supabase = await createClient();

  const email       = (formData.get("email")       as string).trim();
  const password    =  formData.get("password")    as string;
  const displayName = (formData.get("display_name") as string | null)?.trim() ?? "";

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
      /* emailRedirectTo is set in Supabase Dashboard → Auth → URL Configuration */
    },
  });

  if (error) {
    redirect(`/auth/signup?error=${encodeURIComponent(error.message)}`);
  }

  /* Supabase may require email confirmation — redirect to a holding page */
  redirect("/auth/verify-email");
}

/* ── Sign In ─────────────────────────────────────────────────────────────── */
export async function readerSignIn(formData: FormData) {
  const supabase = await createClient();

  const email    = (formData.get("email")    as string).trim();
  const password =  formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/auth/login?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/profile");
}

/* ── Sign Out ────────────────────────────────────────────────────────────── */
export async function readerSignOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

/* ── Forgot Password ─────────────────────────────────────────────────────── */
export async function forgotPassword(formData: FormData) {
  const supabase = await createClient();

  const email = (formData.get("email") as string).trim();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
  });

  if (error) {
    redirect(`/auth/forgot-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/auth/forgot-password?sent=true");
}

/* ── Reset Password ──────────────────────────────────────────────────────── */
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
