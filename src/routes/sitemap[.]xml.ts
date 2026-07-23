import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { PUBLICATIONS } from "@/data/publications";

const BASE_URL = "https://cyryxlabs.com";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/company", changefreq: "monthly", priority: "0.7" },
          { path: "/products", changefreq: "monthly", priority: "0.8" },
          { path: "/products/maax-studio", changefreq: "monthly", priority: "0.9" },
          { path: "/solutions", changefreq: "monthly", priority: "0.8" },
          { path: "/solutions/ai-strategy-advisory", changefreq: "monthly", priority: "0.8" },
          { path: "/solutions/digital-web-systems", changefreq: "monthly", priority: "0.7" },
          { path: "/solutions/workflow-automation", changefreq: "monthly", priority: "0.7" },
          { path: "/solutions/internal-ai-assistants", changefreq: "monthly", priority: "0.7" },
          {
            path: "/solutions/custom-ai-product-development",
            changefreq: "monthly",
            priority: "0.7",
          },
          { path: "/solutions/ai-governance-cost-control", changefreq: "monthly", priority: "0.7" },
          { path: "/managed-operations", changefreq: "monthly", priority: "0.7" },
          { path: "/engagement-model", changefreq: "monthly", priority: "0.7" },
          { path: "/research", changefreq: "monthly", priority: "0.6" },
          { path: "/answers", changefreq: "monthly", priority: "0.6" },
          {
            path: "/answers/what-is-governed-ai-execution",
            changefreq: "monthly",
            priority: "0.7",
          },
          {
            path: "/answers/ai-execution-system-vs-ai-automation",
            changefreq: "monthly",
            priority: "0.7",
          },
          {
            path: "/answers/what-are-command-gates-in-ai-systems",
            changefreq: "monthly",
            priority: "0.7",
          },
          {
            path: "/answers/what-is-goal-grounded-generation",
            changefreq: "monthly",
            priority: "0.7",
          },
          {
            path: "/answers/how-to-measure-ai-output-quality",
            changefreq: "monthly",
            priority: "0.7",
          },
          { path: "/start", changefreq: "monthly", priority: "0.8" },
          { path: "/contact", changefreq: "monthly", priority: "0.6" },
          { path: "/careers", changefreq: "monthly", priority: "0.5" },
          { path: "/privacy", changefreq: "yearly", priority: "0.3" },
          { path: "/terms", changefreq: "yearly", priority: "0.3" },
          ...PUBLICATIONS.filter((p) => p.status !== "draft").map((p) => ({
            path: `/research/${p.slug}`,
            changefreq: "monthly" as const,
            priority: "0.6",
          })),
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
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
