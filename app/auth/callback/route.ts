/*
  ── Auth callback route ────────────────────────────────────────────────────────
  Supabase redirects here after:
    - email verification
    - password reset links

  Exchanges the code/token for a session then sends the user somewhere useful.
  See: Supabase Dashboard → Auth → URL Configuration → Redirect URLs
       Add: https://your-domain.com/auth/callback
*/
import { NextResponse }       from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies }            from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/profile";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(toSet) {
            try { toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); }
            catch { /* Server Component context */ }
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  /* Something went wrong — send back to login with error */
  return NextResponse.redirect(`${origin}/auth/login?error=Could+not+verify+email`);
}
