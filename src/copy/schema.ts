import { z } from "zod";
import type { CopyDocument } from "./types";

/**
 * Runtime contract for every copy variant. Guarantees that every section and
 * key the components read exists and that strings are non-empty, trimmed and
 * short enough for the layouts they were designed around.
 */
const nonEmpty = (label: string, max = 600) =>
  z
    .string({ required_error: `${label} is required` })
    .trim()
    .min(1, `${label} cannot be empty`)
    .max(max, `${label} exceeds ${max} chars`);

export const CopyDocumentSchema = z.object({
  hero: z.object({
    eyebrow: nonEmpty("hero.eyebrow", 80),
    headline: nonEmpty("hero.headline", 90),
    sub: nonEmpty("hero.sub", 260),
    ctaPrimary: nonEmpty("hero.ctaPrimary", 32),
    ctaSecondary: nonEmpty("hero.ctaSecondary", 32),
    assistantNote: nonEmpty("hero.assistantNote", 90),
  }),
  header: z.object({
    cta: nonEmpty("header.cta", 32),
  }),
  finalCta: z.object({
    eyebrow: nonEmpty("finalCta.eyebrow", 60),
    headline: nonEmpty("finalCta.headline", 90),
    body: nonEmpty("finalCta.body", 400),
    ctaPrimary: nonEmpty("finalCta.ctaPrimary", 32),
    ctaSecondary: nonEmpty("finalCta.ctaSecondary", 32),
  }),
}) satisfies z.ZodType<CopyDocument>;

export interface CopyValidationIssue {
  path: string;
  message: string;
}

export interface CopyValidationResult {
  ok: boolean;
  issues: CopyValidationIssue[];
}

export function validateCopy(input: unknown): CopyValidationResult {
  const parsed = CopyDocumentSchema.safeParse(input);
  if (parsed.success) return { ok: true, issues: [] };
  return {
    ok: false,
    issues: parsed.error.issues.map((i) => ({
      path: i.path.join(".") || "(root)",
      message: i.message,
    })),
  };
}

/**
 * Asserts the copy document is renderable. Throws in dev, logs in prod so a
 * misconfigured variant never blanks the page on a visitor.
 */
export function assertCopy(input: unknown, variantId: string): CopyDocument {
  const result = validateCopy(input);
  if (result.ok) return input as CopyDocument;
  const summary = result.issues.map((i) => `  - ${i.path}: ${i.message}`).join("\n");
  const msg = `[copy] variant "${variantId}" failed validation:\n${summary}`;
  if (import.meta.env?.DEV) throw new Error(msg);
  console.error(msg);
  return input as CopyDocument;
}
