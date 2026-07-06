import type { CopyDocument } from "./types";

/**
 * v4 — Copy v4 (Final Enterprise Register). Kept under the `v3` export name
 * for backward-compat with the copy variant registry.
 */
export const v3: CopyDocument = {
  hero: {
    headline: "The execution layer for operational AI.",
    sub:
      "Cyryx Labs builds AI products, agentic workflow systems, and governed execution infrastructure for teams moving from scattered AI experiments to structured, auditable operations.",
    meta: [],
    rail: [],
    ctaPrimary: "Explore MAAX Studio",
    ctaSecondary: "Start a project",
  },
  header: {
    cta: "Start a project",
  },
  maaxSpotlight: {
    eyebrow: "FLAGSHIP PRODUCT · IN DEVELOPMENT",
    cta: "Request early access",
  },
  finalCta: {
    headline: "Ready to turn AI into",
    headlineAccent: "execution?",
    body:
      "Build your AI product, automate a workflow, or join the MAAX Studio early access program.",
    ctaPrimary: "Start a project",
    ctaSecondary: "Request access",
    tagline: "From prompt chaos to governed AI execution.",
  },
};