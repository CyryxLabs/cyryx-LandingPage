import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { buildUrlSetXml, sitemapResponse, type SitemapEntry } from "@/lib/sitemap";

// /products/maax-studio 308s to /products (product discontinued Sep 2026).
const ENTRIES: SitemapEntry[] = [
  { path: "/products", priority: "0.8", changefreq: "monthly" },
  { path: "/products/aexos", priority: "0.8", changefreq: "monthly" },
];

export const Route = createFileRoute("/sitemap-products.xml")({
  server: {
    handlers: {
      GET: async () => sitemapResponse(buildUrlSetXml(ENTRIES)),
    },
  },
});
