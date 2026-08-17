import { expect, test } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const SNAPSHOT = resolve("tests/accessibility/__snapshots__/jsonld.snapshot.json");
const STABLE_KEYS = {
  Organization: [
    "@type",
    "@id",
    "name",
    "legalName",
    "alternateName",
    "url",
    "slogan",
    "foundingDate",
    "areaServed",
    "email",
    "knowsAbout",
  ],
  WebSite: ["@type", "@id", "url", "name"],
  WebPage: ["@type", "@id", "url", "name", "description"],
};

function pick<T extends Record<string, unknown>>(node: T, keys: string[]) {
  return Object.fromEntries(keys.filter((k) => k in node).map((k) => [k, node[k]]));
}

test("schema.org JSON-LD Organization + WebSite + WebPage fields match snapshot", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const graph = blocks.flatMap((raw): Record<string, unknown>[] => {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return Array.isArray(parsed["@graph"])
      ? (parsed["@graph"] as Record<string, unknown>[])
      : [parsed];
  });

  const org = graph.find((node) => node["@type"] === "Organization");
  const site = graph.find((node) => node["@type"] === "WebSite");
  const webPage = graph.find((node) => node["@type"] === "WebPage");
  expect(org, "Organization JSON-LD node missing").toBeTruthy();
  expect(site, "WebSite JSON-LD node missing").toBeTruthy();
  expect(webPage, "WebPage JSON-LD node missing").toBeTruthy();
  if (!org || !site || !webPage) throw new Error("Required homepage JSON-LD node missing");

  const current = {
    Organization: {
      ...pick(org, STABLE_KEYS.Organization),
      sameAsCount: Array.isArray(org.sameAs) ? org.sameAs.length : 0,
    },
    WebSite: pick(site, STABLE_KEYS.WebSite),
    WebPage: pick(webPage, STABLE_KEYS.WebPage),
  };

  if (process.env.UPDATE_JSONLD_SNAPSHOT) {
    writeFileSync(SNAPSHOT, JSON.stringify(current, null, 2) + "\n");
    return;
  }

  const expected = JSON.parse(readFileSync(SNAPSHOT, "utf8"));
  expect(
    current,
    "JSON-LD changed — review and re-run with UPDATE_JSONLD_SNAPSHOT=1 if intentional",
  ).toEqual(expected);
});
