import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRow } from "@/lib/supabase/types";
import { updateProfile } from "@/lib/actions/profile";
import Banner from "@/components/auth/ErrorBanner";
import AuthField from "@/components/auth/AuthField";
import AuthButton from "@/components/auth/AuthButton";
import AvatarUploader from "@/components/auth/AvatarUploader";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit Profile — AdunolaBooks", robots: { index: false, follow: false } };

interface Props { searchParams: Promise<{ error?: string }> }

export default async function EditProfilePage({ searchParams }: Props) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data } = await (supabase.from("profiles") as any)
    .select("*")
    .eq("user_id", user.id)
    .single();

  const profile = data as ProfileRow | null;
  if (!profile) redirect("/profile"); /* profile page handles creation */

  const { error } = await searchParams;

  return (
    <>
      <TopNav />
      <main style={{ background: "var(--bg)", minHeight: "100vh", paddingBottom: "5rem" }}>
        <div style={{ maxWidth: "640px", margin: "0 auto", padding: "3.5rem 2rem 0" }}>

          {/* Back link */}
          <Link href="/profile" style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.58rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--muted)",
            textDecoration: "none",
            display: "inline-block",
            marginBottom: "2rem",
          }}>
            ← Back to Profile
          </Link>

          {/* Header */}
          <p className="section-tag" style={{ marginBottom: "0.4rem" }}>Your account</p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "2.2rem",
            fontWeight: 400,
            color: "var(--ink)",
            margin: "0 0 2rem",
            lineHeight: 1.1,
          }}>
            Edit Profile
          </h1>

          {error && <Banner message={decodeURIComponent(error)} />}

          {/* Avatar section */}
          <div style={{
            background: "var(--white)",
            border: "1.5px solid var(--lavender-border)",
            borderRadius: "12px",
            padding: "1.75rem",
            marginBottom: "1.5rem",
          }}>
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "1.25rem",
            }}>
              Profile Picture
            </p>
            <AvatarUploader
              currentAvatarUrl={profile.avatar_url}
              displayName={profile.display_name || profile.username}
            />
          </div>

          {/* Profile text fields */}
          <div style={{
            background: "var(--white)",
            border: "1.5px solid var(--lavender-border)",
            borderRadius: "12px",
            padding: "1.75rem",
          }}>
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: "1.25rem",
            }}>
              Profile Details
            </p>

            <form action={updateProfile} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <AuthField
                label="Display Name"
                name="display_name"
                defaultValue={profile.display_name}
                placeholder="How you'd like to appear"
                maxLength={60}
              />
              <AuthField
                label="Username"
                name="username"
                required
                defaultValue={profile.username}
                hint="3–30 characters. Lowercase letters, numbers, and underscores only."
                minLength={3}
                maxLength={30}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                <label
                  htmlFor="bio"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                  }}
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  maxLength={280}
                  defaultValue={profile.bio}
                  placeholder="A few words about yourself, your reading tastes, where you're from…"
                  style={{
                    width: "100%",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.95rem",
                    color: "var(--ink)",
                    background: "var(--bg)",
                    border: "1.5px solid var(--lavender-border)",
                    borderRadius: "7px",
                    padding: "0.82rem 1rem",
                    outline: "none",
                    lineHeight: 1.65,
                    resize: "vertical",
                    boxSizing: "border-box",
                    minHeight: "100px",
                  }}
                />
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.76rem", color: "var(--muted-light)", margin: 0 }}>
                  Max 280 characters.
                </p>
              </div>

              <div style={{ paddingTop: "0.25rem" }}>
                <AuthButton label="Save Changes" pendingLabel="Saving…" />
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
