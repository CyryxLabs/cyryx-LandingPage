import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import heroBanner from "@/assets/cyryx-hero-monolith-void.png.asset.json";

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
          isDesktop: "(min-width: 768px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { isMobile, isDesktop, reduceMotion } = ctx.conditions as {
            isMobile: boolean;
            isDesktop: boolean;
            reduceMotion: boolean;
          };

          if (reduceMotion) return;

          const tl = gsap.timeline({
            defaults: { ease: "power3.out", duration: 0.9 },
          });

          tl.from(".cx-bg", { opacity: 0, duration: 1.4, ease: "power2.out" })
            .from(
              ".cx-eyebrow",
              { opacity: 0, y: 16, duration: 0.7 },
              "-=1.0",
            )
            .from(
              ".cx-line",
              { opacity: 0, y: 28, duration: 0.95, stagger: 0.12 },
              "-=0.55",
            )
            .from(
              ".cx-sub",
              { opacity: 0, y: 18, duration: 0.7 },
              "-=0.55",
            )
            .from(
              ".cx-cta",
              { opacity: 0, y: 14, duration: 0.6, stagger: 0.08 },
              "-=0.45",
            )
            .from(
              ".cx-meta",
              { opacity: 0, y: 10, duration: 0.55, stagger: 0.06 },
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

          if (isDesktop) {
            gsap.to(".cx-bg-img", {
              yPercent: -10,
              scale: 1.06,
              ease: "none",
              scrollTrigger: {
                trigger: root.current,
                start: "top top",
                end: "bottom top",
                scrub: 0.6,
              },
            });
            gsap.to(".cx-stage", {
              yPercent: -6,
              opacity: 0.4,
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
            gsap.set(".cx-bg-img", { scale: 1.02 });
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
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-black"
    >
      {/* Background */}
      <div aria-hidden className="cx-bg absolute inset-0 -z-10">
        <img
          src={heroBanner.url}
          alt=""
          className="cx-bg-img absolute inset-0 h-full w-full object-cover object-right will-change-transform"
          draggable={false}
        />
        {/* deep vignette to anchor copy */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, #000 0%, rgba(0,0,0,0.92) 28%, rgba(0,0,0,0.55) 52%, rgba(0,0,0,0.15) 78%, transparent 100%)",
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
        className="cx-stage pointer-events-none absolute right-[8%] top-1/2 -z-[5] h-[55vh] w-[55vh] -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--accent-glow) 22%, transparent) 0%, transparent 65%)",
          filter: "blur(50px)",
        }}
      />

      {/* Foreground content */}
      <div className="relative mx-auto w-full max-w-7xl px-6 pb-28 pt-32 sm:px-10 sm:pt-40 lg:px-14">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="cx-eyebrow inline-flex items-center gap-3 border-l-2 border-[var(--accent-glow)] pl-3">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-glow)] shadow-[0_0_10px_var(--accent-glow)]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--silver-dim)]">
              Cyryx Labs · Enterprise AI · United States
            </span>
          </div>

          {/* Headline */}
          <h1 className="mt-10 font-display font-semibold leading-[0.92] tracking-[-0.04em] text-white">
            <span className="cx-line block text-[clamp(44px,8.4vw,116px)]">
              Intelligence
            </span>
            <span className="cx-line block text-[clamp(44px,8.4vw,116px)] text-silver-gradient">
              that executes.
            </span>
          </h1>

          {/* Sub */}
          <p className="cx-sub mt-8 max-w-xl text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg">
            We engineer the proprietary AI infrastructure and governed agent
            systems that mission-critical American enterprises run on.
          </p>

          {/* CTAs */}
          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:gap-5">
            <a
              href="#cta"
              className="cx-cta group relative inline-flex h-14 items-center justify-center gap-2 overflow-hidden rounded-none border border-[var(--accent-glow)] bg-[var(--accent-glow)] px-9 text-[12px] font-semibold uppercase tracking-[0.28em] text-black transition hover:brightness-110"
            >
              <span>Initialize a System</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href="#maax"
              className="cx-cta group inline-flex h-14 items-center justify-center gap-2 rounded-none border border-white/20 bg-transparent px-9 text-[12px] font-semibold uppercase tracking-[0.28em] text-white transition hover:border-[var(--accent-glow)] hover:text-[var(--accent-glow)]"
            >
              <span>Enter MAAX Studio</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* Bottom meta rail */}
        <div className="mt-24 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-white/10 pt-6">
          {META.map((m) => (
            <span
              key={m}
              className="cx-meta font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--silver-dim)]"
            >
              <span className="mr-3 text-[var(--accent-glow)]">/</span>
              {m}
            </span>
          ))}
          <span className="cx-meta ml-auto font-mono text-[11px] uppercase tracking-[0.32em] text-[var(--silver-dim)]">
            SOC 2 · ISO 27001 · HIPAA-Ready
          </span>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="cx-scroll absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.36em] text-[var(--silver-dim)]">
          Scroll
        </span>
        <span className="cx-scroll-dot h-6 w-px bg-gradient-to-b from-[var(--accent-glow)] to-transparent" />
      </div>
    </section>
  );
}