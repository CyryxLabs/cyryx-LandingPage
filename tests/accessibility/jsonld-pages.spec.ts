import { expect, test } from "@playwright/test";

/**
 * Fetches each public page and validates that the rendered JSON-LD
 * blocks are syntactically valid and that the expected schema.org
 * types are present.
 */
const PAGES: { path: string; required: string[] }[] = [
  { path: "/", required: ["Organization", "WebSite"] },
  { path: "/company", required: ["Organization"] },
  { path: "/products/maax-studio", required: ["SoftwareApplication", "BreadcrumbList"] },
  { path: "/solutions", required: ["BreadcrumbList"] },
  { path: "/solutions/ai-websites-lead-systems", required: ["Service", "BreadcrumbList"] },
  { path: "/solutions/workflow-automation", required: ["Service", "BreadcrumbList"] },
  { path: "/solutions/internal-ai-assistants", required: ["Service", "BreadcrumbList"] },
  { path: "/solutions/custom-ai-product-development", required: ["Service", "BreadcrumbList"] },
  { path: "/solutions/ai-integrations", required: ["Service", "BreadcrumbList"] },
  { path: "/solutions/ai-governance-cost-control", required: ["Service", "BreadcrumbList"] },
  { path: "/research", required: ["BreadcrumbList"] },
  { path: "/answers", required: ["BreadcrumbList"] },
  { path: "/answers/what-is-governed-ai-execution", required: ["FAQPage", "BreadcrumbList"] },
  { path: "/answers/ai-execution-system-vs-ai-automation", required: ["FAQPage", "BreadcrumbList"] },
  { path: "/answers/what-are-command-gates-in-ai-systems", required: ["FAQPage", "BreadcrumbList"] },
  { path: "/answers/what-is-goal-grounded-generation", required: ["FAQPage", "BreadcrumbList"] },
  { path: "/answers/how-to-measure-ai-output-quality", required: ["FAQPage", "BreadcrumbList"] },
];

function collectTypes(nodes: unknown[]): Set<string> {
  const types = new Set<string>();
  for (const node of nodes) {
    if (!node || typeof node !== "object") continue;
    const t = (node as Record<string, unknown>)["@type"];
    if (typeof t === "string") types.add(t);
    else if (Array.isArray(t)) t.forEach((x) => typeof x === "string" && types.add(x));
  }
  return types;
}

for (const { path, required } of PAGES) {
  test(`JSON-LD on ${path} parses and includes ${required.join(", ")}`, async ({ page }) => {
    const response = await page.goto(path, { waitUntil: "networkidle" });
    expect(response, `no response for ${path}`).toBeTruthy();
    expect(response!.status(), `bad status for ${path}`).toBe(200);

    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(blocks.length, `no JSON-LD blocks on ${path}`).toBeGreaterThan(0);

    const graph: unknown[] = [];
    for (const raw of blocks) {
      let parsed: unknown;
      expect(() => {
        parsed = JSON.parse(raw);
      }, `invalid JSON-LD JSON on ${path}`).not.toThrow();
      if (parsed && typeof parsed === "object" && Array.isArray((parsed as { "@graph"?: unknown[] })["@graph"])) {
        graph.push(...(parsed as { "@graph": unknown[] })["@graph"]);
      } else {
        graph.push(parsed);
      }
    }

    // schema.org sanity: every node must have @type and (where applicable) @context
    for (const node of graph) {
      expect(node, `null JSON-LD node on ${path}`).toBeTruthy();
      expect((node as Record<string, unknown>)["@type"], `missing @type on ${path}`).toBeDefined();
    }

    const types = collectTypes(graph);
    for (const req of required) {
      expect(types.has(req), `${path}: missing @type ${req} (found: ${[...types].join(",")})`).toBe(true);
    }
  });
}
