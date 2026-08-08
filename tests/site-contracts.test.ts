import { describe, expect, test } from "bun:test";
import { FitReviewSchema } from "../src/lib/contact.schema";
import { buildStartProjectHref, parseStartProjectContext } from "../src/lib/cta";
import { CGP_V1 } from "../src/data/publications";
import { OPERATING_LIFECYCLE, TRANSVERSAL_CAPABILITIES } from "../src/data/site-taxonomy";
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
  test("keeps the canonical lifecycle and transversal capabilities separate", () => {
    expect(OPERATING_LIFECYCLE.map((stage) => stage.name)).toEqual([
      "Advise",
      "Build",
      "Control",
      "Operate",
    ]);
    expect(TRANSVERSAL_CAPABILITIES.map((capability) => capability.name)).toEqual([
      "Products",
      "Applied Research",
    ]);
    expect(
      TRANSVERSAL_CAPABILITIES.every((capability) =>
        capability.description.includes("separate from client delivery"),
      ),
    ).toBe(true);
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

  test("builds a stable contextual fit-review URL", () => {
    expect(buildStartProjectHref({ source: "home", intent: "operating-capability" })).toBe(
      "/start?source=home&intent=operating-capability",
    );
  });
});

describe("fit-review qualification contract", () => {
  test("requires project type, problem, outcome, and why-now context", () => {
    expect(FitReviewSchema.safeParse(validFitReview).success).toBe(true);
    for (const field of ["projectType", "problem", "outcome", "whyNow"] as const) {
      expect(FitReviewSchema.safeParse({ ...validFitReview, [field]: "" }).success).toBe(false);
    }
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
    expect(confirmation).toEqual({
      templateName: "fit-review-confirmation",
      recipientEmail: input.email,
      templateData: { name: input.name },
      idempotencyKey: `fit-review-confirmation-${input.submissionId}`,
    });
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
