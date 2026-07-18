import type { Metadata } from "next";
import Link from "next/link";
import { readerSignIn } from "@/lib/actions/reader-auth";
import AuthCard from "@/components/auth/AuthCard";
import AuthField from "@/components/auth/AuthField";
import AuthButton from "@/components/auth/AuthButton";
import Banner from "@/components/auth/ErrorBanner";

export const metadata: Metadata = { title: "Sign In — AdunolaBooks" };

interface Props { searchParams: Promise<{ error?: string; reset?: string }> }

export default async function LoginPage({ searchParams }: Props) {
  const { error, reset } = await searchParams;

  return (
    <AuthCard
      title="Welcome back."
      subtitle="Sign in to your reader account."
      footer={
        <>
          No account yet?{" "}
          <Link href="/auth/signup" style={{ color: "var(--purple)", textDecoration: "none", fontWeight: 500 }}>
            Create one
          </Link>
        </>
      }
    >
      {reset && <Banner message="Password updated. You can now sign in." type="success" />}
      {error  && <Banner message={decodeURIComponent(error)} />}

      <form action={readerSignIn} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
        <AuthField label="Email" name="email" type="email" required autoComplete="email" />
        <AuthField label="Password" name="password" type="password" required autoComplete="current-password" />

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Link href="/auth/forgot-password" style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.58rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--muted-light)",
            textDecoration: "none",
          }}>
            Forgot password?
          </Link>
        </div>

        <AuthButton label="Sign In" pendingLabel="Signing in…" />
      </form>
    </AuthCard>
  );
}
