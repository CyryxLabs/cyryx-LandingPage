import { z } from "zod";

/**
 * Software requirements brief (/brief). Mirrors `requirements` in the CRM
 * intake contract v1. Shared by the browser (validation, quality score,
 * preview) and the server route (authoritative validation).
 */

export const BRIEF_CONSENT_VERSION = "website-brief-v1-2026-09-24";

const short = (max = 200) => z.string().trim().max(max).optional().default("");
const long = (max = 4000) => z.string().trim().max(max).optional().default("");
const list = <T extends z.ZodTypeAny>(item: T, max = 30) =>
  z.array(item).max(max).optional().default([]);

export const ENGAGEMENT_TYPES = [
  "Build",
  "Advise",
  "Control",
  "Operate",
  "AEXOS",
  "Not sure",
] as const;
export const PROJECT_TYPES = [
  "New product or MVP",
  "AI feature in an existing product",
  "Internal tool or copilot",
  "Workflow automation",
  "Integration between systems",
  "Modernize an existing system",
  "Something else",
] as const;
export const PROJECT_STAGES = [
  "Idea",
  "Validated idea",
  "Prototype",
  "Live product",
  "Legacy system",
] as const;
export const PLATFORMS = [
  "Web app",
  "iOS",
  "Android",
  "Desktop",
  "API / backend only",
  "Chat / assistant",
  "Internal back-office",
] as const;
export const DATA_SENSITIVITY = [
  "Personal data",
  "Financial data",
  "Health data",
  "Children's data",
  "Confidential business data",
  "Public data only",
] as const;
export const REGULATIONS = [
  "GDPR",
  "LGPD",
  "CCPA",
  "EU AI Act",
  "Sector-specific",
  "Not sure",
] as const;
export const BUDGET_BANDS = [
  "Under $25,000",
  "$25,000–$75,000",
  "$75,000–$150,000",
  "$150,000–$300,000",
  "Over $300,000",
  "Not defined yet",
] as const;
export const TIMELINES = [
  "As soon as possible",
  "1–3 months",
  "3–6 months",
  "6+ months",
  "Flexible",
] as const;
export const PRIORITIES = ["Must", "Should", "Could", "Won't"] as const;
export const AI_AUTONOMY = [
  "No AI needed",
  "Suggests, people decide",
  "Acts with approval on key steps",
  "Acts on its own within set limits",
  "Not sure yet",
] as const;

export const BriefPersonaSchema = z.object({
  name: short(120),
  description: long(800),
  needs: long(800),
});

export const BriefFeatureSchema = z.object({
  title: short(160),
  description: long(1200),
  priority: z.enum(PRIORITIES).default("Should"),
});

export const BriefIntegrationSchema = z.object({
  system: short(120),
  purpose: long(600),
  direction: z.enum(["read", "write", "both"]).default("both"),
});

export const BriefStakeholderSchema = z.object({
  name: short(120),
  role: short(120),
  decisionMaker: z.boolean().default(false),
});

export const BriefRequirementsSchema = z.object({
  projectName: short(160),
  projectType: short(80),
  summary: long(1200),
  problem: long(),
  goals: list(short(300), 12),
  successMetrics: list(short(300), 12),
  whyNow: long(1200),
  users: list(BriefPersonaSchema, 8),
  scenarios: list(long(800), 15),
  features: list(BriefFeatureSchema, 40),
  outOfScope: long(2000),
  mvpDefinition: long(2000),
  platforms: list(short(60), 10),
  locales: list(short(60), 10),
  integrations: list(BriefIntegrationSchema, 20),
  data: z
    .object({
      sources: long(1500),
      sensitivity: list(short(60), 10),
      volume: short(300),
      retention: short(300),
      regulations: list(short(60), 10),
    })
    .default({}),
  ai: z
    .object({
      useCases: long(2000),
      autonomy: short(80),
      humanApproval: long(1500),
      providerConstraints: long(1000),
    })
    .default({}),
  nonFunctional: z
    .object({
      performance: long(800),
      availability: long(800),
      security: long(1200),
      accessibility: long(800),
      scalability: long(800),
    })
    .default({}),
  design: z
    .object({
      brandAssets: long(800),
      references: list(short(300), 10),
      designSystem: long(800),
    })
    .default({}),
  technical: z
    .object({
      stackPreferences: long(1000),
      hosting: long(600),
      existingSystems: long(1500),
      constraints: long(1500),
    })
    .default({}),
  stakeholders: list(BriefStakeholderSchema, 12),
  risks: long(2000),
  openQuestions: long(2000),
  freeText: long(4000),
});

export const BriefAttachmentSchema = z.object({
  path: z.string().min(1).max(400),
  name: z.string().min(1).max(200),
  mime: z.string().min(1).max(120),
  bytes: z
    .number()
    .int()
    .min(1)
    .max(25 * 1024 * 1024),
  sha256: z.string().regex(/^[a-f0-9]{64}$/),
  caption: short(300),
});

export const BriefSubmissionSchema = z
  .object({
    intakeId: z.string().min(4).max(80).optional(),
    contact: z.object({
      name: z.string().trim().min(2, "Your name is required").max(120),
      email: z.string().trim().toLowerCase().email("Enter a valid work email").max(200),
      phone: short(40),
      role: short(120),
      company: z.string().trim().min(2, "Company is required").max(160),
      website: short(300),
      country: short(80),
      timezone: short(80),
    }),
    engagement: z.object({
      type: z.enum(ENGAGEMENT_TYPES).default("Not sure"),
      budgetBand: short(60),
      timeline: short(60),
      deadline: short(40),
      stage: short(60),
    }),
    requirements: BriefRequirementsSchema,
    attachments: list(BriefAttachmentSchema, 10),
    consent: z.literal(true, { errorMap: () => ({ message: "Consent is required" }) }),
    marketingOptIn: z.boolean().default(false),
    // Honeypot: must stay empty.
    nickname: z.string().max(0).optional().default(""),
    startedAt: z.number().int().optional(),
  })
  .refine(
    (value) => value.requirements.problem.length >= 20 || value.requirements.summary.length >= 20,
    {
      message: "Describe the problem or the product in at least a couple of sentences",
      path: ["requirements", "problem"],
    },
  );

export type BriefSubmission = z.input<typeof BriefSubmissionSchema>;
export type BriefRequirements = z.infer<typeof BriefRequirementsSchema>;

export const ATTACHMENT_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/markdown",
  "text/csv",
] as const;
export const MAX_ATTACHMENTS = 10;
export const MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024;
export const MAX_TOTAL_ATTACHMENT_BYTES = 100 * 1024 * 1024;

export const FileManifestSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  files: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(200),
        bytes: z.number().int().min(1).max(MAX_ATTACHMENT_BYTES),
        mime: z.enum(ATTACHMENT_MIME_TYPES),
      }),
    )
    .min(1)
    .max(MAX_ATTACHMENTS)
    .refine(
      (files) => files.reduce((sum, file) => sum + file.bytes, 0) <= MAX_TOTAL_ATTACHMENT_BYTES,
      "Attachments exceed 100 MB in total",
    ),
});

type QualityCheck = { key: string; label: string; weight: number; done: boolean };

/**
 * Completeness of a brief, 0–100. Weighted toward what a PRD cannot do
 * without: the problem, users, prioritized scope and success criteria.
 */
export function briefQuality(input: Partial<BriefRequirements> & { hasAttachments?: boolean }) {
  const r = input;
  const filled = (value?: string) => Boolean(value && value.trim().length >= 12);
  const checks: QualityCheck[] = [
    { key: "problem", label: "Problem statement", weight: 14, done: filled(r.problem) },
    { key: "summary", label: "One-line summary", weight: 5, done: filled(r.summary) },
    {
      key: "goals",
      label: "Business goals",
      weight: 8,
      done: (r.goals ?? []).filter(Boolean).length > 0,
    },
    {
      key: "metrics",
      label: "Success metrics",
      weight: 10,
      done: (r.successMetrics ?? []).filter(Boolean).length > 0,
    },
    {
      key: "users",
      label: "Users and personas",
      weight: 10,
      done: (r.users ?? []).some((u) => u.name),
    },
    {
      key: "scenarios",
      label: "Key scenarios",
      weight: 6,
      done: (r.scenarios ?? []).filter(Boolean).length > 0,
    },
    {
      key: "features",
      label: "Prioritized features",
      weight: 14,
      done: (r.features ?? []).filter((f) => f.title).length >= 3,
    },
    { key: "mvp", label: "MVP definition", weight: 6, done: filled(r.mvpDefinition) },
    { key: "scope", label: "Out of scope", weight: 4, done: filled(r.outOfScope) },
    {
      key: "platforms",
      label: "Platforms",
      weight: 4,
      done: (r.platforms ?? []).length > 0,
    },
    {
      key: "integrations",
      label: "Integrations",
      weight: 5,
      done: (r.integrations ?? []).some((i) => i.system),
    },
    {
      key: "data",
      label: "Data and compliance",
      weight: 5,
      done: Boolean(r.data?.sources) || (r.data?.sensitivity ?? []).length > 0,
    },
    {
      key: "nfr",
      label: "Quality requirements",
      weight: 4,
      done: Object.values(r.nonFunctional ?? {}).some((v) => filled(v as string)),
    },
    {
      key: "attachments",
      label: "Wireframes or documents",
      weight: 5,
      done: Boolean(r.hasAttachments),
    },
  ];
  const total = checks.reduce((sum, c) => sum + c.weight, 0);
  const score = Math.round(
    (checks.filter((c) => c.done).reduce((sum, c) => sum + c.weight, 0) / total) * 100,
  );
  return {
    score,
    missing: checks.filter((c) => !c.done).map((c) => c.label),
  };
}

const bullet = (items: string[]) =>
  items
    .filter(Boolean)
    .map((i) => `- ${i}`)
    .join("\n");

/** Readable Markdown of the brief: the preview the visitor reviews and can download. */
export function briefToMarkdown(input: {
  contact?: { company?: string };
  engagement?: Partial<Record<"type" | "budgetBand" | "timeline" | "deadline" | "stage", string>>;
  requirements: Partial<BriefRequirements>;
  attachments?: Array<{ name: string; caption?: string }>;
}): string {
  const r = input.requirements;
  const out: string[] = [];
  out.push(`# ${r.projectName || "Software requirements brief"}`);
  if (r.summary) out.push(`> ${r.summary}`);
  const meta = [
    input.contact?.company && `**Company:** ${input.contact.company}`,
    r.projectType && `**Type:** ${r.projectType}`,
    input.engagement?.stage && `**Stage:** ${input.engagement.stage}`,
    input.engagement?.type && `**Engagement:** ${input.engagement.type}`,
    input.engagement?.budgetBand && `**Budget:** ${input.engagement.budgetBand}`,
    input.engagement?.timeline && `**Timeline:** ${input.engagement.timeline}`,
    input.engagement?.deadline && `**Deadline:** ${input.engagement.deadline}`,
  ].filter(Boolean);
  if (meta.length) out.push(meta.join("  \n"));
  const section = (title: string, body?: string) => {
    if (body && body.trim()) out.push(`## ${title}\n\n${body.trim()}`);
  };
  section("Problem", r.problem);
  section("Why now", r.whyNow);
  section("Goals", bullet(r.goals ?? []));
  section("Success metrics", bullet(r.successMetrics ?? []));
  section(
    "Users and personas",
    (r.users ?? [])
      .filter((u) => u.name)
      .map(
        (u) => `### ${u.name}\n${u.description ?? ""}${u.needs ? `\n\n*Needs:* ${u.needs}` : ""}`,
      )
      .join("\n\n"),
  );
  section("Key scenarios", bullet(r.scenarios ?? []));
  const features = (r.features ?? []).filter((f) => f.title);
  if (features.length) {
    out.push(
      [
        "## Features (MoSCoW)",
        "",
        "| Priority | Feature | Description |",
        "| --- | --- | --- |",
        ...PRIORITIES.flatMap((p) =>
          features
            .filter((f) => (f.priority ?? "Should") === p)
            .map((f) => `| ${p} | ${f.title} | ${(f.description ?? "").replace(/\n/g, " ")} |`),
        ),
      ].join("\n"),
    );
  }
  section("MVP definition", r.mvpDefinition);
  section("Out of scope", r.outOfScope);
  section("Platforms", (r.platforms ?? []).join(", "));
  section(
    "Integrations",
    (r.integrations ?? [])
      .filter((i) => i.system)
      .map((i) => `- **${i.system}** (${i.direction ?? "both"}): ${i.purpose ?? ""}`)
      .join("\n"),
  );
  if (r.data) {
    section(
      "Data and compliance",
      [
        r.data.sources && `Sources: ${r.data.sources}`,
        (r.data.sensitivity ?? []).length
          ? `Sensitivity: ${(r.data.sensitivity ?? []).join(", ")}`
          : "",
        r.data.volume && `Volume: ${r.data.volume}`,
        r.data.retention && `Retention: ${r.data.retention}`,
        (r.data.regulations ?? []).length
          ? `Regulations: ${(r.data.regulations ?? []).join(", ")}`
          : "",
      ]
        .filter(Boolean)
        .join("\n\n"),
    );
  }
  if (r.ai) {
    section(
      "AI behaviour",
      [
        r.ai.useCases && `Use cases: ${r.ai.useCases}`,
        r.ai.autonomy && `Autonomy: ${r.ai.autonomy}`,
        r.ai.humanApproval && `Human approval: ${r.ai.humanApproval}`,
        r.ai.providerConstraints && `Provider constraints: ${r.ai.providerConstraints}`,
      ]
        .filter(Boolean)
        .join("\n\n"),
    );
  }
  if (r.nonFunctional) {
    section(
      "Quality requirements",
      Object.entries(r.nonFunctional)
        .filter(([, v]) => v)
        .map(([k, v]) => `- **${k[0].toUpperCase()}${k.slice(1)}:** ${v}`)
        .join("\n"),
    );
  }
  if (r.design) {
    section(
      "Design",
      [
        r.design.brandAssets && `Brand assets: ${r.design.brandAssets}`,
        r.design.designSystem && `Design system: ${r.design.designSystem}`,
        (r.design.references ?? []).filter(Boolean).length
          ? `References:\n${bullet(r.design.references ?? [])}`
          : "",
      ]
        .filter(Boolean)
        .join("\n\n"),
    );
  }
  if (r.technical) {
    section(
      "Technical context",
      Object.entries(r.technical)
        .filter(([, v]) => v)
        .map(([k, v]) => `- **${k.replace(/([A-Z])/g, " $1").toLowerCase()}:** ${v}`)
        .join("\n"),
    );
  }
  section(
    "Stakeholders",
    (r.stakeholders ?? [])
      .filter((s) => s.name)
      .map(
        (s) =>
          `- ${s.name}${s.role ? `, ${s.role}` : ""}${s.decisionMaker ? " (decision maker)" : ""}`,
      )
      .join("\n"),
  );
  section("Risks", r.risks);
  section("Open questions", r.openQuestions);
  section("Anything else", r.freeText);
  if (input.attachments?.length) {
    section(
      "Attachments",
      input.attachments.map((a) => `- ${a.name}${a.caption ? ` — ${a.caption}` : ""}`).join("\n"),
    );
  }
  return out.join("\n\n") + "\n";
}
