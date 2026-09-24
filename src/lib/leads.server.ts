import { createClient, type SupabaseClient } from "@supabase/supabase-js";
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
};

export type SaveLeadResult =
  | { ok: true; submissionId: string; structured: boolean }
  | { ok: false; status: 429 | 500 | 503; error: string };

function publicClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function isMissingFunction(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  return (
    error.code === "PGRST202" ||
    error.code === "42883" ||
    /could not find the function|does not exist/i.test(error.message ?? "")
  );
}

function submissionIdFrom(data: unknown): string {
  return data && typeof data === "object" && "id" in data && typeof data.id === "string"
    ? data.id
    : crypto.randomUUID();
}

/**
 * Persists a lead through submit_contact_public_v2 (structured qualification
 * and attribution). Falls back to v1 while the 20260924 migration is not
 * applied, folding the structured data into the readable message.
 */
export async function saveLead(
  input: SaveLeadInput,
  client = publicClient(),
): Promise<SaveLeadResult> {
  if (!client) return { ok: false, status: 503, error: "Backend unavailable" };

  const v2 = await client.rpc("submit_contact_public_v2", {
    p_name: input.name,
    p_email: input.email,
    p_company: input.company,
    p_message: input.message.slice(0, 6000),
    p_interest: input.interest,
    p_consent_version: input.consentVersion,
    p_ip_hash: input.ipHash,
    p_user_agent_hash: input.userAgentHash,
    p_qualification: input.qualification ?? null,
    p_attribution: input.attribution ?? null,
  });

  if (!v2.error) return { ok: true, submissionId: submissionIdFrom(v2.data), structured: true };

  if (!isMissingFunction(v2.error)) return rpcFailure(v2.error);

  const legacyMessage = [
    input.message,
    input.attribution ? `\nAttribution: ${JSON.stringify(input.attribution)}` : "",
  ]
    .join("")
    .slice(0, 2000);
  const v1 = await client.rpc("submit_contact_public", {
    p_name: input.name,
    p_email: input.email,
    p_company: input.company.slice(0, 120),
    p_message: legacyMessage,
    p_interest: input.interest === "assistant" ? "other" : input.interest,
    p_consent_version: input.consentVersion,
    p_ip_hash: input.ipHash,
    p_user_agent_hash: input.userAgentHash,
  });
  if (v1.error) return rpcFailure(v1.error);
  return { ok: true, submissionId: submissionIdFrom(v1.data), structured: false };
}

function rpcFailure(error: { message?: string; code?: string }): SaveLeadResult {
  const rateLimited = /rate_limited/i.test(error.message ?? "");
  console.error("[leads] RPC failed", rateLimited ? "rate_limited" : error.code);
  return rateLimited
    ? { ok: false, status: 429, error: "Too many submissions — please try again later." }
    : { ok: false, status: 500, error: "We couldn't save your brief right now." };
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
      timeoutMs: 7000,
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

export async function recordFirstReply(
  submissionId: string,
  reply: string,
  client = publicClient(),
) {
  if (!client) return;
  const { error } = await client.rpc("record_contact_ai_reply", {
    p_submission_id: submissionId,
    p_reply: reply,
  });
  if (error && !isMissingFunction(error)) {
    console.warn("[leads] could not store first reply", error.code);
  }
}
