import { test, expect } from "@playwright/test";
test("navigation, demo entry and responsive foundation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Your situation is unique",
  );
  await page.getByRole("link", { name: "Try Demo", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Begin a clearer journey." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Try Demo" }).click();
  await expect(
    page.getByLabel("Describe the situation in your own words"),
  ).toHaveValue("Meri job chali gayi hai aur August ki salary bhi nahi mili.");
  await page.getByRole("link", { name: "Verification", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "A record you can check." }),
  ).toBeVisible();
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
  expect(result.data.mode).toBe("demo");
  expect(result.data.database).toBe("local_demo");
});
