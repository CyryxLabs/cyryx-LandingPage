import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { HudLabel } from "../primitives/HudLabel";
import { OPERATING_LIFECYCLE } from "@/data/site-taxonomy";
import { buildStartProjectHref } from "@/lib/cta";
import { trackCta } from "@/lib/track-cta";

export function OperatingModel() {
  return (
    <section
      id="operating-model"
      aria-labelledby="operating-model-heading"
      data-story-section
      className="relative bg-[var(--graphite)] py-12 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="cx-reveal grid gap-6 sm:gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end lg:gap-20">
          <div>
            <HudLabel withDot>Ways to engage</HudLabel>
            <h2
              id="operating-model-heading"
              className="mt-5 max-w-[12ch] font-display text-3xl font-semibold leading-[0.98] tracking-[-0.045em] text-[var(--silver)] sm:mt-7 sm:text-5xl lg:text-7xl"
            >
              Four ways to start.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg lg:pb-2">
            Start with the stage you need now: Advise, Build, Control or Operate. Each one stands on
            its own, and they connect into one program when you need more.
          </p>
        </div>

        <ol className="cx-stagger relative mt-8 grid gap-6 sm:mt-16 sm:gap-10 lg:grid-cols-4 lg:gap-0">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-4 hidden h-px bg-[color-mix(in_oklab,var(--silver)_18%,transparent)] lg:block"
          />
          {OPERATING_LIFECYCLE.map((stage) => (
            <li
              key={stage.name}
              className="cx-stagger-item relative flex flex-col border-l border-[color-mix(in_oklab,var(--silver)_18%,transparent)] pl-5 sm:pl-6 lg:min-h-[24rem] lg:border-l-0 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
            >
              <div className="relative z-10 flex items-center gap-4">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--accent-glow)] bg-[var(--graphite)] font-mono text-[11px] text-[var(--accent-glow)]">
                  {stage.n}
                </span>
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--steel)]">
                  {stage.name}
                </span>
              </div>
              <h3 className="mt-5 max-w-[16ch] font-display text-2xl font-medium leading-[1.02] tracking-[-0.035em] text-[var(--silver)] sm:mt-10 sm:max-w-[14ch] sm:text-3xl">
                {stage.promise}
              </h3>
              <div className="mt-4 border-t border-[color-mix(in_oklab,var(--silver)_12%,transparent)] pt-4 sm:mt-8 sm:pt-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--steel)]">
                  What you receive
                </p>
                <ul className="mt-3 space-y-1.5 text-sm text-[var(--silver-dim)] sm:mt-4 sm:space-y-2">
                  {stage.receives.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden className="text-[var(--accent-glow)]">
                        /
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to={stage.href}
                className="mt-auto inline-flex min-h-11 items-center gap-2 pt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--silver)] transition hover:text-[var(--accent-glow)] sm:pt-8"
              >
                {stage.cta} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </li>
          ))}
        </ol>
        <div className="cx-reveal mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-5 sm:mt-10 sm:gap-6 sm:pt-8">
          <a
            href={buildStartProjectHref({ source: "home" })}
            onClick={() =>
              trackCta({
                cta: "start_project",
                section: "operating_model",
                href: buildStartProjectHref({ source: "home" }),
              })
            }
            className="inline-flex min-h-11 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--accent-glow)]"
          >
            Not sure where to start? Tell us the problem <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </a>
          <Link
            to="/engagement-model"
            className="inline-flex min-h-11 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--silver-dim)] transition-colors hover:text-[var(--silver)]"
          >
            See how engagements run <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
