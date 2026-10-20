"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdmin } from "@/components/admin/AdminProvider";
import { useAsync } from "@/components/admin/useAsync";
import { importPayload } from "@/lib/cms/bundled";
import type { ContentStatusRow, ImportProgress } from "@/lib/cms/store/types";

export default function PublishingPage() {
  const { store, mode, isAdmin } = useAdmin();
  const [rows, setRows] = useState<ContentStatusRow[]>([]);
  const [filter, setFilter] = useState<"all" | ContentStatusRow["status"]>("all");
  const [importProgress, setImportProgress] = useState<ImportProgress | null>(null);
  const [initialized, setInitialized] = useState<boolean | null>(null);
  const action = useAsync();

  async function reload() {
    if (!store) return;
    setRows(await store.contentStatus());
    setInitialized(await store.isInitialized());
  }

  useEffect(() => {
    if (!store) return;
    let active = true;
    store.contentStatus().then((result) => active && setRows(result));
    store.isInitialized().then((result) => active && setInitialized(result));
    return () => {
      active = false;
    };
  }, [store]);

  async function runImport(publish: boolean) {
    if (!store) return;
    await action.run(async () => {
      await store.importContent(importPayload(), { publish }, setImportProgress);
      setImportProgress(null);
      await reload();
    }, publish ? "Imported and published the website's current content." : "Imported the website's current content as drafts.");
  }

  const visible = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  return (
    <AdminShell>
      <h1 className="admin-title">Publishing</h1>
      <p className="admin-hint">
        Publishing a draft here does not change the live website by itself. The static site reads a snapshot taken by{" "}
        <code>npm run cms:sync</code> at build time — run that, then rebuild and redeploy <code>out/</code> to publish for real.
      </p>

      {action.error && <div className="banner banner--error">{action.error}</div>}
      {action.success && <div className="banner banner--success">{action.success}</div>}

      {initialized === false && (
        <div className="admin-card">
          <h2 style={{ marginTop: 0, fontSize: "1rem" }}>Get started: import the website&apos;s current content</h2>
          <p className="admin-hint">
            {mode === "local"
              ? "The local demo is already seeded automatically."
              : "The database is empty. Copy the website's current content in as a starting point, then edit it here."}
          </p>
          {mode !== "local" && (
            <div className="btn-row" style={{ marginTop: 0 }}>
              <button type="button" className="btn" disabled={action.pending || !isAdmin} onClick={() => runImport(false)}>
                Import as drafts
              </button>
              <button type="button" className="btn btn--primary" disabled={action.pending || !isAdmin} onClick={() => runImport(true)}>
                Import and publish immediately
              </button>
            </div>
          )}
          {importProgress && (
            <p className="field-hint">
              {importProgress.label} ({importProgress.done}/{importProgress.total})
            </p>
          )}
        </div>
      )}

      <div className="search-row">
        {(["all", "draft", "modified", "published"] as const).map((f) => (
          <button key={f} type="button" className="btn" onClick={() => setFilter(f)} style={f === filter ? { borderColor: "var(--brand-primary)" } : undefined}>
            {f} {f !== "all" ? `(${rows.filter((r) => r.status === f).length})` : `(${rows.length})`}
          </button>
        ))}
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Content</th>
            <th>Status</th>
            <th>Updated</th>
            <th>Published</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((r) => (
            <tr key={`${r.table}-${r.recordId}`}>
              <td>
                {r.table.replace("cms_", "")} — {r.label}
              </td>
              <td>
                <span className={`status-pill status-pill--${r.status}`}>{r.status}</span>
              </td>
              <td>{new Date(r.updatedAt).toLocaleString()}</td>
              <td>{r.publishedAt ? new Date(r.publishedAt).toLocaleString() : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
