/**
 * Browser-only Supabase client. There is no server for this site (static
 * export), so this intentionally does not use `@supabase/ssr`: the admin
 * dashboard runs entirely client-side, authenticates with the publishable
 * key plus the signed-in member's own session, and lets Row Level Security
 * decide what each request may do.
 */
"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabaseKey, supabaseUrl } from "./config";

let client: SupabaseClient | null = null;

/** `null` when Supabase isn't configured — callers fall back to the local demo store. */
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "implicit",
        storageKey: "cms-auth",
      },
    });
  }
  return client;
}
