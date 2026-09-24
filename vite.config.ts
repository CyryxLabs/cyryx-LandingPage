// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro,
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const buildVersion = process.env.LOVABLE_DEPLOYMENT_ID ?? new Date().toISOString();
const isLighthouseBuild = process.env.LIGHTHOUSE_BUILD === "1";

// Passed through to nitro as-is. Declared as a variable because the wrapper's
// type only lists preset/output/cloudflare, while nitro accepts routeRules too.
const nitroOptions = {
  preset: isLighthouseBuild ? "node" : "vercel",
  // Hero film frames are static and versioned by filename; let browsers and
  // the edge keep them instead of revalidating on every visit.
  routeRules: {
    "/media/**": {
      headers: { "cache-control": "public, max-age=604800, stale-while-revalidate=86400" },
    },
  },
};

export default defineConfig({
  nitro: nitroOptions,
  vite: {
    define: {
      __CYRYX_BUILD_VERSION__: JSON.stringify(buildVersion),
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
