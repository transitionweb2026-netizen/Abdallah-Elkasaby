import { defineConfig } from "@playwright/test";

/**
 * Browser verification against the already-built static export, served by
 * `npm run preview` (scripts/serve-out.mjs, port 4173). Run `npm run build`
 * first; these tests read the real `out/` output, the same files a host
 * would serve — not a dev server.
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:4173",
  },
  reporter: "list",
});
