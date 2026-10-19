import type { CopyDocument } from "./types";

/**
 * Copy shared by every hero variant. Only the hero promise changes between A and B.
 * Plain English on purpose: a visitor should know in five seconds what Cyryx
 * builds, for whom, and what to click (positioning plan, 2026-10-19).
 */
export const SHARED_COPY: Omit<CopyDocument, "hero"> & {
  heroBase: Omit<CopyDocument["hero"], "headline">;
} = {
  heroBase: {
    eyebrow: "Advise · Build · Control · Operate",
    sub: "Cyryx Labs designs and builds websites, automations, custom software and AI for small businesses, growing companies and enterprises across the US and Latin America. Fixed timelines. A human in control of every AI decision.",
    rail: ["Websites. Software.", "Automation. AI.", "One accountable team, start to finish."],
    ctaPrimary: "Get a free fit check",
    ctaSecondary: "See what we build",
    trust: "Free 20-minute call · Fixed-price quotes · English & Español",
    assistantNote: "Have a question first? Ask the Cyryx assistant. It answers in seconds.",
  },
  header: {
    cta: "Get a free fit check",
  },
  finalCta: {
    eyebrow: "Start here",
    headline: "Sometimes the right answer is not to build.",
    body: "Let's find out in 20 minutes. Tell us what you want to build or fix — a website, an automation, software or AI — and we'll give you an honest answer and a clear next step.",
    ctaPrimary: "Get a free fit check",
    ctaSecondary: "See how we work",
  },
};
