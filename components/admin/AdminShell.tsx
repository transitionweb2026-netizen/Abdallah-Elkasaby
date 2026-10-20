"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { documentKeys, catalogKeys } from "@/lib/cms/model";
import { catalogRegistry, documents } from "@/lib/cms/registry";
import { useAdmin } from "./AdminProvider";

type NavGroup = { group: string; items: { href: string; label: string }[] };

function buildNav(): NavGroup[] {
  const groups = new Map<string, { href: string; label: string }[]>();
  for (const key of documentKeys) {
    const def = documents[key];
    const list = groups.get(def.group.en) ?? [];
    list.push({ href: `/admin/documents/${key}`, label: def.label.en });
    groups.set(def.group.en, list);
  }
  for (const key of catalogKeys) {
    const def = catalogRegistry[key];
    const label = `${def.itemLabel.en}s`;
    const list = groups.get(def.group.en) ?? [];
    list.push({ href: `/admin/catalogs/${key}`, label });
    groups.set(def.group.en, list);
  }
  return [...groups.entries()].map(([group, items]) => ({ group, items }));
}

const NAV = buildNav();

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { mode, isAdmin, session, awaitingAccess, signOut, resetLocalDemo, ready } = useAdmin();

  if (!ready) {
    return (
      <div className="login-wrap">
        <p>Loading…</p>
      </div>
    );
  }

  if (mode === "supabase" && !session) {
    return (
      <div className="login-wrap">
        <div className="login-card">
          <h1 className="admin-title">Sign-in required</h1>
          <p className="admin-hint">This dashboard is connected to Supabase. Sign in to continue.</p>
          <Link href="/admin/login" className="btn btn--primary">
            Go to sign in
          </Link>
        </div>
      </div>
    );
  }

  if (mode === "supabase" && awaitingAccess) {
    return (
      <div className="login-wrap">
        <div className="login-card">
          <h1 className="admin-title">No dashboard access yet</h1>
          <p className="admin-hint">
            You are signed in, but no role has been granted to this account. Ask an existing administrator to add you from
            Users &amp; access, or see docs/SUPABASE.md for the first-administrator setup.
          </p>
          <button type="button" className="btn" onClick={() => void signOut()}>
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <nav className="admin-nav" aria-label="Admin navigation">
        <Link href="/admin" className="admin-brand">
          <span className="dot" aria-hidden="true" /> Dr. Elkasaby CMS
        </Link>
        <div className="admin-nav-group">
          <h3>Dashboard</h3>
          <Link href="/admin" aria-current={pathname === "/admin" ? "page" : undefined}>
            Overview
          </Link>
          <Link href="/admin/publishing" aria-current={pathname === "/admin/publishing" ? "page" : undefined}>
            Publishing
          </Link>
          <Link href="/admin/media" aria-current={pathname === "/admin/media" ? "page" : undefined}>
            Media library
          </Link>
          {isAdmin && (
            <Link href="/admin/users" aria-current={pathname === "/admin/users" ? "page" : undefined}>
              Users &amp; access
            </Link>
          )}
        </div>
        {NAV.map((group) => (
          <div key={group.group} className="admin-nav-group">
            <h3>{group.group}</h3>
            {group.items.map((item) => (
              <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
          </div>
        ))}
        <div className="admin-nav-group">
          <button
            type="button"
            className="admin-nav-link btn"
            style={{ width: "100%", marginTop: "0.5rem" }}
            onClick={() => (mode === "local" ? resetLocalDemo() : void signOut())}
          >
            {mode === "local" ? "Reset local demo" : "Sign out"}
          </button>
        </div>
      </nav>
      <main className="admin-main">{children}</main>
    </div>
  );
}
