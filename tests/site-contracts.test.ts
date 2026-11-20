import { describe, expect, test } from "bun:test";
import {
  FIT_REVIEW_PROJECT_TYPES,
  FIT_REVIEW_STEP_ONE_FIELDS,
  FitReviewSchema,
  PROJECT_TYPE_BY_START_INTENT,
} from "../src/lib/contact.schema";
import { buildStartProjectHref, parseStartProjectContext } from "../src/lib/cta";
import { CGP_V1 } from "../src/data/publications";
import * as siteTaxonomy from "../src/data/site-taxonomy";
import { AEXOS_PRODUCT, OPERATING_LIFECYCLE } from "../src/data/site-taxonomy";
import { publicDestination, publicPath, publicReferrer } from "../src/lib/public-location";
import { PRODUCTS } from "../src/data/products";
import { SERVICES } from "../src/data/services";
import { SEGMENTS, SOURCES } from "../src/data/market";
import { CYRYX_KNOWLEDGE } from "../src/lib/ai/knowledge";

// Founder decisions 2026-11-17: no blanket promises, fixed timelines, paid AEXOS edition,
// retired products or stale Onyx facts in public data or the assistant's knowledge.
const UNAPPROVED_CLAIMS =
  /own the code|fixed (written )?quote|written quote|fixed price|30-day|30 days|\bweeks\b|\bPro\b|ASTRA|MAAX|No card|1\.14\.25|human approval|audit log/i;

const validFitReview = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  company: "Analytical Engines Ltd",
  projectType: "Workflow Automation" as const,
  problem: "A manual handoff loses review context between teams.",
  outcome: "A reviewable workflow with named ownership and evidence.",
  whyNow: "The current process cannot support the next operating cycle.",
  consent: true as const,
  website: "",
};

describe("public taxonomy contract", () => {
  test("keeps the canonical four-stage lifecycle", () => {
    expect(OPERATING_LIFECYCLE.map((stage) => stage.name)).toEqual([
      "Advise",
      "Build",
      "Control",
      "Operate",
    ]);
  });

  test("presents AEXOS as the public product with its real maturity", () => {
    expect(AEXOS_PRODUCT.name).toBe("AEXOS");
    expect(AEXOS_PRODUCT.kind).toBe("Product");
    expect(AEXOS_PRODUCT.maturity).toBe("AEXOS Core, free on npm");
    expect(AEXOS_PRODUCT.category).toBe("An agent framework for software projects");
    expect(AEXOS_PRODUCT.installCommand).toBe("npx @aexos/core init my-project");
    expect(AEXOS_PRODUCT.version).toBe("5.3.0");
    expect(JSON.stringify(AEXOS_PRODUCT)).not.toMatch(/\bPro\b/);
    expect(AEXOS_PRODUCT.npmPackage).toBe("@aexos/core");
    expect(AEXOS_PRODUCT.npmUrl).toBe("https://www.npmjs.com/package/@aexos/core");
  });

  test("no taxonomy export references the discontinued MAAX product", () => {
    expect(JSON.stringify(siteTaxonomy)).not.toMatch(/MAAX/i);
    expect(Object.keys(siteTaxonomy)).not.toContain("MAAX_STUDIO_PRODUCT");
  });
});

describe("start context contract", () => {
  test("accepts only allowlisted single values", () => {
    expect(parseStartProjectContext("source=solutions&intent=workflow-automation")).toEqual({
      source: "solutions",
      intent: "workflow-automation",
    });
    expect(parseStartProjectContext("source=unknown&intent=unknown")).toEqual({});
    expect(
      parseStartProjectContext("source=home&source=solutions&intent=custom-ai-product"),
    ).toEqual({
      intent: "custom-ai-product",
    });
    expect(parseStartProjectContext({ source: ["home"], intent: ["workflow-automation"] })).toEqual(
      {},
    );
  });

  test("builds a stable contextual start-a-project URL", () => {
    expect(buildStartProjectHref({ source: "home" })).toBe("/start?source=home");
    expect(buildStartProjectHref({ source: "home", intent: "operating-capability" })).toBe(
      "/start?source=home&intent=operating-capability",
    );
    expect(buildStartProjectHref()).toBe("/start");
  });

  test("every intent that maps to a project type maps to an offered option", () => {
    for (const projectType of Object.values(PROJECT_TYPE_BY_START_INTENT)) {
      expect(FIT_REVIEW_PROJECT_TYPES).toContain(projectType);
    }
    expect(PROJECT_TYPE_BY_START_INTENT["workflow-automation"]).toBe("Workflow Automation");
  });
});

describe("fit-review qualification contract", () => {
  test("step one requires identity, project type, problem, and consent", () => {
    expect(FitReviewSchema.safeParse(validFitReview).success).toBe(true);
    for (const field of ["name", "email", "company", "projectType", "problem"] as const) {
      expect(FitReviewSchema.safeParse({ ...validFitReview, [field]: "" }).success).toBe(false);
    }
    expect(FitReviewSchema.safeParse({ ...validFitReview, consent: false }).success).toBe(false);
    expect([...FIT_REVIEW_STEP_ONE_FIELDS]).toEqual(
      expect.arrayContaining(["name", "email", "company", "projectType", "problem", "consent"]),
    );
  });

  test("outcome and why-now are optional step-two context", () => {
    const { outcome: _outcome, whyNow: _whyNow, ...stepOneOnly } = validFitReview;
    const parsed = FitReviewSchema.safeParse(stepOneOnly);
    expect(parsed.success).toBe(true);
    const blanks = FitReviewSchema.safeParse({ ...validFitReview, outcome: "", whyNow: "  " });
    expect(blanks.success).toBe(true);
    if (blanks.success) {
      expect(blanks.data.outcome).toBeUndefined();
      expect(blanks.data.whyNow).toBeUndefined();
    }
    for (const field of ["outcome", "whyNow"] as const) {
      expect(FIT_REVIEW_STEP_ONE_FIELDS as readonly string[]).not.toContain(field);
    }
  });

  test("accepts optional attribution and assistant summary", () => {
    const parsed = FitReviewSchema.safeParse({
      ...validFitReview,
      assistantSummary: "Visitor asked how engagements start; recommended Advise.",
    });
    expect(parsed.success).toBe(true);
  });
});

describe("public attribution contract", () => {
  test("removes queries and fragments from routing metadata", () => {
    expect(publicPath("https://cyryxlabs.com/start?email=ada@example.com#form")).toBe("/start");
    expect(publicReferrer("https://partner.example/path?token=secret#fragment")).toBe(
      "https://partner.example/path",
    );
    expect(publicDestination("/start?source=home&intent=operating-capability#form")).toBe("/start");
    expect(publicPath("javascript:contains-private-data")).toBe("/");
  });
});

describe("research evidence contract", () => {
  test("separates publication, implementation, conformance, and certification", () => {
    expect(CGP_V1.evidence.publicationRecord.state).toBe("verified");
    expect(CGP_V1.evidence.implementation.state).toBe("qualified");
    expect(CGP_V1.evidence.conformance.state).toBe("qualified");
    expect(CGP_V1.evidence.certification.state).toBe("withheld");
  });
});

describe("public claims contract", () => {
  test("the catalog lists Onyx, AEXOS and Orbit, with Orbit by name and status only", () => {
    expect(PRODUCTS.map((product) => product.name)).toEqual(["Onyx", "AEXOS", "Orbit"]);
    const orbit = PRODUCTS.find((product) => product.id === "orbit");
    expect(orbit).toBeDefined();
    expect(orbit?.stage).toBe("In development");
    expect(Object.keys(orbit ?? {}).sort()).toEqual(["id", "name", "published", "stage"]);
  });

  test("services and segments publish no fixed timelines or unapproved promises", () => {
    for (const service of SERVICES) {
      expect(service.timeline).not.toMatch(/\d/);
      expect(JSON.stringify(service)).not.toMatch(UNAPPROVED_CLAIMS);
    }
    for (const segment of SEGMENTS) {
      expect(segment.timeline).toBe("Timeline set in the written plan.");
      expect(JSON.stringify(segment)).not.toMatch(UNAPPROVED_CLAIMS);
    }
  });

  test("every market source links to the publisher's page", () => {
    for (const source of Object.values(SOURCES)) {
      expect(source.url).toMatch(/^https:\/\//);
    }
    expect(Object.keys(SOURCES)).not.toContain("g2");
  });

  test("the assistant knowledge uses the approved process language", () => {
    expect(CYRYX_KNOWLEDGE).not.toMatch(UNAPPROVED_CLAIMS);
    expect(CYRYX_KNOWLEDGE).toContain("Ownership and licensing are defined in each agreement.");
    expect(CYRYX_KNOWLEDGE).toContain(
      "Access, approvals, logging and spending limits are defined in the scope of each project.",
    );
    expect(CYRYX_KNOWLEDGE).toContain("Orbit: In development.");
  });
});
