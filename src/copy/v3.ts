import type { CopyDocument } from "./types";

/**
 * v3 — current production copy. Add new variants by creating a sibling file
 * (e.g. v4.ts) and listing it in src/copy/index.ts. Visit `/?copy=v4` to opt
 * the current browser into the new variant; v3 stays the default for everyone
 * else (including search engines).
 */
export const v3: CopyDocument = {
  hero: {
    headline: "Built to achieve. Not just to generate.",
    sub:
      "Cyryx Labs builds AI products, execution systems, and applied research for companies that measure AI by outcomes — not by output.",
    meta: ["AI PRODUCTS", "EXECUTION SYSTEMS", "APPLIED RESEARCH", "GOAL-GROUNDED ARCHITECTURE"],
    rail: ["Outcomes over output", "Verification over generation", "Systems over tools"],
    ctaPrimary: "Start a Project",
    ctaSecondary: "Explore MAAX Studio",
  },
  header: {
    cta: "Start a Project",
  },
  maaxSpotlight: {
    eyebrow: "A new operating model for AI-assisted software development.",
    cta: "Request Early Access",
  },
  finalCta: {
    headline: "Build AI systems that",
    headlineAccent: "achieve objectives.",
    body:
      "Most AI produces output. Cyryx builds systems that verify outcomes. Whether you're building an AI product, automating a business workflow, deploying an internal assistant, or looking for early access to MAAX Studio — Cyryx Labs turns AI capability into measurable business results.",
    ctaPrimary: "Start a Project",
    ctaSecondary: "Request MAAX Studio Access",
    tagline: "Built to achieve. Not just to generate.",
  },
};