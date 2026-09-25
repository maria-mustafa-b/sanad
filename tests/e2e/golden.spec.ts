import { test, expect } from "@playwright/test";
test("complete accessible demo journey and public verification", async ({
  page,
}) => {
  await page.goto("/onboarding");
  await page.getByRole("button", { name: "Try Demo" }).click();
  const description = page.getByLabel(
    "Describe the situation in your own words",
  );
  await expect(description).toHaveValue(
    "Meri job chali gayi hai aur August ki salary bhi nahi mili.",
  );
  await page.getByRole("button", { name: "Understand my situation" }).click();
  await expect(
    page.getByRole("heading", { name: "Here’s what SANAD understood." }),
  ).toBeVisible();
  await expect(
    page.getByText("Local example analysis (rule-based simulation)"),
  ).toBeVisible();
  await expect(page.getByLabel("Issue", { exact: true })).toHaveValue(
    "unpaid_wages",
  );
  await page.getByRole("button", { name: "Confirm information" }).click();
  await expect(page.getByText("Your confirmed claim was saved.")).toBeVisible();
  await page
    .getByRole("button", { name: "Issue user-confirmed credential" })
    .click();
  await expect(
    page.getByText("Credential valid · Demo/Testnet Simulation"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Find relevant support" }).click();
  await expect(
    page.getByRole("heading", { name: "Private-sector labour complaint" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Start SANAD journey" })
    .first()
    .click();
  await expect(
    page.getByRole("heading", { name: "Your application journey" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Submit demo journey" }).click();
  await page.getByRole("button", { name: "Simulate under review" }).click();
  await page.getByRole("button", { name: "Simulate document request" }).click();
  await expect(
    page
      .getByRole("status")
      .filter({ hasText: "Additional documents are required" })
      .first(),
  ).toBeVisible();
  await page.getByRole("link", { name: /Open public verification/ }).click();
  await page.getByRole("button", { name: "Verify credential" }).click();
  await expect(page.locator(".verification-result .valid")).toContainText(
    "VALID",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
