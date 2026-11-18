/**
 * Runs automatically before every `npm run build` (npm's own `prebuild`
 * lifecycle hook — the same mechanism `postbuild` already relies on here).
 *
 * If Supabase is configured, syncs the currently published CMS content
 * into content/cms-snapshot.json before the build reads it — so publishing
 * in the dashboard reaches the live site on the next deploy without anyone
 * remembering to run `npm run cms:sync` by hand. If Supabase isn't
 * configured (a fresh clone, or a deliberate local-demo/bundled-only
 * build), this does nothing and the build proceeds on bundled content,
 * exactly as before this script existed.
 *
 * A real sync failure (configured, but the request itself fails) still
 * exits non-zero, which fails the whole build loudly — safer than quietly
 * shipping stale or wrong content.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
nextEnv.loadEnvConfig(root, false, { info() {}, error: console.error });

const configured = Boolean((process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim() && (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "").trim());

if (!configured) {
  console.log("prebuild: Supabase isn't configured — building on bundled content (skipping cms:sync).");
  process.exit(0);
}

console.log("prebuild: Supabase is configured — syncing published CMS content first.");
const result = spawnSync(process.execPath, [path.join(root, "scripts", "cms-sync.mjs")], { stdio: "inherit" });
process.exit(result.status ?? 1);
