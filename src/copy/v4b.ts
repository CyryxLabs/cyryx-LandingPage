import type { CopyDocument } from "./types";
import { SHARED_COPY } from "./shared";

/** Hero option B — pinned with ?copy=v4b for comparison. */
export const v4b: CopyDocument = {
  hero: {
    ...SHARED_COPY.heroBase,
    headline: "From idea to running system: websites, MVPs and AI, with you in control.",
  },
  header: SHARED_COPY.header,
  finalCta: SHARED_COPY.finalCta,
};
