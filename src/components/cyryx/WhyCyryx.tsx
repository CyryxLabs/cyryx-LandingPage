import { AlertCircle, GitBranch, EyeOff, Repeat, ScrollText, ShieldAlert } from "lucide-react";
import { HudLabel } from "./primitives/HudLabel";

const PAINS = [
  { icon: AlertCircle, title: "Output without objectives", copy: "Teams generate content, code, and decisions with no defined measure of success. AI produces. Nobody knows if it worked." },
  { icon: Repeat, title: "Generation without verification", copy: "AI delivers a single response optimized for probability — not for the goal. There is no evaluation before deployment." },
  { icon: GitBranch, title: "Context without continuity", copy: "Business knowledge is scattered across tools, documents, chats, and people. Every AI interaction starts from zero." },
  { icon: ShieldAlert, title: "Automation without governance", copy: "AI acts across workflows without structure for review, cost control, or accountability. Work happens. Errors compound." },
  { icon: EyeOff, title: "Systems without architecture", copy: "Companies have AI tools. Few have AI systems designed around how the business works. The difference is compounding returns." },
  { icon: ScrollText, title: "Tools without measurement", copy: "Without success criteria, evaluation rubrics, and review loops, AI value cannot be confirmed or improved over time." },
];

export function WhyCyryx() {
  return (
    <section id="problem" className="relative py-14 sm:py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-end cx-reveal">
          <div>
            <HudLabel withDot>Company Thesis</HudLabel>
            <h2 className="mt-5 font-display text-[32px] sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-[1.05] tracking-[-0.02em] text-silver-gradient">
              The gap between AI output and business outcome is the{" "}
              <span style={{ color: "var(--accent-glow)" }}>defining problem of this era.</span>
            </h2>
          </div>
          <p className="text-[15px] sm:text-base lg:text-lg leading-relaxed text-[var(--silver-dim)] max-w-xl">
            Every company now has access to AI. Most cannot measure whether it
            works. Models generate. They do not verify. Agents respond. They do
            not evaluate. The gap between what AI generates and what a business
            actually needs is not a model problem — it is a systems problem.
            Cyryx Labs closes that gap, building the products, execution
            systems, and research infrastructure that connect AI capability to
            measurable business outcomes.
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