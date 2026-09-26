import { test, expect } from "@playwright/test";

test("complete accessible demo journey and public verification", async ({
  page,
}) => {
  // Step 1: Landing page loads
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 10000 });

  // Step 2: Navigate to sign-in / get started
  const getStarted = page.getByRole("button", { name: /Get Started/i }).or(
    page.getByRole("link", { name: /Get Started/i })
  );
  await expect(getStarted).toBeVisible({ timeout: 10000 });
  await getStarted.click();

  // Step 3: Auth or Onboarding page loads (either is valid)
  await page.waitForTimeout(1000);
  const currentUrl = page.url();
  expect(
    currentUrl.includes("/auth") ||
    currentUrl.includes("/onboarding") ||
    currentUrl.includes("/dashboard")
  ).toBe(true);

  // Step 4: Navigate directly to chat/voice intake
  await page.goto("/chat");
  await page.waitForTimeout(1000);

  // Step 5: Check that the voice/chat intake page has a main heading
  const headingVisible = await page.getByRole("heading", { level: 1 }).isVisible().catch(() => false);
  // Accept either a heading or a textarea/mic button as proof the page loaded
  const pageHasContent = headingVisible || 
    await page.getByRole("textbox").isVisible().catch(() => false) ||
    await page.getByRole("button", { name: /speak|mic|record|start/i }).isVisible().catch(() => false);
  
  expect(pageHasContent).toBe(true);

  // Step 6: Verify page loads
  await page.goto("/verify");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 10000 });

  // Step 7: Verify input exists on the verify page
  const verifyInput = page.getByRole("textbox").or(
    page.getByPlaceholder(/credential|SANAD/i)
  );
  await expect(verifyInput.first()).toBeVisible({ timeout: 5000 });

  // No horizontal scroll (responsive check)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
