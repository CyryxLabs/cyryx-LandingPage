import { AlertCircle, GitBranch, EyeOff, Repeat, ScrollText, ShieldAlert } from "lucide-react";
import { HudLabel } from "./primitives/HudLabel";

const PAINS = [
  { icon: AlertCircle, title: "Scattered context", copy: "Business knowledge is spread across documents, chats, websites, tools, dashboards, and human memory." },
  { icon: Repeat, title: "Manual work", copy: "Teams still repeat tasks that could be automated, routed, summarized, or structured by AI." },
  { icon: GitBranch, title: "Disconnected tools", copy: "AI output often stays outside the systems where the business actually operates." },
  { icon: ShieldAlert, title: "Inconsistent results", copy: "Without workflow design, review points, and operating rules, AI output is hard to repeat or trust." },
  { icon: EyeOff, title: "Poor visibility", copy: "Usage, cost, performance, decisions, and handoffs are difficult to monitor." },
  { icon: ScrollText, title: "No operating layer", copy: "Most companies have AI tools, but not an AI system designed around how the business works." },
];

export function WhyCyryx() {
  return (
    <section id="problem" className="relative py-14 sm:py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-end cx-reveal">
          <div>
            <HudLabel withDot>Company Thesis</HudLabel>
            <h2 className="mt-5 font-display text-[32px] sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-[1.05] tracking-[-0.02em] text-silver-gradient">
              AI is no longer the question.<br />
              <span style={{ color: "var(--accent-glow)" }}>Execution is.</span>
            </h2>
          </div>
          <p className="text-[15px] sm:text-base lg:text-lg leading-relaxed text-[var(--silver-dim)] max-w-xl">
            Most companies now have access to powerful AI tools. The harder
            problem is turning those tools into reliable systems that
            understand context, support real workflows, preserve decisions,
            control costs, and produce work that can be reviewed. Cyryx Labs
            exists to build that operational layer — proprietary AI products,
            applied systems, and implementation architecture for businesses
            moving from scattered AI experimentation to structured execution.
          </p>
        </div>

        <div className="cx-stagger mt-14 lg:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {PAINS.map(({ icon: Icon, title, copy }) => (
            <article
              key={title}
              className="cx-stagger-item glass-panel rounded-md p-6 lg:p-7"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-sm border border-[color-mix(in_oklab,var(--accent-glow)_30%,transparent)]">
                  <Icon className="h-4 w-4 text-[var(--accent-glow)]" />
                </span>
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[var(--silver)]">
                  {title}
                </h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[var(--silver-dim)]">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}