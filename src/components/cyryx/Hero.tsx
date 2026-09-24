import { ArrowUpRight, MessageSquare } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { CyryxHeroSequence } from "@/components/cyryx/CyryxHeroSequence";
import { ExecutionTrace } from "@/components/cyryx/ExecutionTrace";
import { useCopyVariant } from "@/lib/copy-variant";
import { getCopy } from "@/copy";
import { buildStartProjectHref } from "@/lib/cta";
import { trackCta } from "@/lib/track-cta";
import { isAssistantEnabled, openAssistant } from "@/lib/assistant-client";

/**
 * Homepage hero.
 *
 * Headline, sub and both CTAs are visible in the first frame at every
 * breakpoint. On tablet/desktop the approved monolith film scrubs across one
 * extra viewport while the copy stays pinned; on phones the poster is static
 * and the page flows normally, so the message never sits below the fold.
 */
export function Hero() {
  const copy = getCopy(useCopyVariant()).hero;
  const startHref = buildStartProjectHref({ source: "home" });
  const assistantEnabled = isAssistantEnabled();

  return (
    <section id="top" data-hero aria-labelledby="hero-heading" className="relative bg-black">
      <div data-hero-scroll-scene className="relative md:h-[190svh]">
        <div
          data-hero-sticky
          className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-black md:sticky md:top-0 md:h-[100svh] md:items-center"
        >
          <div
            className="cx-bg cx-hero-media-frame absolute inset-0 -z-10 overflow-hidden"
            data-hero-media-frame
          >
            <CyryxHeroSequence />
            <div className="cx-hero-overlay cx-hero-grade absolute inset-0" />
            <div className="cx-hero-overlay cx-hero-feather absolute inset-0" />
            <div
              aria-hidden
              className="cx-hero-line-glow absolute left-0 right-0 top-1/2 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--accent-glow) 60%, transparent) 50%, transparent 100%)",
                opacity: 0.4,
              }}
            />
          </div>

          <div
            aria-hidden
            data-hero-aura
            className="cx-stage pointer-events-none absolute left-1/2 top-[40%] -z-[5] h-[55vh] w-[55vh] -translate-x-1/2 -translate-y-1/2 rounded-full lg:left-[72%] lg:top-1/2"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--accent-glow) 20%, transparent) 0%, transparent 65%)",
              filter: "blur(50px)",
            }}
          />

          <div
            data-hero-content
            className="relative z-[5] mx-auto grid w-full max-w-7xl gap-10 px-5 pb-10 pt-28 sm:px-8 md:pb-16 md:pt-32 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-center lg:gap-14 lg:px-10"
          >
            <div className="cx-hero-copy max-w-[40rem]">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent-glow)] sm:text-xs">
                {copy.eyebrow}
              </p>
              <h1
                id="hero-heading"
                className="cx-hero-heading mt-4 font-display font-semibold text-[var(--silver)] sm:mt-5"
              >
                <span data-hero-line className="cx-hero-title-line block text-chrome-gradient">
                  {copy.headline}
                </span>
              </h1>

              <p className="cx-sub cx-hero-sub mt-5 max-w-[36rem] text-base leading-[1.6] text-[rgba(230,238,239,0.86)] [text-shadow:0_1px_16px_rgba(0,0,0,0.9)] sm:mt-6 sm:text-lg">
                {copy.sub}
              </p>

              <div className="cx-hero-ctas mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center sm:gap-4">
                <a
                  href={startHref}
                  data-cta="primary"
                  className="cx-btn-primary"
                  onClick={() =>
                    trackCta({ cta: "start_project", section: "hero", href: startHref })
                  }
                >
                  <span>{copy.ctaPrimary}</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <Link
                  to="/engagement-model"
                  data-cta="secondary"
                  className="cx-btn-secondary"
                  onClick={() =>
                    trackCta({ cta: "see_how_we_work", section: "hero", href: "/engagement-model" })
                  }
                >
                  <span>{copy.ctaSecondary}</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              {assistantEnabled && (
                <button
                  type="button"
                  onClick={() => openAssistant("hero")}
                  className="mt-5 inline-flex min-h-11 items-center gap-2 text-left text-sm text-[var(--silver-dim)] underline-offset-4 transition-colors hover:text-[var(--accent-glow)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)]"
                >
                  <MessageSquare
                    className="h-4 w-4 shrink-0 text-[var(--accent-glow)]"
                    aria-hidden
                  />
                  {copy.assistantNote}
                </button>
              )}
            </div>

            <div className="hidden lg:block">
              <ExecutionTrace />
            </div>
          </div>

          <div
            aria-hidden="true"
            data-hero-scroll-cue
            className="cx-hero-scroll-cue pointer-events-none absolute bottom-8 right-8 hidden items-center gap-4 md:flex xl:bottom-10 xl:right-12"
          >
            <span className="cx-hero-scroll-track relative block h-px w-24 overflow-hidden bg-white/15">
              <span
                data-scroll-progress
                className="absolute inset-0 origin-left scale-x-[0.06] bg-[var(--accent-glow)] will-change-transform"
              />
            </span>
          </div>
        </div>
      </div>

      {/* Phones and tablets: the trace follows the first screen instead of crowding it. */}
      <div className="bg-[var(--obsidian)] px-5 pb-12 pt-2 sm:px-8 lg:hidden">
        <div className="mx-auto max-w-xl">
          <ExecutionTrace />
        </div>
      </div>
    </section>
  );
}
