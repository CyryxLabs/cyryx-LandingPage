import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export type ForbiddenTerm = { label: string; pattern: RegExp };

export function loadForbiddenTerms(): ForbiddenTerm[] {
  const file = process.env.FORBIDDEN_TERMS_FILE ?? ".quality/forbidden-terms.json";
  const raw = readFileSync(resolve(file), "utf8");
  const parsed = JSON.parse(raw) as { terms: { label: string; pattern: string; flags?: string }[] };
  return parsed.terms.map((t) => ({ label: t.label, pattern: new RegExp(t.pattern, t.flags ?? "") }));
}