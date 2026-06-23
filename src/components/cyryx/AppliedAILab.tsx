import { Bot, Brain, ShieldCheck, Route, Boxes } from "lucide-react";
import { HudLabel } from "./primitives/HudLabel";

const FOCUS = [
  { icon: Bot, title: "Agentic Execution Systems", copy: "We design systems that turn goals into structured missions, routed execution, validated outputs, and auditable outcomes." },
  { icon: Brain, title: "Context Intelligence", copy: "We build context systems that help AI retrieve the right information, at the right time, with less waste and higher precision." },
  { icon: ShieldCheck, title: "AI Governance & Evaluation", copy: "We create evaluation and governance layers that make AI systems measurable, auditable, cost-aware, and safe to operate." },
  { icon: Route, title: "Model Routing & Cost Intelligence", copy: "We develop routing and cost-intelligence systems that help teams use the right model for the right task without losing margin or control." },
  { icon: Boxes, title: "Productized AI Systems", copy: "We turn applied AI experiments into production-ready products, reusable systems, and scalable business capabilities." },
];

export function AppliedAILab() {
  return (
    <section id="applied-lab" className="relative py-20 lg:py-32 bg-[var(--graphite)]">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color-mix(in_oklab,var(--accent-glow)_30%,transparent)] to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:items-end cx-reveal">
          <div>
            <HudLabel withDot>Cyryx Applied AI Lab</HudLabel>
            <h2 className="mt-5 font-display text-[30px] sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-[1.05] tracking-tight text-silver-gradient uppercase">
              We don&rsquo;t just implement AI. We design the systems that make AI operational.
            </h2>
          </div>
          <div>
            <p className="text-[15px] sm:text-base leading-relaxed text-[var(--silver-dim)] max-w-md">
              Cyryx Applied AI Lab develops the protocols, architectures,
              evaluation models, and execution systems behind our products and
              client solutions.
            </p>
            <p className="mt-5 hud-label text-[var(--accent-glow)]">
              Applied research for real AI execution.
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