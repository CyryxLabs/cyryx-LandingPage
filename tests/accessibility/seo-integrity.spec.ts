import { expect, test } from "@playwright/test";
import {
  canonicalUrl,
  crawlSitemaps,
  LEGACY_ALIASES,
  PRIMARY_ORIGIN,
  PRIMARY_SITEMAP,
} from "../support/seo-site-contract";

test.describe.configure({ mode: "serial" });

test("public SEO graph is canonical, accessible, unique, and directly linked", async ({
  baseURL,
  page,
  request,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "hero-a11y-chromium",
    "The deterministic SEO crawl runs once in Chromium.",
  );
  test.setTimeout(120_000);
  expect(baseURL).toBeTruthy();

  const robotsResponse = await request.get(`${baseURL}/robots.txt`, { maxRedirects: 0 });
  expect(robotsResponse.status()).toBe(200);
  const robots = await robotsResponse.text();
  const sitemapDirectives = [...robots.matchAll(/^Sitemap:\s*(\S+)\s*$/gim)].map(
    (match) => match[1],
  );
  expect(sitemapDirectives, "robots.txt must submit exactly one canonical sitemap").toEqual([
    PRIMARY_SITEMAP,
  ]);

  const inventory = await crawlSitemaps(request, baseURL!, PRIMARY_SITEMAP);
  expect(inventory.sitemapUrls.length).toBeGreaterThan(1);
  expect(inventory.pageUrls.length).toBeGreaterThan(0);

  for (const sitemapUrl of inventory.sitemapUrls) {
    expect(new URL(sitemapUrl).origin, `${sitemapUrl}: alternate sitemap host`).toBe(
      PRIMARY_ORIGIN,
    );
  }
  for (const [url, sources] of inventory.memberships) {
    expect(new URL(url).origin, `${url}: alternate page host`).toBe(PRIMARY_ORIGIN);
    expect(sources, `${url}: duplicated across sitemaps`).toHaveLength(1);
  }

  const descriptions = new Map<string, string>();
  const incomingSources = new Map<string, Set<string>>();
  const internalTargets = new Map<string, string>();
  const canonicalPaths = new Set(inventory.pageUrls.map((url) => new URL(url).pathname));

  for (const publicUrl of inventory.pageUrls) {
    const pathname = new URL(publicUrl).pathname;
    const response = await page.goto(pathname, { waitUntil: "domcontentloaded" });
    expect(response?.status(), `${pathname}: page status`).toBe(200);

    const expectedUrl = canonicalUrl(pathname);
    const canonicals = await page.locator('link[rel="canonical"]').all();
    const ogUrls = await page.locator('meta[property="og:url"]').all();
    expect(canonicals, `${pathname}: canonical count`).toHaveLength(1);
    expect(ogUrls, `${pathname}: og:url count`).toHaveLength(1);
    expect(await canonicals[0].getAttribute("href"), `${pathname}: canonical`).toBe(expectedUrl);
    expect(await ogUrls[0].getAttribute("content"), `${pathname}: og:url`).toBe(expectedUrl);

    const description =
      (await page.locator('meta[name="description"]').first().getAttribute("content")) ?? "";
    expect(
      description.length,
      `${pathname}: description below Cyryx editorial minimum`,
    ).toBeGreaterThanOrEqual(100);
    expect(description.length, `${pathname}: description too long`).toBeLessThan(160);
    expect(descriptions.get(description), `${pathname}: duplicate description`).toBeUndefined();
    descriptions.set(description, pathname);

    expect(
      await page.locator("img:not([alt])").count(),
      `${pathname}: image without alt decision`,
    ).toBe(0);

    const jsonLdBlocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(jsonLdBlocks.length, `${pathname}: missing JSON-LD`).toBeGreaterThan(0);
    for (const raw of jsonLdBlocks) {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      expect(parsed["@context"], `${pathname}: JSON-LD context`).toBe("https://schema.org");
      const nodes = Array.isArray(parsed["@graph"]) ? parsed["@graph"] : [parsed];
      for (const value of nodes) {
        const node = value as Record<string, unknown>;
        const type = node["@type"];
        expect(type, `${pathname}: JSON-LD node without @type`).toBeTruthy();
        expect(type, `${pathname}: invalid legal schema type`).not.toBe("PrivacyPolicy");
        expect(type, `${pathname}: invalid legal schema type`).not.toBe("TermsOfService");
        if (type === "SoftwareApplication") {
          const offers = node.offers as Record<string, unknown> | undefined;
          expect(node.name, `${pathname}: SoftwareApplication.name`).toBeTruthy();
          expect(offers?.price, `${pathname}: SoftwareApplication.offers.price`).toBeDefined();
          expect(
            node.review || node.aggregateRating,
            `${pathname}: SoftwareApplication review evidence`,
          ).toBeTruthy();
        }
      }
    }

    const anchors = await page.locator("a[href]").evaluateAll((elements) =>
      elements.map((element) => ({
        href: element.getAttribute("href") ?? "",
        rel: element.getAttribute("rel") ?? "",
      })),
    );
    for (const anchor of anchors) {
      if (!anchor.href || anchor.href.startsWith("#") || /^(mailto|tel):/i.test(anchor.href))
        continue;
      const target = new URL(anchor.href, expectedUrl);
      if (!target.hostname.endsWith("cyryxlabs.com")) continue;
      expect(target.origin, `${pathname}: internal link uses redirecting host ${anchor.href}`).toBe(
        PRIMARY_ORIGIN,
      );
      const targetKey = `${target.pathname}${target.search}`;
      internalTargets.set(targetKey, pathname);
      if (!anchor.rel.split(/\s+/).includes("nofollow") && target.pathname !== pathname) {
        const sources = incomingSources.get(target.pathname) ?? new Set<string>();
        sources.add(pathname);
        incomingSources.set(target.pathname, sources);
      }
    }
  }

  for (const [target, source] of internalTargets) {
    const response = await request.get(`${baseURL}${target}`, { maxRedirects: 0 });
    expect(response.status(), `${source} links to redirect/error ${target}`).toBe(200);
  }
  for (const pathname of canonicalPaths) {
    expect(
      incomingSources.get(pathname)?.size ?? 0,
      `${pathname}: fewer than two unique non-self dofollow sources`,
    ).toBeGreaterThanOrEqual(2);
  }
});

for (const [alias, destination] of LEGACY_ALIASES) {
  test(`legacy alias ${alias} is a direct permanent redirect`, async ({
    baseURL,
    request,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "hero-a11y-chromium",
      "Legacy HTTP redirect contracts are browser-independent.",
    );
    const response = await request.get(`${baseURL}${alias}?utm_source=seo-gate`, {
      maxRedirects: 0,
    });
    expect(response.status()).toBe(308);
    const location = response.headers().location;
    expect(location, `${alias}: missing Location`).toBeTruthy();
    const redirected = new URL(location!, baseURL);
    expect(redirected.pathname).toBe(destination);
    expect(redirected.searchParams.get("utm_source"), `${alias}: lost query parameter`).toBe(
      "seo-gate",
    );
    const destinationResponse = await request.get(`${baseURL}${destination}`, { maxRedirects: 0 });
    expect(destinationResponse.status(), `${alias}: destination is not a direct 200`).toBe(200);
  });
}
