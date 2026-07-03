import type { CopyDocument } from "./types";

/**
 * v4 — Copy v4 (Final Enterprise Register). Kept under the `v3` export name
 * for backward-compat with the copy variant registry.
 */
export const v3: CopyDocument = {
  hero: {
    headline: "The execution layer for enterprise AI.",
    sub:
      "Cyryx Labs builds AI products and execution systems — governed agents, automated workflows, and operational infrastructure engineered for accountability, auditability, and cost control.",
    meta: [],
    rail: [],
    ctaPrimary: "Start a project",
    ctaSecondary: "MAAX Studio →",
  },
  header: {
    cta: "Start a project",
  },
  maaxSpotlight: {
    eyebrow: "FLAGSHIP · IN DEVELOPMENT",
    cta: "Request early access",
  },
  finalCta: {
    headline: "From experimentation to",
    headlineAccent: "governed execution.",
    body:
      "Describe the workflow, the product, or the operational problem. We will tell you directly whether it warrants a system, what it requires, and what it costs.",
    ctaPrimary: "Start a project",
    ctaSecondary: "Request MAAX early access",
    tagline: "AI products and execution systems for the agentic era.",
  },
};