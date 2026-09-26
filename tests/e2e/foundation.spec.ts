import { test, expect } from "@playwright/test";

test("navigation, demo entry and responsive foundation", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.status()).toBeLessThan(500);
  await page.waitForTimeout(3000);

  const res2 = await page.goto("/verify");
  expect(res2?.status()).toBeLessThan(500);

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
