import { test, expect } from "@playwright/test";

test("complete accessible demo journey and public verification", async ({
  page,
}) => {
  // Step 1: Landing Hub and trigger demo mode
  await page.goto("/");
  
  // Click Try Demo Mode
  await page.getByRole("button", { name: /Try Demo Mode/ }).click();

  // Now on /journey (JourneyHomeView)
  await expect(page.getByRole("heading", { name: "Tell SANAD what happened." })).toBeVisible();

  // Click Tell SANAD What Happened
  await page.getByRole("button", { name: /Tell SANAD What Happened/ }).click();

  // Now on /tell-sanad (VoiceIntakeView)
  await expect(page.getByRole("heading", { name: /Tell SANAD what happened/i })).toBeVisible();

  // Wait for AI button to be ready (it's called "Yes, Confirm & Structure Case" or "Analyze & Structure My Account")
  // In the file it's: {isProcessing ? t.intake.structuringWait : 'Yes, Confirm & Structure Case'}
  await page.getByRole("button", { name: /Confirm & Structure Case/ }).click();

  // Click "Confirm & Review Summary" on /processing once it becomes ready
  await page.getByRole("button", { name: /Confirm & Review Summary/ }).click({ timeout: 15000 });

  // Wait for Confirm situation heading (on /confirm-situation)
  await expect(page.getByRole("heading", { name: "Is this what happened?" })).toBeVisible({ timeout: 15000 });

  // Click Confirm & Create Verifiable Proof
  await page.getByRole("button", { name: /Confirm & Create Verifiable Proof/ }).click();

  // Now on /my-proof (MyProofVaultView)
  await expect(page.getByText("✓ Tamper-Evident Signed")).toBeVisible();
  
  // Click Step 4: Find Support & Apply
  await page.getByRole("button", { name: "Step 4: Find Support & Apply" }).click();

  // Now on /evidence-application (EvidenceApplicationView)
  await expect(page.getByRole("heading", { name: /Migrant Justice Legal Clinic|South Asian Bilateral Worker Mission/ })).toBeVisible();

  // Click Submit Application
  await page.getByRole("button", { name: /Submit Application/ }).click();

  // Wait for success modal
  await expect(page.getByRole("heading", { name: "Application Successfully Transferred" })).toBeVisible();

  // Click Go to Applications
  await page.getByRole("button", { name: /Go to Applications/ }).click();

  // Now on /applications (ApplicationsTrackingView)
  await expect(page.getByRole("heading", { name: "Applications & Live Case Tracking" })).toBeVisible();

  // Click Public Verification Portal
  await page.getByRole("button", { name: /Public Verification/ }).first().click();

  // Now on /verify
  await page.getByRole("button", { name: "Verify Credential" }).click();
  await expect(page.getByText("✓ Credential Valid")).toBeVisible();

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

