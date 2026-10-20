"use client";

import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { isSupabaseConfigured } from "@/lib/cms/config";
import { getSupabaseClient } from "@/lib/cms/supabase";
import { LocalStore } from "@/lib/cms/store/local-store";
import { SupabaseStore } from "@/lib/cms/store/supabase-store";
import type { CmsStore } from "@/lib/cms/store/types";

type Role = "admin" | "editor" | null;

type AdminState = {
  /** "local" = no Supabase configured, everything lives in this browser only. */
  mode: "local" | "supabase";
  ready: boolean;
  store: CmsStore | null;
  session: Session | null;
  role: Role;
  isAdmin: boolean;
  isEditor: boolean;
  /** Signed in to Supabase, but no row in cms_profiles yet (no access until an admin grants a role). */
  awaitingAccess: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  /** Local demo only: wipes local edits and reseeds from the website's bundled content. */
  resetLocalDemo: () => void;
};

const AdminContext = createContext<AdminState | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [client] = useState<SupabaseClient | null>(() => getSupabaseClient());
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [ready, setReady] = useState(!isSupabaseConfigured);
  const [localStore] = useState(() => (isSupabaseConfigured ? null : new LocalStore()));

  useEffect(() => {
    if (!client) return;
    const db = client;
    let active = true;

    async function loadRole(uid: string) {
      const { data } = await db.from("cms_profiles").select("role").eq("user_id", uid).maybeSingle();
      if (active) setRole((data?.role as Role) ?? null);
    }

    db.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session ?? null);
      if (data.session) loadRole(data.session.user.id).finally(() => active && setReady(true));
      else setReady(true);
    });

    const { data: sub } = db.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) loadRole(nextSession.user.id);
      else setRole(null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [client]);

  const store = useMemo<CmsStore | null>(() => {
    if (localStore) return localStore;
    if (client && session) return new SupabaseStore(client);
    return null;
  }, [localStore, client, session]);

  const value: AdminState = {
    mode: isSupabaseConfigured ? "supabase" : "local",
    ready,
    store,
    session,
    role: isSupabaseConfigured ? role : "admin",
    isAdmin: isSupabaseConfigured ? role === "admin" : true,
    isEditor: isSupabaseConfigured ? role === "admin" || role === "editor" : true,
    awaitingAccess: isSupabaseConfigured && Boolean(session) && role === null,
    async signIn(email, password) {
      if (!client) throw new Error("Supabase is not configured.");
      const { error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    async signOut() {
      await client?.auth.signOut();
    },
    resetLocalDemo() {
      localStore?.reset();
      window.location.reload();
    },
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin(): AdminState {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin() must be used inside <AdminProvider>.");
  return ctx;
}
