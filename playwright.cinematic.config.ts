import { defineConfig } from "@playwright/test";
import config from "./playwright.cross-browser.config";

// Review the production build with the original browser and navigation matrix.
// Start the sanctioned local CRM/Gemini stand-ins before running this config.
export default defineConfig({
  ...config,
  workers: 2,
  use: { ...config.use, baseURL: "http://127.0.0.1:4175" },
  webServer: {
    command: "node .output/server/index.mjs",
    url: "http://127.0.0.1:4175",
    reuseExistingServer: true,
    timeout: 120_000,
    env: { HOST: "127.0.0.1", PORT: "4175", PLAYWRIGHT_USE_PRODUCTION_SERVER: "1" },
  },
});
