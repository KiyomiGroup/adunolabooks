/*
  Login page uses its own full-page layout — no AdminShell nav.
  This layout takes precedence over /admin/layout.tsx for this route segment.
*/
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
