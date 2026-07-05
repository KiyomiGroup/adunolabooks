/*
  ── Middleware — Admin route protection ───────────────────────────────────────
  Runs on every request to /admin/* (except /admin/login).
  Checks Supabase session; redirects to /admin/login if no valid user.

  Using @supabase/ssr's server client here so the session cookie is refreshed
  on every request — keeps the admin session alive without manual refresh.

  Sprint 4: extend this to protect community routes if public auth is added.
*/
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
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

  /* Refresh session — required for SSR auth to work correctly */
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage  = pathname === "/admin/login";

  if (isAdminRoute && !isLoginPage && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    return NextResponse.redirect(loginUrl);
  }

  /* If already logged in and trying to hit login page, go to dashboard */
  if (isLoginPage && user) {
    const dashUrl = request.nextUrl.clone();
    dashUrl.pathname = "/admin";
    return NextResponse.redirect(dashUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
