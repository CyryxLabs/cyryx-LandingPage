import { ArrowRight } from "lucide-react";
import lobby from "@/assets/cyryx-cta-lobby.jpg";
import { CyryxMark } from "./primitives/CyryxMark";

export function CTASection() {
  return (
    <section id="cta" className="relative isolate overflow-hidden py-20 sm:py-28 lg:py-40">
      <img
        src={lobby}
        alt=""
        aria-hidden
        loading="lazy"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        data-parallax
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[var(--onyx)]/95 via-[var(--onyx)]/60 to-[var(--onyx)]/95"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "var(--gradient-radial-teal)" }}
      />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-10 text-center cx-reveal">
        <div className="flex justify-center mb-10">
          <div className="relative">
            <CyryxMark
              size={96}
              className="drop-shadow-[0_0_32px_color-mix(in_oklab,var(--accent-glow)_55%,transparent)]"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-full mt-2 h-12 w-px -translate-x-1/2 teal-core-line opacity-70"
            />
          </div>
        </div>
        <h2 className="font-display text-[36px] sm:text-5xl lg:text-6xl xl:text-7xl font-semibold leading-[1.05] uppercase text-silver-gradient">
          Ready to build AI into <span style={{ color: "var(--accent-glow)" }}>your business?</span>
        </h2>
        <p className="mt-6 mx-auto max-w-xl text-[15px] sm:text-base lg:text-lg text-[var(--silver-dim)]">
          Whether you need an AI-powered website, workflow automation, an
          internal assistant, a custom AI product, or early access to MAAX
          Studio, Cyryx Labs can help turn the idea into a working system.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <a
            href="#contact"
            aria-label="Start an AI project — open contact form"
            className="cx-liquid-glass inline-flex h-12 min-h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-md px-6 hud-label text-[var(--accent-glow)] font-semibold shadow-[var(--shadow-glow-teal)] hover:brightness-110 transition"
          >
            Start an AI Project
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#contact"
            aria-label="Request MAAX Studio access — open contact form"
            className="cx-liquid-glass inline-flex h-12 min-h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-md px-6 hud-label text-[var(--silver)] transition"
          >
            Request MAAX Studio Access
            <ArrowRight className="h-4 w-4 text-[var(--accent-glow)]" />
          </a>
        </div>
        <p className="mt-6 text-sm text-[var(--silver-dim)]">
          Or email us at{" "}
          <a
            href="mailto:hello@cyryxlabs.com"
            className="text-[var(--accent-glow)] underline-offset-4 hover:underline"
          >
            hello@cyryxlabs.com
          </a>
        </p>
        <p className="mt-4 hud-label text-[var(--silver-dim)]">
          Build AI into your business.
        </p>
      </div>
    </section>
  );
}