import { useRef } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import heroBanner from "@/assets/cyryx-hero-cinematic.png.asset.json";
import wordmark from "@/assets/cyryx-wordmark-chrome.png.asset.json";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const TICKER = [
  "AI INFRASTRUCTURE",
  "COMMAND LAYER",
  "AUTONOMOUS EXECUTION",
  "GOVERNED INTELLIGENCE",
  "MAAX STUDIO",
  "APPLIED AI LAB",
  "AGENT FLEETS",
  "ENTERPRISE GRADE",
];

const SYSTEM_ROWS = [
  { k: "REASONING ENGINES", v: "12 ACTIVE", c: true },
  { k: "EXECUTION STATUS", v: "98.7%", c: true },
  { k: "NETWORK", v: "SECURE", c: true },
  { k: "LATENCY", v: "8 MS", c: true },
  { k: "REGION", v: "GLOBAL", c: false },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // ── Reduced motion: snap to final state ─────────────────────
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".cx-banner, .cx-eyebrow, .cx-headline-line, .cx-tagline, .cx-cta, .cx-stat, .cx-hud, .cx-scan-bar", {
          opacity: 1,
          y: 0,
          scale: 1,
          clipPath: "inset(0% 0% 0% 0%)",
        });
      });

      // ── Motion-allowed shared intro ─────────────────────────────
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

        // 1. Cinematic banner reveal — clip-path wipe + slow zoom
        tl.set(".cx-banner", {
          clipPath: "inset(50% 0% 50% 0%)",
          scale: 1.15,
          opacity: 0,
        })
          .set(".cx-banner-img", { scale: 1.18 })
          .set(".cx-scan-bar", { scaleY: 0, transformOrigin: "50% 0%" })
          .set([".cx-eyebrow", ".cx-headline-line", ".cx-tagline", ".cx-cta", ".cx-stat", ".cx-hud"], {
            opacity: 0,
            y: 30,
          })
          .to(".cx-banner", {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            scale: 1,
            duration: 1.6,
            ease: "expo.out",
          })
          .to(".cx-banner-img", {
            scale: 1,
            duration: 2.4,
            ease: "expo.out",
          }, "<")
          .to(".cx-scan-bar", {
            scaleY: 1,
            duration: 1.0,
            ease: "power2.out",
          }, "-=1.2")
          .to(".cx-eyebrow", {
            opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          }, "-=1.1")
          .to(".cx-headline-line", {
            opacity: 1, y: 0, duration: 1.0, ease: "expo.out", stagger: 0.12,
          }, "-=0.9")
          .to(".cx-tagline", {
            opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          }, "-=0.6")
          .to(".cx-cta", {
            opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08,
          }, "-=0.5")
          .to(".cx-hud", {
            opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.06,
          }, "-=0.6")
          .to(".cx-stat", {
            opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.07,
          }, "-=0.4");

        // Loops — transform-only, cheap
        gsap.to(".cx-marquee-track", {
          xPercent: -50, duration: 42, ease: "none", repeat: -1,
        });
        gsap.fromTo(".cx-pulse-ring",
          { scale: 0.6, opacity: 0.7 },
          { scale: 2.4, opacity: 0, duration: 2.2, ease: "power2.out", repeat: -1 },
        );
        // Scan-line sweep across the banner
        gsap.fromTo(".cx-scan-bar",
          { yPercent: -10, opacity: 0 },
          { yPercent: 1000, opacity: 0.9, duration: 4.5, ease: "power1.inOut", repeat: -1, repeatDelay: 1.2 },
        );
      });

      // ── Desktop: scroll-driven 3D parallax (no GL, pure transforms) ──
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          // Banner zoom + lift on scroll (cinematic)
          gsap.to(".cx-banner-img", {
            yPercent: -8,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
            },
          });
          // Foreground copy floats up faster (depth)
          gsap.to(".cx-foreground", {
            yPercent: -14,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.4,
            },
          });
          // HUD strip drifts slower (background depth)
          gsap.to(".cx-hud-stack", {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.8,
            },
          });
          // Vignette darkens as you scroll out — sense of departure
          gsap.to(".cx-vignette", {
            opacity: 0.95,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        },
      );

      // ── Mobile: lightweight reveals only, no pinning ──
      mm.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.from(".cx-stat", {
            opacity: 0, y: 16, duration: 0.7, ease: "power3.out", stagger: 0.08,
            scrollTrigger: {
              trigger: ".cx-stat-strip",
              start: "top 90%",
              toggleActions: "play none none none",
            },
          });
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
      {/* ── Full-bleed cinematic banner ───────────────────────────── */}
      <div className="absolute inset-0 -z-10">
        <div className="cx-banner relative h-full w-full overflow-hidden">
          <img
            src={heroBanner.url}
            alt=""
            aria-hidden
            className="cx-banner-img absolute inset-0 h-full w-full object-cover object-center will-change-transform"
            draggable={false}
          />

          {/* Cinematic legibility wash: left-side dark gradient so copy reads */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, var(--onyx) 0%, color-mix(in oklab, var(--onyx) 88%, transparent) 28%, color-mix(in oklab, var(--onyx) 40%, transparent) 55%, transparent 80%)",
            }}
          />
          {/* Top + bottom feather */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, var(--onyx) 0%, transparent 18%, transparent 70%, var(--onyx) 100%)",
            }}
          />
          {/* Vignette that intensifies on scroll */}
          <div
            aria-hidden
            className="cx-vignette absolute inset-0 opacity-50"
            style={{
              background:
                "radial-gradient(ellipse 90% 70% at 50% 50%, transparent 30%, var(--onyx) 100%)",
            }}
          />
          {/* Cyan scanline */}
          <div
            aria-hidden
            className="cx-scan-bar absolute inset-x-0 top-0 h-[2px] origin-top"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--accent-glow) 90%, transparent) 50%, transparent 100%)",
              boxShadow:
                "0 0 24px color-mix(in oklab, var(--accent-glow) 80%, transparent), 0 0 60px color-mix(in oklab, var(--accent-glow) 50%, transparent)",
            }}
          />
          {/* Subtle dotted overlay */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.10] mix-blend-screen"
            style={{
              backgroundImage:
                "radial-gradient(color-mix(in oklab, var(--silver) 40%, transparent) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
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
      </div>

      {/* ── Foreground content ────────────────────────────────────── */}
      <div className="cx-foreground relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 pb-24 pt-32 sm:px-8 sm:pt-36 lg:px-12 lg:pt-40">
        <div className="grid items-end gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Left — manifesto */}
          <div className="max-w-xl">
            {/* Status chip */}
            <div className="cx-eyebrow inline-flex items-center gap-3 rounded-full border border-[color-mix(in_oklab,var(--accent-glow)_30%,transparent)] bg-[color-mix(in_oklab,var(--onyx)_70%,transparent)] px-4 py-1.5 backdrop-blur-md">
              <span className="relative grid h-2 w-2 place-items-center">
                <span className="cx-pulse-ring absolute h-2 w-2 rounded-full bg-[var(--accent-glow)]" />
                <span className="relative h-2 w-2 rounded-full bg-[var(--accent-glow)] shadow-[0_0_10px_var(--accent-glow)]" />
              </span>
              <span className="hud-label text-[var(--accent-glow)]">
                CYRYX LABS · SYSTEMS ONLINE
              </span>
              <span aria-hidden className="h-3 w-px bg-[color-mix(in_oklab,var(--silver)_22%,transparent)]" />
              <span className="hud-label text-[var(--silver-dim)]">
                UNITED STATES · GLOBAL
              </span>
            </div>

            {/* Wordmark */}
            <img
              src={wordmark.url}
              alt="Cyryx Labs"
              className="cx-headline-line mt-8 block h-auto w-[300px] sm:w-[380px] lg:w-[420px]"
              draggable={false}
            />

            {/* Editorial headline */}
            <h1 className="mt-8 font-display font-semibold leading-[0.95] tracking-[-0.035em] text-[var(--silver)]">
              <span className="cx-headline-line block text-[42px] sm:text-[58px] lg:text-[64px]">
                The intelligence
              </span>
              <span className="cx-headline-line block text-[42px] sm:text-[58px] lg:text-[64px] text-silver-gradient">
                infrastructure behind
              </span>
              <span className="cx-headline-line block text-[42px] sm:text-[58px] lg:text-[64px]">
                <span className="text-[var(--accent-glow)]">autonomous</span>{" "}
                <span className="italic font-light text-[var(--silver-dim)]">execution.</span>
              </span>
            </h1>

            <p className="cx-tagline mt-8 text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg">
              <span className="text-[var(--silver)]">Cyryx Labs</span> engineers
              proprietary AI products, governed agent fleets, and execution
              architectures for enterprises that refuse to ship experiments —
              <span className="text-[var(--silver)]"> only systems</span>.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
              <a
                href="#cta"
                className="cx-cta group relative inline-flex h-14 min-w-[240px] items-center justify-center gap-2 overflow-hidden rounded-full bg-[var(--accent-glow)] px-8 text-sm font-semibold tracking-wide text-[var(--onyx)] shadow-[var(--shadow-glow-teal)] transition hover:brightness-110"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <Sparkles className="relative h-4 w-4" />
                <span className="relative">Initialize a System</span>
                <ArrowUpRight className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="#maax"
                className="cx-cta group inline-flex h-14 min-w-[240px] items-center justify-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--silver)_22%,transparent)] bg-[color-mix(in_oklab,var(--onyx)_60%,transparent)] px-8 text-sm font-medium text-[var(--silver)] backdrop-blur-md transition hover:border-[var(--accent-glow)] hover:text-[var(--accent-glow)]"
              >
                Enter MAAX Studio
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>

          {/* Right — floating HUD stack (over the banner, not replacing it) */}
          <div className="cx-hud-stack relative hidden lg:block">
            <div className="ml-auto w-full max-w-md space-y-4">
              {/* System overview card */}
              <div
                className="cx-hud relative overflow-hidden rounded-xl border border-[color-mix(in_oklab,var(--accent-glow)_22%,transparent)] bg-[color-mix(in_oklab,var(--onyx)_72%,transparent)] p-5 backdrop-blur-xl"
                style={{ boxShadow: "var(--shadow-panel)" }}
              >
                <span aria-hidden className="absolute left-2 top-2 h-2.5 w-2.5 border-l border-t border-[var(--accent-glow)]" />
                <span aria-hidden className="absolute right-2 top-2 h-2.5 w-2.5 border-r border-t border-[var(--accent-glow)]" />
                <span aria-hidden className="absolute bottom-2 left-2 h-2.5 w-2.5 border-b border-l border-[var(--accent-glow)]" />
                <span aria-hidden className="absolute bottom-2 right-2 h-2.5 w-2.5 border-b border-r border-[var(--accent-glow)]" />

                <div className="flex items-center justify-between">
                  <span className="hud-label text-[var(--silver)]">SYSTEM OVERVIEW</span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-glow)] shadow-[0_0_8px_var(--accent-glow)]" />
                    <span className="hud-label text-[var(--accent-glow)]">LIVE</span>
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  {SYSTEM_ROWS.map((r) => (
                    <div key={r.k} className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-[var(--silver-dim)]">{r.k}</span>
                      <span className={r.c ? "text-[var(--accent-glow)]" : "text-[var(--silver)]"}>
                        {r.v}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Mini telemetry bars */}
                <div className="mt-4 flex h-12 items-end gap-[3px]">
                  {[42, 58, 36, 71, 49, 84, 62, 90, 73, 55, 78, 96, 68, 82, 60, 88, 54, 72].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-[1px]"
                        style={{
                          height: `${h}%`,
                          background:
                            i >= 14
                              ? "linear-gradient(180deg, var(--accent-glow), color-mix(in oklab, var(--accent-glow) 40%, transparent))"
                              : "color-mix(in oklab, var(--silver) 20%, transparent)",
                          boxShadow:
                            i >= 14 ? "0 0 8px color-mix(in oklab, var(--accent-glow) 60%, transparent)" : "none",
                        }}
                      />
                    ),
                  )}
                </div>
              </div>

              {/* Compact bracket label */}
              <div className="cx-hud flex items-center gap-3">
                <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-transparent via-[color-mix(in_oklab,var(--accent-glow)_60%,transparent)] to-transparent" />
                <span className="hud-label text-[var(--silver-dim)]">
                  002 / COMMAND LAYER · ENGAGED
                </span>
                <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-transparent via-[color-mix(in_oklab,var(--accent-glow)_60%,transparent)] to-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* Stat strip */}
        <div className="cx-stat-strip mt-16 grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[color-mix(in_oklab,var(--silver)_10%,transparent)] bg-[color-mix(in_oklab,var(--silver)_10%,transparent)] backdrop-blur-md sm:grid-cols-4">
          {[
            { k: "Products shipped", v: "12+" },
            { k: "Workflows automated", v: "180+" },
            { k: "Avg. time saved", v: "73%" },
            { k: "Uptime / agents", v: "99.9%" },
          ].map((s) => (
            <div
              key={s.k}
              className="cx-stat bg-[color-mix(in_oklab,var(--onyx)_82%,transparent)] px-6 py-5"
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
            {[...TICKER, ...TICKER].map((item, i) => (
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