import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60000,
  use: {
    baseURL: "http://127.0.0.1:3000",
    launchOptions: process.env.SANAD_CHROMIUM_PATH
      ? {
          executablePath: process.env.SANAD_CHROMIUM_PATH,
          args: ["--no-sandbox", "--disable-gpu"],
        }
      : {},
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobile",
      use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
    },
  ],
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    env: {
      SANAD_MODE: "demo",
      BLOCKCHAIN_MODE: "mock",
      NEXT_PUBLIC_APP_URL: "http://127.0.0.1:3000",
    },
  },
});
