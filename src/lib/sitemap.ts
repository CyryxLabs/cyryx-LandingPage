import { absoluteSiteUrl } from "@/lib/site-url";

export interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const SECTION_SITEMAPS = [
  "/sitemap-products.xml",
  "/sitemap-solutions.xml",
  "/sitemap-company.xml",
] as const;

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>';

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function buildSitemapIndexXml(paths: readonly string[] = SECTION_SITEMAPS): string {
  return [
    XML_HEADER,
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...paths.map((path) => `  <sitemap><loc>${escapeXml(absoluteSiteUrl(path))}</loc></sitemap>`),
    "</sitemapindex>",
  ].join("\n");
}

export function buildUrlSetXml(entries: readonly SitemapEntry[]): string {
  const urls = entries.map((entry) =>
    [
      "  <url>",
      `    <loc>${escapeXml(absoluteSiteUrl(entry.path))}</loc>`,
      entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>` : null,
      entry.priority ? `    <priority>${entry.priority}</priority>` : null,
      "  </url>",
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    XML_HEADER,
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
  ].join("\n");
}

export function sitemapResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
