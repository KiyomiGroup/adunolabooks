import type { Metadata } from "next";
import { resetPassword } from "@/lib/actions/reader-auth";
import AuthCard from "@/components/auth/AuthCard";
import AuthField from "@/components/auth/AuthField";
import AuthButton from "@/components/auth/AuthButton";
import Banner from "@/components/auth/ErrorBanner";

export const metadata: Metadata = { title: "Set New Password — AdunolaBooks", robots: { index: false, follow: false } };

interface Props { searchParams: Promise<{ error?: string }> }

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <AuthCard title="Set a new password." subtitle="Choose something you'll remember.">
      {error && <Banner message={decodeURIComponent(error)} />}
      <form action={resetPassword} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
        <AuthField label="New Password" name="password" type="password" required autoComplete="new-password" minLength={8} />
        <AuthField label="Confirm Password" name="confirm" type="password" required autoComplete="new-password" minLength={8} />
        <AuthButton label="Update Password" pendingLabel="Updating…" />
      </form>
    </AuthCard>
  );
}
