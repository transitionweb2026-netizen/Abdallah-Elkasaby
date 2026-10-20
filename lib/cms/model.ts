/**
 * Maps between the CMS's generic records (documents keyed by a dotted
 * string, catalogs as slug-keyed rows) and the site's real `ContentTree`
 * (content/types.ts). `applySnapshot()` is the one function the static
 * build calls: bundled content, with whatever has actually been published
 * in the CMS overlaid on top.
 */
import { media } from "@/content/media";
import type { ImageRef, MediaKey } from "@/content/media";
import type { ContentTree } from "@/content/types";
import { isObject, type Label, type Json } from "./schema";

// ---- documents --------------------------------------------------------------------------

export const documentKeys = [
  "settings.identity",
  "settings.contact",
  "settings.socials",
  "settings.general",
  "settings.nav",
  "settings.ui",
  "settings.footer",
  "global.finalCta",
  "home.stats",
  "home.intro",
  "home.specialties",
  "home.services",
  "home.results",
  "home.journey",
  "home.expectations",
  "home.reviews",
  "home.articles",
  "pages.home",
  "pages.about",
  "pages.services",
  "pages.results",
  "pages.videos",
  "pages.reviews",
  "pages.articles",
  "pages.contact",
  "services.note",
  "services.journey",
  "services.expectations",
  "services.approach",
  "about.portrait",
  "about.biography",
  "results.gallery",
  "videos.library",
] as const;

export type DocumentKey = (typeof documentKeys)[number];

/** Dot-path into `ContentTree` holding exactly this document's value. */
export const documentPaths: Record<DocumentKey, string> = {
  "settings.identity": "site.doctor",
  "settings.contact": "site.contact",
  "settings.socials": "site.socials",
  "settings.general": "site.settings",
  "settings.nav": "site.navLabels",
  "settings.ui": "site.ui",
  "settings.footer": "site.footer",
  "global.finalCta": "global.finalCta",
  "home.stats": "home.stats",
  "home.intro": "home.intro",
  "home.specialties": "home.specialties",
  "home.services": "home.services",
  "home.results": "home.results",
  "home.journey": "home.journey",
  "home.expectations": "home.expectations",
  "home.reviews": "home.reviews",
  "home.articles": "home.articles",
  "pages.home": "pages.home",
  "pages.about": "pages.about",
  "pages.services": "pages.services",
  "pages.results": "pages.results",
  "pages.videos": "pages.videos",
  "pages.reviews": "pages.reviews",
  "pages.articles": "pages.articles",
  "pages.contact": "pages.contact",
  "services.note": "practice.servicesNote",
  "services.journey": "practice.journey",
  "services.expectations": "practice.expectations",
  "services.approach": "practice.approach",
  "about.portrait": "about.portrait",
  "about.biography": "about.biography",
  "results.gallery": "results.disclaimer",
  "videos.library": "videosLibrary",
};

export function getPath(tree: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((node, key) => (node && typeof node === "object" ? (node as Record<string, unknown>)[key] : undefined), tree);
}

export function setPath<T extends object>(tree: T, path: string, value: unknown): T {
  const clone: Record<string, unknown> = structuredClone(tree as unknown as Record<string, unknown>);
  const keys = path.split(".");
  let node = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    node[key] = typeof node[key] === "object" && node[key] !== null ? structuredClone(node[key]) : {};
    node = node[key] as Record<string, unknown>;
  }
  node[keys.at(-1)!] = value;
  return clone as T;
}

// ---- catalogs ----------------------------------------------------------------------------

export const catalogKeys = [
  "serviceGroups",
  "services",
  "specialties",
  "videos",
  "reviews",
  "faqCategories",
  "faqs",
  "articles",
  "beforeAfterCases",
  "credentials",
  "timeline",
  "certificates",
] as const;

export type CatalogKey = (typeof catalogKeys)[number];

export type CatalogDef = { table: string; label: Label; parent?: CatalogKey; parentColumn?: string };

export const catalogs: Record<CatalogKey, CatalogDef> = {
  serviceGroups: { table: "cms_service_groups", label: { en: "Service groups", ar: "فئات الخدمات" } },
  services: { table: "cms_services", label: { en: "Services", ar: "الخدمات" }, parent: "serviceGroups", parentColumn: "group_id" },
  specialties: { table: "cms_specialties", label: { en: "Key specialties", ar: "التخصصات الرئيسية" } },
  videos: { table: "cms_videos", label: { en: "Videos", ar: "الفيديوهات" } },
  reviews: { table: "cms_reviews", label: { en: "Reviews", ar: "المراجعات" } },
  faqCategories: { table: "cms_faq_categories", label: { en: "FAQ categories", ar: "فئات الأسئلة الشائعة" } },
  faqs: { table: "cms_faqs", label: { en: "FAQ items", ar: "الأسئلة الشائعة" }, parent: "faqCategories", parentColumn: "category_id" },
  articles: { table: "cms_articles", label: { en: "Articles", ar: "المقالات" } },
  beforeAfterCases: { table: "cms_before_after_cases", label: { en: "Before & after cases", ar: "حالات قبل وبعد" } },
  credentials: { table: "cms_credentials", label: { en: "Credentials", ar: "المؤهلات" } },
  timeline: { table: "cms_timeline", label: { en: "Career timeline", ar: "المسار المهني" } },
  certificates: { table: "cms_certificates", label: { en: "Certificates", ar: "الشهادات" } },
};

export const tableToCatalog: Record<string, CatalogKey> = Object.fromEntries(
  catalogKeys.map((key) => [catalogs[key].table, key]),
) as Record<string, CatalogKey>;

export type CatalogEntry = { slug: string; parent?: string; content: Json };

// ---- seeding: ContentTree -> generic catalog rows (used to import the website's own content) ----

export function buildCatalogSeed(tree: ContentTree): Record<CatalogKey, CatalogEntry[]> {
  return {
    serviceGroups: Object.entries(tree.practice.serviceGroups).map(([slug, g]) => ({ slug, content: g as unknown as Json })),
    services: tree.practice.services.map((s) => ({ slug: s.slug, parent: s.group, content: s as unknown as Json })),
    specialties: tree.practice.specialties.map((s) => ({ slug: s.slug, content: s as unknown as Json })),
    videos: tree.videos.map((v) => ({ slug: v.id, content: v as unknown as Json })),
    reviews: tree.reviews.map((r) => ({ slug: r.id, content: { ...r, isPlaceholder: r.sample ?? false } as unknown as Json })),
    faqCategories: tree.faq.map((g) => ({ slug: g.id, content: { icon: g.icon, title: g.title } as unknown as Json })),
    faqs: tree.faq.flatMap((g) => g.items.map((item, i) => ({ slug: `${g.id}-${i + 1}`, parent: g.id, content: item as unknown as Json }))),
    articles: tree.articles.map((a) => ({ slug: a.slug, content: { ...a, isPlaceholder: true } as unknown as Json })),
    beforeAfterCases: tree.results.cases.map((c) => ({ slug: c.id, content: { ...c, isPlaceholder: c.placeholder } as unknown as Json })),
    credentials: tree.about.credentials.map((c, i) => ({ slug: `credential-${i + 1}`, content: c as unknown as Json })),
    timeline: tree.about.timeline.map((t, i) => ({ slug: `timeline-${i + 1}`, content: t as unknown as Json })),
    certificates: tree.about.certificates.map((c, i) => ({ slug: `certificate-${i + 1}`, content: c as unknown as Json })),
  };
}

export function buildDocumentSeed(tree: ContentTree): Record<DocumentKey, Json> {
  return Object.fromEntries(documentKeys.map((key) => [key, getPath(tree, documentPaths[key]) as Json])) as Record<DocumentKey, Json>;
}

// ---- the build-time merge: bundled defaults, overlaid with what the CMS actually published ----

export type CmsSnapshot = {
  enabled: boolean;
  syncedAt?: string;
  version?: string | null;
  documents?: Partial<Record<DocumentKey, Json>>;
  catalogs?: Partial<Record<CatalogKey, CatalogEntry[]>>;
  placeholders?: string[];
};

function asArray<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) && value.length > 0 ? (value as T[]) : fallback;
}

// ---- media: resolving an uploaded asset's id to a real URL --------------------------------
//
// Upload fields (about.portrait.src, certificates[].src, before/after photos,
// video files) store `{ assetId }` in CMS content, never a direct URL — the
// URL depends on where `npm run cms:sync` downloaded that asset's responsive
// variants. `media-variants.cms.generated.json` is that lookup table, keyed
// by asset id. A reference to an asset the sync hasn't produced a variant
// for (not yet synced, or no longer public) resolves to `null` — the same
// "nothing here yet" state the bundled content already renders safely,
// never a crash.

export type MediaVariant = { width: number; height: number; widths: number[]; color: string };
export type MediaVariants = Record<string, MediaVariant>;

function isAssetRef(value: unknown): value is { assetId: string; alt?: unknown } {
  return isObject(value) && typeof value.assetId === "string";
}

function resolveAssetSrc(assetId: string, variants: MediaVariants): string | null {
  const variant = variants[assetId];
  if (!variant) return null;
  const biggest = variant.widths.at(-1) ?? variant.width;
  return `/media/cms/cms-${assetId}-${biggest}.webp`;
}

/** `{assetId}` -> a URL string; a plain string or `null` (the bundled shape) passes through unchanged. */
function resolveImageValue(value: unknown, variants: MediaVariants): string | null {
  if (isAssetRef(value)) return resolveAssetSrc(value.assetId, variants);
  return typeof value === "string" ? value : null;
}

function isKnownMediaKey(value: unknown): value is MediaKey {
  return typeof value === "string" && value in media;
}

/**
 * Resolves a `hybridImage()` field's stored value — one of the site's
 * bundled stock photos (a plain `MediaKey` string, the only value
 * content/*.ts ever assigns) or an uploaded replacement (`{assetId, alt?}`)
 * — into what `components/ui/Media` can actually render. Falls back to
 * `fallback` (always a valid, already-resolved `ImageRef`) rather than
 * ever producing `null`: unlike the doctor's portrait or a certificate
 * scan, these fields always show *some* photo, bundled default included.
 */
function resolveImageRef(value: unknown, variants: MediaVariants, fallback: ImageRef): ImageRef {
  if (isKnownMediaKey(value)) return value;
  if (isAssetRef(value)) {
    const variant = variants[value.assetId];
    if (!variant) return fallback;
    const base = `/media/cms/cms-${value.assetId}`;
    const biggest = variant.widths.at(-1) ?? variant.width;
    return {
      src: `${base}-${biggest}.webp`,
      srcSet: variant.widths.map((w) => `${base}-${w}.webp ${w}w`).join(", "),
      width: variant.width,
      height: variant.height,
      color: variant.color,
      alt: isObject(value.alt) ? (value.alt as Label) : undefined,
    };
  }
  return fallback;
}

function resolvePortrait(value: unknown, variants: MediaVariants): ContentTree["about"]["portrait"] {
  const v = isObject(value) ? value : {};
  return {
    src: resolveImageValue(v.src, variants),
    alt: isObject(v.alt) ? (v.alt as ContentTree["about"]["portrait"]["alt"]) : { en: "", ar: "" },
    width: typeof v.width === "number" ? v.width : 0,
    height: typeof v.height === "number" ? v.height : 0,
  };
}

function resolveCertificate(value: unknown, variants: MediaVariants): ContentTree["about"]["certificates"][number] {
  const v = isObject(value) ? value : {};
  return {
    src: resolveImageValue(v.src, variants),
    width: typeof v.width === "number" ? v.width : 0,
    height: typeof v.height === "number" ? v.height : 0,
    alt: isObject(v.alt) ? (v.alt as ContentTree["about"]["certificates"][number]["alt"]) : { en: "", ar: "" },
  };
}

/** `{ asset: {assetId}|string|null, alt }` -> `{src,alt} | null` (the registry's `before`/`after` group shape). */
function resolveResultImage(value: unknown, variants: MediaVariants): ContentTree["results"]["cases"][number]["before"] {
  if (!isObject(value)) return null;
  const src = resolveImageValue(value.asset, variants);
  if (!src) return null;
  return { src, alt: isObject(value.alt) ? (value.alt as { en: string; ar: string }) : { en: "", ar: "" } };
}

/** `{type, id?, assetId?}` -> the real `VideoSource` union (or `null` = "coming soon"). */
function resolveVideoSource(value: unknown, variants: MediaVariants): ContentTree["videos"][number]["source"] {
  if (!isObject(value)) return value === null ? null : (value as ContentTree["videos"][number]["source"]);
  if (value.type === "youtube" && typeof value.id === "string" && value.id) return { type: "youtube", id: value.id };
  if (value.type === "file") {
    // A literal bundled path (content/videos.ts, authored directly — see its
    // header comment) passes straight through; an uploaded replacement is
    // resolved from its asset id, nested (legacy group shape) or flat
    // (the current `kind: "video"` field).
    if (typeof value.src === "string" && value.src) return { type: "file", src: value.src };
    const src = isAssetRef(value.asset) ? resolveAssetSrc(value.asset.assetId, variants) : isAssetRef(value) ? resolveAssetSrc(value.assetId, variants) : null;
    if (src) return { type: "file", src };
  }
  return null;
}

/**
 * Bundled content, overlaid with published CMS content. Returns `base`
 * unchanged (same reference) when there is no snapshot or it is disabled —
 * i.e. the ordinary, fully-supported "no Supabase connected yet" state.
 */
export function applySnapshot(base: ContentTree, snapshot: CmsSnapshot | null | undefined, mediaVariants: MediaVariants = {}): ContentTree {
  if (!snapshot?.enabled) return base;

  let tree: ContentTree = structuredClone(base);
  for (const key of documentKeys) {
    const value = snapshot.documents?.[key];
    if (value !== undefined) tree = setPath(tree, documentPaths[key], value);
  }
  // Idempotent either way: resolves a CMS-provided {assetId}, or passes an
  // already-correct bundled string/null straight through.
  tree.about.portrait = resolvePortrait(tree.about.portrait, mediaVariants);
  tree.about.biography.image = resolveImageRef(tree.about.biography.image, mediaVariants, base.about.biography.image);
  tree.home.intro.image = resolveImageRef(tree.home.intro.image, mediaVariants, base.home.intro.image);
  tree.home.expectations.image = resolveImageRef(tree.home.expectations.image, mediaVariants, base.home.expectations.image);
  for (const key of Object.keys(tree.pages) as Array<keyof ContentTree["pages"]>) {
    tree.pages[key].hero.image = resolveImageRef(tree.pages[key].hero.image, mediaVariants, base.pages[key].hero.image);
  }

  const cat = snapshot.catalogs ?? {};
  // A single, reasonable fallback when a catalog is republished with more or
  // fewer rows than the bundled set has (so there's no 1:1 index to fall
  // back to): the bundled set's own first image, which always exists.
  const fallbackServiceImage: ImageRef = base.practice.services[0]?.image ?? "stethoscope";
  const fallbackSpecialtyImage: ImageRef = base.practice.specialties[0]?.image ?? "stethoscope";
  const fallbackArticleImage: ImageRef = base.articles[0]?.image ?? "stethoscope";
  const fallbackPoster: ImageRef = base.videos[0]?.poster ?? "stethoscope";

  if (cat.serviceGroups?.length) {
    tree.practice.serviceGroups = Object.fromEntries(
      cat.serviceGroups.map((e) => [e.slug, e.content]),
    ) as ContentTree["practice"]["serviceGroups"];
  }
  if (cat.services?.length) {
    tree.practice.services = cat.services.map((e) => {
      const content = e.content as Record<string, unknown>;
      return { ...content, slug: e.slug, group: e.parent, image: resolveImageRef(content.image, mediaVariants, fallbackServiceImage) } as ContentTree["practice"]["services"][number];
    });
  }
  tree.practice.specialties = asArray(
    cat.specialties?.map((e) => {
      const content = e.content as Record<string, unknown>;
      return { ...content, slug: e.slug, image: resolveImageRef(content.image, mediaVariants, fallbackSpecialtyImage) } as ContentTree["practice"]["specialties"][number];
    }),
    tree.practice.specialties,
  );
  tree.videos = asArray(
    cat.videos?.map((e) => {
      const content = e.content as Record<string, unknown>;
      return {
        ...content,
        id: e.slug,
        poster: resolveImageRef(content.poster, mediaVariants, fallbackPoster),
        source: resolveVideoSource(content.source, mediaVariants),
      } as ContentTree["videos"][number];
    }),
    tree.videos,
  );
  tree.reviews = asArray(
    cat.reviews?.map((e) => ({ ...(e.content as object), id: e.slug }) as ContentTree["reviews"][number]),
    tree.reviews,
  );
  if (cat.faqCategories?.length) {
    const categories = cat.faqCategories.map((e) => ({ ...(e.content as object), id: e.slug, items: [] as unknown[] }) as ContentTree["faq"][number]);
    const bySlug = new Map(categories.map((c) => [c.id, c]));
    for (const item of cat.faqs ?? []) {
      const parent = item.parent ? bySlug.get(item.parent) : undefined;
      parent?.items.push(item.content as ContentTree["faq"][number]["items"][number]);
    }
    tree.faq = categories;
  }
  tree.articles = asArray(
    cat.articles?.map((e) => {
      const content = e.content as Record<string, unknown>;
      return { ...content, slug: e.slug, image: resolveImageRef(content.image, mediaVariants, fallbackArticleImage) } as ContentTree["articles"][number];
    }),
    tree.articles,
  );
  tree.results.cases = asArray(
    cat.beforeAfterCases?.map((e) => {
      const content = e.content as Record<string, unknown>;
      return {
        ...content,
        id: e.slug,
        before: resolveResultImage(content.before, mediaVariants),
        after: resolveResultImage(content.after, mediaVariants),
      } as ContentTree["results"]["cases"][number];
    }),
    tree.results.cases,
  );
  tree.about.credentials = asArray(cat.credentials?.map((e) => e.content as ContentTree["about"]["credentials"][number]), tree.about.credentials);
  tree.about.timeline = asArray(cat.timeline?.map((e) => e.content as ContentTree["about"]["timeline"][number]), tree.about.timeline);
  tree.about.certificates = asArray(
    cat.certificates?.map((e) => resolveCertificate(e.content, mediaVariants)),
    tree.about.certificates,
  );

  return tree;
}
