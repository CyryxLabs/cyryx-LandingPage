import type { CopyDocument } from "./types";

/**
 * v3 — current production copy. Add new variants by creating a sibling file
 * (e.g. v4.ts) and listing it in src/copy/index.ts. Visit `/?copy=v4` to opt
 * the current browser into the new variant; v3 stays the default for everyone
 * else (including search engines).
 */
export const v3: CopyDocument = {
  hero: {
    headline: "Building operational intelligence for the AI era.",
    sub:
      "Cyryx Labs develops proprietary AI products, applied systems, and implementation architecture that help organizations turn artificial intelligence into working business capability.",
    meta: ["AI PRODUCTS", "APPLIED AI SYSTEMS", "WORKFLOW AUTOMATION", "AI RESEARCH"],
    rail: ["Product thinking", "Applied AI engineering", "Governed execution"],
    ctaPrimary: "Explore MAAX Studio",
    ctaSecondary: "Start an AI Project",
  },
  header: {
    cta: "Start an AI Project",
  },
  maaxSpotlight: {
    eyebrow: "The native command workbench for AI-native software execution.",
    cta: "Request Early Access",
  },
  finalCta: {
    headline: "Ready to build AI into",
    headlineAccent: "your business?",
    body:
      "Whether you need an AI-powered website, workflow automation, an internal assistant, a custom AI product, or early access to MAAX Studio, Cyryx Labs can help turn the idea into a working system.",
    ctaPrimary: "Start an AI Project",
    ctaSecondary: "Request MAAX Studio Access",
    tagline: "Build AI into your business.",
  },
};