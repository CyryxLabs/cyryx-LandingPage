import type { CopyDocument } from "./types";
import { SHARED_COPY } from "./shared";

/**
 * Hero v5 (Hallmark redesign, 2026-11-06): the founder's chosen title (Oct 2026)
 * over the monolith film. The three rail lines are the terms of the offer,
 * revealed as the film plays.
 */
export const v5: CopyDocument = {
  hero: {
    ...SHARED_COPY.heroBase,
    headline: "AI that works. People who answer for it.",
    sub: "Websites, automations, software and AI agents, at a fixed price in writing.",
    rail: [
      "The price is fixed before we start.",
      "AI asks a person before it acts.",
      "Finished means it passes your checklist.",
    ],
  },
  header: SHARED_COPY.header,
  finalCta: {
    ...SHARED_COPY.finalCta,
    body: "Tell us what you want to build or fix. In 20 minutes you get an honest answer and a clear next step.",
  },
};
