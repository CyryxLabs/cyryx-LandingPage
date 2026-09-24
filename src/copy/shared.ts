import type { CopyDocument } from "./types";

/** Copy shared by every hero variant. Only the hero promise changes between A and B. */
export const SHARED_COPY: Omit<CopyDocument, "hero"> & {
  heroBase: Omit<CopyDocument["hero"], "headline" | "sub">;
} = {
  heroBase: {
    eyebrow: "AI systems · Advise · Build · Control · Operate",
    ctaPrimary: "Start a project",
    ctaSecondary: "See how we work",
    assistantNote: "Have a question first? Ask the Cyryx assistant. It answers in seconds.",
  },
  header: {
    cta: "Start a project",
  },
  finalCta: {
    eyebrow: "Start here",
    headline: "What should AI be trusted to change in your business?",
    body: "Tell us about the workflow, product or constraint. We will tell you whether AI belongs there, what it would take, and where to start: Advise, Build, Control or Operate. Sometimes the right answer is not to build.",
    ctaPrimary: "Start a project",
    ctaSecondary: "See how we work",
  },
};
