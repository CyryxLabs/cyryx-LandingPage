import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SERVICE_STAGES } from "@/data/offer";
import { buildStartProjectHref } from "@/lib/cta";
import { trackCta } from "@/lib/track-cta";
import { SectionHeading } from "./SectionHeading";

/** Advise · Build · Control · Operate, each with the concrete services behind it. */
export function Services() {
  const startHref = buildStartProjectHref({ source: "home" });
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      data-story-section
      className="relative scroll-mt-24 overflow-hidden bg-[var(--graphite)] py-12 sm:py-20 lg:py-28"
    >
      <div aria-hidden className="cx-aurora opacity-60" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          id="services-heading"
          title="Four ways to work with us."
          lead="Start with the stage you need now. Each one stands on its own, and they connect into one program when you need more."
        />

        <ol className="cx-stagger mt-8 grid gap-4 sm:mt-16 md:grid-cols-2 xl:grid-cols-4">
          {SERVICE_STAGES.map((stage, index) => (
            <li
              key={stage.id}
              id={`service-${stage.id}`}
              className="cx-stagger-item group flex flex-col rounded-xl border border-white/10 bg-[var(--obsidian)] p-6 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_oklab,var(--accent-glow)_45%,transparent)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-7"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--accent-glow)]">
                  {String(index + 1).padStart(2, "0")} · {stage.name}
                </span>
              </div>
              <h3 className="mt-6 font-display text-2xl font-semibold leading-[1.1] tracking-[-0.03em] text-[var(--silver)]">
                {stage.outcome}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--silver-dim)]">
                {stage.body}
              </p>
              <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-5 text-[15px] text-[var(--silver)]">
                {stage.services.map((service) => (
                  <li key={service} className="flex gap-3">
                    <span aria-hidden className="text-[var(--accent-glow)]">
                      /
                    </span>
                    {service}
                  </li>
                ))}
              </ul>
              <Link
                to={stage.href}
                className="mt-auto inline-flex min-h-11 items-center gap-2 pt-6 font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--silver)] transition-colors hover:text-[var(--accent-glow)]"
              >
                {stage.cta} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </li>
          ))}
        </ol>

        <div className="cx-reveal mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[15px] text-[var(--silver-dim)]">
            Every project starts with a free fit check and ends in a fixed written quote.
          </p>
          <a
            href={startHref}
            onClick={() =>
              trackCta({ cta: "start_project", section: "operating_model", href: startHref })
            }
            className="inline-flex min-h-11 items-center gap-2 font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--accent-glow)]"
          >
            Not sure where to start? Tell us the problem{" "}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
