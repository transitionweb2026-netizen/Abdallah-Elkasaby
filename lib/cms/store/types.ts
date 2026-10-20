/**
 * The one interface the admin dashboard talks to. `SupabaseStore` and
 * `LocalStore` (the local-demo fallback) both implement it identically, so
 * no screen needs to know or care which one is active.
 */
import type { CatalogKey, DocumentKey } from "../model";
import type { ImportPayload } from "../bundled";
import type { Json, Label } from "../schema";

export class CmsError extends Error {
  constructor(message: string, readonly code?: string) {
    super(message);
    this.name = "CmsError";
  }
}

export type Page<T> = { items: T[]; total: number };

export type DocumentRecord = {
  id: string;
  key: DocumentKey;
  draft: Json;
  published: Json | null;
  publishedAt: string | null;
  updatedAt: string;
};

export type CatalogRecord = {
  id: string;
  catalog: CatalogKey;
  slug: string;
  parentId: string | null;
  sortOrder: number;
  draft: Json;
  published: Json | null;
  publishedAt: string | null;
  updatedAt: string;
  consentConfirmed?: boolean;
  verificationNote?: string | null;
};

export type CatalogQuery = { page: number; pageSize: number; search?: string; parentId?: string | null };

export type MediaRecord = {
  id: string;
  kind: "image" | "video";
  storagePath: string | null;
  thumbPath: string | null;
  bundledSrc: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  width: number | null;
  height: number | null;
  originalName: string | null;
  title: string | null;
  alt: Label;
  isPublic: boolean;
  createdAt: string;
};

export type MediaQuery = { page: number; pageSize: number; search?: string; kind?: "image" | "video" | "all" };

export type MediaUsage = { table: string; recordId: string; label: string; inDraft: boolean; inPublished: boolean };

export type Revision = { id: number; action: "update" | "delete"; draft: Json | null; published: Json | null; createdAt: string };

export type ContentStatusRow = {
  table: string;
  recordId: string;
  label: string;
  status: "draft" | "published" | "modified";
  updatedAt: string;
  publishedAt: string | null;
};

export type PreparedUpload = {
  file: File;
  kind: "image" | "video";
  mimeType: string;
  extension: string;
  width: number | null;
  height: number | null;
  durationSeconds: number | null;
  thumbnail: Blob | null;
};

export type ImportProgress = { done: number; total: number; label: string };

/** Draft vs published vs modified, computed the same way everywhere. */
export function statusOf(draft: Json, published: Json | null): ContentStatusRow["status"] {
  if (published === null || published === undefined) return "draft";
  return JSON.stringify(draft) === JSON.stringify(published) ? "published" : "modified";
}

export interface CmsStore {
  readonly mode: "supabase" | "local";

  getDocument(key: DocumentKey): Promise<DocumentRecord | null>;
  listDocuments(): Promise<DocumentRecord[]>;
  saveDocumentDraft(key: DocumentKey, draft: Json): Promise<DocumentRecord>;

  listCatalog(catalog: CatalogKey, query: CatalogQuery): Promise<Page<CatalogRecord>>;
  listAll(catalog: CatalogKey): Promise<CatalogRecord[]>;
  getCatalogItem(catalog: CatalogKey, id: string): Promise<CatalogRecord | null>;
  createCatalogItem(catalog: CatalogKey, input: { slug: string; parentId: string | null; draft: Json }): Promise<CatalogRecord>;
  saveCatalogDraft(
    catalog: CatalogKey,
    id: string,
    draft: Json,
    extra?: { parentId?: string | null; consentConfirmed?: boolean; verificationNote?: string | null },
  ): Promise<CatalogRecord>;
  deleteCatalogItem(catalog: CatalogKey, id: string): Promise<void>;
  reorder(catalog: CatalogKey, orderedIds: string[]): Promise<void>;

  publish(table: string, id: string): Promise<void>;
  unpublish(table: string, id: string): Promise<void>;
  revertToPublished(table: string, id: string): Promise<void>;
  revisions(recordId: string): Promise<Revision[]>;
  contentStatus(): Promise<ContentStatusRow[]>;
  contentVersion(): Promise<string | null>;

  listMedia(query: MediaQuery): Promise<Page<MediaRecord>>;
  getMedia(id: string): Promise<MediaRecord | null>;
  uploadMedia(upload: PreparedUpload, onProgress: (fraction: number) => void): Promise<MediaRecord>;
  updateMedia(id: string, patch: { title?: string | null; alt?: Label }): Promise<MediaRecord>;
  deleteMedia(id: string): Promise<void>;
  mediaUsage(id: string): Promise<MediaUsage[]>;
  mediaUrls(records: MediaRecord[]): Promise<Record<string, { url: string; thumbUrl: string }>>;

  isInitialized(): Promise<boolean>;
  importContent(payload: ImportPayload, options: { publish: boolean }, onProgress: (progress: ImportProgress) => void): Promise<void>;
}
