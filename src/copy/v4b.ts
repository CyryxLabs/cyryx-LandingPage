import type { CopyDocument } from "./types";
import { SHARED_COPY } from "./shared";

/** Hero option B — outcome-led. Opt in with `?copy=v4b`. */
export const v4b: CopyDocument = {
  hero: {
    ...SHARED_COPY.heroBase,
    headline: "Put AI to work in your operations, without losing control of it.",
    sub: "Cyryx Labs builds agents, automations and internal assistants that plug into the tools you already use, with the approvals, limits and cost controls that let you trust them in production.",
  },
  header: SHARED_COPY.header,
  finalCta: SHARED_COPY.finalCta,
};
