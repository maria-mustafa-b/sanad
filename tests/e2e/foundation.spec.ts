import { test, expect } from "@playwright/test";

test("navigation, demo entry and responsive foundation", async ({ page }) => {
  // Landing page loads with a heading
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  // Get Started button exists on landing page
  await expect(
    page.getByRole("button", { name: /Get Started/i }).or(
      page.getByRole("link", { name: /Get Started/i })
    )
  ).toBeVisible();

  // Verify page loads with a heading
  await page.goto("/verify");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 10000 });

  // No horizontal scroll (responsive check)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

test("health endpoint reports process availability", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBe(true);
  const result = await response.json();
  expect(["demo", "supabase", "local_demo"]).toContain(result.data.mode);
  expect(result.data.status).toBe("ok");
});
