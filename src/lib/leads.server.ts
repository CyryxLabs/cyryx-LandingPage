import { CYRYX_KNOWLEDGE, FIRST_REPLY_RULES } from "@/lib/ai/knowledge";
import { generateText, getGeminiConfig } from "@/lib/ai/gemini.server";

export type LeadInterest = "project" | "research" | "other" | "assistant";

export type SaveLeadInput = {
  name: string;
  email: string;
  company: string;
  message: string;
  interest: LeadInterest;
  consentVersion: string;
  ipHash: string;
  userAgentHash: string;
  qualification?: Record<string, unknown>;
  attribution?: Record<string, unknown>;
  /** Structured fields forwarded to the CRM intake (contract v1). */
  details?: {
    projectType?: string;
    problem?: string;
    outcome?: string;
    whyNow?: string;
    role?: string;
    website?: string;
    stage?: string;
    budget?: string;
    timeline?: string;
    systems?: string;
    entrySource?: string;
    entryIntent?: string;
  };
  /** First reply shown to the visitor, stored with the lead in the CRM. */
  aiFirstReply?: string | null;
};

export type SaveLeadResult =
  | { ok: true; submissionId: string; structured: boolean }
  | { ok: false; status: 429 | 500 | 503; error: string };

/** True when the Cyryx CRM intake (the system of record for leads) is configured. */
export async function crmIntakeEnabled(): Promise<boolean> {
  const { getCrmIntakeConfig } = await import("@/lib/crm-intake.server");
  return getCrmIntakeConfig() !== null;
}

async function saveLeadToCrm(input: SaveLeadInput): Promise<SaveLeadResult | null> {
  const crm = await import("@/lib/crm-intake.server");
  const config = crm.getCrmIntakeConfig();
  if (!config) return null;
  const { idempotencyKeyFor } = await import("@/lib/brief-attribution.server");
  const d = input.details ?? {};
  const attribution = (input.attribution ?? {}) as Record<string, unknown>;
  const text = (value: unknown, max = 300) =>
    typeof value === "string" ? value.slice(0, max) : "";
  const utm: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
    if (text(attribution[key])) utm[key] = text(attribution[key], 120);
  }
  const kind = input.interest === "assistant" ? "assistant" : "project";
  const payload = {
    kind,
    source: {
      site: "cyryxlabs.com",
      page: kind === "assistant" ? "assistant" : "/start",
      referrer: text(attribution.referrer),
      landingPath: text(attribution.landing_path, 200),
      utm,
      copyVariant: text(attribution.copy_variant, 20),
      entrySource: d.entrySource ?? "",
      entryIntent: d.entryIntent ?? "",
    },
    contact: {
      name: input.name,
      email: input.email,
      company: input.company,
      role: d.role ?? "",
      website: d.website ?? "",
    },
    engagement: {
      type: "Not sure",
      budgetBand: d.budget ?? "",
      timeline: d.timeline ?? "",
      stage: d.stage ?? "",
    },
    requirements: {
      projectType: d.projectType ?? "",
      problem: (d.problem || input.message).slice(0, 4000),
      goals: d.outcome ? [d.outcome.slice(0, 300)] : [],
      whyNow: (d.whyNow ?? "").slice(0, 1200),
      technical: { existingSystems: (d.systems ?? "").slice(0, 1500) },
      freeText: input.message.slice(0, 4000),
    },
    attachments: [],
    aiFirstReply: input.aiFirstReply ?? "",
    consent: {
      privacyNoticeVersion: input.consentVersion,
      processingBasis: "consent",
      marketingOptIn: false,
      acceptedAt: new Date().toISOString(),
      ipHash: input.ipHash,
      userAgentHash: input.userAgentHash,
    },
  };
  const result = await crm.crmIntakeSubmit(
    config,
    payload,
    idempotencyKeyFor({ ...payload, contact: { email: input.email } }),
  );
  if (result.ok) {
    return { ok: true, submissionId: result.data.requirementsId, structured: true };
  }
  return result.status === 429
    ? { ok: false, status: 429, error: "Too many submissions — please try again later." }
    : { ok: false, status: 500, error: "We couldn't save your brief right now." };
}

export async function saveLead(input: SaveLeadInput): Promise<SaveLeadResult> {
  // The Cyryx CRM is the only system of record for leads.
  const saved = await saveLeadToCrm(input);
  return saved ?? { ok: false, status: 503, error: "Backend unavailable" };
}

/**
 * Drafts the instant first reply for a new lead. Returns null when AI is not
 * configured, times out or fails, so callers always fall back to the static
 * confirmation.
 */
export async function draftFirstReply(
  brief: string,
  fetchImpl: typeof fetch = fetch,
): Promise<string | null> {
  const config = getGeminiConfig();
  if (!config) return null;
  const text = await generateText(
    config,
    {
      system: `${FIRST_REPLY_RULES}\n\n# Knowledge\n${CYRYX_KNOWLEDGE}`,
      turns: [{ role: "user", text: `Project brief:\n${brief.slice(0, 4000)}` }],
      maxOutputTokens: 320,
      temperature: 0.3,
      timeoutMs: 9000,
      totalTimeoutMs: 14_000,
    },
    fetchImpl,
  );
  if (!text) return null;
  return sanitizeReply(text);
}

const ALLOWED_LINK_HOSTS = new Set(["cyryxlabs.com", "www.cyryxlabs.com", "aexos.cyryxlabs.com"]);

function keepAllowedUrl(raw: string): string {
  const trailing = raw.match(/[.,;:!?)]+$/)?.[0] ?? "";
  const candidate = trailing ? raw.slice(0, -trailing.length) : raw;
  try {
    const url = new URL(candidate);
    return ALLOWED_LINK_HOSTS.has(url.hostname.toLowerCase()) ? raw : trailing;
  } catch {
    return trailing;
  }
}

/** Plain text only, bounded length, no links other than Cyryx-owned hosts. */
export function sanitizeReply(text: string): string {
  return text
    .replace(/\[([^\]]*)\]\(([^)\s]*)\)/g, (_m, label: string, href: string) =>
      keepAllowedUrl(href) === href && href ? `${label} (${href})` : label,
    )
    .replace(/[*_#`>]+/g, "")
    .replace(/https?:\/\/[^\s]+/gi, (raw) => keepAllowedUrl(raw))
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 1200);
}
