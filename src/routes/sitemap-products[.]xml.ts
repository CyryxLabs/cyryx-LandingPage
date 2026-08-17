import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { buildUrlSetXml, sitemapResponse, type SitemapEntry } from "@/lib/sitemap";

const ENTRIES: SitemapEntry[] = [
  { path: "/products", priority: "0.8", changefreq: "monthly" },
  { path: "/products/maax-studio", priority: "0.9", changefreq: "monthly" },
];

export const Route = createFileRoute("/sitemap-products.xml")({
  server: {
    handlers: {
      GET: async () => sitemapResponse(buildUrlSetXml(ENTRIES)),
    },
  },
});
