"use client";
/*
  ── MobileNavAvatar ───────────────────────────────────────────────────────────
  Small circular avatar shortcut for the mobile bottom bar (the "bookmark"
  action row). Renders nothing for signed-out visitors — sign in / create
  account already live in the mobile menu — so the bar's layout never shifts
  for guests.

  Sprint 4A.4 — integration only, reuses the existing bottom-bar styling
  (.mobile-page-counter sizing) rather than introducing new visual language.
*/
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function MobileNavAvatar() {
  const [avatarUrl, setAvatarUrl]     = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [loggedIn, setLoggedIn]       = useState(false);
  const [ready, setReady]             = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    const load = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (cancelled) return;
        if (error) { setReady(true); return; }

        setLoggedIn(!!user);
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

    load();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session?.user);
      if (!session?.user) { setAvatarUrl(null); setDisplayName(""); }
      setReady(true);
    });

    return () => { cancelled = true; subscription.unsubscribe(); };
  }, []);

  if (!ready || !loggedIn) return null;

  const initials = (displayName[0] ?? "R").toUpperCase();

  return (
    <Link
      href="/profile"
      aria-label="Your profile"
      className="mobile-page-counter"
      style={{ padding: 0, overflow: "hidden", textDecoration: "none" }}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt=""
          width={38}
          height={38}
          style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
        />
      ) : (
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", color: "var(--purple-dark)", fontStyle: "italic" }}>
          {initials}
        </span>
      )}
    </Link>
  );
}
