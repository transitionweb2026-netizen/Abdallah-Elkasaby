"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdmin } from "@/components/admin/AdminProvider";
import type { ContentStatusRow } from "@/lib/cms/store/types";

type BuildInfo = { cmsContent: boolean; contentVersion: string | null; syncedAt: string | null; builtAt: string };

export default function AdminOverviewPage() {
  const { store, mode } = useAdmin();
  const [rows, setRows] = useState<ContentStatusRow[] | null>(null);
  const [dbVersion, setDbVersion] = useState<string | null>(null);
  const [build, setBuild] = useState<BuildInfo | "unavailable" | null>(null);

  useEffect(() => {
    if (!store) return;
    store.contentStatus().then(setRows);
    store.contentVersion().then(setDbVersion);
  }, [store]);

  useEffect(() => {
    fetch("/cms-build.json")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setBuild)
      .catch(() => setBuild("unavailable"));
  }, []);

  const counts = { draft: 0, modified: 0, published: 0 };
  for (const r of rows ?? []) counts[r.status]++;

  const liveBuild = build && build !== "unavailable" ? build : null;
  const liveBehind = Boolean(liveBuild?.cmsContent && dbVersion && liveBuild.contentVersion && new Date(dbVersion) > new Date(liveBuild.contentVersion));

  return (
    <AdminShell>
      <div className="admin-topbar">
        <div>
          <h1 className="admin-title">Overview</h1>
          <p className="admin-hint">Dr. Abdullah Elkasaby — content dashboard</p>
        </div>
        <span className={`admin-badge admin-badge--${mode === "local" ? "local" : "supabase"}`}>
          {mode === "local" ? "Local demo — not connected to Supabase" : "Connected to Supabase"}
        </span>
      </div>

      {mode === "local" && (
        <div className="banner banner--info">
          This is the local demo: every screen works, but edits are saved only in this browser and nothing here ever
          reaches the live website. Connect Supabase (see docs/SUPABASE.md) to manage the real site.
        </div>
      )}

      {liveBehind && (
        <div className="banner banner--warn">
          The database has published changes from {new Date(dbVersion ?? "").toLocaleString()} that the live site (built{" "}
          {liveBuild ? new Date(liveBuild.builtAt).toLocaleString() : ""}) does not have yet. Run{" "}
          <code>npm run cms:sync</code> then rebuild and redeploy — see Publishing.
        </div>
      )}

      <div className="admin-grid">
        <div className="admin-stat">
          <strong>{counts.draft}</strong>
          <span>Draft only</span>
        </div>
        <div className="admin-stat">
          <strong>{counts.modified}</strong>
          <span>Published, with unpublished edits</span>
        </div>
        <div className="admin-stat">
          <strong>{counts.published}</strong>
          <span>Published, up to date</span>
        </div>
      </div>

      <div className="admin-card">
        <h2 style={{ margin: "0 0 0.5rem", fontSize: "1rem" }}>Quick links</h2>
        <div className="btn-row" style={{ marginTop: 0 }}>
          <Link className="btn" href="/admin/documents/settings.identity">
            Global settings
          </Link>
          <Link className="btn" href="/admin/catalogs/services">
            Services
          </Link>
          <Link className="btn" href="/admin/media">
            Media library
          </Link>
          <Link className="btn" href="/admin/publishing">
            Publishing
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
