import { ArrowRight } from "lucide-react";
import { PLAN_STEPS } from "@/data/offer";
import { buildStartProjectHref } from "@/lib/cta";
import { trackCta } from "@/lib/track-cta";
import { SectionHeading } from "./SectionHeading";

export function Plan() {
  const startHref = buildStartProjectHref({ source: "home" });
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      data-story-section
      className="relative overflow-hidden py-12 sm:py-20 lg:py-28"
    >
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          id="how-it-works-heading"
          title="Three steps from idea to running system."
        />
        <div className="relative mt-10 sm:mt-16">
          <div
            aria-hidden
            className="cx-sweep-line absolute left-0 right-0 top-5 hidden h-px bg-[color-mix(in_oklab,var(--silver)_18%,transparent)] lg:block"
          />
          <ol className="cx-stagger relative grid gap-8 lg:grid-cols-3 lg:gap-10">
            {PLAN_STEPS.map((step) => (
              <li
                key={step.n}
                className="cx-stagger-item relative grid grid-cols-[2.75rem_1fr] gap-5 lg:block"
              >
                <span className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--accent-glow)] bg-[var(--onyx)] font-mono text-[12px] text-[var(--accent-glow)]">
                  {step.n}
                </span>
                <div className="lg:mt-8">
                  <h3 className="font-display text-2xl font-semibold tracking-[-0.03em] text-[var(--silver)]">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-[var(--silver-dim)]">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="cx-reveal mt-10 grid gap-6 rounded-xl border border-white/10 bg-[var(--obsidian)] p-6 sm:mt-14 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <p className="max-w-3xl text-[15px] leading-relaxed text-[var(--silver-dim)] sm:text-base">
            <span className="text-[var(--silver)]">No surprises.</span> Every project has a written
            acceptance checklist agreed before work starts, and you own the code, content and data
            we create for you.
          </p>
          <a
            href={startHref}
            className="cx-btn-primary justify-center"
            onClick={() => trackCta({ cta: "start_project", section: "paths", href: startHref })}
          >
            Get a free fit check <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
