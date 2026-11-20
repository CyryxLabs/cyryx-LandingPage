import type { CopyDocument } from "./types";
import { SHARED_COPY } from "./shared";

/**
 * Hero v5, institutional revision (2026-11-06): the founder retired the
 * monolith film and asked for a professional, institutional voice. The rail
 * is empty because no statements play over a film any more.
 */
export const v5: CopyDocument = {
  hero: {
    ...SHARED_COPY.heroBase,
    headline: "We build the systems your business runs on.",
    sub: "Websites, custom software, automation and AI agents, scoped and priced in writing first.",
    rail: [],
  },
  header: SHARED_COPY.header,
  finalCta: {
    ...SHARED_COPY.finalCta,
    headline: "Start with a 20-minute conversation.",
    body: "Tell us what you want to build or fix. You get an honest answer and, when it makes sense, a written plan.",
  },
};
