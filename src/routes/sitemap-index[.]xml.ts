import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://cyryxlabs.com";

const SECTION_SITEMAPS = [
  "/sitemap-products.xml",
  "/sitemap-solutions.xml",
  "/sitemap-company.xml",
];

export const Route = createFileRoute("/sitemap-index.xml")({
  server: {
    handlers: {
      GET: async () => {
        const now = new Date().toISOString();
        const body = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...SECTION_SITEMAPS.map(
            (p) =>
              `  <sitemap><loc>${BASE_URL}${p}</loc><lastmod>${now}</lastmod></sitemap>`,
          ),
          `</sitemapindex>`,
        ].join("\n");
        return new Response(body, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});