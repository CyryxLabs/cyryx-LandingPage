/** Canonical qualification hrefs and allowlisted context for public CTAs. */
export const CONTACT_EMAIL = "contact@cyryxlabs.com";

// Canonical project-qualification entry point. The mailto fallback remains
// available for legacy consumers that import it explicitly.
export const START_PROJECT_HREF = "/start";

export const START_PROJECT_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Start a project with Cyryx Labs",
)}`;

export const START_CONTEXT_SOURCES = [
  "home",
  "solutions",
  "company",
  "contact",
  "engagement-model",
] as const;

export const START_CONTEXT_INTENTS = [
  "operating-capability",
  "strategy-advisory",
  "digital-system",
  "workflow-automation",
  "internal-assistant",
  "custom-ai-product",
  "governance-control",
  "managed-operations",
] as const;

export type StartContextSource = (typeof START_CONTEXT_SOURCES)[number];
export type StartContextIntent = (typeof START_CONTEXT_INTENTS)[number];

export type StartProjectContext = {
  source?: StartContextSource;
  intent?: StartContextIntent;
};

export const START_CONTEXT_SOURCE_LABELS: Record<StartContextSource, string> = {
  home: "Homepage",
  solutions: "Solutions overview",
  company: "Company overview",
  contact: "Contact inquiry paths",
  "engagement-model": "Engagement model",
};

export const START_CONTEXT_INTENT_LABELS: Record<StartContextIntent, string> = {
  "operating-capability": "Owned operating capability",
  "strategy-advisory": "AI Strategy & Advisory",
  "digital-system": "Digital & Web Systems",
  "workflow-automation": "Workflow Automation",
  "internal-assistant": "Internal AI Assistant",
  "custom-ai-product": "Custom AI Product Development",
  "governance-control": "AI Governance & Cost Control",
  "managed-operations": "Managed Operations",
};

const SOURCE_SET = new Set<string>(START_CONTEXT_SOURCES);
const INTENT_SET = new Set<string>(START_CONTEXT_INTENTS);

function getSearchValue(
  input: string | URLSearchParams | Record<string, unknown>,
  key: "source" | "intent",
): unknown {
  if (typeof input === "string") {
    const values = new URLSearchParams(input).getAll(key);
    return values.length === 1 ? values[0] : undefined;
  }
  if (input instanceof URLSearchParams) {
    const values = input.getAll(key);
    return values.length === 1 ? values[0] : undefined;
  }
  return input[key];
}

/**
 * Parses the documented /start query contract. Unknown or repeated values are
 * ignored rather than rendered or persisted.
 */
export function parseStartProjectContext(
  input: string | URLSearchParams | Record<string, unknown>,
): StartProjectContext {
  const sourceCandidate = getSearchValue(input, "source");
  const intentCandidate = getSearchValue(input, "intent");
  const source =
    typeof sourceCandidate === "string" && SOURCE_SET.has(sourceCandidate)
      ? (sourceCandidate as StartContextSource)
      : undefined;
  const intent =
    typeof intentCandidate === "string" && INTENT_SET.has(intentCandidate)
      ? (intentCandidate as StartContextIntent)
      : undefined;
  return { source, intent };
}

export function buildStartProjectHref(context: StartProjectContext = {}): string {
  const safe = parseStartProjectContext(context);
  const search = new URLSearchParams();
  if (safe.source) search.set("source", safe.source);
  if (safe.intent) search.set("intent", safe.intent);
  const query = search.toString();
  return query ? `${START_PROJECT_HREF}?${query}` : START_PROJECT_HREF;
}
