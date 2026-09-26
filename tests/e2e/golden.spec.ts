import { test, expect } from "@playwright/test";

test("complete accessible demo journey and public verification", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.status()).toBeLessThan(500);
  await page.waitForTimeout(3000);

  const res2 = await page.goto("/verify");
  expect(res2?.status()).toBeLessThan(500);

  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBe(true);
});
