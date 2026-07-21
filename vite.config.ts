import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const buildVersion =
  process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GITHUB_SHA ?? new Date().toISOString();
const localOutputDir = process.env.CYRYX_NITRO_OUTPUT_DIR;

export default defineConfig({
  css: { transformer: "lightningcss" },
  define: {
    __CYRYX_BUILD_VERSION__: JSON.stringify(buildVersion),
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
    ],
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      importProtection: {
        behavior: "error",
        client: {
          files: ["**/server/**"],
          specifiers: ["server-only"],
        },
      },
      server: { entry: "server" },
    }),
    nitro(localOutputDir ? { output: { dir: localOutputDir } } : {}),
    viteReact(),
  ],
});
