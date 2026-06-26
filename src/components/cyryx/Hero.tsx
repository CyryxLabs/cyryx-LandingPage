import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import heroBanner from "@/assets/cyryx-hero-monolith-serene.png.asset.json";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const META = [
  "AI PRODUCTS",
  "AGENTIC SYSTEMS",
  "GOVERNED EXECUTION",
  "APPLIED AI INFRASTRUCTURE",
];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [debug, setDebug] = useState(false);
  const [hideOverlay, setHideOverlay] = useState(false);
  const [parallax, setParallax] = useState({ y: 0, scale: 1, progress: 0 });

  // Enable debug via ?heroDebug=1 or pressing "D"
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("heroDebug") === "1") {
      setDebug(true);
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "d" && (e.altKey || e.metaKey)) {
        setDebug((v) => !v);
      }
      if (debug && e.key.toLowerCase() === "o") {
        setHideOverlay((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [debug]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          isMobile: "(max-width: 767px)",
          isTablet: "(min-width: 768px) and (max-width: 1023px)",
          isDesktop: "(min-width: 1024px)",
          isAbove768: "(min-width: 768px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { isMobile, isDesktop, isAbove768, reduceMotion } = ctx.conditions as {
            isMobile: boolean;
            isDesktop: boolean;
            isAbove768: boolean;
            reduceMotion: boolean;
          };

          if (reduceMotion) {
            // Fully disable GSAP/ScrollTrigger work — snap to final state, no loops.
            gsap.set(
              [
                ".cx-bg",
                ".cx-bg-img",
                ".cx-eyebrow",
                ".cx-line",
                ".cx-sub",
                ".cx-cta",
                ".cx-meta",
                ".cx-scroll",
                ".cx-scroll-dot",
                ".cx-stage",
              ],
              { clearProps: "all", opacity: 1, y: 0, x: 0, scale: 1 },
            );
            // Kill any ScrollTriggers that may have been created elsewhere on the page.
            ScrollTrigger.getAll().forEach((t) => t.kill());
            gsap.globalTimeline.clear();
            return;
          }

          const tl = gsap.timeline({
            defaults: {
              ease: "power3.out",
              duration: isMobile ? 0.7 : 0.9,
            },
          });

          tl.from(".cx-bg", { opacity: 0, duration: 1.4, ease: "power2.out" })
            .from(
              ".cx-line",
              {
                opacity: 0,
                y: isMobile ? 18 : 28,
                duration: isMobile ? 0.7 : 0.95,
                stagger: isMobile ? 0.08 : 0.12,
              },
              "-=0.55",
            )
            .from(
              ".cx-sub",
              { opacity: 0, y: isMobile ? 12 : 18, duration: 0.65 },
              "-=0.55",
            )
            .from(
              ".cx-cta",
              { opacity: 0, y: 12, duration: 0.55, stagger: 0.08 },
              "-=0.45",
            )
            .from(
              ".cx-meta",
              { opacity: 0, y: 8, duration: 0.5, stagger: 0.05 },
              "-=0.35",
            )
            .from(
              ".cx-scroll",
              { opacity: 0, duration: 0.6 },
              "-=0.3",
            );

          gsap.to(".cx-scroll-dot", {
            y: 14,
            opacity: 0.2,
            duration: 1.6,
            ease: "power1.inOut",
            repeat: -1,
            yoyo: true,
          });

          // Same parallax shape across all breakpoints — tuned per device.
          // Mobile keeps the transform; we just dial back the travel/scale.
          const bannerY = isDesktop ? -10 : isMobile ? -7 : -6;
          const bannerScale = isDesktop ? 1.06 : isMobile ? 1.05 : 1.04;
          const stageY = isDesktop ? -6 : isMobile ? -4 : -3;
          const stageOpacity = isDesktop ? 0.4 : isMobile ? 0.5 : 0.6;

          gsap.to(".cx-bg-img", {
            yPercent: bannerY,
            scale: bannerScale,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom top",
              scrub: isDesktop ? 0.6 : 0.4,
              onUpdate: (self) =>
                setParallax({
                  y: bannerY * self.progress,
                  scale: 1 + (bannerScale - 1) * self.progress,
                  progress: self.progress,
                }),
            },
          });
          gsap.to(".cx-stage", {
            yPercent: stageY,
            opacity: stageOpacity,
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
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      data-hero
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-black"
    >
      {/* Background */}
      <div aria-hidden className="cx-bg absolute inset-0 -z-10" data-hide-overlay={hideOverlay || undefined}>
        <img
          src={heroBanner.url}
          alt=""
          fetchPriority="high"
          loading="eager"
          decoding="async"
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 100vw, 1920px"
          width={1920}
          height={1080}
          className="cx-bg-img absolute inset-0 h-full w-full object-cover object-[72%_center] will-change-transform sm:object-[75%_center] lg:object-right"
          draggable={false}
        />
        {/* deep vignette to anchor copy — vertical on mobile, horizontal on desktop */}
        <div
          className="cx-hero-overlay absolute inset-0 lg:hidden data-[hide=true]:hidden"
          data-hide={hideOverlay ? "true" : "false"}
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.32) 36%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.68) 100%)",
          }}
        />
        <div
          className="cx-hero-overlay absolute inset-0 hidden lg:block data-[hide=true]:lg:hidden"
          data-hide={hideOverlay ? "true" : "false"}
          style={{
            background:
              "linear-gradient(90deg, #000 0%, rgba(0,0,0,0.94) 30%, rgba(0,0,0,0.65) 55%, rgba(0,0,0,0.2) 80%, transparent 100%)",
          }}
        />
        {/* top/bottom feather */}
        <div
          className="cx-hero-overlay absolute inset-0 data-[hide=true]:hidden"
          data-hide={hideOverlay ? "true" : "false"}
          style={{
            background:
              "linear-gradient(180deg, #000 0%, transparent 14%, transparent 78%, #000 100%)",
          }}
        />
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

      {/* Debug HUD — toggle with Alt/⌘ + D, then O to hide overlays */}
      {debug && (
        <div className="pointer-events-auto fixed bottom-4 right-4 z-[60] w-60 rounded-md border border-white/15 bg-black/85 p-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/90 backdrop-blur">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[var(--accent-glow)]">Hero Debug</span>
            <button
              type="button"
              onClick={() => setDebug(false)}
              className="text-white/60 hover:text-white"
              aria-label="Close debug"
            >
              ×
            </button>
          </div>
          <button
            type="button"
            onClick={() => setHideOverlay((v) => !v)}
            className="mb-2 w-full rounded border border-white/20 px-2 py-1 text-left hover:border-[var(--accent-glow)]"
          >
            Overlay: {hideOverlay ? "off" : "on"} (O)
          </button>
          <div className="space-y-0.5 normal-case tracking-normal">
            <div>progress: {parallax.progress.toFixed(3)}</div>
            <div>yPercent: {parallax.y.toFixed(2)}</div>
            <div>scale: {parallax.scale.toFixed(3)}</div>
          </div>
        </div>
      )}

      {/* Teal aura behind banner */}
      <div
        aria-hidden
        className="cx-stage pointer-events-none absolute left-1/2 top-[58%] -z-[5] h-[55vh] w-[55vh] -translate-x-1/2 -translate-y-1/2 rounded-full lg:left-auto lg:right-[8%] lg:top-1/2"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--accent-glow) 22%, transparent) 0%, transparent 65%)",
          filter: "blur(50px)",
        }}
      />

      {/* Foreground content */}
      <div className="relative mx-auto w-full max-w-7xl px-5 pb-24 pt-28 sm:px-10 sm:pt-40 sm:pb-28 lg:px-14">
        <div className="cx-hero-panel mx-auto max-w-[64rem] sm:mx-0">
          {/* Headline */}
          <h1
            id="hero-heading"
            className="cx-hero-heading font-display font-bold text-silver-gradient [text-shadow:0_2px_24px_rgba(0,0,0,0.6)]"
          >
            <span className="cx-line cx-hero-title-line block text-chrome-gradient sm:whitespace-nowrap">
              The execution layer
            </span>
            <span className="cx-line cx-hero-title-line block text-chrome-gradient sm:whitespace-nowrap">
              for operational AI.
            </span>
          </h1>

          {/* Sub */}
          <p className="cx-sub cx-hero-sub mt-5 max-w-[34ch] text-[15px] leading-[1.55] text-[var(--silver-dim)] [text-shadow:0_1px_12px_rgba(0,0,0,0.7)] sm:mt-8 sm:max-w-xl sm:text-lg sm:leading-relaxed">
            Cyryx Labs builds AI products, agentic workflow systems, and
            governed execution infrastructure for teams moving from scattered
            AI experiments to structured, auditable operations.
          </p>

          {/* CTAs */}
          <div className="cx-hero-ctas mt-8 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:gap-5">
            <a
              href="#maax"
              aria-label="Explore MAAX Studio — flagship product"
              className="cx-cta cx-cta-primary cx-liquid-glass group relative inline-flex min-h-[48px] w-full items-center justify-center gap-2 overflow-hidden rounded-md px-6 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent-glow)] shadow-[0_10px_30px_-12px_color-mix(in_oklab,var(--accent-glow)_55%,transparent)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)] focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:w-auto sm:px-7 sm:py-3.5 sm:text-[11.5px] sm:tracking-[0.26em]"
            >
              <span>Explore MAAX Studio</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#contact"
              aria-label="Start a project with Cyryx Labs"
              className="cx-cta cx-cta-ghost cx-liquid-glass group inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-md px-6 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-silver-gradient transition hover:text-[var(--accent-glow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)] focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:w-auto sm:px-7 sm:py-3.5 sm:text-[11.5px] sm:tracking-[0.26em]"
            >
              <span>Start a Project</span>
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>

        {/* Bottom meta rail */}
        <ul
          aria-label="Cyryx platform pillars and operating posture"
          className="mt-24 flex list-none flex-wrap items-center gap-x-10 gap-y-4 border-t border-white/10 pt-6"
        >
          {META.map((m) => (
            <li
              key={m}
              className="cx-meta font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--silver-dim)]"
            >
              <span aria-hidden="true" className="mr-3 text-[var(--accent-glow)]">/</span>
              {m}
            </li>
          ))}
          <li className="cx-meta ml-auto font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--silver-dim)]">
            Governance-ready architecture · Human-commanded autonomy · Cost-aware execution
          </li>
        </ul>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden="true"
        className="cx-scroll pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.36em] text-[var(--silver-dim)]">
          Scroll
        </span>
        <span className="cx-scroll-dot h-6 w-px bg-gradient-to-b from-[var(--accent-glow)] to-transparent" />
      </div>
    </section>
  );
}