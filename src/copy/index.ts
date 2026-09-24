import { v4a } from "./v4a";
import { v4b } from "./v4b";
import type { CopyDocument } from "./types";
import { assertCopy } from "./schema";

export type { CopyDocument } from "./types";
export { CopyDocumentSchema, validateCopy } from "./schema";

/**
 * Hero copy variants. `v4a` is the default for every visitor and for search
 * engines. `?copy=v4b` pins option B in that browser (see lib/copy-variant.ts).
 */
const REGISTRY = {
  v4a,
  v4b,
} as const;

export type CopyVariant = keyof typeof REGISTRY;

export const DEFAULT_COPY_VARIANT: CopyVariant = "v4a";

export const AVAILABLE_COPY_VARIANTS = Object.keys(REGISTRY) as readonly CopyVariant[];

export function getCopy(variant: CopyVariant | string | null | undefined): CopyDocument {
  if (variant && variant in REGISTRY) {
    return assertCopy(REGISTRY[variant as CopyVariant], variant as string);
  }
  return assertCopy(REGISTRY[DEFAULT_COPY_VARIANT], DEFAULT_COPY_VARIANT);
}
