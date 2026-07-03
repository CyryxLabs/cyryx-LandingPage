import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://cyryxlabs.com";

const ENTRIES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/company", priority: "0.7", changefreq: "monthly" },
  { path: "/research", priority: "0.6", changefreq: "monthly" },
  { path: "/answers", priority: "0.6", changefreq: "monthly" },
  { path: "/answers/what-is-governed-ai-execution", priority: "0.7", changefreq: "monthly" },
  { path: "/answers/ai-execution-system-vs-ai-automation", priority: "0.7", changefreq: "monthly" },
  { path: "/answers/what-are-command-gates-in-ai-systems", priority: "0.7", changefreq: "monthly" },
  { path: "/answers/what-is-goal-grounded-generation", priority: "0.7", changefreq: "monthly" },
  { path: "/answers/how-to-measure-ai-output-quality", priority: "0.7", changefreq: "monthly" },
  { path: "/contact", priority: "0.6", changefreq: "monthly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
];

export const Route = createFileRoute("/sitemap-company.xml")({
  server: {
    handlers: {
      GET: async () => {
        const urls = ENTRIES.map(
          (e) =>
            `  <url><loc>${BASE_URL}${e.path}</loc><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`,
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