import { Bot, Brain, ShieldCheck, Route, Boxes } from "lucide-react";
import { HudLabel } from "./primitives/HudLabel";

const FOCUS = [
  { icon: ShieldCheck, title: "Goal-Grounded Generation", copy: "How AI systems can evaluate output against defined objectives before delivery. The architecture behind generation that verifies, not just produces." },
  { icon: Brain, title: "Context Intelligence", copy: "How AI retrieves and uses the right business context at the right time. The architecture behind memory systems that compound." },
  { icon: Bot, title: "Evaluation Architecture", copy: "Methods for measuring AI output quality before and after deployment. Rubrics, gates, scoring systems, and feedback loops that make quality measurable." },
  { icon: Route, title: "Agentic Workflow Design", copy: "How multi-agent systems coordinate work across tools, roles, and review points without losing structure, cost control, or human oversight." },
  { icon: Boxes, title: "Model Routing & Economics", copy: "How systems route tasks to the right model for the right cost while keeping spend visible and accountable." },
  { icon: Brain, title: "Knowledge Systems", copy: "How scattered business knowledge becomes structured intelligence that AI can retrieve, use, and build on." },
];

export function AppliedAILab() {
  return (
    <section id="applied-lab" className="relative py-14 sm:py-20 lg:py-32 bg-[var(--graphite)]">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color-mix(in_oklab,var(--accent-glow)_30%,transparent)] to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:items-end cx-reveal">
          <div>
            <HudLabel withDot>Cyryx Applied AI Lab</HudLabel>
            <h2 className="mt-5 font-display text-[30px] sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-[1.05] tracking-tight text-silver-gradient uppercase">
              Research built to ship.
            </h2>
          </div>
          <div>
            <p className="text-[15px] sm:text-base leading-relaxed text-[var(--silver-dim)] max-w-md">
              The Applied AI Lab develops the architecture and evaluation
              methods behind Cyryx products and client systems. This is not
              academic research. Every pattern we study becomes infrastructure
              we build.
            </p>
            <p className="mt-5 hud-label text-[var(--accent-glow)]">
              Research that ships. Architecture that compounds.
            </p>
          </div>
        </div>

        <div className="cx-stagger mt-14 lg:mt-20 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FOCUS.map(({ icon: Icon, title, copy }) => (
            <article
              key={title}
              className="cx-stagger-item glass-panel rounded-md p-6 lg:p-7"
            >
              <span className="grid h-10 w-10 place-items-center rounded-sm border border-[color-mix(in_oklab,var(--accent-glow)_30%,transparent)]">
                <Icon className="h-4 w-4 text-[var(--accent-glow)]" />
              </span>
              <h3 className="mt-5 font-display text-base font-semibold uppercase tracking-wider text-[var(--silver)]">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}