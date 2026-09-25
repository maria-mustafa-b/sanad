import { test, expect } from "@playwright/test";
test("foundation navigation and local example are honest and usable", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Your situation is unique",
  );
  await page.getByRole("link", { name: "Explore the situation flow" }).click();
  await page.getByRole("button", { name: "Load example" }).click();
  await expect(page.getByLabel("What is happening?")).toHaveValue(
    "Meri job chali gayi hai aur August ki salary bhi nahi mili.",
  );
  await expect(page.getByRole("status")).toContainText("Example loaded");
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(page.getByLabel("What is happening?")).toHaveValue("");
  await page.getByRole("link", { name: "Verification", exact: true }).click();
  await expect(
    page.getByText("No credentials have been issued", { exact: false }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
test("health endpoint reports foundation without implying connectivity", async ({
  request,
}) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBe(true);
  expect((await response.json()).data.integrations).toBe("not_yet_connected");
});
