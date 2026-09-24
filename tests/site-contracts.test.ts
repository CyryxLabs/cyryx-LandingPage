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
import {
  buildFitReviewEmailJobs,
  enqueueFitReviewEmails,
} from "../src/lib/email/fit-review-notifications.server";

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
    expect(AEXOS_PRODUCT.maturity).toBe("Core available on npm · Pro by commercial license");
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

describe("fit-review email delivery contract", () => {
  const input = {
    submissionId: "00000000-0000-4000-8000-000000000001",
    name: "Ada Lovelace",
    email: "ada@example.com",
    company: "Analytical Engines Ltd",
    message: "Project type: Workflow Automation\n\nPrimary problem:\nManual handoffs.",
    submittedAt: "2026-08-03T12:00:00.000Z",
  };

  test("builds a fixed internal notification and a sender confirmation without leaking context", () => {
    const [notification, confirmation] = buildFitReviewEmailJobs(input);

    expect(notification.templateName).toBe("fit-review-notification");
    expect(notification.recipientEmail).toBeUndefined();
    expect(notification.templateData).toMatchObject({
      email: input.email,
      message: input.message,
      submissionId: input.submissionId,
    });
    // The sender only receives their name and (when present) the AI first read
    // of their own brief: never the internal message, email or company.
    expect(confirmation).toEqual({
      templateName: "fit-review-confirmation",
      recipientEmail: input.email,
      templateData: { name: input.name, aiReply: "" },
      idempotencyKey: `fit-review-confirmation-${input.submissionId}`,
    });
  });

  test("carries the AI first read to both the team and the sender", () => {
    const aiReply = "Build looks like the right starting point.";
    const [notification, confirmation] = buildFitReviewEmailJobs({ ...input, aiReply });
    expect(notification.templateData).toMatchObject({ aiReply });
    expect(confirmation.templateData).toEqual({ name: input.name, aiReply });
  });

  test("attempts the two queues independently and reports partial delivery", async () => {
    const calls: string[] = [];
    const delivery = await enqueueFitReviewEmails(input, async (job) => {
      calls.push(job.templateName);
      return job.templateName === "fit-review-confirmation"
        ? { ok: true, messageId: "confirmation-message" }
        : { ok: false, reason: "enqueue_failed" };
    });

    expect(calls).toEqual(["fit-review-notification", "fit-review-confirmation"]);
    expect(delivery).toEqual({ notification: "failed", confirmation: "queued" });
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
