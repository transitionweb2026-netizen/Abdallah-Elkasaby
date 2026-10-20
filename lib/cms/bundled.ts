/**
 * Bridges the site's existing bundled content (content/*.ts + the
 * pre-generated photo variants) into the CMS's generic record shape. Used
 * to seed the local demo store and to build the "import this website's
 * current content into Supabase" payload — never anything else.
 */
import { media } from "@/content/media";
import variants from "@/content/media-variants.generated.json";
import { defaultContentTree } from "@/content/types";
import { buildCatalogSeed, buildDocumentSeed, catalogKeys, type CatalogEntry, type CatalogKey, type DocumentKey } from "./model";
import type { Json, Label } from "./schema";

export type ImportPayload = {
  documents: Record<DocumentKey, Json>;
  catalogs: Record<CatalogKey, CatalogEntry[]>;
  bundledMedia: { src: string; width: number; height: number; alt: Label }[];
};

type Variant = { width: number; height: number; widths: number[]; color: string };
const manifest = variants as Record<string, Variant>;

/** One entry per named slot in content/media.ts — the site's current stock photos. */
export function importPayload(): ImportPayload {
  const tree = defaultContentTree();
  return {
    documents: buildDocumentSeed(tree),
    catalogs: buildCatalogSeed(tree),
    bundledMedia: Object.entries(media).map(([key, slot]) => {
      const variant = manifest[slot.name];
      return { src: key, width: variant?.width ?? 0, height: variant?.height ?? 0, alt: slot.alt };
    }),
  };
}

/** Resolves a bundled media slot's key (content/media.ts) to a URL the admin UI can preview. */
export function bundledUrls(mediaSlotKey: string): { url: string; thumbUrl: string } {
  const slot = media[mediaSlotKey as keyof typeof media];
  if (!slot) return { url: "", thumbUrl: "" };
  const variant = manifest[slot.name];
  const base = `/media/photos/${slot.name}`;
  if (!variant) return { url: `${base}.webp`, thumbUrl: `${base}.webp` };
  const smallest = variant.widths[0] ?? variant.width;
  const biggest = variant.widths.at(-1) ?? variant.width;
  return { url: `${base}-${biggest}.webp`, thumbUrl: `${base}-${smallest}.webp` };
}


export { catalogKeys };
