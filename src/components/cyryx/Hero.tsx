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
      {/* ── Layered cinematic background ─────────────────────────── */}
      <div className="absolute inset-0 -z-10">
        {/* Monolith photo — pushed right, heavily graded */}
        <img
          src={heroMonolith}
          alt=""
          aria-hidden
          fetchPriority="high"
          decoding="async"
          width={1920}
          height={1280}
          className="absolute inset-0 h-full w-full object-cover object-[78%_center] opacity-70 lg:opacity-80 mix-blend-screen"
        />
        {/* Receding grid floor */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[55%] grid-floor opacity-60"
          style={{ perspective: "800px" }}
        />
        {/* Animated teal orbs */}
        <div
          aria-hidden
          className="absolute -left-32 top-1/3 h-[520px] w-[520px] rounded-full blur-[120px] opacity-60 animate-[pulse_8s_ease-in-out_infinite]"
          style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--accent-glow) 35%, transparent) 0%, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="absolute right-[-10%] top-[10%] h-[420px] w-[420px] rounded-full blur-[100px] opacity-50 animate-[pulse_11s_ease-in-out_infinite]"
          style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--emerald-accent) 55%, transparent) 0%, transparent 70%)" }}
        />
        {/* Left legibility wash */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, var(--onyx) 0%, color-mix(in oklab, var(--onyx) 88%, transparent) 35%, color-mix(in oklab, var(--onyx) 40%, transparent) 65%, transparent 100%)",
          }}
        />
        {/* Top/bottom vignette */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, var(--onyx) 0%, transparent 18%, transparent 72%, var(--onyx) 100%)",
          }}
        />
        {/* Subtle scanlines */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0, transparent 2px, var(--silver) 2px, var(--silver) 3px)",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 pb-28 pt-32 sm:px-8 sm:pt-36 lg:min-h-[100vh] lg:px-12 lg:pt-40 lg:pb-36">
        <div className="max-w-2xl lg:max-w-4xl">
          {/* Status chip */}
          <div data-hero-line className="inline-flex items-center gap-3 rounded-full border border-[color-mix(in_oklab,var(--accent-glow)_28%,transparent)] bg-[color-mix(in_oklab,var(--onyx)_70%,transparent)] px-4 py-1.5 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-glow)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent-glow)]" />
            </span>
            <span className="hud-label text-[var(--accent-glow)]">
              CYRYX LABS · AGENTIC EXECUTION SYSTEMS
            </span>
          </div>

          <h1
            className="mt-10 font-display font-semibold leading-[0.95] tracking-[-0.035em] text-[var(--silver)]"
            data-hero-headline
          >
            <span className="block text-[44px] sm:text-[68px] lg:text-[92px] xl:text-[108px]">
              AI products.
            </span>
            <span className="block text-[44px] sm:text-[68px] lg:text-[92px] xl:text-[108px] text-silver-gradient">
              Execution systems.
            </span>
            <span className="mt-4 block text-[28px] sm:text-[40px] lg:text-[54px] xl:text-[62px] font-light italic text-[var(--silver-dim)]">
              For the <span className="text-[var(--accent-glow)] not-italic font-normal">agentic era</span>.
            </span>
          </h1>

          <p
            className="mt-10 max-w-xl text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg"
            data-hero-line
          >
            We build proprietary AI products, custom automation systems, and
            agentic workflows that turn scattered AI experimentation into
            <span className="text-[var(--silver)]"> governed execution</span>.
          </p>

          <div
            className="mt-12 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4"
            data-hero-line
          >
            <a
              href="#cta"
              className="group relative inline-flex h-13 min-w-[220px] items-center justify-center gap-2 overflow-hidden rounded-md bg-[var(--accent-glow)] px-7 py-3.5 text-sm font-semibold tracking-wide text-[var(--onyx)] shadow-[var(--shadow-glow-teal)] transition hover:brightness-110"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">Start a Project</span>
              <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#maax"
              className="group inline-flex h-13 min-w-[220px] items-center justify-center gap-2 rounded-md border border-[color-mix(in_oklab,var(--silver)_22%,transparent)] bg-[color-mix(in_oklab,var(--onyx)_60%,transparent)] px-7 py-3.5 text-sm font-medium text-[var(--silver)] backdrop-blur-md transition hover:border-[var(--accent-glow)] hover:text-[var(--accent-glow)]"
            >
              Explore MAAX Studio
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Stat strip */}
          <div
            className="mt-16 grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-lg border border-[color-mix(in_oklab,var(--silver)_10%,transparent)] bg-[color-mix(in_oklab,var(--silver)_10%,transparent)] backdrop-blur-md"
            data-hero-line
          >
            {[
              { k: "Products shipped", v: "12+" },
              { k: "Workflows automated", v: "180+" },
              { k: "Avg. time saved", v: "73%" },
            ].map((s) => (
              <div
                key={s.k}
                className="bg-[color-mix(in_oklab,var(--onyx)_75%,transparent)] px-5 py-5"
              >
                <div className="font-display text-2xl font-semibold text-[var(--silver)] sm:text-3xl">
                  {s.v}
                </div>
                <div className="mt-1 hud-label">{s.k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative flex justify-center pb-8">
        <ScrollIndicator />
      </div>

      {/* Bottom hairline */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--accent-glow) 60%, transparent) 50%, transparent 100%)",
        }}
      />
    </section>
  );
}