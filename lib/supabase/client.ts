/*
  ── Supabase browser client ──────────────────────────────────────────────────
  Used in Client Components ("use client") to read public data and handle
  auth sessions. Never passes the service-role key.
*/
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
