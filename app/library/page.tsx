import type { Metadata } from "next";
import { redirect } from "next/navigation";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My Library — AdunolaBooks" };

/* Route protection is also enforced in proxy.ts; this check is a fallback
   so the page never renders content for a signed-out visitor even if
   reached in an unusual way. */
export default async function LibraryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?next=/library");

  return (
    <>
      <TopNav />
      <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
        <section style={{ padding: "7rem 0 6rem", textAlign: "center" }}>
          <div className="container fade-up" style={{ maxWidth: "440px", margin: "0 auto" }}>
            <p className="section-tag" style={{ marginBottom: "1rem" }}>My Library</p>

            <div style={{
              width: "64px", height: "64px", borderRadius: "50%",
              background: "var(--purple-light)", border: "1.5px solid var(--lavender-border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1.75rem",
            }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", fontStyle: "italic", color: "var(--purple-dark)" }}>
                ◻
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)",
              fontWeight: 400,
              color: "var(--ink)",
              lineHeight: 1.2,
              margin: "0 0 0.85rem",
            }}>
              Your personal library is waiting for your first story.
            </h1>

            <p style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.95rem",
              color: "var(--muted)",
              lineHeight: 1.75,
              margin: "0 0 0.5rem",
            }}>
              This feature will arrive in an upcoming update.
            </p>
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "0.58rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--muted-light)",
            }}>
              Coming soon
            </p>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
