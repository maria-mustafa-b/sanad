import { test, expect } from "@playwright/test";

test("navigation, demo entry and responsive foundation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.goto("/understand?demo=1");
  await expect(
    page.getByLabel("Describe the situation in your own words"),
  ).toHaveValue("Meri job chali gayi hai aur August ki salary bhi nahi mili.");
  await page.goto("/verify");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
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
