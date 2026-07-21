/*
  ── Proxy (Next.js 16 middleware) — Sprint 4A ────────────────────────────
  Next.js 16 renamed `middleware.ts` → `proxy.ts` and the export
  from `middleware` → `proxy`. This file is the platform's request
  interceptor.

  Two jobs:

  1. SESSION REFRESH on every matched request.
     @supabase/ssr keeps auth tokens alive by refreshing cookies on every
     response. Without this, the JWT expires silently and users appear to
     be randomly logged out.

  2. ROUTE PROTECTION.
     /admin/*   → authenticated admin only (lib/actions/auth.ts)
     /profile/* → authenticated reader only (lib/actions/reader-auth.ts)

  The two auth systems share the same Supabase project but are logically
  separate. Readers are never shown /admin/* pages.

  Sprint 4B: protect /api/comments/* here when community features ship.
*/
import { createServerClient } from "@supabase/ssr";
import { NextResponse }       from "next/server";
import type { NextRequest }   from "next/server";

export async function proxy(request: NextRequest) {
  /* Always build a fresh response so cookies can be written back */
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
          /*
            Write into request.cookies so subsequent getAll() calls in
            this proxy see the updated values, and write into
            supabaseResponse so the refreshed token reaches the browser.
          */
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
    IMPORTANT: Do not insert any logic between createServerClient and
    getUser(). Token rotation happens inside getUser() — code inserted
    here can silently break the refresh cycle.
  */
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  /* ── Admin route protection ───────────────────────────────────────── */
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminLogin = pathname === "/admin/login";

  if (isAdminRoute && !isAdminLogin && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  /* Send an already-logged-in user past the admin login page */
  if (isAdminLogin && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  /* ── Reader route protection ──────────────────────────────────────── */
  /*
    /profile, /library, /settings require a signed-in reader.
    We preserve ?next= so the login page can redirect back after auth.
    Sprint 4C: add /reading-list, /bookmarks, /continue-reading here.
  */
  const READER_PROTECTED_PREFIXES = ["/profile", "/library", "/settings"];
  const isProfileRoute = READER_PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isProfileRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Run on every path EXCEPT static assets.
     * A broad matcher is required for session refresh — limiting to
     * specific routes means tokens expire silently on unmatched pages.
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
