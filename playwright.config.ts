import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";

const sandboxChromium = "/chromium-1194/chrome-linux/chrome";
const chromiumExecutablePath =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ?? (existsSync(sandboxChromium) ? sandboxChromium : undefined);

export default defineConfig({
  testDir: "./tests/accessibility",
  outputDir: "test-results/a11y",
  reporter: process.env.CI ? [["list"], ["html", { outputFolder: "playwright-report/a11y", open: "never" }]] : "list",
  use: {
    baseURL: "http://127.0.0.1:4175",
    launchOptions: chromiumExecutablePath ? { executablePath: chromiumExecutablePath } : undefined,
    trace: "retain-on-failure",
  },
  webServer: {
    command: "bun run dev --host 127.0.0.1 --port 4175",
    url: "http://127.0.0.1:4175",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "hero-a11y-chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1024, height: 900 } },
    },
    {
      name: "hero-a11y-mobile-360",
      use: { ...devices["Pixel 5"], viewport: { width: 360, height: 800 } },
    },
    {
      name: "hero-high-contrast",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1024, height: 900 },
        forcedColors: "active",
      },
    },
  ],
});