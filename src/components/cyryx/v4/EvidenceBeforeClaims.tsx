import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { HudLabel } from "../primitives/HudLabel";

const ARTIFACTS = [
  ["01", "Architecture brief", "How the system should work."],
  ["02", "Acceptance matrix", "What must pass before release."],
  ["03", "Operating record", "What happened, who approved it, and what it cost."],
] as const;

export function EvidenceBeforeClaims() {
  return (
    <section
      id="evidence"
      aria-labelledby="evidence-heading"
      data-story-section
      className="relative overflow-hidden bg-[var(--graphite)] py-12 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="cx-reveal grid gap-6 sm:gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:gap-20">
          <div>
            <HudLabel withDot>Evidence before claims</HudLabel>
            <h2
              id="evidence-heading"
              className="mt-7 max-w-[15ch] font-display text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-silver-gradient sm:text-5xl lg:text-6xl"
            >
              Show the architecture. Define the limits. Test what matters.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg">
            Cyryx treats evidence as part of delivery. Architecture decisions, acceptance criteria,
            operating boundaries, and ownership are made explicit before trust expands.
          </p>
        </div>

        <ol className="cx-stagger mt-10 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:mt-16 lg:grid-cols-3">
          {ARTIFACTS.map(([n, title, body]) => (
            <li key={n} className="cx-stagger-item bg-[var(--obsidian)] p-6 sm:p-8 lg:min-h-64">
              <span className="font-mono text-[9px] tracking-[0.22em] text-[var(--accent-glow)]">
                {n}
              </span>
              <h3 className="mt-8 font-display text-2xl font-medium tracking-[-0.03em] text-[var(--silver)] sm:mt-12">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">{body}</p>
            </li>
          ))}
        </ol>

        <div className="cx-reveal mt-8 flex flex-wrap gap-6">
          <Link
            to="/research"
            className="inline-flex min-h-11 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent-glow)]"
          >
            Explore applied research <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
          <Link
            to="/answers"
            className="inline-flex min-h-11 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--silver-dim)] transition-colors hover:text-[var(--silver)]"
          >
            Read Cyryx Answers <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
