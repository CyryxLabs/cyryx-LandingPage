import { v3 } from "./v3";
import type { CopyDocument } from "./types";
import { assertCopy } from "./schema";

export type { CopyDocument } from "./types";
export { CopyDocumentSchema, validateCopy } from "./schema";

const REGISTRY = {
  v3,
} as const;

export type CopyVariant = keyof typeof REGISTRY;

export const AVAILABLE_COPY_VARIANTS = Object.keys(REGISTRY) as readonly CopyVariant[];

export function getCopy(variant: CopyVariant | string | null | undefined): CopyDocument {
  if (variant && variant in REGISTRY) {
    return assertCopy(REGISTRY[variant as CopyVariant], variant as string);
  }
  return assertCopy(REGISTRY.v3, "v3");
}