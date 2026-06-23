import { ArrowRight, Download } from "lucide-react";
import lobby from "@/assets/cyryx-cta-lobby.jpg";
import { CyryxMark } from "./primitives/CyryxMark";

export function CTASection() {
  return (
    <section id="cta" className="relative isolate overflow-hidden py-28 lg:py-40">
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
          Ready to initialize <span style={{ color: "var(--accent-glow)" }}>the future?</span>
        </h2>
        <p className="mt-6 mx-auto max-w-xl text-[15px] sm:text-base lg:text-lg text-[var(--silver-dim)]">
          Partner with Cyryx Labs to build, deploy, and scale the next generation of intelligent systems.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <a
            href="#"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[var(--accent-glow)] px-6 hud-label text-[var(--onyx)] font-semibold shadow-[var(--shadow-glow-teal)] hover:brightness-110 transition"
          >
            Schedule a Briefing
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-[color-mix(in_oklab,var(--silver)_22%,transparent)] px-6 hud-label text-[var(--silver)] hover:border-[var(--accent-glow)] transition"
          >
            <Download className="h-4 w-4 text-[var(--accent-glow)]" />
            Download Overview
          </a>
        </div>
      </div>
    </section>
  );
}