import type { CopyDocument } from "./types";
import { SHARED_COPY } from "./shared";

/** Hero option A — default for every visitor and for search engines. */
export const v4a: CopyDocument = {
  hero: {
    ...SHARED_COPY.heroBase,
    headline:
      "Websites, software and AI that grow your business — built and run by one accountable team.",
  },
  header: SHARED_COPY.header,
  finalCta: SHARED_COPY.finalCta,
};
