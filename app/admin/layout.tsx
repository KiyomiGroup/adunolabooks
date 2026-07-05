/*
  ── Admin Layout ──────────────────────────────────────────────────────────────
  Middleware already handles the redirect to /admin/login for unauthenticated
  requests. This layout wraps all /admin/* pages (including login) in the
  AdminShell — but the login page overrides the shell with its own full-page
  layout because it renders before auth is confirmed.

  The shell is lightweight enough that showing it briefly on the login page
  is fine; the middleware redirect happens instantly on authenticated routes.
*/
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Studio — AdunolaBooks",
  robots: "noindex",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
