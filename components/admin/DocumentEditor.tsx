"use client";

import { useEffect, useMemo, useState } from "react";
import { defaultContentTree } from "@/content/types";
import { documentPaths, getPath, type DocumentKey } from "@/lib/cms/model";
import { documents } from "@/lib/cms/registry";
import { blocksPublish, blocksSave, validateField, type Json } from "@/lib/cms/schema";
import type { DocumentRecord, Revision } from "@/lib/cms/store/types";
import { useAdmin } from "./AdminProvider";
import { FieldForm } from "./FieldForm";
import { useAsync } from "./useAsync";
import { useFieldEnv } from "./useFieldEnv";
import { useUnsavedWarning } from "./useUnsavedWarning";

export function DocumentEditor({ documentKey }: { documentKey: DocumentKey }) {
  const def = documents[documentKey];
  const { store } = useAdmin();
  const [record, setRecord] = useState<DocumentRecord | null | undefined>(undefined);
  const [draft, setDraft] = useState<Json>(null);
  const [saved, setSaved] = useState<Json>(null);
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const action = useAsync();

  useEffect(() => {
    if (!store) return;
    let active = true;
    store.getDocument(documentKey).then((r) => {
      if (!active) return;
      setRecord(r);
      const seed = r?.draft ?? (getPath(defaultContentTree(), documentPaths[documentKey]) as Json);
      setDraft(seed);
      setSaved(r?.draft ?? null);
      if (r) store.revisions(r.id).then((rev) => active && setRevisions(rev));
    });
    return () => {
      active = false;
    };
  }, [store, documentKey]);

  const dirty = record !== undefined && JSON.stringify(draft) !== JSON.stringify(saved);
  useUnsavedWarning(dirty);

  const issues = useMemo(() => validateField(def.field, draft, documentKey), [def.field, draft, documentKey]);
  const canSave = !blocksSave(issues);
  const canPublish = !blocksPublish(issues);
  const status = record?.published ? (JSON.stringify(record.published) === JSON.stringify(record.draft) ? "published" : "modified") : "draft";

  async function save() {
    if (!store) return;
    await action.run(async () => {
      const next = await store.saveDocumentDraft(documentKey, draft);
      setRecord(next);
      setSaved(next.draft);
    }, "Draft saved.");
  }

  async function publish() {
    if (!store || !record) return;
    await action.run(async () => {
      if (dirty) await store.saveDocumentDraft(documentKey, draft);
      await store.publish("cms_documents", record.id);
      const next = await store.getDocument(documentKey);
      setRecord(next);
      setSaved(next?.draft ?? null);
    }, "Published. Rebuild and redeploy the site to make this live — see Publishing.");
  }

  async function unpublish() {
    if (!store || !record) return;
    await action.run(async () => {
      await store.unpublish("cms_documents", record.id);
      const next = await store.getDocument(documentKey);
      setRecord(next);
    }, "Unpublished.");
  }

  async function revert() {
    if (!store || !record?.published) return;
    await action.run(async () => {
      setDraft(record.published);
      await store.saveDocumentDraft(documentKey, record.published as Json);
      const next = await store.getDocument(documentKey);
      setRecord(next);
      setSaved(next?.draft ?? null);
    }, "Draft reverted to the published version.");
  }

  const { env, pickerNode } = useFieldEnv(draft);

  if (record === undefined) return <p>Loading…</p>;

  return (
    <div>
      <div className="admin-topbar">
        <div>
          <h1 className="admin-title">{def.label.en}</h1>
          <p className="admin-hint">{def.group.en}</p>
        </div>
        <span className={`status-pill status-pill--${status}`}>{status}</span>
      </div>

      {action.error && <div className="banner banner--error">{action.error}</div>}
      {action.success && <div className="banner banner--success">{action.success}</div>}
      {dirty && <div className="banner banner--warn">You have unsaved changes.</div>}

      <div className="admin-card">
        <FieldForm field={def.field} value={draft} path={documentKey} onChange={(v) => setDraft(v)} issues={issues} env={env} />
      </div>
      {pickerNode}

      <div className="btn-row">
        <button type="button" className="btn btn--primary" disabled={!canSave || action.pending} onClick={save}>
          Save draft
        </button>
        <button type="button" className="btn btn--accent" disabled={!canPublish || action.pending} onClick={publish} title={!canPublish ? "Resolve the required fields above before publishing." : undefined}>
          Publish
        </button>
        {record?.published && (
          <button type="button" className="btn" disabled={action.pending} onClick={unpublish}>
            Unpublish
          </button>
        )}
        {record?.published && (
          <button type="button" className="btn" disabled={action.pending} onClick={revert}>
            Revert draft to published
          </button>
        )}
      </div>

      {revisions.length > 0 && (
        <details className="admin-card" style={{ marginTop: "1rem" }}>
          <summary>Revision history ({revisions.length})</summary>
          <table className="admin-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {revisions.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.createdAt).toLocaleString()}</td>
                  <td>{r.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      )}
    </div>
  );
}
