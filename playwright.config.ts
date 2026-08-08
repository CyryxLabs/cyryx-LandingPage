import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";

const sandboxChromium = "/chromium-1194/chrome-linux/chrome";
const chromiumExecutablePath =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ??
  (existsSync(sandboxChromium) ? sandboxChromium : undefined);
const webkitMobileLayoutSpec = /webkit-mobile-layout\.spec\.ts/;

export default defineConfig({
  testDir: "./tests/accessibility",
  globalSetup: "./tests/support/vite-client-ready.ts",
  outputDir: "test-results/a11y",
  // The TanStack/Vite development server can miss or re-register virtual
  // client modules when this heavy browser matrix saturates the host. Keep CI
  // concurrent, but below the point where dev-server hydration becomes flaky.
  workers: process.env.CI ? 4 : undefined,
  reporter: process.env.CI
    ? [["list"], ["html", { outputFolder: "playwright-report/a11y", open: "never" }]]
    : "list",
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
      testIgnore: webkitMobileLayoutSpec,
      use: { ...devices["Desktop Chrome"], viewport: { width: 1024, height: 900 } },
    },
    {
      name: "hero-a11y-mobile-360",
      testIgnore: webkitMobileLayoutSpec,
      use: { ...devices["Pixel 5"], viewport: { width: 360, height: 800 } },
    },
    {
      name: "hero-high-contrast",
      testIgnore: webkitMobileLayoutSpec,
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1024, height: 900 },
        forcedColors: "active",
      },
    },
    {
      name: "safari-mobile",
      testMatch: webkitMobileLayoutSpec,
      use: {
        ...devices["iPhone 13"],
        launchOptions: {},
      },
    },
  ],
});
