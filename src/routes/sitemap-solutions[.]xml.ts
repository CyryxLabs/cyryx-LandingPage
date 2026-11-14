import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { buildUrlSetXml, sitemapResponse, type SitemapEntry } from "@/lib/sitemap";
import { SERVICES } from "@/data/services";

const ENTRIES: SitemapEntry[] = [
  { path: "/solutions", priority: "0.9", changefreq: "monthly" },
  ...SERVICES.map((service) => ({
    path: service.path,
    priority: "0.8",
    changefreq: "monthly" as const,
  })),
  { path: "/engagement-model", priority: "0.7", changefreq: "monthly" },
  { path: "/start", priority: "0.8", changefreq: "monthly" },
  { path: "/brief", priority: "0.7", changefreq: "monthly" },
];

export const Route = createFileRoute("/sitemap-solutions.xml")({
  server: {
    handlers: {
      GET: async () => sitemapResponse(buildUrlSetXml(ENTRIES)),
    },
  },
});
