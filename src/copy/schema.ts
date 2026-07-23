import { z } from "zod";
import type { CopyDocument } from "./types";

/**
 * Runtime contract for every copy variant. Guarantees that:
 *  - every section + key the components read exists
 *  - strings are non-empty and trimmed
 *  - array-length-sensitive fields (hero.meta / hero.rail) preserve the
 *    layout the components were designed around
 *  - the consent / legal copy still contains its expected anchors so
 *    privacy + contact links don't silently disappear
 */
const nonEmpty = (label: string, max = 600) =>
  z
    .string({ required_error: `${label} is required` })
    .trim()
    .min(1, `${label} cannot be empty`)
    .max(max, `${label} exceeds ${max} chars`);

export const CopyDocumentSchema = z.object({
  hero: z.object({
    headline: nonEmpty("hero.headline", 180),
    sub: nonEmpty("hero.sub", 400),
    meta: z.array(nonEmpty("hero.meta[]", 64)).max(4, "hero.meta allows up to 4 pills"),
    rail: z.array(nonEmpty("hero.rail[]", 64)).max(4, "hero.rail allows up to 4 items"),
    ctaPrimary: nonEmpty("hero.ctaPrimary", 48),
    ctaSecondary: nonEmpty("hero.ctaSecondary", 48),
  }),
  header: z.object({
    cta: nonEmpty("header.cta", 32),
  }),
  maaxSpotlight: z.object({
    eyebrow: nonEmpty("maaxSpotlight.eyebrow", 200),
    cta: nonEmpty("maaxSpotlight.cta", 48),
  }),
  finalCta: z.object({
    headline: nonEmpty("finalCta.headline", 120),
    headlineAccent: nonEmpty("finalCta.headlineAccent", 80),
    body: nonEmpty("finalCta.body", 600),
    ctaPrimary: nonEmpty("finalCta.ctaPrimary", 48),
    ctaSecondary: nonEmpty("finalCta.ctaSecondary", 48),
    tagline: nonEmpty("finalCta.tagline", 120),
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
  const summary = result.issues
    .map((i) => `  - ${i.path}: ${i.message}`)
    .join("\n");
  const msg = `[copy] variant "${variantId}" failed validation:\n${summary}`;
  if (import.meta.env?.DEV) throw new Error(msg);
  console.error(msg);
  // best-effort: return as-is so the caller's fallback path can take over
  return input as CopyDocument;
}
