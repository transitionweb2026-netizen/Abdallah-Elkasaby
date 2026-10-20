import type { CatalogKey } from "../model";
import type { Json } from "../schema";

/** Which key inside a catalog entry's `content` holds its human-readable title, for search. */
export const catalogTitleKey: Record<CatalogKey, string> = {
  serviceGroups: "title",
  services: "title",
  specialties: "title",
  videos: "title",
  reviews: "author",
  faqCategories: "title",
  faqs: "q",
  articles: "title",
  beforeAfterCases: "title",
  credentials: "title",
  timeline: "title",
  certificates: "alt",
};

/** Escapes a search term for PostgREST's `ilike` pattern syntax. */
export function postgrestTerm(term: string): string {
  return term.trim().replace(/[%*,()]/g, "");
}

function flattenText(value: Json): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(flattenText).join(" ");
  return Object.values(value).map(flattenText).join(" ");
}

export function catalogSearchText(catalog: CatalogKey, record: { slug: string; draft: Json }): string {
  return `${record.slug} ${flattenText(record.draft)}`.toLowerCase();
}

export function matchesSearch(haystack: string, term: string): boolean {
  const needle = term.trim().toLowerCase();
  return !needle || haystack.toLowerCase().includes(needle);
}
