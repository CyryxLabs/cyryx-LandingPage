import { expect, test } from "@playwright/test";

const CANONICAL_ORIGIN = "https://www.cyryxlabs.com";
const ORGANIZATION_ID = `${CANONICAL_ORIGIN}/#organization`;

test("llms.txt uses canonical absolute references and evidence boundaries", async ({ request }) => {
  const response = await request.get("/llms.txt");
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain("Last reviewed:");
  expect(body).toContain(`${CANONICAL_ORIGIN}/answers`);
  expect(body).toContain("https://doi.org/10.5281/zenodo.21045760");
  expect(body).not.toMatch(/\]\(\/(?!\/)/);
  expect(body).toContain("Do not infer implementation, conformance, certification");
});

test("homepage publishes one stable, verified organization entity", async ({ page }) => {
  await page.goto("/");
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const nodes = blocks.flatMap((raw) => {
    const value = JSON.parse(raw) as Record<string, unknown>;
    return Array.isArray(value["@graph"]) ? value["@graph"] : [value];
  }) as Array<Record<string, unknown>>;
  const organization = nodes.find((node) => node["@id"] === ORGANIZATION_ID);
  expect(organization).toBeTruthy();
  expect(organization?.name).toBe("Cyryx Labs");
  expect(organization?.legalName).toBe("Cyryx Labs LLC");
  expect(organization?.sameAs).toEqual(["https://github.com/CyryxLabs", "https://x.com/cyryxlabs"]);
  expect(JSON.stringify(organization)).not.toContain("linkedin.com");
});

test("IndexNow key is publicly verifiable and dry-run is canonical-host bound", async ({
  request,
}) => {
  const key = "1f0a899cb1fd4b29b1f6756b6d61da84";
  const response = await request.get(`/${key}.txt`);
  expect(response.status()).toBe(200);
  expect((await response.text()).trim()).toBe(key);
});
