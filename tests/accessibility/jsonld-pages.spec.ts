import { expect, test } from "@playwright/test";

/**
 * Fetches each public page and validates that the rendered JSON-LD
 * blocks are syntactically valid and that the expected schema.org
 * types are present.
 */
const PAGES: { path: string; required: string[] }[] = [
  { path: "/", required: ["Organization", "WebSite"] },
  { path: "/company", required: ["Organization", "WebPage"] },
  { path: "/products/maax-studio", required: ["WebPage", "BreadcrumbList"] },
  { path: "/solutions", required: ["BreadcrumbList"] },
  { path: "/solutions/ai-strategy-advisory", required: ["Service", "BreadcrumbList"] },
  { path: "/solutions/digital-web-systems", required: ["Service", "BreadcrumbList"] },
  { path: "/solutions/workflow-automation", required: ["Service", "BreadcrumbList"] },
  { path: "/solutions/internal-ai-assistants", required: ["Service", "BreadcrumbList"] },
  { path: "/solutions/custom-ai-product-development", required: ["Service", "BreadcrumbList"] },
  { path: "/solutions/ai-governance-cost-control", required: ["Service", "BreadcrumbList"] },
  { path: "/managed-operations", required: ["Service", "BreadcrumbList"] },
  { path: "/engagement-model", required: ["BreadcrumbList"] },
  { path: "/start", required: ["BreadcrumbList"] },
  { path: "/contact", required: ["BreadcrumbList"] },
  { path: "/careers", required: ["BreadcrumbList"] },
  { path: "/privacy", required: ["WebPage", "BreadcrumbList"] },
  { path: "/terms", required: ["WebPage", "BreadcrumbList"] },
  { path: "/research", required: ["BreadcrumbList"] },
  { path: "/answers", required: ["BreadcrumbList"] },
  {
    path: "/answers/what-is-ai-governance",
    required: ["FAQPage", "BreadcrumbList", "TechArticle"],
  },
  {
    path: "/answers/what-is-governed-ai-execution",
    required: ["FAQPage", "BreadcrumbList", "TechArticle"],
  },
  {
    path: "/answers/ai-execution-system-vs-ai-automation",
    required: ["FAQPage", "BreadcrumbList", "TechArticle"],
  },
  {
    path: "/answers/what-are-command-gates-in-ai-systems",
    required: ["FAQPage", "BreadcrumbList", "TechArticle"],
  },
  {
    path: "/answers/what-is-goal-grounded-generation",
    required: ["FAQPage", "BreadcrumbList", "TechArticle"],
  },
  {
    path: "/answers/how-to-measure-ai-output-quality",
    required: ["FAQPage", "BreadcrumbList", "TechArticle"],
  },
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
    const topLevelNodes: unknown[] = [];
    for (const raw of blocks) {
      let parsed: unknown;
      expect(() => {
        parsed = JSON.parse(raw);
      }, `invalid JSON-LD JSON on ${path}`).not.toThrow();
      if (
        parsed &&
        typeof parsed === "object" &&
        Array.isArray((parsed as { "@graph"?: unknown[] })["@graph"])
      ) {
        graph.push(...(parsed as { "@graph": unknown[] })["@graph"]);
        topLevelNodes.push(parsed);
      } else {
        graph.push(parsed);
        topLevelNodes.push(parsed);
      }
    }

    // Every top-level JSON-LD block must declare @context.
    for (const node of topLevelNodes) {
      expect(
        (node as Record<string, unknown>)["@context"],
        `${path}: top-level JSON-LD missing @context`,
      ).toBe("https://schema.org");
    }

    // schema.org sanity: every node must have @type and (where applicable) @context
    for (const node of graph) {
      expect(node, `null JSON-LD node on ${path}`).toBeTruthy();
      expect((node as Record<string, unknown>)["@type"], `missing @type on ${path}`).toBeDefined();
    }

    const types = collectTypes(graph);
    for (const req of required) {
      expect(types.has(req), `${path}: missing @type ${req} (found: ${[...types].join(",")})`).toBe(
        true,
      );
    }

    // Schema-shape assertions: each node must declare @context and required
    // fields for its type. Catches missing url/name/mainEntity mismatches.
    for (const node of graph) {
      const n = node as Record<string, unknown>;
      const t = n["@type"];
      const typeStr = typeof t === "string" ? t : Array.isArray(t) ? String(t[0]) : "";

      if (typeStr === "BreadcrumbList") {
        expect(
          Array.isArray(n.itemListElement),
          `${path}: BreadcrumbList.itemListElement not array`,
        ).toBe(true);
        for (const item of n.itemListElement as Array<Record<string, unknown>>) {
          expect(item["@type"], `${path}: breadcrumb item missing @type`).toBe("ListItem");
          expect(typeof item.position, `${path}: breadcrumb position not number`).toBe("number");
          expect(typeof item.name, `${path}: breadcrumb name not string`).toBe("string");
          expect(
            typeof item.item === "string" && (item.item as string).startsWith("https://"),
            `${path}: breadcrumb item URL invalid`,
          ).toBe(true);
        }
      }

      if (typeStr === "FAQPage") {
        expect(Array.isArray(n.mainEntity), `${path}: FAQPage.mainEntity not array`).toBe(true);
        for (const q of n.mainEntity as Array<Record<string, unknown>>) {
          expect(q["@type"]).toBe("Question");
          expect(typeof q.name).toBe("string");
          const answer = q.acceptedAnswer as Record<string, unknown> | undefined;
          expect(answer?.["@type"]).toBe("Answer");
          expect(typeof answer?.text).toBe("string");
        }
      }

      if (typeStr === "Service") {
        expect(typeof n.name, `${path}: Service.name missing`).toBe("string");
        expect(typeof n.description, `${path}: Service.description missing`).toBe("string");
        expect(typeof n.url).toBe("string");
        expect((n.provider as Record<string, unknown>)?.["@type"]).toBe("Organization");
      }

      if (typeStr === "WebPage") {
        expect(typeof n.name, `${path}: WebPage.name missing`).toBe("string");
        expect(typeof n.description, `${path}: WebPage.description missing`).toBe("string");
        expect(typeof n.url).toBe("string");
        expect((n.publisher as Record<string, unknown>)?.["@type"]).toBe("Organization");
      }
    }
  });
}
