import type { Metadata } from "next";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";

export const metadata: Metadata = { title: "Verify Your Email — AdunolaBooks", robots: { index: false, follow: false } };

export default function VerifyEmailPage() {
  return (
    <AuthCard
      title="One more step."
      footer={
        <Link href="/auth/login" style={{ color: "var(--purple)", textDecoration: "none" }}>
          Already verified? Sign in →
        </Link>
      }
    >
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.75, margin: 0 }}>
        We've sent a confirmation link to your email address.
        Click it to activate your account, then come back and sign in.
      </p>
      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.12em", color: "var(--muted-light)", marginTop: "1.25rem" }}>
        Can't find it? Check your spam folder.
      </p>
    </AuthCard>
  );
}
