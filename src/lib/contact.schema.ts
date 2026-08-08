import { z } from "zod";
import {
  START_CONTEXT_INTENTS,
  START_CONTEXT_SOURCES,
  START_CONTEXT_INTENT_LABELS,
  START_CONTEXT_SOURCE_LABELS,
  type StartContextIntent,
} from "./cta";

export const CONTACT_CONSENT_VERSION = "website-contact-v2-2026-08-03";

export const CONTACT_INTERESTS = {
  project: "Start a fit review",
  "maax-early-access": "MAAX Studio early access",
  research: "Research & partnerships",
  other: "Something else",
} as const;

export type ContactInterest = keyof typeof CONTACT_INTERESTS;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => value || undefined);

const BaseSubmissionSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid work email").max(255),
  company: z.string().trim().max(160).optional().default(""),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Consent is required" }),
  }),
  // Honeypot. It accepts a bounded value so the handler can silently drop bots.
  website: z.string().max(200).optional().default(""),
});

export const ContactSchema = BaseSubmissionSchema.extend({
  message: z.string().trim().min(10, "Tell us a bit more").max(2000),
  interest: z
    .enum(["project", "maax-early-access", "research", "other"])
    .optional()
    .default("project"),
});

export const FIT_REVIEW_PROJECT_TYPES = [
  "AI Strategy & Advisory",
  "Digital & Web Systems",
  "Workflow Automation",
  "Internal AI Assistant",
  "Custom AI Product Development",
  "AI Governance & Cost Control",
  "Managed Operations",
  "Other",
] as const;

export const PROJECT_TYPE_BY_START_INTENT: Partial<
  Record<StartContextIntent, (typeof FIT_REVIEW_PROJECT_TYPES)[number]>
> = {
  "operating-capability": "Other",
  "strategy-advisory": "AI Strategy & Advisory",
  "digital-system": "Digital & Web Systems",
  "workflow-automation": "Workflow Automation",
  "internal-assistant": "Internal AI Assistant",
  "custom-ai-product": "Custom AI Product Development",
  "governance-control": "AI Governance & Cost Control",
  "managed-operations": "Managed Operations",
};

export const FitReviewSchema = BaseSubmissionSchema.extend({
  company: z
    .string()
    .trim()
    .min(2, "Company is required")
    .max(160, "Company must be 160 characters or fewer"),
  projectType: z.enum(FIT_REVIEW_PROJECT_TYPES, {
    errorMap: () => ({ message: "Select a project type" }),
  }),
  problem: z
    .string()
    .trim()
    .min(10, "Describe the primary problem in at least 10 characters")
    .max(2000),
  outcome: z
    .string()
    .trim()
    .min(10, "Describe the desired outcome in at least 10 characters")
    .max(2000),
  whyNow: z
    .string()
    .trim()
    .min(10, "Describe the triggering event or why this matters now")
    .max(2000),
  role: optionalText(120),
  companyWebsite: optionalText(500).refine((value) => {
    if (!value) return true;
    try {
      const url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:";
    } catch {
      return false;
    }
  }, "Enter a valid http or https URL"),
  stage: optionalText(120),
  investment: optionalText(120),
  timeline: optionalText(120),
  systems: optionalText(1000),
  decision: optionalText(120),
  notes: optionalText(1500),
  source: z.enum(START_CONTEXT_SOURCES).optional(),
  intent: z.enum(START_CONTEXT_INTENTS).optional(),
});

export type ContactInput = z.infer<typeof ContactSchema>;
export type FitReviewInput = z.infer<typeof FitReviewSchema>;

export function formatFitReviewMessage(data: FitReviewInput): string {
  const source = data.source ? START_CONTEXT_SOURCE_LABELS[data.source] : "Direct visit";
  const intent = data.intent ? START_CONTEXT_INTENT_LABELS[data.intent] : "Not specified";

  return [
    `Project type: ${data.projectType}`,
    `Entry source: ${source}`,
    `Entry intent: ${intent}`,
    `Current stage: ${data.stage ?? "—"}`,
    `Investment range: ${data.investment ?? "—"}`,
    `Timeline: ${data.timeline ?? "—"}`,
    `Review involvement: ${data.decision ?? "—"}`,
    `Role: ${data.role ?? "—"}`,
    `Company website: ${data.companyWebsite ?? "—"}`,
    `Systems / data involved: ${data.systems ?? "—"}`,
    "",
    "Primary problem:",
    data.problem,
    "",
    "Desired outcome:",
    data.outcome,
    "",
    "Why now / timing context:",
    data.whyNow,
    "",
    "Additional context:",
    data.notes ?? "—",
  ].join("\n");
}
