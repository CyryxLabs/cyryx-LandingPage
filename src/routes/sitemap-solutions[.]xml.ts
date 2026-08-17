import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { buildUrlSetXml, sitemapResponse, type SitemapEntry } from "@/lib/sitemap";

const ENTRIES: SitemapEntry[] = [
  { path: "/solutions", priority: "0.8", changefreq: "monthly" },
  { path: "/solutions/ai-strategy-advisory", priority: "0.8", changefreq: "monthly" },
  { path: "/solutions/digital-web-systems", priority: "0.8", changefreq: "monthly" },
  { path: "/solutions/workflow-automation", priority: "0.7", changefreq: "monthly" },
  { path: "/solutions/internal-ai-assistants", priority: "0.7", changefreq: "monthly" },
  { path: "/solutions/custom-ai-product-development", priority: "0.7", changefreq: "monthly" },
  { path: "/solutions/ai-governance-cost-control", priority: "0.7", changefreq: "monthly" },
  { path: "/managed-operations", priority: "0.7", changefreq: "monthly" },
  { path: "/engagement-model", priority: "0.7", changefreq: "monthly" },
  { path: "/start", priority: "0.8", changefreq: "monthly" },
];

export const Route = createFileRoute("/sitemap-solutions.xml")({
  server: {
    handlers: {
      GET: async () => sitemapResponse(buildUrlSetXml(ENTRIES)),
    },
  },
});
