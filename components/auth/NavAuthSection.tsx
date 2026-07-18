"use client";
/*
  ── NavAuthSection ────────────────────────────────────────────────────────────
  Injected into TopNav's nav-right area.
  Client component — reads auth state from Supabase browser client on mount.
  Shows: "Sign In" + "Create Account" when logged out.
  Shows: profile initial/avatar + "Sign Out" when logged in.

  Deliberately minimal — does not redesign the nav.
  Sits to the left of the existing "Start Reading" CTA.
*/
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { readerSignOut } from "@/lib/actions/reader-auth";
import type { User } from "@supabase/supabase-js";

export default function NavAuthSection() {
  const [user, setUser] = useState<User | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await (supabase.from("profiles") as any)
          .select("avatar_url, display_name, username")
          .eq("user_id", user.id)
          .single();
        if (data) {
          setAvatarUrl(data.avatar_url);
          setDisplayName(data.display_name || data.username || "");
        }
      }
      setReady(true);
    };

    init();

    /* Keep in sync when auth state changes (login/logout in another tab) */
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setAvatarUrl(null);
        setDisplayName("");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  /* Don't flash anything until we know auth state */
  if (!ready) return null;

  const linkStyle: React.CSSProperties = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.76rem",
    fontWeight: 500,
    textDecoration: "none",
    letterSpacing: "0.04em",
    whiteSpace: "nowrap",
  };

  if (!user) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingBottom: "0.6rem" }}>
        <Link href="/auth/login" style={{ ...linkStyle, color: "var(--muted)" }}>
          Sign In
        </Link>
        <Link href="/auth/signup" style={{
          ...linkStyle,
          color: "var(--purple)",
          padding: "0.42rem 0.9rem",
          border: "1.5px solid var(--purple-light)",
          borderRadius: "5px",
          transition: "all 0.2s",
        }}>
          Join
        </Link>
      </div>
    );
  }

  /* Logged-in state */
  const initials = displayName[0]?.toUpperCase() ?? "R";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingBottom: "0.6rem" }}>
      <Link href="/profile" style={{ display: "flex", alignItems: "center", gap: "0.55rem", textDecoration: "none" }}>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Your profile"
            width={28}
            height={28}
            style={{ width: "28px", height: "28px", borderRadius: "50%", objectFit: "cover", border: "1.5px solid var(--purple-light)" }}
          />
        ) : (
          <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--purple-light)", border: "1.5px solid var(--lavender-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.82rem", color: "var(--purple-dark)", fontStyle: "italic", lineHeight: 1 }}>
              {initials}
            </span>
          </div>
        )}
        <span style={{ ...linkStyle, color: "var(--ink-soft)" }}>
          {displayName || "Profile"}
        </span>
      </Link>

      <form action={readerSignOut} style={{ margin: 0 }}>
        <button
          type="submit"
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.56rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--muted-light)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            transition: "color 0.2s",
          }}
        >
          Sign Out
        </button>
      </form>
    </div>
  );
}
