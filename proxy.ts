/*
  ── Middleware — Sprint 4A ────────────────────────────────────────────────────
  Handles TWO separate auth systems on the same platform:

    1. Admin auth  (/admin/*)    — publisher, uses Supabase Auth, high trust
    2. Reader auth (/profile/*)  — readers, same Supabase Auth, separate flow

  CRITICAL: These systems share a Supabase project but are logically separate.
    - Admin login → /admin/login  (lib/actions/auth.ts)
    - Reader login → /auth/login  (lib/actions/reader-auth.ts)
    - The same Supabase user table powers both, but readers are NEVER
      shown /admin/* and admins access /admin/* directly.

  Session is refreshed on every matched request so cookies stay current.

  Sprint 4B: Add /api/comments/* protection here when community features ship.
*/
import { createServerClient } from "@supabase/ssr";
import { NextResponse }       from "next/server";
import type { NextRequest }   from "next/server";

export async function proxy(request: NextRequest) {
  /* Always build a fresh response so cookies can be written */
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  /*
    Refresh the session on every matched request.
    This is required by @supabase/ssr to keep the cookie-based session alive.
    Do not remove — auth will silently break after the JWT expires.
  */
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  /* ── Admin route protection ──────────────────────────────────── */
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminLogin = pathname === "/admin/login";

  if (isAdminRoute && !isAdminLogin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  /* Redirect already-logged-in admin away from login page */
  if (isAdminLogin && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  /* ── Reader route protection ─────────────────────────────────── */
  /*
    /profile and /profile/edit require authentication.
    Unauthenticated readers are sent to /auth/login.
    Auth pages (/auth/*) are always public — no redirect needed there.

    Sprint 4C: protect /reading-list, /bookmarks etc. here.
  */
  const isProfileRoute = pathname.startsWith("/profile");

  if (isProfileRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    /* Preserve the intended destination so we can redirect back after login */
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  /*
    Match admin routes, profile routes, and the auth callback.
    /auth/callback must be matched so the session exchange can run and
    write the resulting cookie before the page redirect fires.
    All other /auth/* pages are public and don't need middleware — they
    handle their own redirects via server actions.
  */
  matcher: ["/admin/:path*", "/profile/:path*", "/profile", "/auth/callback"],
};
