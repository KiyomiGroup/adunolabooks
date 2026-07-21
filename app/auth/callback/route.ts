/*
  ── Auth callback route ────────────────────────────────────────────────────
  Supabase redirects here after:
    - Email verification (sign-up confirmation)
    - Password reset links

  Exchanges the PKCE code for a live session, then:
    1. Ensures the reader's profile row exists (belt-and-suspenders — the
       DB trigger should have already created it on sign-up, but if it
       failed for any reason this catches the gap).
    2. Redirects to ?next= param (default: /profile).

  Configure in Supabase Dashboard → Auth → URL Configuration → Redirect URLs:
    Add: https://your-domain.com/auth/callback
*/
import { NextResponse }       from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies }            from "next/headers";

function deriveUsername(email: string, userId: string): string {
  const prefix = email.split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, 24) || "reader";
  const suffix = userId.replace(/-/g, "").slice(0, 6);
  return `${prefix}_${suffix}`;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/profile";

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login?error=Missing+verification+code`);
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll()  { return cookieStore.getAll(); },
        setAll(toSet) {
          try {
            toSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch { /* Server Component context — safe to ignore */ }
        },
      },
    }
  );

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    return NextResponse.redirect(
      `${origin}/auth/login?error=${encodeURIComponent(
        "Verification link has expired or already been used. Please sign in again."
      )}`
    );
  }

  /* ── Ensure profile exists ── */
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: existingProfile } = await (supabase.from("profiles") as any)
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!existingProfile) {
      /* Fallback: DB trigger should have done this, but create here if missing */
      await (supabase.from("profiles") as any)
        .insert({
          user_id:      user.id,
          username:     deriveUsername(user.email ?? "", user.id),
          display_name: (user.user_metadata?.display_name as string) ?? "",
          bio:          "",
        })
        .single();
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
