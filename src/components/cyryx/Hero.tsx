import { ArrowRight } from "lucide-react";
import { HudLabel } from "./primitives/HudLabel";
import { ScrollIndicator } from "./ScrollIndicator";
import heroMonolith from "@/assets/cyryx-hero-monolith.jpg";

export function Hero() {
  return (
    <section
      id="top"
      data-hero
      className="relative isolate overflow-hidden bg-[var(--onyx)]"
    >
      {/* Full-bleed cinematic monolith background */}
      <div className="absolute inset-0 -z-10">
        <img
          src={heroMonolith}
          alt=""
          aria-hidden
          fetchPriority="high"
          decoding="async"
          width={1920}
          height={1280}
          className="h-full w-full object-cover object-[70%_center] sm:object-[65%_center] lg:object-center opacity-90"
        />
        {/* Left-side darkening for text legibility */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, var(--onyx) 0%, color-mix(in oklab, var(--onyx) 92%, transparent) 28%, color-mix(in oklab, var(--onyx) 55%, transparent) 55%, transparent 100%)",
          }}
        />
        {/* Top + bottom vignette */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--onyx) 70%, transparent) 0%, transparent 22%, transparent 70%, var(--onyx) 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 pb-24 pt-32 sm:px-8 sm:pt-36 lg:min-h-[92vh] lg:px-12 lg:pt-40 lg:pb-32">
        <div className="max-w-2xl lg:max-w-3xl">
          <div data-hero-line>
            <HudLabel withDot className="text-[var(--accent-glow)]">
              CYRYX LABS / AGENTIC EXECUTION
            </HudLabel>
          </div>

          <h1
            className="mt-8 font-display font-semibold leading-[1.02] tracking-[-0.02em] text-[var(--silver)]"
            data-hero-headline
          >
            <span className="block text-[40px] sm:text-[60px] lg:text-[78px] xl:text-[88px]">
              AI products and
            </span>
            <span className="block text-[40px] sm:text-[60px] lg:text-[78px] xl:text-[88px] text-silver-gradient">
              execution systems
            </span>
            <span className="mt-1 block text-[28px] sm:text-[40px] lg:text-[52px] xl:text-[60px] font-normal text-[var(--silver-dim)]">
              for the agentic era.
            </span>
          </h1>

          <p
            className="mt-8 max-w-xl text-[15px] leading-relaxed text-[var(--silver-dim)] sm:text-base lg:text-lg"
            data-hero-line
          >
            Cyryx Labs builds proprietary AI products, custom automation systems,
            and agentic workflows that help founders, agencies, and businesses
            turn AI into governed execution.
          </p>

          <div
            className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4"
            data-hero-line
          >
            <a
              href="#cta"
              className="inline-flex h-12 min-w-[200px] items-center justify-center gap-2 rounded-md bg-[var(--accent-glow)] px-7 text-sm font-semibold tracking-wide text-[var(--onyx)] shadow-[var(--shadow-glow-teal)] hover:brightness-110 transition"
            >
              Start a Project
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#maax"
              className="inline-flex h-12 min-w-[200px] items-center justify-center gap-2 rounded-md border border-[color-mix(in_oklab,var(--silver)_22%,transparent)] bg-[color-mix(in_oklab,var(--onyx)_60%,transparent)] px-7 text-sm font-medium text-[var(--silver)] hover:border-[var(--accent-glow)] hover:text-[var(--accent-glow)] transition backdrop-blur-sm"
            >
              Explore MAAX Studio
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <p
            className="mt-10 hud-label text-[var(--accent-glow)]"
            data-hero-line
          >
            From scattered AI experimentation to governed execution.
          </p>
        </div>
      </div>

      <div className="relative flex justify-center pb-8">
        <ScrollIndicator />
      </div>
    </section>
  );
}