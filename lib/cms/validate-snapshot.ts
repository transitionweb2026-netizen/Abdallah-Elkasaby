/**
 * Validates a CMS snapshot's shape before `applySnapshot()` ever touches it.
 *
 * `applySnapshot()` itself trusts its input — it has to, since it's a plain
 * merge. The actual safety net is here: anything that doesn't structurally
 * match what its field (from `registry.ts`) describes is dropped, with a
 * build-log warning, before the merge runs. A field that's merely empty or
 * incomplete is still accepted (that's a content problem for an editor to
 * fix, not a build-time crash risk); a field whose *type* is wrong — a
 * string where an object belongs, an object where a list belongs — is not.
 */
import type { CatalogEntry, CmsSnapshot } from "./model";
import { catalogKeys, documentKeys } from "./model";
import { catalogRegistry, documents as documentRegistry } from "./registry";
import { isObject, type Field } from "./schema";

function topLevelShapeOk(field: Field, value: unknown): boolean {
  switch (field.kind) {
    case "group":
      return isObject(value);
    case "list":
    case "lines":
    case "blocks":
      return Array.isArray(value);
    case "text":
      return field.bilingual ? isObject(value) : typeof value === "string";
    case "number":
      return typeof value === "number";
    case "boolean":
      return typeof value === "boolean";
    case "select":
    case "icon":
    case "reference":
      return typeof value === "string";
    case "image":
    case "video":
    case "cta":
      return value === null || isObject(value);
    case "note":
      return true;
  }
}

export type ValidatedSnapshot = { snapshot: CmsSnapshot; dropped: string[] };

/** Drops any document or catalog entry whose value doesn't match its registry field's shape. */
export function validateSnapshot(raw: CmsSnapshot): ValidatedSnapshot {
  const dropped: string[] = [];
  if (!raw?.enabled) return { snapshot: raw, dropped };

  const documents: CmsSnapshot["documents"] = {};
  for (const key of documentKeys) {
    const value = raw.documents?.[key];
    if (value === undefined) continue;
    if (topLevelShapeOk(documentRegistry[key].field, value)) documents[key] = value;
    else dropped.push(`document "${key}"`);
  }

  const catalogs: CmsSnapshot["catalogs"] = {};
  for (const key of catalogKeys) {
    const entries = raw.catalogs?.[key];
    if (!entries?.length) continue;
    const groupField: Field = { kind: "group", label: catalogRegistry[key].itemLabel, fields: catalogRegistry[key].fields };
    const valid = entries.filter((entry: CatalogEntry) => {
      if (typeof entry?.slug !== "string" || !entry.slug) {
        dropped.push(`a "${key}" entry with no valid slug`);
        return false;
      }
      if (!topLevelShapeOk(groupField, entry.content)) {
        dropped.push(`"${key}" entry "${entry.slug}"`);
        return false;
      }
      return true;
    });
    if (valid.length) catalogs[key] = valid;
  }

  return { snapshot: { ...raw, documents, catalogs }, dropped };
}
