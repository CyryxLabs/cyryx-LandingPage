import { useRef } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const MARQUEE = [
  "AGENTIC WORKFLOWS",
  "MAAX STUDIO",
  "AULEXA",
  "LUMINAI",
  "CUSTOM AUTOMATION",
  "APPLIED AI LAB",
  "COMMAND LAYER",
  "GOVERNED EXECUTION",
];

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Aurora blobs drift
      gsap.to(".cx-aurora-a", {
        xPercent: 8,
        yPercent: -6,
        duration: 14,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(".cx-aurora-b", {
        xPercent: -10,
        yPercent: 8,
        duration: 18,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap.to(".cx-aurora-c", {
        xPercent: 6,
        yPercent: 6,
        duration: 22,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Marquee infinite scroll
      const track = root.current?.querySelector<HTMLElement>(".cx-marquee-track");
      if (track) {
        gsap.to(track, {
          xPercent: -50,
          duration: 38,
          ease: "none",
          repeat: -1,
        });
      }

      // Conic sweep
      gsap.to(".cx-sweep", {
        rotate: 360,
        duration: 28,
        ease: "none",
        repeat: -1,
        transformOrigin: "50% 50%",
      });

      // Floating side panel — soft idle motion
      gsap.to(".cx-side-panel", {
        y: -10,
        duration: 4.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      // Ping ring on status dot
      gsap.fromTo(
        ".cx-pulse-ring",
        { scale: 0.6, opacity: 0.7 },
        {
          scale: 2.4,
          opacity: 0,
          duration: 2.2,
          ease: "power2.out",
          repeat: -1,
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      data-hero
      className="relative isolate overflow-hidden bg-[var(--onyx)]"
    >
      {/* ── Layered cinematic backdrop (pure CSS, no 3D) ──────── */}
      <div className="absolute inset-0 -z-10">
        {/* Deep gradient base */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 20%, color-mix(in oklab, var(--emerald-accent) 22%, transparent) 0%, transparent 60%), radial-gradient(ellipse 70% 60% at 90% 80%, color-mix(in oklab, var(--accent-glow) 14%, transparent) 0%, transparent 65%), linear-gradient(180deg, #050607 0%, var(--onyx) 50%, #050607 100%)",
          }}
        />

        {/* Aurora blobs */}
        <div
          aria-hidden
          className="cx-aurora-a absolute left-[-12%] top-[8%] h-[55vmax] w-[55vmax] rounded-full opacity-70 blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--accent-glow) 38%, transparent) 0%, transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="cx-aurora-b absolute right-[-15%] top-[-10%] h-[50vmax] w-[50vmax] rounded-full opacity-60 blur-[140px]"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--emerald-accent) 60%, transparent) 0%, transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="cx-aurora-c absolute bottom-[-20%] left-[20%] h-[60vmax] w-[60vmax] rounded-full opacity-50 blur-[160px]"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--teal) 80%, transparent) 0%, transparent 70%)",
          }}
        />

        {/* Conic light sweep */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -z-0 h-[160vmax] w-[160vmax] -translate-x-1/2 -translate-y-1/2 opacity-[0.08]"
        >
          <div
            className="cx-sweep h-full w-full"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, color-mix(in oklab, var(--accent-glow) 60%, transparent) 30deg, transparent 60deg, transparent 360deg)",
            }}
          />
        </div>

        {/* Dotted matrix */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(color-mix(in oklab, var(--silver) 28%, transparent) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 40%, black 0%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 40%, black 0%, transparent 80%)",
          }}
        />

        {/* Perspective grid floor */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[45%]"
          style={{ perspective: "900px" }}
        >
          <div
            className="absolute inset-x-[-20%] bottom-0 h-full grid-floor opacity-50"
            style={{ transform: "rotateX(62deg)", transformOrigin: "50% 100%" }}
          />
        </div>

        {/* Vignette */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, var(--onyx) 0%, transparent 14%, transparent 70%, var(--onyx) 100%)",
          }}
        />
        {/* Top-left legibility wash */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in oklab, var(--onyx) 85%, transparent) 0%, transparent 55%)",
          }}
        />
        {/* Noise */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 pb-32 pt-32 sm:px-8 sm:pt-36 lg:px-12 lg:pt-40">
        <div className="grid items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left column */}
          <div>
            {/* Status chip */}
            <div
              data-hero-line
              className="inline-flex items-center gap-3 rounded-full border border-[color-mix(in_oklab,var(--accent-glow)_30%,transparent)] bg-[color-mix(in_oklab,var(--onyx)_70%,transparent)] px-4 py-1.5 backdrop-blur-md"
            >
              <span className="relative grid h-2 w-2 place-items-center">
                <span className="cx-pulse-ring absolute h-2 w-2 rounded-full bg-[var(--accent-glow)]" />
                <span className="relative h-2 w-2 rounded-full bg-[var(--accent-glow)] shadow-[0_0_10px_var(--accent-glow)]" />
              </span>
              <span className="hud-label text-[var(--accent-glow)]">
                Cyryx Labs · v3 Online
              </span>
              <span aria-hidden className="h-3 w-px bg-[color-mix(in_oklab,var(--silver)_22%,transparent)]" />
              <span className="hud-label text-[var(--silver-dim)]">
                São Paulo / Worldwide
              </span>
            </div>

            {/* Index marker */}
            <div
              data-hero-line
              className="mt-12 flex items-center gap-3 hud-label text-[var(--silver-dim)]"
            >
              <span className="text-[var(--accent-glow)]">001 /</span>
              <span>Manifesto</span>
              <span aria-hidden className="ml-2 h-px w-16 bg-gradient-to-r from-[color-mix(in_oklab,var(--accent-glow)_60%,transparent)] to-transparent" />
            </div>

            {/* Editorial headline */}
            <h1
              className="mt-6 font-display font-semibold leading-[0.92] tracking-[-0.04em] text-[var(--silver)]"
              data-hero-headline
            >
              <span className="block text-[52px] sm:text-[78px] lg:text-[104px] xl:text-[124px]">
                Engineering
              </span>
              <span className="block text-[52px] sm:text-[78px] lg:text-[104px] xl:text-[124px] text-silver-gradient">
                the agentic
              </span>
              <span className="block text-[52px] sm:text-[78px] lg:text-[104px] xl:text-[124px]">
                <span className="italic font-light text-[var(--silver-dim)]">era of </span>
                <span className="text-[var(--accent-glow)]">execution.</span>
              </span>
            </h1>

            <p
              className="mt-10 max-w-xl text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg"
              data-hero-line
            >
              <span className="text-[var(--silver)]">Cyryx Labs</span> builds
              proprietary AI products, custom automations, and agentic
              workflows — turning scattered AI experimentation into
              <span className="text-[var(--silver)]"> governed execution systems</span>.
            </p>

            {/* CTAs */}
            <div
              className="mt-12 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4"
              data-hero-line
            >
              <a
                href="#cta"
                className="group relative inline-flex h-14 min-w-[240px] items-center justify-center gap-2 overflow-hidden rounded-full bg-[var(--accent-glow)] px-8 text-sm font-semibold tracking-wide text-[var(--onyx)] shadow-[var(--shadow-glow-teal)] transition hover:brightness-110"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <Sparkles className="relative h-4 w-4" />
                <span className="relative">Start a Project</span>
                <ArrowUpRight className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="#maax"
                className="group inline-flex h-14 min-w-[240px] items-center justify-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--silver)_22%,transparent)] bg-[color-mix(in_oklab,var(--onyx)_60%,transparent)] px-8 text-sm font-medium text-[var(--silver)] backdrop-blur-md transition hover:border-[var(--accent-glow)] hover:text-[var(--accent-glow)]"
              >
                Explore MAAX Studio
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* Right column — floating live-system panel */}
          <div className="relative hidden lg:block" data-hero-line>
            <div className="cx-side-panel relative">
              {/* Glow halo */}
              <div
                aria-hidden
                className="absolute -inset-10 -z-10 rounded-[36px] opacity-70 blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, color-mix(in oklab, var(--accent-glow) 35%, transparent), transparent 70%)",
                }}
              />

              <div
                className="relative overflow-hidden rounded-2xl border border-[color-mix(in_oklab,var(--silver)_12%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_82%,transparent)] p-6 backdrop-blur-xl"
                style={{ boxShadow: "var(--shadow-panel)" }}
              >
                {/* Bracket corners */}
                <span aria-hidden className="absolute left-3 top-3 h-3 w-3 border-l border-t border-[var(--accent-glow)]" />
                <span aria-hidden className="absolute right-3 top-3 h-3 w-3 border-r border-t border-[var(--accent-glow)]" />
                <span aria-hidden className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-[var(--accent-glow)]" />
                <span aria-hidden className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-[var(--accent-glow)]" />

                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[var(--accent-glow)] shadow-[0_0_10px_var(--accent-glow)]" />
                    <span className="hud-label text-[var(--silver)]">
                      cyryx.agent / runtime
                    </span>
                  </div>
                  <span className="hud-label text-[var(--silver-dim)]">LIVE</span>
                </div>

                {/* Big metric */}
                <div className="mt-6">
                  <div className="hud-label text-[var(--silver-dim)]">
                    Workflows executed · 24h
                  </div>
                  <div className="mt-2 flex items-baseline gap-3">
                    <span className="font-display text-5xl font-semibold text-[var(--silver)]">
                      18,427
                    </span>
                    <span className="font-mono text-xs text-[var(--accent-glow)]">
                      ▲ 12.4%
                    </span>
                  </div>
                </div>

                {/* Mini bar chart */}
                <div className="mt-6 flex h-20 items-end gap-1.5">
                  {[42, 58, 36, 71, 49, 84, 62, 90, 73, 55, 78, 96, 68, 82].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm"
                        style={{
                          height: `${h}%`,
                          background:
                            i === 11
                              ? "linear-gradient(180deg, var(--accent-glow), color-mix(in oklab, var(--accent-glow) 40%, transparent))"
                              : "color-mix(in oklab, var(--silver) 18%, transparent)",
                          boxShadow:
                            i === 11
                              ? "0 0 14px color-mix(in oklab, var(--accent-glow) 60%, transparent)"
                              : "none",
                        }}
                      />
                    ),
                  )}
                </div>

                {/* Agent feed */}
                <div className="mt-6 space-y-2 border-t border-[color-mix(in_oklab,var(--silver)_10%,transparent)] pt-4">
                  {[
                    { t: "agent.maax", m: "Synced 1,204 records → Aulexa", c: true },
                    { t: "agent.lumin", m: "Drafted 28 outbound replies", c: true },
                    { t: "agent.ops", m: "Auditing pipeline (running)", c: false },
                  ].map((row) => (
                    <div
                      key={row.t}
                      className="flex items-center justify-between font-mono text-[11px] text-[var(--silver-dim)]"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            row.c
                              ? "bg-[var(--accent-glow)]"
                              : "bg-[var(--silver-dim)] animate-pulse"
                          }`}
                        />
                        <span className="text-[var(--silver)]">{row.t}</span>
                        <span className="text-[var(--silver-dim)]">
                          — {row.m}
                        </span>
                      </span>
                      <span className="text-[var(--silver-dim)]">
                        {row.c ? "ok" : "···"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating label badge */}
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 rotate-[-90deg] origin-left">
                <span className="hud-label text-[var(--silver-dim)]">
                  Command Layer · 002
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stat strip */}
        <div
          className="mt-20 grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[color-mix(in_oklab,var(--silver)_10%,transparent)] bg-[color-mix(in_oklab,var(--silver)_10%,transparent)] backdrop-blur-md sm:grid-cols-4"
          data-hero-line
        >
          {[
            { k: "Products shipped", v: "12+" },
            { k: "Workflows automated", v: "180+" },
            { k: "Avg. time saved", v: "73%" },
            { k: "Uptime / agents", v: "99.9%" },
          ].map((s) => (
            <div
              key={s.k}
              className="bg-[color-mix(in_oklab,var(--onyx)_80%,transparent)] px-6 py-5"
            >
              <div className="font-display text-3xl font-semibold text-[var(--silver)]">
                {s.v}
              </div>
              <div className="mt-1 hud-label">{s.k}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee */}
      <div
        aria-hidden
        className="relative border-y border-[color-mix(in_oklab,var(--silver)_10%,transparent)] bg-[color-mix(in_oklab,var(--onyx)_85%,transparent)] py-4 backdrop-blur-md"
      >
        <div className="overflow-hidden">
          <div className="cx-marquee-track flex w-max items-center gap-12 whitespace-nowrap">
            {[...MARQUEE, ...MARQUEE].map((item, i) => (
              <span key={i} className="flex items-center gap-12">
                <span className="font-display text-2xl font-light tracking-tight text-[color-mix(in_oklab,var(--silver)_70%,transparent)] sm:text-3xl">
                  {item}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-glow)] shadow-[0_0_10px_var(--accent-glow)]" />
              </span>
            ))}
          </div>
        </div>
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