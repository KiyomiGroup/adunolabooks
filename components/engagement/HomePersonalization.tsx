import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getMyLibrary } from "@/lib/stories";
import { LibraryProgressCard } from "@/components/engagement/LibraryCards";

/*
  ── HomePersonalization ──────────────────────────────────────────────────
  Server Component, rendered once at the top of the homepage. Renders
  nothing for signed-out visitors so the existing homepage (Hero /
  MobileHomePage) is untouched for them, as the sprint brief requires.

  For a signed-in reader: "Welcome back" + Continue Reading + Recently
  Read. If there's no reading history yet, the section still greets the
  reader by name but omits the empty rows entirely rather than showing an
  empty grid — "hide this section gracefully".
*/
export default async function HomePersonalization() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, library] = await Promise.all([
    (supabase.from("profiles") as any)
      .select("display_name, username")
      .eq("user_id", user.id)
      .single(),
    getMyLibrary(user.id),
  ]);

  const name = profile?.display_name || profile?.username || "reader";

  /* Recently read that isn't already shown in Continue Reading, so the
     two rows never duplicate the same book. */
  const continuingIds = new Set(library.currentlyReading.map((e) => e.bookId));
  const recentlyReadOnly = library.recentlyRead.filter((e) => !continuingIds.has(e.bookId));

  const hasHistory = library.currentlyReading.length > 0 || recentlyReadOnly.length > 0;

  return (
    <section className="home-personalization">
      <div className="container">
        <div className="fade-up" style={{ marginBottom: hasHistory ? "1.75rem" : 0 }}>
          <p className="section-tag" style={{ marginBottom: "0.35rem" }}>Welcome back</p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            fontWeight: 400,
            fontStyle: "italic",
            color: "var(--ink)",
            margin: "0 0 0.4rem",
            lineHeight: 1.25,
          }}>
            {name}.
          </h2>
          {hasHistory ? (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "var(--muted)", margin: 0 }}>
              Pick up where you left off.
            </p>
          ) : (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "var(--muted)", margin: 0 }}>
              Your bookshelf is ready whenever you are —{" "}
              <Link href="/stories" style={{ color: "var(--purple)", fontWeight: 500, textDecoration: "none" }}>
                browse the library
              </Link>.
            </p>
          )}
        </div>

        {library.currentlyReading.length > 0 && (
          <div style={{ marginBottom: recentlyReadOnly.length > 0 ? "2.25rem" : 0 }}>
            <p className="library-subtag">Continue Reading</p>
            <div className="library-grid library-grid-compact">
              {library.currentlyReading.slice(0, 3).map((entry) => (
                <LibraryProgressCard key={entry.bookId} entry={entry} />
              ))}
            </div>
          </div>
        )}

        {recentlyReadOnly.length > 0 && (
          <div>
            <p className="library-subtag">Recently Read</p>
            <div className="library-grid library-grid-compact">
              {recentlyReadOnly.slice(0, 3).map((entry) => (
                <LibraryProgressCard key={`recent-${entry.bookId}`} entry={entry} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
