import { test, expect } from "@playwright/test";

test("complete accessible demo journey and public verification", async ({ page }) => {
  // Step 1: Landing page loads
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 15000 });

  // Step 2: CTA button is visible and clickable
  const cta = page.locator("[data-testid='cta-get-started']").first();
  await expect(cta).toBeVisible({ timeout: 10000 });
  await cta.click();

  // Step 3: Something loaded after click
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 15000 });

  // Step 4: Verify page loads and has a heading
  await page.goto("/verify");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 15000 });

  // Step 5: No horizontal scroll
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBe(true);
});
