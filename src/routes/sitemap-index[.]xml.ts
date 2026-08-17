import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { buildSitemapIndexXml, sitemapResponse } from "@/lib/sitemap";

/**
 * Backward-compatible 200 response for previously discovered sitemap-index.xml.
 * robots.txt submits only /sitemap.xml, preventing duplicate sitemap submission.
 */
export const Route = createFileRoute("/sitemap-index.xml")({
  server: {
    handlers: {
      GET: async () => sitemapResponse(buildSitemapIndexXml()),
    },
  },
});
