import type { Metadata } from "next";
import Link from "next/link";
import { readerSignUp } from "@/lib/actions/reader-auth";
import AuthCard from "@/components/auth/AuthCard";
import AuthField from "@/components/auth/AuthField";
import AuthButton from "@/components/auth/AuthButton";
import Banner from "@/components/auth/ErrorBanner";

export const metadata: Metadata = { title: "Create Account — AdunolaBooks" };

interface Props { searchParams: Promise<{ error?: string }> }

export default async function SignupPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <AuthCard
      title="Join the library."
      subtitle="Create a free reader account to save your place, leave notes, and be part of the story."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/auth/login" style={{ color: "var(--purple)", textDecoration: "none", fontWeight: 500 }}>
            Sign in
          </Link>
        </>
      }
    >
      {error && <Banner message={decodeURIComponent(error)} />}

      <form action={readerSignUp} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
        <AuthField
          label="Display Name"
          name="display_name"
          placeholder="How you'd like to be known"
          autoComplete="name"
          maxLength={60}
        />
        <AuthField
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
        <AuthField
          label="Password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          minLength={8}
          hint="At least 8 characters."
        />

        <AuthButton label="Create Account" pendingLabel="Creating account…" />

        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.74rem",
          color: "var(--muted-light)",
          textAlign: "center",
          margin: "0.25rem 0 0",
          lineHeight: 1.5,
        }}>
          By creating an account you agree to our{" "}
          <span style={{ color: "var(--muted)" }}>terms of use</span>.
        </p>
      </form>
    </AuthCard>
  );
}
