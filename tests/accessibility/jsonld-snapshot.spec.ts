import { expect, test } from "@playwright/test";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const SNAPSHOT = resolve("tests/accessibility/__snapshots__/jsonld.snapshot.json");
const STABLE_KEYS = {
  Organization: [
    "@type", "@id", "name", "legalName", "alternateName", "url", "slogan",
    "foundingDate", "industry", "areaServed", "email", "knowsAbout",
  ],
  SoftwareApplication: [
    "@type", "@id", "name", "alternateName", "applicationCategory",
    "applicationSubCategory", "operatingSystem", "softwareRequirements", "featureList",
  ],
};

function pick<T extends Record<string, unknown>>(node: T, keys: string[]) {
  return Object.fromEntries(keys.filter((k) => k in node).map((k) => [k, node[k]]));
}

test("schema.org JSON-LD Organization + SoftwareApplication fields match snapshot", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const graph = blocks.flatMap((raw) => {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.["@graph"]) ? parsed["@graph"] : [parsed];
  });

  const org = graph.find((n: any) => n["@type"] === "Organization");
  const app = graph.find((n: any) => n["@type"] === "SoftwareApplication");
  expect(org, "Organization JSON-LD node missing").toBeTruthy();
  expect(app, "SoftwareApplication JSON-LD node missing").toBeTruthy();

  const current = {
    Organization: { ...pick(org, STABLE_KEYS.Organization), sameAsCount: Array.isArray(org.sameAs) ? org.sameAs.length : 0 },
    SoftwareApplication: pick(app, STABLE_KEYS.SoftwareApplication),
  };

  if (process.env.UPDATE_JSONLD_SNAPSHOT) {
    writeFileSync(SNAPSHOT, JSON.stringify(current, null, 2) + "\n");
    return;
  }

  const expected = JSON.parse(readFileSync(SNAPSHOT, "utf8"));
  expect(current, "JSON-LD changed — review and re-run with UPDATE_JSONLD_SNAPSHOT=1 if intentional").toEqual(expected);
});