import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://cyryxlabs.com";

const ENTRIES = [
  { path: "/solutions", priority: "0.8" },
  { path: "/solutions/digital-web-systems", priority: "0.8" },
  { path: "/solutions/ai-websites-lead-systems", priority: "0.7" },
  { path: "/solutions/workflow-automation", priority: "0.7" },
  { path: "/solutions/internal-ai-assistants", priority: "0.7" },
  { path: "/solutions/custom-ai-product-development", priority: "0.7" },
  { path: "/solutions/ai-integrations", priority: "0.7" },
  { path: "/solutions/ai-governance-cost-control", priority: "0.7" },
  { path: "/managed-operations", priority: "0.7" },
  { path: "/engagement-model", priority: "0.7" },
  { path: "/start", priority: "0.8" },
];

export const Route = createFileRoute("/sitemap-solutions.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = ENTRIES.map(
          (e) =>
            `  <url><loc>${BASE_URL}${e.path}</loc><changefreq>monthly</changefreq><priority>${e.priority}</priority></url>`,
        );
        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});