import { expect, test } from "@playwright/test";

/**
 * Local-demo-mode workflow. Requires `out/` to have been built with NO
 * Supabase env vars configured — a materially different build from the one
 * tests/cms.spec.ts assumes, so it's a separate npm script
 * (`test:e2e:local-demo`) and not part of the default `npm run build` /
 * `test:e2e` pass. See docs/CMS.md for exactly how the two are rebuilt.
 */

const base = "http://localhost:4173";

test("shows the local-demo banner, not a real-Supabase claim", async ({ page }) => {
  await page.goto(`${base}/admin/`);
  await expect(page.getByText("Local demo — not connected to Supabase")).toBeVisible();
  await expect(page.getByText(/This is the local demo: every screen works/)).toBeVisible();
});

test("editing a document persists across reload (localStorage), and nowhere else", async ({ page }) => {
  const marker = `Playwright test ${Date.now()}`;

  await page.goto(`${base}/admin/documents/settings.identity/`);
  const enName = page.locator(".field-bilingual-col", { hasText: "EN" }).first().locator("input").first();
  await expect(enName).toBeVisible();
  await enName.fill(marker);

  await page.getByRole("button", { name: "Save draft" }).click();
  await expect(page.getByText("Draft saved.")).toBeVisible();

  // Reload: a real save round-trips through localStorage, not component state.
  await page.reload();
  await expect(page.locator(".field-bilingual-col", { hasText: "EN" }).first().locator("input").first()).toHaveValue(marker);

  // The public site is a separate, already-built export: a local-demo
  // draft (unpublished, and even if published, never synced/rebuilt) must
  // never appear there.
  const homeResponse = await page.goto(`${base}/en/`);
  expect(homeResponse?.status()).toBe(200);
  await expect(page.getByText(marker)).toHaveCount(0);
});

test("replacing an image reference is disabled in local demo, with a clear reason — never a silent fake save", async ({ page }) => {
  await page.goto(`${base}/admin/documents/about.portrait/`);
  const uploadButton = page.getByRole("button", { name: /Upload a photo/i });
  await expect(uploadButton).toBeDisabled();
  await expect(page.getByText(/Uploading needs the Supabase connection/).first()).toBeVisible();

  // Choosing something already in the library has no such restriction —
  // only *uploading a new file* needs Supabase. The picker opens, and (for
  // a pure-upload field like the portrait, no bundled stock photo exists)
  // its own upload control is disabled with the same stated reason.
  await page.getByRole("button", { name: "Choose from library" }).click();
  await expect(page.getByRole("dialog", { name: /Choose a photo/i })).toBeVisible();
  await expect(page.getByText(/Uploading needs the Supabase connection/).last()).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
});

test("the videos page heading is an editable document, independent of the catalog", async ({ page }) => {
  const marker = `Playwright heading ${Date.now()}`;
  await page.goto(`${base}/admin/documents/videos.library/`);
  const enTitle = page.locator(".field-bilingual-col", { hasText: "EN" }).first().locator("input").first();
  await enTitle.fill(marker);
  await page.getByRole("button", { name: "Save draft" }).click();
  await expect(page.getByText("Draft saved.")).toBeVisible();
  await page.reload();
  await expect(page.locator(".field-bilingual-col", { hasText: "EN" }).first().locator("input").first()).toHaveValue(marker);
});

test("a hybrid image field (bundled default + upload) offers both the library picker and an upload button", async ({ page }) => {
  await page.goto(`${base}/admin/documents/pages.home/`);
  // The hero photo is the first image-kind field on this page: bundled by
  // default, so its "use a stock photo instead" reset button only appears
  // once something else is selected — initially it's just upload + choose.
  await expect(page.getByRole("button", { name: /Upload a photo|Replace with a new upload/i }).first()).toBeVisible();
  await page.getByRole("button", { name: "Choose from library" }).first().click();
  const dialog = page.getByRole("dialog", { name: /Choose a photo/i });
  await expect(dialog).toBeVisible();
  // Bundled stock photos are offered for this field — this is the field that replaces the old plain <select>.
  await expect(dialog.getByText("(bundled)").first()).toBeVisible();
  await dialog.getByRole("button", { name: "Close" }).click();
});

test("a video catalog item's source field offers a real video upload, not an image uploader", async ({ page }) => {
  await page.goto(`${base}/admin/catalogs/videos/`);
  await page.getByRole("button", { name: "bariatric-consultation" }).click();
  await page.getByLabel("Source type").selectOption("file");
  // Before the fix, this field was wired as an `image` field: the button
  // said "Upload photo" and the hidden file input only accepted images. The
  // item also has its own poster (an image field with the same "Choose
  // from library" button), so scope to the source field's: it's the last
  // one on the page once "file" is selected.
  await expect(page.getByRole("button", { name: /Upload video/i })).toBeVisible();
  await expect(page.getByRole("button", { name: "Choose from library" }).last()).toBeVisible();
  await expect(page.locator('input[type="file"][accept="video/*"]')).toBeAttached();
});

test("publishing is a real, distinct action from saving, and says a rebuild is still needed", async ({ page }) => {
  await page.goto(`${base}/admin/documents/settings.identity/`);
  // The local demo seeds every document already published, so Unpublish/Revert
  // are visible too — match the Publish button by its exact accessible name.
  await page.getByRole("button", { name: "Publish", exact: true }).click();
  await expect(page.getByText(/Rebuild and redeploy the site to make this live/)).toBeVisible();
});

test("auto-saves a document edit without clicking Save draft, and before navigating away", async ({ page }) => {
  const marker = `Autosave check ${Date.now()}`;
  await page.goto(`${base}/admin/documents/settings.contact/`);
  const field = page.locator(".field-bilingual-col", { hasText: "EN" }).first().locator("input, textarea").first();
  await expect(field).toBeVisible();
  await field.fill(marker);

  // Should show the auto-saving indicator, then the real "Draft saved." success banner,
  // all without ever clicking the Save draft button. A client-side admin nav change never
  // fires beforeunload, so without this, the edit would be silently lost on navigating away.
  await expect(page.getByText("Saving automatically…")).toBeVisible();
  await expect(page.getByText("Draft saved.")).toBeVisible({ timeout: 5000 });

  await page.reload();
  await expect(page.locator(".field-bilingual-col", { hasText: "EN" }).first().locator("input, textarea").first()).toHaveValue(marker);
});

test("flushes a pending edit immediately when navigating away before the debounce fires", async ({ page }) => {
  const marker = `Flush check ${Date.now()}`;
  await page.goto(`${base}/admin/documents/settings.footer/`);
  const field = page.locator(".field-bilingual-col", { hasText: "EN" }).first().locator("input, textarea").first();
  await expect(field).toBeVisible();
  await field.fill(marker);

  // Navigate away almost immediately — well inside the debounce window — via a real
  // admin nav link (a client-side route change, not a full reload).
  await page.waitForTimeout(200);
  await page.getByRole("link", { name: "Doctor identity" }).click();
  await expect(page).toHaveURL(/settings\.identity/);

  // Go back and confirm the edit was flushed on unmount, not lost.
  await page.goto(`${base}/admin/documents/settings.footer/`);
  await expect(page.locator(".field-bilingual-col", { hasText: "EN" }).first().locator("input, textarea").first()).toHaveValue(marker);
});

test("auto-saves a catalog item edit without clicking Save draft", async ({ page }) => {
  const marker = `Catalog autosave ${Date.now()}`;
  await page.goto(`${base}/admin/catalogs/services/`);
  await page.getByRole("button", { name: "bariatric-surgery" }).click();
  const summaryField = page.locator(".field-bilingual-col", { hasText: "EN" }).nth(1).locator("input, textarea").first();
  await expect(summaryField).toBeVisible();
  await summaryField.fill(marker);

  await expect(page.getByText("Saving automatically…")).toBeVisible();
  await expect(page.getByText("Saved.")).toBeVisible({ timeout: 5000 });

  // The catalog item editor's "selected" state lives in React state, not the URL,
  // so reload() lands back on the list — re-enter the item to check persistence.
  await page.reload();
  await page.getByRole("button", { name: "bariatric-surgery" }).click();
  await expect(page.locator(".field-bilingual-col", { hasText: "EN" }).nth(1).locator("input, textarea").first()).toHaveValue(marker);
});
