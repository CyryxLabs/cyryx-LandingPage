import type { CopyDocument } from "./types";
import { SHARED_COPY } from "./shared";

/** Hero option A — the registered reference headline. Default for every visitor. */
export const v4a: CopyDocument = {
  hero: {
    ...SHARED_COPY.heroBase,
    headline: "The execution layer for enterprise AI.",
    sub: "We design, build and run AI systems that act inside your workflows, with clear permissions, human approval where it matters and a record of every decision.",
  },
  header: SHARED_COPY.header,
  finalCta: SHARED_COPY.finalCta,
};
