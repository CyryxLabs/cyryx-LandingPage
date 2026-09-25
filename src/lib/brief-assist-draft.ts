import { BriefRequirementsSchema } from "@/lib/brief.schema";

type Json = unknown;

const TEXT_FIELDS = [
  "projectName",
  "summary",
  "problem",
  "mvpDefinition",
  "outOfScope",
  "whyNow",
  "openQuestions",
] as const;
const LIST_FIELDS = ["goals", "successMetrics", "scenarios", "platforms"] as const;
const NESTED_TEXT: Record<string, string[]> = {
  users: ["name", "description", "needs"],
  features: ["title", "description"],
  integrations: ["system", "purpose"],
};

/** A list of strings becomes one line per item; numbers become text. */
function asText(value: Json): Json {
  if (
    Array.isArray(value) &&
    value.every((item) => typeof item === "string" || typeof item === "number")
  ) {
    return value.map(String).join("\n");
  }
  return typeof value === "number" ? String(value) : value;
}

/** A single string becomes a list of its non-empty lines. */
function asList(value: Json): Json {
  return typeof value === "string"
    ? value
        .split(/\r?\n/)
        .map((line) => line.replace(/^[-*•]\s*/, "").trim())
        .filter(Boolean)
    : value;
}

function capitalized(value: Json): Json {
  return typeof value === "string" && value
    ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    : value;
}

/**
 * Turns a model's JSON into a partial brief draft. Models differ in small shape
 * details (a list where one text is expected, "must" instead of "Must"), so the
 * common ones are coerced first; any key that still fails validation is left
 * out rather than discarding the whole draft. Returns the kept draft and the
 * keys that were dropped (for logging, never the content).
 */
export function toBriefDraft(raw: Json): { draft: Record<string, unknown>; dropped: string[] } {
  if (!raw || typeof raw !== "object" || Array.isArray(raw))
    return { draft: {}, dropped: ["(root)"] };
  const input = { ...(raw as Record<string, Json>) };
  for (const key of TEXT_FIELDS) if (key in input) input[key] = asText(input[key]);
  for (const key of LIST_FIELDS) if (key in input) input[key] = asList(input[key]);
  for (const [key, fields] of Object.entries(NESTED_TEXT)) {
    const items = input[key];
    if (!Array.isArray(items)) continue;
    input[key] = items.map((item) => {
      if (!item || typeof item !== "object") return item;
      const copy = { ...(item as Record<string, Json>) };
      for (const field of fields) if (field in copy) copy[field] = asText(copy[field]);
      if (key === "features" && "priority" in copy) copy.priority = capitalized(copy.priority);
      if (key === "integrations" && typeof copy.direction === "string")
        copy.direction = copy.direction.toLowerCase();
      return copy;
    });
  }

  const shape = BriefRequirementsSchema.shape as Record<
    string,
    { safeParse: (v: Json) => { success: boolean; data?: unknown } }
  >;
  const draft: Record<string, unknown> = {};
  const dropped: string[] = [];
  for (const [key, value] of Object.entries(input)) {
    const field = shape[key];
    if (!field) continue;
    const result = field.safeParse(value);
    if (result.success) draft[key] = result.data;
    else dropped.push(key);
  }
  return { draft, dropped };
}
