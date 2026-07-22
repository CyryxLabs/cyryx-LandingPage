import type { CopyDocument } from "./types";

/**
 * v4 — Copy v4 (Final Enterprise Register). Kept under the `v3` export name
 * for backward-compat with the copy variant registry.
 */
export const v3: CopyDocument = {
  hero: {
    headline: "The execution layer for enterprise AI.",
    sub: "Cyryx Labs builds AI products and execution systems — governed agents, automated workflows, and operational infrastructure engineered for accountability, auditability, and cost control.",
    meta: [],
    rail: [],
    ctaPrimary: "Start a project",
    ctaSecondary: "MAAX Studio →",
  },
  header: {
    cta: "Start a project",
  },
  maaxSpotlight: {
    eyebrow: "FLAGSHIP PRODUCT · IN DEVELOPMENT",
    cta: "Request early access",
  },
  finalCta: {
    headline: "Ready to make AI an",
    headlineAccent: "operating capability?",
    body: "Bring us the workflow, product opportunity, or operational constraint. We will help determine whether AI belongs there — and what it takes to make the result durable.",
    ctaPrimary: "Start a project",
    ctaSecondary: "Request access",
    tagline: "From prompt chaos to governed AI execution.",
  },
};
