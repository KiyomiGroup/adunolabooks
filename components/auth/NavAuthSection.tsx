"use client";
/*
  ── NavAuthSection ────────────────────────────────────────────────────────────
  Injected into TopNav's nav-right area.
  Client component — reads auth state from Supabase browser client on mount,
  and stays in sync via onAuthStateChange (covers login/logout in another
  tab, and token refresh/expiry).

  Logged out → "Sign In" + "Create Account".
  Logged in  → avatar + name, opens a minimal account dropdown:
               Profile · My Library (placeholder) · Settings (placeholder) · Logout.

  Sprint 4A.4 — integration only. No new backend systems.
*/
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { readerSignOut } from "@/lib/actions/reader-auth";
import type { User } from "@supabase/supabase-js";

export default function NavAuthSection() {
  const [user, setUser]               = useState<User | null>(null);
  const [avatarUrl, setAvatarUrl]      = useState<string | null>(null);
  const [displayName, setDisplayName]  = useState<string>("");
  const [ready, setReady]              = useState(false);
  const [open, setOpen]                = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    const loadUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (cancelled) return;

        /* A transient network/session error shouldn't flip a signed-in
           reader to "logged out" — just stop showing the loading state
           and keep whatever we last knew to be true. */
        if (error) { setReady(true); return; }

        setUser(user);

        if (user) {
          const { data } = await (supabase.from("profiles") as any)
            .select("avatar_url, display_name, username")
            .eq("user_id", user.id)
            .single();
          if (!cancelled && data) {
            setAvatarUrl(data.avatar_url);
            setDisplayName(data.display_name || data.username || "");
          }
        }
        setReady(true);
      } catch {
        if (!cancelled) setReady(true);
      }
    };

    loadUser();

    /* Keep in sync when auth state changes — login/logout in another tab,
       or the session expiring. */
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setAvatarUrl(null);
        setDisplayName("");
        setOpen(false);
      }
      setReady(true);
    });

    return () => { cancelled = true; subscription.unsubscribe(); };
  }, []);

  /* Close the dropdown on outside click or Escape */
  useEffect(() => {
    if (!open) return;

    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

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
          Create Account
        </Link>
      </div>
    );
  }

  /* Logged-in state — avatar trigger + dropdown */
  const initials = (displayName[0] ?? "R").toUpperCase();

  const menuItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.75rem",
    padding: "0.65rem 0.9rem",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.82rem",
    fontWeight: 500,
    color: "var(--ink-soft)",
    textDecoration: "none",
    borderRadius: "6px",
    transition: "background 0.15s",
  };

  const disabledItemStyle: React.CSSProperties = {
    ...menuItemStyle,
    color: "var(--muted-light)",
    cursor: "not-allowed",
  };

  const soonTagStyle: React.CSSProperties = {
    fontFamily: "'DM Mono', monospace",
    fontSize: "0.5rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--muted-light)",
    border: "1px solid var(--lavender-border)",
    borderRadius: "4px",
    padding: "0.15rem 0.4rem",
  };

  return (
    <div ref={wrapRef} style={{ position: "relative", paddingBottom: "0.6rem" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        style={{
          display: "flex", alignItems: "center", gap: "0.55rem",
          background: "none", border: "none", padding: 0, cursor: "pointer",
        }}
      >
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
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <path d="M1.5 3.5L5 7l3.5-3.5" stroke="var(--muted-light)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Account menu"
          style={{
            position: "absolute",
            top: "calc(100% + 0.6rem)",
            right: 0,
            minWidth: "190px",
            background: "var(--white)",
            border: "1.5px solid var(--lavender-border)",
            borderRadius: "10px",
            boxShadow: "0 8px 32px var(--lavender-shadow)",
            padding: "0.4rem",
            zIndex: 300,
          }}
        >
          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            style={menuItemStyle}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-soft)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            Profile
          </Link>

          <Link
            href="/library"
            role="menuitem"
            onClick={() => setOpen(false)}
            style={menuItemStyle}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-soft)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            My Library
          </Link>

          <span role="menuitem" aria-disabled="true" style={disabledItemStyle}>
            Settings
            <span style={soonTagStyle}>Soon</span>
          </span>

          <div style={{ borderTop: "1px solid var(--lavender-border)", margin: "0.35rem 0" }} />

          <form action={readerSignOut}>
            <button
              type="submit"
              role="menuitem"
              style={{
                ...menuItemStyle,
                width: "100%",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                color: "var(--coral)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-soft)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Logout
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
