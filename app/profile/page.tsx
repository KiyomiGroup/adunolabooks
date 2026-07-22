import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRow } from "@/lib/supabase/types";
import { getMyLibrary } from "@/lib/stories";
import Banner from "@/components/auth/ErrorBanner";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My Profile — AdunolaBooks" };

/* Placeholder stat for Sprint 4C */
function StatPill({ value, label }: { value: string | number; label: string }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "0.2rem",
      minWidth: "80px",
    }}>
      <span style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "1.75rem",
        fontWeight: 500,
        color: "var(--purple)",
        lineHeight: 1,
      }}>{value}</span>
      <span style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.52rem",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "var(--muted-light)",
      }}>{label}</span>
    </div>
  );
}

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ saved?: string; welcome?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data } = await (supabase.from("profiles") as any)
    .select("*")
    .eq("user_id", user.id)
    .single();

  const profile = data as ProfileRow | null;

  /* Profile missing — shouldn't happen if the DB trigger is set up correctly,
     but create it on-the-fly rather than bouncing the user to login. */
  if (!profile) {
    await (supabase.from("profiles") as any).insert({
      user_id:      user.id,
      username:     user.email!.split("@")[0]
                      .toLowerCase()
                      .replace(/[^a-z0-9_]/g, "")
                      .slice(0, 24) || "reader"
                      + "_" + user.id.replace(/-/g, "").slice(0, 6),
      display_name: (user.user_metadata?.display_name as string) ?? "",
      bio:          "",
    });
    redirect("/profile");   /* reload so the new row is fetched */
  }

  const { saved, welcome } = await searchParams;

  /* Sprint 4C: real numbers instead of the "—" placeholders. */
  const library = await getMyLibrary(user.id);
  const booksRead = library.completed.length;
  const chaptersRead = [...library.currentlyReading, ...library.completed].reduce(
    (sum, entry) => sum + (entry.progressPercentage >= 100 ? entry.totalChapters : entry.currentChapterNumber ?? 0),
    0
  );
  const bookmarksCount = library.bookmarkedStories.length + library.bookmarkedChapters.length;

  const joinedLabel = new Date(profile.joined_at).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <>
      <TopNav />
      <main style={{ background: "var(--bg)", minHeight: "100vh" }}>

        {/* Desktop */}
        <div className="u-desktop-only">
          <section style={{ background: "var(--bg-soft)", borderBottom: "1px solid var(--lavender-border)", padding: "5rem 0 4rem" }}>
            <div className="container">
              {welcome && (
                <div className="fade-up" style={{ marginBottom: "1.75rem" }}>
                  <p className="section-tag" style={{ marginBottom: "0.35rem" }}>
                    Welcome back
                  </p>
                  <h2 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.6rem",
                    fontWeight: 400,
                    fontStyle: "italic",
                    color: "var(--ink)",
                    margin: "0 0 0.35rem",
                    lineHeight: 1.2,
                  }}>
                    {profile.display_name || profile.username}.
                  </h2>
                  <p style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.9rem",
                    color: "var(--muted)",
                    margin: 0,
                  }}>
                    Continue your reading journey.
                  </p>
                </div>
              )}

              {saved && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <Banner message="Profile updated." type="success" />
                </div>
              )}

              {/* Top row: avatar + name */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "2.5rem", flexWrap: "wrap" }}>
                {/* Avatar */}
                <div style={{ flexShrink: 0, position: "relative" }}>
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={`${profile.display_name || profile.username}'s avatar`}
                      width={96}
                      height={96}
                      loading="lazy"
                      style={{
                        width: "96px",
                        height: "96px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid var(--purple-light)",
                        display: "block",
                      }}
                    />
                  ) : (
                    /* Elegant monogram fallback */
                    <div style={{
                      width: "96px",
                      height: "96px",
                      borderRadius: "50%",
                      background: "var(--purple-light)",
                      border: "2px solid var(--lavender-border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <span style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "2.2rem",
                        fontWeight: 400,
                        color: "var(--purple-dark)",
                        fontStyle: "italic",
                        lineHeight: 1,
                      }}>
                        {(profile.display_name || profile.username)[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Name / username / bio */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="section-tag" style={{ marginBottom: "0.35rem" }}>
                    Reader
                  </p>
                  <h1 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    fontWeight: 400,
                    color: "var(--ink)",
                    lineHeight: 1.1,
                    margin: "0 0 0.35rem",
                    letterSpacing: "-0.01em",
                  }}>
                    {profile.display_name || profile.username}
                  </h1>
                  <p style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.62rem",
                    letterSpacing: "0.16em",
                    color: "var(--muted-light)",
                    margin: "0 0 1rem",
                  }}>
                    @{profile.username}
                  </p>
                  {profile.bio && (
                    <p style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.95rem",
                      color: "var(--muted)",
                      lineHeight: 1.75,
                      maxWidth: "52ch",
                      margin: "0 0 1.25rem",
                    }}>
                      {profile.bio}
                    </p>
                  )}
                  <p style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.58rem",
                    letterSpacing: "0.12em",
                    color: "var(--muted-light)",
                    margin: "0 0 1.5rem",
                  }}>
                    Reader since {joinedLabel}
                  </p>

                  {/* Edit profile link */}
                  <Link href="/profile/edit" style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                    color: "var(--purple)",
                    textDecoration: "none",
                    padding: "0.6rem 1.35rem",
                    border: "1.5px solid var(--purple-light)",
                    borderRadius: "6px",
                    display: "inline-block",
                    transition: "all 0.2s",
                  }}>
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Stats — Sprint 4C: real values from reading_progress + bookmarks */}
          <section style={{ padding: "3.5rem 0" }}>
            <div className="container">
              <p className="section-tag" style={{ marginBottom: "1.5rem" }}>Reading Journey</p>
              <div style={{
                display: "flex",
                gap: "2.5rem",
                flexWrap: "wrap",
                alignItems: "flex-start",
              }}>
                <StatPill value={booksRead} label="Books Read" />
                <StatPill value={chaptersRead} label="Chapters Read" />
                <StatPill value={bookmarksCount} label="Bookmarks" />
              </div>
              <Link href="/library" style={{
                display: "inline-block",
                marginTop: "1.5rem",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.8rem",
                fontWeight: 500,
                color: "var(--purple)",
                textDecoration: "none",
              }}>
                View my library →
              </Link>
            </div>
          </section>

          <Footer />
        </div>

        {/* Mobile — same content, stacked layout */}
        <div className="u-mobile-only" style={{ padding: "2.5rem 1.25rem 6rem" }}>
          {welcome && (
            <div className="fade-up" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <p className="section-tag" style={{ marginBottom: "0.3rem" }}>Welcome back</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.35rem", fontStyle: "italic", fontWeight: 400, color: "var(--ink)", margin: "0 0 0.3rem" }}>
                {profile.display_name || profile.username}.
              </h2>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.84rem", color: "var(--muted)", margin: 0 }}>
                Continue your reading journey.
              </p>
            </div>
          )}
          {saved && <Banner message="Profile updated." type="success" />}

          {/* Avatar */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt=""
                width={80}
                height={80}
                loading="lazy"
                style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--purple-light)" }}
              />
            ) : (
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--purple-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", color: "var(--purple-dark)", fontStyle: "italic" }}>
                  {(profile.display_name || profile.username)[0]?.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.8rem", fontWeight: 400, color: "var(--ink)", textAlign: "center", margin: "0 0 0.3rem" }}>
            {profile.display_name || profile.username}
          </h1>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.16em", color: "var(--muted-light)", textAlign: "center", marginBottom: "1rem" }}>
            @{profile.username}
          </p>
          {profile.bio && (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "var(--muted)", lineHeight: 1.7, textAlign: "center", marginBottom: "1.25rem" }}>
              {profile.bio}
            </p>
          )}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
            <Link href="/profile/edit" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", fontWeight: 500, color: "var(--purple)", textDecoration: "none", padding: "0.6rem 1.25rem", border: "1.5px solid var(--purple-light)", borderRadius: "6px" }}>
              Edit Profile
            </Link>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
            <StatPill value={booksRead} label="Books Read" />
            <StatPill value={bookmarksCount} label="Bookmarks" />
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}>
            <Link href="/library" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", fontWeight: 500, color: "var(--purple)", textDecoration: "none" }}>
              View my library →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
