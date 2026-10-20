import { expect, test } from "@playwright/test";

/**
 * Real-browser verification of the parts a static HTML diff can't see:
 * hydration, console errors, and the admin dashboard's auth gating.
 * Requires `npm run build` to have run first, against the preview server
 * started by `npm run preview` (see playwright.config.ts).
 *
 * The admin tests here assume Supabase IS configured (.env.local has real
 * NEXT_PUBLIC_SUPABASE_* values) — that's this project's actual current
 * state. The local-demo-mode workflow (no Supabase configured) is a
 * materially different build and is covered separately by
 * tests/cms.local-demo.spec.ts, run against its own isolated build.
 */

test.describe("public pages render without console errors", () => {
  for (const path of ["/en/", "/ar/", "/en/about/", "/en/services/", "/en/videos/"]) {
    test(`no console errors on ${path}`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(String(e)));
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(msg.text());
      });
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await page.waitForLoadState("networkidle");
      expect(errors, `console/page errors on ${path}: ${errors.join("\n")}`).toEqual([]);
    });
  }
});

test.describe("admin dashboard — Supabase configured, signed out", () => {
  test("/admin/ gates behind sign-in rather than exposing the dashboard", async ({ page }) => {
    await page.goto("/admin/");
    await expect(page.getByRole("heading", { name: "Sign-in required" })).toBeVisible();
    await expect(page.getByText("This dashboard is connected to Supabase. Sign in to continue.")).toBeVisible();
    await page.getByRole("link", { name: "Go to sign in" }).click();
    await expect(page).toHaveURL(/\/admin\/login\/?$/);
  });

  test("the sign-in form is real (not a mock) and rejects a bogus login", async ({ page }) => {
    await page.goto("/admin/login/");
    await expect(page.getByRole("heading", { name: "Dashboard sign-in" })).toBeVisible();
    await page.getByLabel("Email").fill("does-not-exist@example.com");
    await page.getByLabel("Password").fill("not-the-right-password");
    await page.getByRole("button", { name: "Sign in" }).click();
    // A real Supabase Auth call, rejected — not a client-side mock that would just accept it.
    await expect(page.locator(".banner--error")).toBeVisible({ timeout: 10_000 });
    await expect(page).toHaveURL(/\/admin\/login\/?$/);
  });

  for (const key of ["settings.identity", "services"]) {
    test(`direct links into ${key.includes(".") ? "documents" : "catalogs"}/${key} also gate behind sign-in`, async ({ page }) => {
      const kind = key.includes(".") ? "documents" : "catalogs";
      await page.goto(`/admin/${kind}/${key}/`);
      await expect(page.getByRole("heading", { name: "Sign-in required" })).toBeVisible();
    });
  }
});
