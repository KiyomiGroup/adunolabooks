import type { Metadata } from "next";
import Link from "next/link";
import { forgotPassword } from "@/lib/actions/reader-auth";
import AuthCard from "@/components/auth/AuthCard";
import AuthField from "@/components/auth/AuthField";
import AuthButton from "@/components/auth/AuthButton";
import Banner from "@/components/auth/ErrorBanner";

export const metadata: Metadata = { title: "Reset Password — AdunolaBooks" };

interface Props { searchParams: Promise<{ error?: string; sent?: string }> }

export default async function ForgotPasswordPage({ searchParams }: Props) {
  const { error, sent } = await searchParams;

  if (sent) {
    return (
      <AuthCard title="Check your inbox." footer={
        <Link href="/auth/login" style={{ color: "var(--purple)", textDecoration: "none" }}>← Back to sign in</Link>
      }>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.7 }}>
          If an account exists with that email, we've sent a password reset link.
          It may take a minute to arrive. Check your spam folder if you don't see it.
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot your password?"
      subtitle="Enter your email and we'll send a reset link."
      footer={
        <Link href="/auth/login" style={{ color: "var(--purple)", textDecoration: "none" }}>
          ← Back to sign in
        </Link>
      }
    >
      {error && <Banner message={decodeURIComponent(error)} />}
      <form action={forgotPassword} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
        <AuthField label="Email" name="email" type="email" required autoComplete="email" />
        <AuthButton label="Send Reset Link" pendingLabel="Sending…" />
      </form>
    </AuthCard>
  );
}
