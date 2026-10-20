"use client";

import { useEffect, useRef, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdmin } from "@/components/admin/AdminProvider";
import { useAsync } from "@/components/admin/useAsync";
import { formatBytes, prepareUpload } from "@/lib/cms/media-upload";
import type { MediaRecord, MediaUsage } from "@/lib/cms/store/types";

const PAGE_SIZE = 24;

export default function MediaLibraryPage() {
  const { store, mode, isAdmin } = useAdmin();
  const [items, setItems] = useState<MediaRecord[]>([]);
  const [urls, setUrls] = useState<Record<string, { url: string; thumbUrl: string }>>({});
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState<"all" | "image" | "video">("all");
  const [selected, setSelected] = useState<MediaRecord | null>(null);
  const [usage, setUsage] = useState<MediaUsage[]>([]);
  const [progress, setProgress] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const action = useAsync();

  async function reload() {
    if (!store) return;
    const result = await store.listMedia({ page, pageSize: PAGE_SIZE, search, kind });
    setItems(result.items);
    setTotal(result.total);
    setUrls(await store.mediaUrls(result.items));
  }

  useEffect(() => {
    if (!store) return;
    let active = true;
    store.listMedia({ page, pageSize: PAGE_SIZE, search, kind }).then(async (result) => {
      if (!active) return;
      setItems(result.items);
      setTotal(result.total);
      const resolved = await store.mediaUrls(result.items);
      if (active) setUrls(resolved);
    });
    return () => {
      active = false;
    };
  }, [store, page, search, kind]);

  async function onUpload(file: File) {
    if (!store) return;
    await action.run(async () => {
      const prepared = await prepareUpload(file);
      setProgress(0);
      await store.uploadMedia(prepared, setProgress);
      setProgress(null);
      await reload();
    }, "Uploaded.");
    setProgress(null);
  }

  async function openDetail(item: MediaRecord) {
    setSelected(item);
    if (store) setUsage(await store.mediaUsage(item.id));
  }

  async function saveDetail(title: string, altEn: string, altAr: string) {
    if (!store || !selected) return;
    await action.run(async () => {
      await store.updateMedia(selected.id, { title: title || null, alt: { en: altEn, ar: altAr } });
      await reload();
      setSelected(null);
    }, "Saved.");
  }

  async function remove(item: MediaRecord) {
    if (!store) return;
    if (!confirm(`Delete "${item.title ?? item.originalName ?? item.id}"?`)) return;
    await action.run(async () => {
      await store.deleteMedia(item.id);
      setSelected(null);
      await reload();
    }, "Deleted.");
  }

  return (
    <AdminShell>
      <div className="admin-topbar">
        <div>
          <h1 className="admin-title">Media library</h1>
          <p className="admin-hint">{total} file(s)</p>
        </div>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) onUpload(file);
            }}
          />
          <button type="button" className="btn btn--primary" onClick={() => fileRef.current?.click()}>
            Upload
          </button>
        </div>
      </div>

      {mode === "local" && <div className="banner banner--info">Uploading needs the Supabase connection. The photos already on the website are listed below and can be previewed and relabelled.</div>}
      {action.error && <div className="banner banner--error">{action.error}</div>}
      {progress !== null && <div className="banner banner--info">Uploading… {Math.round(progress * 100)}%</div>}

      <div className="search-row">
        <input placeholder="Search files…" value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} />
        <select value={kind} onChange={(e) => { setPage(1); setKind(e.target.value as typeof kind); }}>
          <option value="all">All</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
        </select>
      </div>

      <div className="admin-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}>
        {items.map((item) => (
          <button key={item.id} type="button" className="admin-card" style={{ textAlign: "start", cursor: "pointer" }} onClick={() => openDetail(item)}>
            {item.kind === "image" && urls[item.id] ? (
              // eslint-disable-next-line @next/next/no-img-element -- admin-only preview of a dynamic, arbitrarily-sized upload
              <img src={urls[item.id].thumbUrl} alt={item.alt.en} style={{ width: "100%", height: 90, objectFit: "cover", borderRadius: 6, marginBottom: "0.4rem" }} />
            ) : (
              <div style={{ width: "100%", height: 90, background: "#eee", borderRadius: 6, marginBottom: "0.4rem", display: "grid", placeItems: "center" }}>🎬</div>
            )}
            <strong style={{ fontSize: "0.78rem", display: "block", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title ?? item.originalName ?? item.bundledSrc ?? item.id}</strong>
            <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
              {item.bundledSrc ? "bundled" : formatBytes(item.sizeBytes)} · {item.isPublic ? "public" : "not public"}
            </span>
          </button>
        ))}
      </div>

      {total > PAGE_SIZE && (
        <div className="btn-row">
          <button type="button" className="btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
          <span>Page {page} of {Math.ceil(total / PAGE_SIZE)}</span>
          <button type="button" className="btn" disabled={page * PAGE_SIZE >= total} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}

      {selected && (
        <MediaDetail
          item={selected}
          url={urls[selected.id]?.url}
          usage={usage}
          canDelete={isAdmin}
          onClose={() => setSelected(null)}
          onSave={saveDetail}
          onDelete={() => remove(selected)}
        />
      )}
    </AdminShell>
  );
}

function MediaDetail({
  item,
  url,
  usage,
  canDelete,
  onClose,
  onSave,
  onDelete,
}: {
  item: MediaRecord;
  url?: string;
  usage: MediaUsage[];
  canDelete: boolean;
  onClose: () => void;
  onSave: (title: string, altEn: string, altAr: string) => void;
  onDelete: () => void;
}) {
  const [title, setTitle] = useState(item.title ?? "");
  const [altEn, setAltEn] = useState(item.alt.en);
  const [altAr, setAltAr] = useState(item.alt.ar);
  // The database (and the local demo's own store) blocks deletion for ANY
  // usage, draft included — not just published — so the button's disabled
  // state must agree, rather than letting a doomed request reach the store.
  const inUse = usage.length > 0;

  return (
    <div className="admin-card" style={{ marginTop: "1rem" }}>
      <div className="admin-topbar">
        <h2 style={{ margin: 0, fontSize: "1rem" }}>File details</h2>
        <button type="button" className="btn" onClick={onClose}>Close</button>
      </div>
      {item.kind === "image" && url && (
        // eslint-disable-next-line @next/next/no-img-element -- admin-only preview of an uploaded file
        <img src={url} alt="" style={{ maxWidth: 240, maxHeight: 180, borderRadius: 8, marginBottom: "0.75rem" }} />
      )}
      <div className="field">
        <label>Title<input type="text" value={title} onChange={(e) => setTitle(e.target.value)} /></label>
      </div>
      <div className="field-bilingual">
        <label className="field-bilingual-col"><span>EN alt text</span><input type="text" value={altEn} onChange={(e) => setAltEn(e.target.value)} /></label>
        <label className="field-bilingual-col"><span>AR alt text</span><input type="text" dir="rtl" value={altAr} onChange={(e) => setAltAr(e.target.value)} /></label>
      </div>
      <p className="field-hint">
        {usage.length ? `Used in ${usage.length} place(s)${usage.some((u) => u.inPublished) ? " (including published content)" : " (draft only)"}.` : "Not currently used by any content."}
      </p>
      <div className="btn-row">
        <button type="button" className="btn btn--primary" onClick={() => onSave(title, altEn, altAr)}>Save</button>
        <button type="button" className="btn btn--danger" disabled={!canDelete || inUse} title={inUse ? "Still used by draft or published content — replace or remove it there first." : !canDelete ? "Only administrators can delete files." : undefined} onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
