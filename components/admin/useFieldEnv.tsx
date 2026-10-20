"use client";

import { useEffect, useState, type ReactNode } from "react";
import { prepareUpload } from "@/lib/cms/media-upload";
import { isObject, type Json } from "@/lib/cms/schema";
import type { MediaRecord } from "@/lib/cms/store/types";
import { useAdmin } from "./AdminProvider";
import type { FieldEnv } from "./FieldForm";
import { MediaPicker } from "./MediaPicker";

/** Every `{assetId}` reference anywhere inside a draft value, so previews can be pre-fetched once. */
function collectAssetIds(value: Json, found: Set<string> = new Set()): Set<string> {
  if (Array.isArray(value)) {
    for (const item of value) collectAssetIds(item, found);
  } else if (isObject(value)) {
    if (typeof value.assetId === "string") found.add(value.assetId);
    for (const v of Object.values(value)) collectAssetIds(v, found);
  }
  return found;
}

type PickerState = { kind: "image" | "video"; allowBundled: boolean; onSelect: (value: Json) => void };

/**
 * Wires `FieldForm`'s generic `uploadAsset`/`pickAsset` hooks to the active
 * store (local demo or Supabase), shared by the document editor and the
 * catalog item editor so neither has to know how uploads or the Media
 * Library picker actually work. Render `pickerNode` next to wherever
 * `env` is passed to `FieldForm`.
 */
export function useFieldEnv(draft: Json): { env: FieldEnv; pickerNode: ReactNode } {
  const { store } = useAdmin();
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [picker, setPicker] = useState<PickerState | null>(null);

  // Resolve a preview for every asset the draft already references, so a
  // freshly opened document/item shows real thumbnails, not blank fields.
  useEffect(() => {
    if (!store) return;
    const ids = [...collectAssetIds(draft)];
    if (!ids.length) return;
    let active = true;
    Promise.all(ids.map((id) => store.getMedia(id))).then(async (records) => {
      const found = records.filter((r): r is MediaRecord => Boolean(r));
      if (!found.length) return;
      const resolved = await store.mediaUrls(found);
      if (!active) return;
      setPreviews((prev) => ({ ...prev, ...Object.fromEntries(found.map((r) => [r.id, resolved[r.id]?.url ?? resolved[r.id]?.thumbUrl ?? ""])) }));
    });
    return () => {
      active = false;
    };
    // Re-run whenever the set of referenced assets actually changes, not on every keystroke elsewhere in the draft.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store, JSON.stringify([...collectAssetIds(draft)].sort())]);

  // Uploading a real file only ever works against Supabase — the local
  // demo's own store deliberately refuses it (see LocalStore.uploadMedia).
  // Picking something *already* in the library (a bundled stock photo, or
  // — in Supabase mode — something already uploaded) has no such
  // restriction, so it stays available in both modes.
  const canUpload = store?.mode === "supabase";

  const env: FieldEnv = {
    assetPreview: previews,
    uploadAsset: canUpload
      ? async (file, kind) => {
          const prepared = await prepareUpload(file, kind);
          const record = await store.uploadMedia(prepared, () => {});
          const resolved = await store.mediaUrls([record]);
          const previewUrl = resolved[record.id]?.url ?? resolved[record.id]?.thumbUrl ?? "";
          setPreviews((prev) => ({ ...prev, [record.id]: previewUrl }));
          return { assetId: record.id, previewUrl };
        }
      : undefined,
    pickAsset: store ? (kind, allowBundled, onSelect) => setPicker({ kind, allowBundled, onSelect }) : undefined,
  };

  const pickerNode =
    picker && store ? (
      <MediaPicker
        kind={picker.kind}
        allowBundled={picker.allowBundled}
        onClose={() => setPicker(null)}
        onSelect={(value, previewUrl) => {
          if (isObject(value) && typeof value.assetId === "string" && previewUrl) {
            setPreviews((prev) => ({ ...prev, [value.assetId as string]: previewUrl }));
          }
          picker.onSelect(value);
          setPicker(null);
        }}
      />
    ) : null;

  return { env, pickerNode };
}
