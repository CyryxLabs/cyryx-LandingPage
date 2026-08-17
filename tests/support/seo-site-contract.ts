import type { APIRequestContext } from "@playwright/test";

export const PRIMARY_ORIGIN = "https://www.cyryxlabs.com";
export const PRIMARY_SITEMAP = `${PRIMARY_ORIGIN}/sitemap.xml`;

export const LEGACY_ALIASES = [
  ["/solutions/ai-integrations", "/solutions/workflow-automation"],
  ["/solutions/ai-product-engineering", "/solutions/custom-ai-product-development"],
  ["/solutions/ai-websites-lead-systems", "/solutions/digital-web-systems"],
  ["/solutions/applied-ai-systems", "/solutions/internal-ai-assistants"],
  ["/solutions/governance-optimization", "/solutions/ai-governance-cost-control"],
] as const;

export interface SitemapInventory {
  sitemapUrls: string[];
  pageUrls: string[];
  memberships: Map<string, string[]>;
}

export function canonicalUrl(pathname: string): string {
  return pathname === "/" ? `${PRIMARY_ORIGIN}/` : `${PRIMARY_ORIGIN}${pathname}`;
}

function locs(xml: string): string[] {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
}

function localUrl(baseURL: string, publicUrl: string): string {
  const url = new URL(publicUrl);
  return `${baseURL}${url.pathname}${url.search}`;
}

export async function crawlSitemaps(
  request: APIRequestContext,
  baseURL: string,
  root = PRIMARY_SITEMAP,
): Promise<SitemapInventory> {
  const sitemapUrls: string[] = [];
  const pageUrls: string[] = [];
  const memberships = new Map<string, string[]>();
  const visited = new Set<string>();

  const visit = async (sitemapUrl: string): Promise<void> => {
    if (visited.has(sitemapUrl))
      throw new Error(`Sitemap cycle or duplicate reference: ${sitemapUrl}`);
    visited.add(sitemapUrl);
    sitemapUrls.push(sitemapUrl);

    const response = await request.get(localUrl(baseURL, sitemapUrl), { maxRedirects: 0 });
    if (response.status() !== 200) {
      throw new Error(`Sitemap ${sitemapUrl} returned ${response.status()}, expected 200`);
    }
    const xml = await response.text();
    const entries = locs(xml);
    if (entries.length === 0) throw new Error(`Sitemap ${sitemapUrl} contains no <loc> entries`);

    if (/<sitemapindex[\s>]/.test(xml)) {
      for (const entry of entries) await visit(entry);
      return;
    }
    if (!/<urlset[\s>]/.test(xml)) throw new Error(`Unsupported sitemap document: ${sitemapUrl}`);

    for (const entry of entries) {
      pageUrls.push(entry);
      const sources = memberships.get(entry) ?? [];
      sources.push(sitemapUrl);
      memberships.set(entry, sources);
    }
  };

  await visit(root);
  return { sitemapUrls, pageUrls, memberships };
}
