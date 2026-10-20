/**
 * The site's content, as every public page and component should read it:
 * the bundled `content/*.ts` defaults, with whatever was actually published
 * in the CMS at the last `npm run cms:sync` overlaid on top (see
 * content/types.ts and lib/cms/model.ts). `content/cms-snapshot.json`
 * starts as `{ "enabled": false }`, so until the CMS is connected and
 * synced at least once, this is simply the site's existing bundled content,
 * unchanged — the normal, fully-supported state, not a degraded one.
 *
 * This resolves once per build (there is no server; `next build` runs this
 * module exactly once) and is never draft content or a local-demo edit —
 * `cms_published_site()` (see the migration) and the local demo's own
 * publish step are the only two places a value in this snapshot can have
 * come from, and both exclude drafts by construction.
 *
 * Two layers of safety, not one: `validateSnapshot()` drops anything whose
 * *shape* doesn't match its field in `lib/cms/registry.ts` before the merge
 * ever sees it (a wrong type is the one thing a merge can't recover from —
 * everything else, like a missing optional field, the merge already
 * handles); the try/catch below is the last resort for whatever that first
 * pass couldn't anticipate. Either one can trigger a fallback; `usedFallback`
 * and `droppedFields` (exposed via /cms-build.json) say which.
 */
import { defaultContentTree, type ContentTree } from "@/content/types";
import snapshotJson from "@/content/cms-snapshot.json";
import mediaVariantsJson from "@/content/media-variants.cms.generated.json";
import { applySnapshot, type CmsSnapshot, type MediaVariants } from "@/lib/cms/model";
import { validateSnapshot } from "@/lib/cms/validate-snapshot";

export const cmsSnapshot = snapshotJson as CmsSnapshot;

/** `true` once an unexpected error has forced `getContent()` to fall back to the bundled content entirely. */
export let usedFallback = false;

/** Documents/catalog entries dropped by shape validation (the snapshot itself stayed otherwise intact). */
export let droppedFields: string[] = [];

let cached: ContentTree | null = null;

/** The merged content tree. Never throws: a malformed or partial snapshot falls back to the bundled content rather than failing the build. */
export function getContent(): ContentTree {
  if (cached) return cached;
  const base = defaultContentTree();
  if (!cmsSnapshot?.enabled) {
    cached = base;
    return cached;
  }
  try {
    const { snapshot, dropped } = validateSnapshot(cmsSnapshot);
    if (dropped.length) {
      droppedFields = dropped;
      console.warn(`[cms] dropped from the snapshot for not matching their expected shape: ${dropped.join(", ")}.`);
    }
    cached = applySnapshot(base, snapshot, mediaVariantsJson as MediaVariants);
  } catch (error) {
    // Whatever shape-validation couldn't catch must still never take the
    // whole site down. Fall back to the bundled content and say so loudly
    // in the build log — silently serving stale-but-working content
    // without a trace would violate the "make the fallback behavior
    // clear" rule just as much as crashing would.
    usedFallback = true;
    console.warn(
      "[cms] content/cms-snapshot.json could not be applied, so this build uses the bundled content instead:",
      error instanceof Error ? error.message : error,
    );
    cached = base;
  }
  return cached;
}
