"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { media } from "@/content/media";
import { bundledUrls } from "@/lib/cms/bundled";
import { prepareUpload, UploadRejected } from "@/lib/cms/media-upload";
import type { Json } from "@/lib/cms/schema";
import type { MediaRecord } from "@/lib/cms/store/types";
import { useAdmin } from "./AdminProvider";

type Props = {
  kind: "image" | "video";
  /** Also list the site's bundled stock photos (never true for `kind: "video"` — there is no bundled video). */
  allowBundled: boolean;
  onClose: () => void;
  /** `value` is what the field should store: a bundled `MediaKey` string, or `{ assetId }`. */
  onSelect: (value: Json, previewUrl: string) => void;
};

/**
 * One picker, reused by every image/video field: upload a new file, or
 * choose something already in the Media Library (bundled stock photos,
 * shown only when `allowBundled`, plus anything already uploaded).
 */
export function MediaPicker({ kind, allowBundled, onClose, onSelect }: Props) {
  const { store } = useAdmin();
  const canUpload = store?.mode === "supabase";
  const [items, setItems] = useState<MediaRecord[]>([]);
  const [urls, setUrls] = useState<Record<string, { url: string; thumbUrl: string }>>({});
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!store) return;
    let active = true;
    store.listMedia({ page: 1, pageSize: 60, kind }).then(async (result) => {
      if (!active) return;
      const uploaded = result.items.filter((item) => !item.bundledSrc);
      setItems(uploaded);
      setUrls(await store.mediaUrls(uploaded));
    });
    return () => {
      active = false;
    };
  }, [store, kind]);

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !store || !canUpload) return;
    setError(null);
    setUploading(true);
    try {
      const prepared = await prepareUpload(file, kind);
      const record = await store.uploadMedia(prepared, () => {});
      const resolved = await store.mediaUrls([record]);
      onSelect({ assetId: record.id }, resolved[record.id]?.url ?? "");
    } catch (err) {
      setError(err instanceof UploadRejected ? err.reason.en : err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  const bundledEntries = allowBundled && kind === "image" ? Object.keys(media) : [];

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={`Choose ${kind === "image" ? "a photo" : "a video"}`}>
      <div className="modal admin-card">
        <div className="admin-topbar">
          <h2 style={{ margin: 0, fontSize: "1rem" }}>Choose {kind === "image" ? "a photo" : "a video"}</h2>
          <button type="button" className="btn" onClick={onClose}>
            Close
          </button>
        </div>

        {error && <div className="banner banner--error">{error}</div>}

        <label className="btn btn--primary" style={{ cursor: canUpload ? "pointer" : "not-allowed", opacity: canUpload ? 1 : 0.5, display: "inline-block" }}>
          {uploading ? "Uploading…" : `Upload a new ${kind}`}
          <input type="file" accept={`${kind}/*`} hidden disabled={uploading || !canUpload} onChange={onFile} />
        </label>
        {!canUpload && <p className="field-hint">Uploading needs the Supabase connection — not available in the local demo.</p>}

        <div className="media-picker-grid">
          {bundledEntries.map((key) => {
            const { thumbUrl } = bundledUrls(key);
            return (
              <button key={key} type="button" className="admin-card media-picker-item" onClick={() => onSelect(key, thumbUrl)}>
                {/* eslint-disable-next-line @next/next/no-img-element -- admin-only picker thumbnail */}
                <img src={thumbUrl} alt="" className="media-picker-thumb" />
                <span className="media-picker-label">{key} (bundled)</span>
              </button>
            );
          })}
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className="admin-card media-picker-item"
              onClick={() => onSelect({ assetId: item.id }, urls[item.id]?.url ?? "")}
            >
              {item.kind === "image" && urls[item.id] ? (
                // eslint-disable-next-line @next/next/no-img-element -- admin-only picker thumbnail
                <img src={urls[item.id].thumbUrl} alt="" className="media-picker-thumb" />
              ) : (
                <div className="media-picker-thumb media-picker-thumb--placeholder" aria-hidden="true">
                  🎬
                </div>
              )}
              <span className="media-picker-label">{item.title ?? item.originalName ?? item.id}</span>
            </button>
          ))}
        </div>
        {!bundledEntries.length && !items.length && <p className="field-hint">No files yet — upload one above.</p>}
      </div>
    </div>
  );
}
