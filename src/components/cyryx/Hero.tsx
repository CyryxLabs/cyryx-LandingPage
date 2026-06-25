import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import heroBanner from "@/assets/cyryx-hero-monolith-serene.png.asset.json";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const META = ["AI INFRASTRUCTURE", "COMMAND LAYER", "GOVERNED EXECUTION"];

export function Hero() {
  const root = useRef<HTMLElement>(null);

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
              ".cx-eyebrow",
              { opacity: 0, y: isMobile ? 10 : 16, duration: 0.6 },
              "-=1.0",
            )
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

          if (isAbove768) {
            // Tablet gets a lighter parallax; desktop gets the full effect.
            const bannerY = isDesktop ? -10 : -6;
            const bannerScale = isDesktop ? 1.06 : 1.04;
            const stageY = isDesktop ? -6 : -3;
            const stageOpacity = isDesktop ? 0.4 : 0.6;

            gsap.to(".cx-bg-img", {
              yPercent: bannerY,
              scale: bannerScale,
              ease: "none",
              scrollTrigger: {
                trigger: root.current,
                start: "top top",
                end: "bottom top",
                scrub: isDesktop ? 0.6 : 0.4,
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
          }

          if (isMobile) {
            // No pinning, no scrub — just a soft fade on the background
            // as the user scrolls past the hero.
            gsap.set(".cx-bg-img", { scale: 1.04 });
            gsap.to([".cx-bg-img", ".cx-stage"], {
              opacity: 0.55,
              ease: "none",
              scrollTrigger: {
                trigger: root.current,
                start: "top top",
                end: "bottom 40%",
                scrub: 0.4,
              },
            });
          }
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
      <div aria-hidden className="cx-bg absolute inset-0 -z-10">
        <img
          src={heroBanner.url}
          alt=""
          fetchPriority="high"
          loading="eager"
          decoding="async"
          sizes="100vw"
          width={1920}
          height={1080}
          className="cx-bg-img absolute inset-0 h-full w-full object-cover object-[65%_center] will-change-transform sm:object-[75%_center] lg:object-right"
          draggable={false}
        />
        {/* deep vignette to anchor copy — vertical on mobile, horizontal on desktop */}
        <div
          className="absolute inset-0 lg:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 35%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.85) 100%)",
          }}
        />
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            background:
              "linear-gradient(90deg, #000 0%, rgba(0,0,0,0.94) 30%, rgba(0,0,0,0.65) 55%, rgba(0,0,0,0.2) 80%, transparent 100%)",
          }}
        />
        {/* top/bottom feather */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #000 0%, transparent 18%, transparent 72%, #000 100%)",
          }}
        />
        {/* subtle horizontal teal line */}
        <div
          className="absolute left-0 right-0 top-1/2 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--accent-glow) 60%, transparent) 50%, transparent 100%)",
            opacity: 0.4,
          }}
        />
        {/* noise */}
        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
          }}
        />
      </div>

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
      <div className="relative mx-auto w-full max-w-7xl px-6 pb-28 pt-32 sm:px-10 sm:pt-40 lg:px-14">
        <div className="max-w-3xl">
          {/* Headline */}
          <h1
            id="hero-heading"
            className="font-display font-semibold leading-[1.02] tracking-[-0.04em] text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.6)] pb-2"
          >
            <span className="cx-line block text-[clamp(44px,8vw,108px)] text-chrome-gradient pb-[0.08em]">
              Intelligence
            </span>
            <span className="cx-line block text-[clamp(44px,8vw,108px)] text-chrome-gradient pb-[0.08em]">
              that executes.
            </span>
          </h1>

          {/* Sub */}
          <p className="cx-sub mt-8 max-w-xl text-base leading-relaxed text-white/90 [text-shadow:0_1px_12px_rgba(0,0,0,0.7)] sm:text-lg">
            We engineer the proprietary AI infrastructure and governed agent
            systems that mission-critical American enterprises run on.
          </p>

          {/* CTAs */}
          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:gap-5">
            <a
              href="#cta"
              aria-label="Initialize a Cyryx AI system — primary call to action"
              className="cx-cta group relative inline-flex h-14 items-center justify-center gap-2 overflow-hidden rounded-none border border-[var(--accent-glow)] bg-[var(--accent-glow)] px-9 text-[12px] font-semibold uppercase tracking-[0.28em] text-black transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <span>Initialize a System</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#maax"
              aria-label="Enter the MAAX Studio workspace"
              className="cx-cta group inline-flex h-14 items-center justify-center gap-2 rounded-none border border-white/25 bg-transparent px-9 text-[12px] font-semibold uppercase tracking-[0.28em] text-white transition hover:border-[var(--accent-glow)] hover:text-[var(--accent-glow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <span>Enter MAAX Studio</span>
              <ArrowUpRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>

        {/* Bottom meta rail */}
        <ul
          aria-label="Cyryx platform pillars and compliance"
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
            SOC 2 · ISO 27001 · HIPAA-Ready
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