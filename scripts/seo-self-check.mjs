#!/usr/bin/env node
// Deterministic SEO crawl for local previews and post-deploy verification.
//
//   node scripts/seo-self-check.mjs --site=https://www.cyryxlabs.com
//   node scripts/seo-self-check.mjs --site=http://127.0.0.1:4175

const args = Object.fromEntries(
  process.argv.slice(2).map((argument) => {
    const [key, ...value] = argument.replace(/^--/, "").split("=");
    return [key, value.join("=") || "true"];
  }),
);

const SITE = (args.site || "https://www.cyryxlabs.com").replace(/\/$/, "");
const CANONICAL_ORIGIN = (args["canonical-origin"] || "https://www.cyryxlabs.com").replace(
  /\/$/,
  "",
);
const PRIMARY_SITEMAP = `${CANONICAL_ORIGIN}/sitemap.xml`;
const CHECK_TRANSPORT = args.transport === "true" || SITE === CANONICAL_ORIGIN;
const MIN_DESCRIPTION_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 159;

const LEGACY_ALIASES = [
  ["/solutions/ai-integrations", "/solutions/workflow-automation"],
  ["/solutions/ai-product-engineering", "/solutions/custom-ai-product-development"],
  ["/solutions/ai-websites-lead-systems", "/solutions/digital-web-systems"],
  ["/solutions/applied-ai-systems", "/solutions/internal-ai-assistants"],
  ["/solutions/governance-optimization", "/solutions/ai-governance-cost-control"],
];

const results = [];
function record(label, ok, detail = "") {
  results.push({ label, ok, detail });
  console.log(`${ok ? "✓" : "✖"} ${label}${detail ? ` — ${detail}` : ""}`);
}

function requestUrl(publicUrl) {
  const url = new URL(publicUrl, `${CANONICAL_ORIGIN}/`);
  return `${SITE}${url.pathname}${url.search}`;
}

async function get(url, localize = true) {
  const response = await fetch(localize ? requestUrl(url) : url, {
    redirect: "manual",
    headers: { "cache-control": "no-cache", "user-agent": "Cyryx-SEO-Self-Check/2.0" },
  });
  return {
    status: response.status,
    headers: response.headers,
    type: response.headers.get("content-type") || "",
    body: await response.text(),
  };
}

function attributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([:\w-]+)\s*=\s*["']([^"']*)["']/g)].map((match) => [
      match[1].toLowerCase(),
      match[2],
    ]),
  );
}

function findAttribute(html, tagName, selectorName, selectorValue, resultName) {
  for (const match of html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, "gi"))) {
    const attrs = attributes(match[0]);
    if ((attrs[selectorName] || "").toLowerCase() === selectorValue.toLowerCase()) {
      return attrs[resultName];
    }
  }
  return undefined;
}

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
    match[1].trim().replaceAll("&amp;", "&"),
  );
}

async function crawlSitemaps(root) {
  const visited = new Set();
  const sitemapUrls = [];
  const pageUrls = [];
  const memberships = new Map();

  const visit = async (sitemapUrl) => {
    if (visited.has(sitemapUrl)) {
      record(`sitemap reference: ${sitemapUrl}`, false, "cycle or duplicate reference");
      return;
    }
    visited.add(sitemapUrl);
    sitemapUrls.push(sitemapUrl);
    const response = await get(sitemapUrl);
    record(`sitemap status: ${sitemapUrl}`, response.status === 200, `HTTP ${response.status}`);
    if (response.status !== 200) return;

    const entries = extractLocs(response.body);
    record(`sitemap entries: ${sitemapUrl}`, entries.length > 0, `${entries.length} <loc>`);
    if (/<sitemapindex[\s>]/.test(response.body)) {
      for (const entry of entries) await visit(entry);
      return;
    }
    if (!/<urlset[\s>]/.test(response.body)) {
      record(`sitemap format: ${sitemapUrl}`, false, "missing sitemapindex/urlset");
      return;
    }

    for (const entry of entries) {
      pageUrls.push(entry);
      const sources = memberships.get(entry) || [];
      sources.push(sitemapUrl);
      memberships.set(entry, sources);
    }
  };

  await visit(root);
  return { sitemapUrls, pageUrls, memberships };
}

const robots = await get("/robots.txt");
record("robots.txt status", robots.status === 200, `HTTP ${robots.status}`);
for (const agent of [
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "Claude-SearchBot",
  "Claude-User",
  "Applebot",
]) {
  record(
    `robots.txt retrieval agent: ${agent}`,
    new RegExp(`^User-agent:\\s*${agent}\\s*$`, "mi").test(robots.body),
  );
}
record(
  "robots.txt obsolete Claude-Web removed",
  !/^User-agent:\s*Claude-Web\s*$/im.test(robots.body),
);
const sitemapDirectives = [...robots.body.matchAll(/^Sitemap:\s*(\S+)\s*$/gim)].map(
  (match) => match[1],
);
record(
  "robots.txt canonical sitemap",
  sitemapDirectives.length === 1 && sitemapDirectives[0] === PRIMARY_SITEMAP,
  sitemapDirectives.join(", ") || "missing",
);
record(
  "robots.txt does not block all",
  !/^User-agent:\s*\*\s*$\s*Disallow:\s*\/\s*$/im.test(robots.body),
);

const llms = await get("/llms.txt");
record("llms.txt status", llms.status === 200, `HTTP ${llms.status}`);
record("llms.txt reviewed date", /> Last reviewed:\s*\d{4}-\d{2}-\d{2}/.test(llms.body));
record("llms.txt canonical answer hub", llms.body.includes(`${CANONICAL_ORIGIN}/answers`));
record("llms.txt primary CGP DOI", llms.body.includes("https://doi.org/10.5281/zenodo.21045760"));
record("llms.txt no relative markdown links", !/\]\(\/(?!\/)/.test(llms.body));

const inventory = await crawlSitemaps(PRIMARY_SITEMAP);
for (const sitemapUrl of inventory.sitemapUrls) {
  record(`sitemap canonical host: ${sitemapUrl}`, new URL(sitemapUrl).origin === CANONICAL_ORIGIN);
}
for (const [pageUrl, sources] of inventory.memberships) {
  record(`sitemap canonical host: ${pageUrl}`, new URL(pageUrl).origin === CANONICAL_ORIGIN);
  record(`sitemap unique membership: ${pageUrl}`, sources.length === 1, sources.join(", "));
}

const descriptions = new Map();
const internalTargets = new Map();
const incomingSources = new Map();

for (const pageUrl of inventory.pageUrls) {
  const pathname = new URL(pageUrl).pathname;
  const response = await get(pageUrl);
  record(`page direct status: ${pathname}`, response.status === 200, `HTTP ${response.status}`);
  if (response.status !== 200) continue;

  const title = response.body.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() || "";
  const description = findAttribute(response.body, "meta", "name", "description", "content") || "";
  const canonical = findAttribute(response.body, "link", "rel", "canonical", "href");
  const ogUrl = findAttribute(response.body, "meta", "property", "og:url", "content");
  const expectedUrl = pathname === "/" ? `${CANONICAL_ORIGIN}/` : `${CANONICAL_ORIGIN}${pathname}`;

  record(`title: ${pathname}`, title.length > 0 && title.length < 70, `${title.length} chars`);
  record(
    `description: ${pathname}`,
    description.length >= MIN_DESCRIPTION_LENGTH && description.length <= MAX_DESCRIPTION_LENGTH,
    `${description.length} chars`,
  );
  record(`canonical: ${pathname}`, canonical === expectedUrl, canonical || "missing");
  record(`og:url: ${pathname}`, ogUrl === expectedUrl, ogUrl || "missing");
  record(
    `description uniqueness: ${pathname}`,
    !descriptions.has(description),
    descriptions.get(description) ? `matches ${descriptions.get(description)}` : "unique",
  );
  descriptions.set(description, pathname);

  const missingAlt = [...response.body.matchAll(/<img\b[^>]*>/gi)].filter(
    (match) => !("alt" in attributes(match[0])),
  );
  record(
    `image alt decisions: ${pathname}`,
    missingAlt.length === 0,
    `${missingAlt.length} missing`,
  );

  for (const match of response.body.matchAll(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      const parsed = JSON.parse(match[1]);
      const nodes = Array.isArray(parsed?.["@graph"]) ? parsed["@graph"] : [parsed];
      record(`JSON-LD context: ${pathname}`, parsed?.["@context"] === "https://schema.org");
      for (const node of nodes) {
        const type = node?.["@type"];
        record(`JSON-LD type: ${pathname}`, Boolean(type), String(type || "missing"));
        record(
          `JSON-LD legal type: ${pathname}`,
          type !== "PrivacyPolicy" && type !== "TermsOfService",
          String(type),
        );
        if (type === "SoftwareApplication") {
          record(
            `SoftwareApplication evidence: ${pathname}`,
            Boolean(
              node.name &&
              node.offers?.price !== undefined &&
              (node.review || node.aggregateRating),
            ),
          );
        }
      }
    } catch (error) {
      record(
        `JSON-LD parse: ${pathname}`,
        false,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  for (const match of response.body.matchAll(/<a\b[^>]*>/gi)) {
    const attrs = attributes(match[0]);
    const href = attrs.href;
    if (!href || href.startsWith("#") || /^(mailto|tel):/i.test(href)) continue;
    const target = new URL(href, expectedUrl);
    if (!target.hostname.endsWith("cyryxlabs.com")) continue;
    record(
      `internal link host: ${pathname} → ${href}`,
      target.origin === CANONICAL_ORIGIN,
      target.origin,
    );
    const targetKey = `${target.pathname}${target.search}`;
    internalTargets.set(targetKey, pathname);
    if (!(attrs.rel || "").split(/\s+/).includes("nofollow") && target.pathname !== pathname) {
      const sources = incomingSources.get(target.pathname) || new Set();
      sources.add(pathname);
      incomingSources.set(target.pathname, sources);
    }
  }
}

for (const [target, source] of internalTargets) {
  const response = await get(target);
  record(
    `internal link direct: ${source} → ${target}`,
    response.status === 200,
    `HTTP ${response.status}`,
  );
}
for (const pageUrl of inventory.pageUrls) {
  const pathname = new URL(pageUrl).pathname;
  const count = incomingSources.get(pathname)?.size || 0;
  record(`incoming sources: ${pathname}`, count >= 2, `${count} unique non-self pages`);
}

for (const [alias, destination] of LEGACY_ALIASES) {
  const response = await get(`${alias}?utm_source=seo-check`);
  const location = response.headers.get("location") || "";
  const redirected = new URL(location || alias, `${SITE}/`);
  record(`legacy redirect status: ${alias}`, response.status === 308, `HTTP ${response.status}`);
  record(`legacy redirect destination: ${alias}`, redirected.pathname === destination, location);
  record(
    `legacy redirect query: ${alias}`,
    redirected.searchParams.get("utm_source") === "seo-check",
    redirected.search,
  );
  const destinationResponse = await get(destination);
  record(
    `legacy redirect target: ${alias}`,
    destinationResponse.status === 200,
    `HTTP ${destinationResponse.status}`,
  );
}

if (CHECK_TRANSPORT) {
  for (const source of [
    "http://cyryxlabs.com/",
    "http://www.cyryxlabs.com/",
    "https://cyryxlabs.com/",
  ]) {
    const response = await get(source, false);
    const location = response.headers.get("location") || "";
    record(
      `transport redirect: ${source}`,
      (response.status === 301 || response.status === 308) && location === `${CANONICAL_ORIGIN}/`,
      `HTTP ${response.status} → ${location || "missing"}`,
    );
  }
}

const failed = results.filter((result) => !result.ok);
console.log(
  `\n${failed.length === 0 ? "All SEO integrity checks passed." : `${failed.length} failing check(s).`}`,
);
process.exit(failed.length === 0 ? 0 : 1);
