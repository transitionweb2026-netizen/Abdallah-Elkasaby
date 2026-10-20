import { cmsSnapshot, droppedFields, getContent, usedFallback } from "@/lib/content";

// Written into the static export as /cms-build.json. The admin dashboard
// fetches it from the live site to tell whether published database changes
// are still waiting for a rebuild and redeploy.
export const dynamic = "force-static";

export function GET() {
  getContent(); // resolves usedFallback/droppedFields before they're read below
  return Response.json({
    cmsContent: cmsSnapshot.enabled,
    contentVersion: cmsSnapshot.version ?? null,
    syncedAt: cmsSnapshot.syncedAt ?? null,
    builtAt: new Date().toISOString(),
    usedFallback,
    droppedFields,
  });
}
