import { v3 } from "./v3";
import type { CopyDocument } from "./types";

export type { CopyDocument } from "./types";

const REGISTRY = {
  v3,
} as const;

export type CopyVariant = keyof typeof REGISTRY;

export const AVAILABLE_COPY_VARIANTS = Object.keys(REGISTRY) as readonly CopyVariant[];

export function getCopy(variant: CopyVariant | string | null | undefined): CopyDocument {
  if (variant && variant in REGISTRY) {
    return REGISTRY[variant as CopyVariant];
  }
  return REGISTRY.v3;
}