import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { PUBLICATIONS } from "@/data/publications";
import { buildUrlSetXml, sitemapResponse, type SitemapEntry } from "@/lib/sitemap";

const ENTRIES: SitemapEntry[] = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/company", priority: "0.7", changefreq: "monthly" },
  { path: "/research", priority: "0.6", changefreq: "monthly" },
  ...PUBLICATIONS.filter(
    (publication) => publication.status === "published" || publication.status === "new",
  ).map((publication) => ({
    path: `/research/${publication.slug}`,
    priority: "0.6",
    changefreq: "monthly" as const,
  })),
  { path: "/answers", priority: "0.6", changefreq: "monthly" },
  { path: "/answers/what-is-ai-governance", priority: "0.8", changefreq: "monthly" },
  { path: "/answers/what-is-governed-ai-execution", priority: "0.7", changefreq: "monthly" },
  { path: "/answers/ai-execution-system-vs-ai-automation", priority: "0.7", changefreq: "monthly" },
  { path: "/answers/what-are-command-gates-in-ai-systems", priority: "0.7", changefreq: "monthly" },
  { path: "/answers/what-is-goal-grounded-generation", priority: "0.7", changefreq: "monthly" },
  { path: "/answers/how-to-measure-ai-output-quality", priority: "0.7", changefreq: "monthly" },
  { path: "/contact", priority: "0.6", changefreq: "monthly" },
  { path: "/careers", priority: "0.5", changefreq: "monthly" },
  { path: "/privacy", priority: "0.3", changefreq: "yearly" },
  { path: "/terms", priority: "0.3", changefreq: "yearly" },
];

export const Route = createFileRoute("/sitemap-company.xml")({
  server: {
    handlers: {
      GET: async () => sitemapResponse(buildUrlSetXml(ENTRIES)),
    },
  },
});
