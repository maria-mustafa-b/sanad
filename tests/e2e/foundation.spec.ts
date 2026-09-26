import { test, expect } from "@playwright/test";

test("navigation, demo entry and responsive foundation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 15000 });
  await expect(page.locator("[data-testid='cta-get-started']").first()).toBeVisible({ timeout: 10000 });

  await page.goto("/verify");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 15000 });

  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBe(true);
});

test("health endpoint reports process availability", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBe(true);
  const result = await response.json();
  expect(["demo", "supabase", "local_demo"]).toContain(result.data.mode);
  expect(result.data.status).toBe("ok");
});
