import { ArrowUpRight, MessageSquare } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { CyryxHeroSequence } from "@/components/cyryx/CyryxHeroSequence";
import { useCopyVariant } from "@/lib/copy-variant";
import { getCopy } from "@/copy";
import { buildStartProjectHref } from "@/lib/cta";
import { trackCta } from "@/lib/track-cta";
import { isAssistantEnabled, openAssistant } from "@/lib/assistant-client";

/**
 * Homepage hero — the approved scroll scene.
 *
 * A 400svh scene pins the monolith film while GSAP ScrollTrigger scrubs the
 * frame sequence, the grade, the aura and the three story statements. The
 * message and CTAs open the scene and hand over to the film as the visitor
 * scrolls — the same choreography on phones, tablets and desktops.
 */
export function Hero() {
  const copy = getCopy(useCopyVariant()).hero;
  const startHref = buildStartProjectHref({ source: "home" });
  const assistantEnabled = isAssistantEnabled();

  return (
    <section id="top" data-hero aria-labelledby="hero-heading" className="relative bg-black">
      <div data-hero-scroll-scene className="relative h-[400svh]">
        <div
          data-hero-sticky
          className="sticky top-0 isolate flex h-[100svh] items-center overflow-hidden bg-black"
        >
          {/* Background */}
          <div
            className="cx-bg cx-hero-media-frame absolute inset-0 -z-10 overflow-hidden"
            data-hero-media-frame
          >
            <CyryxHeroSequence />
            {/* Responsive grade: preserves a stable, high-contrast reading field without hiding the film. */}
            <div className="cx-hero-overlay cx-hero-grade absolute inset-0" />
            {/* top/bottom feather */}
            <div className="cx-hero-overlay cx-hero-feather absolute inset-0" />
            {/* subtle horizontal teal line */}
            <div
              className="cx-hero-line-glow absolute left-0 right-0 top-1/2 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--accent-glow) 60%, transparent) 50%, transparent 100%)",
                opacity: 0.4,
              }}
            />
            {/* noise */}
            <div
              className="cx-hero-noise absolute inset-0 opacity-[0.06] mix-blend-overlay"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
              }}
            />
          </div>

          {copy.rail.length > 0 && (
            <div
              aria-hidden="true"
              data-hero-story
              className="pointer-events-none absolute inset-0 z-[4]"
            >
              {copy.rail.map((line, index) => (
                <div
                  key={line}
                  data-hero-story-panel
                  data-story-index={index}
                  className={`cx-hero-story-panel absolute inset-x-5 top-1/2 -translate-y-1/2 opacity-0 sm:inset-x-10 lg:inset-x-14 ${
                    index === 1
                      ? "text-right"
                      : index === copy.rail.length - 1
                        ? "text-center"
                        : "text-left"
                  }`}
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--accent-glow)]">
                    0{index + 1} / 0{copy.rail.length}
                  </span>
                  <p className="mt-4 [font-family:var(--font-editorial-hero)] text-[clamp(2.4rem,7vw,6.5rem)] leading-[0.94] tracking-[-0.045em] text-[#e4e0d8] [text-shadow:0_2px_32px_rgba(0,0,0,0.72)]">
                    {line}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Teal aura behind banner */}
          <div
            aria-hidden
            data-hero-aura
            className="cx-stage pointer-events-none absolute left-1/2 top-[58%] -z-[5] h-[55vh] w-[55vh] -translate-x-1/2 -translate-y-1/2 rounded-full lg:top-1/2"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--accent-glow) 22%, transparent) 0%, transparent 65%)",
              filter: "blur(50px)",
            }}
          />

          {/* A minimal affordance makes the pinned, scroll-driven sequence discoverable. */}
          <div
            aria-hidden="true"
            data-hero-scroll-cue
            className="cx-hero-scroll-cue pointer-events-none absolute bottom-6 right-5 flex items-center gap-3 sm:bottom-8 sm:right-8 sm:gap-4 xl:bottom-10 xl:right-12"
          >
            <span className="hidden font-mono text-[11px] uppercase tracking-[0.28em] text-white/55 sm:inline">
              Scroll to execute
            </span>
            <span className="cx-hero-scroll-track relative block h-px w-16 overflow-hidden bg-white/15 sm:w-24">
              <span
                data-scroll-progress
                className="absolute inset-0 origin-left scale-x-[0.06] bg-[var(--accent-glow)] will-change-transform"
              />
            </span>
          </div>
        </div>
      </div>

      {/* The same sticky overlay on every breakpoint: the message opens the
          scene and hands over to the film as the visitor scrolls. */}
      <div
        data-hero-content-layer
        className="cx-hero-content-layer pointer-events-none absolute inset-0 z-[5]"
      >
        <div
          data-hero-content
          className="relative mx-auto flex h-[100svh] w-full max-w-7xl items-end px-5 pb-24 pt-28 sticky top-0 sm:px-8 md:items-center md:px-10 md:pb-28 md:pt-40 lg:px-14"
        >
          <div className="pointer-events-auto w-full max-w-[68rem]">
            <div className="cx-hero-panel">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent-glow)] sm:text-xs">
                {copy.eyebrow}
              </p>
              <h1
                id="hero-heading"
                className="cx-hero-heading mt-4 font-orbitron font-bold tracking-[0.01em] text-silver-gradient [text-shadow:0_2px_24px_rgba(0,0,0,0.6)] sm:mt-5"
              >
                <span
                  data-hero-line
                  className="cx-line cx-hero-title-line block text-chrome-gradient"
                >
                  {copy.headline}
                </span>
              </h1>

              <p className="cx-sub cx-hero-sub mt-5 max-w-[34ch] text-[15px] leading-[1.55] text-[rgba(230,238,239,0.82)] [text-shadow:0_1px_16px_rgba(0,0,0,0.9)] sm:mt-8 sm:max-w-xl sm:text-lg sm:leading-relaxed">
                {copy.sub}
              </p>

              <div className="cx-hero-ctas mt-8 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:items-center sm:gap-4">
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
          </div>
        </div>
      </div>
    </section>
  );
}
