import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/cross-browser",
  globalSetup: "./tests/support/vite-client-ready.ts",
  outputDir: "test-results/cross-browser",
  reporter: "line",
  timeout: 120_000,
  workers: 1,
  expect: { timeout: 10_000 },
  use: {
    baseURL: "http://127.0.0.1:4180",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "bun run dev --host 127.0.0.1 --port 4180",
    url: "http://127.0.0.1:4180",
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox-desktop",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit-desktop",
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "chromium-android",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "webkit-iphone",
      use: { ...devices["iPhone 13"] },
    },
  ],
});
