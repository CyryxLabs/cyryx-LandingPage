import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpRight } from "lucide-react";
import heroPoster960 from "@/assets/cyryx-hero-poster-960.webp";
import heroPoster1920 from "@/assets/cyryx-hero-poster-1920.webp";
import { useCopyVariant } from "@/lib/copy-variant";
import { getCopy } from "@/copy";
import { buildStartProjectHref } from "@/lib/cta";
import { trackCta } from "@/lib/track-cta";

const HERO_VIDEO_MOBILE = "/media/cyryx-hero-720.mp4";
const HERO_VIDEO_DESKTOP = "/media/cyryx-hero-1080.mp4";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getServerReducedMotionSnapshot() {
  return false;
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const copy = getCopy(useCopyVariant()).hero;
  const [debug, setDebug] = useState(false);
  const [hideOverlay, setHideOverlay] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const parallax = { y: 0, scale: 1, progress: 0 };

  // The film is a scroll-controlled surface. Never fall back to autoplay:
  // without ScrollTrigger the poster remains visible instead of changing the
  // approved composition on its own.
  useEffect(() => {
    if (typeof window === "undefined" || reducedMotion) return;
    const host = root.current;
    if (!host) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const v = videoRef.current;
        if (entry.isIntersecting) {
          if (v?.readyState && v.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
            setVideoReady(true);
          }
        }
        v?.pause();
      },
      { threshold: 0.05 },
    );
    io.observe(host);
    return () => io.disconnect();
  }, [reducedMotion]);

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

  return (
    <section
      ref={root}
      id="top"
      data-hero
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-black"
    >
      {/* Background */}
      <div
        aria-hidden
        className="cx-bg cx-hero-media-frame absolute inset-0 -z-10 overflow-hidden"
        data-hero-media-frame
        data-hide-overlay={hideOverlay || undefined}
      >
        {/* Always-on local poster — instant LCP and fallback when reduced motion or video stalls. */}
        <picture>
          <source
            type="image/webp"
            srcSet={`${heroPoster960} 960w, ${heroPoster1920} 1920w`}
            sizes="100vw"
          />
          <img
            src={heroPoster1920}
            alt=""
            fetchPriority="high"
            loading="eager"
            decoding="async"
            width={1920}
            height={1080}
            data-no3d="1"
            data-hero-poster
            className="cx-bg-img cx-hero-media absolute inset-0 h-full w-full object-cover object-center will-change-transform"
            draggable={false}
          />
        </picture>
        {!reducedMotion && (
          <video
            ref={videoRef}
            muted
            playsInline
            preload="metadata"
            disablePictureInPicture
            disableRemotePlayback
            onLoadedData={() => setVideoReady(true)}
            onCanPlay={() => setVideoReady(true)}
            onPlaying={() => setVideoReady(true)}
            aria-hidden="true"
            data-no3d="1"
            data-hero-video
            className={`cx-bg-img cx-hero-media absolute inset-0 h-full w-full object-cover object-center will-change-transform transition-opacity duration-500 ${videoReady ? "opacity-100" : "opacity-0"}`}
          >
            <source media="(max-width: 767px)" src={HERO_VIDEO_MOBILE} type="video/mp4" />
            <source src={HERO_VIDEO_DESKTOP} type="video/mp4" />
          </video>
        )}
        {/* Responsive grade: preserves a stable, high-contrast reading field without hiding the film. */}
        <div
          className="cx-hero-overlay cx-hero-grade absolute inset-0 data-[hide=true]:hidden"
          data-hide={hideOverlay ? "true" : "false"}
        />
        {/* top/bottom feather */}
        <div
          className="cx-hero-overlay cx-hero-feather absolute inset-0 data-[hide=true]:hidden"
          data-hide={hideOverlay ? "true" : "false"}
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
        data-hero-aura
        className="cx-stage pointer-events-none absolute left-1/2 top-[58%] -z-[5] h-[55vh] w-[55vh] -translate-x-1/2 -translate-y-1/2 rounded-full lg:top-1/2"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--accent-glow) 22%, transparent) 0%, transparent 65%)",
          filter: "blur(50px)",
        }}
      />

      {/* Foreground content */}
      <div
        data-hero-content
        className="relative mx-auto w-full max-w-7xl px-5 pb-24 pt-28 sm:px-10 sm:pt-40 sm:pb-28 lg:px-14"
      >
        <div className="mx-auto w-full max-w-[68rem] sm:mx-0">
          <div className="cx-hero-panel">
            {/* Headline */}
            <h1
              id="hero-heading"
              className="cx-hero-heading font-orbitron font-bold tracking-[0.01em] text-silver-gradient [text-shadow:0_2px_24px_rgba(0,0,0,0.6)]"
            >
              <span
                data-hero-line
                className="cx-line cx-hero-title-line block text-chrome-gradient"
              >
                {copy.headline}
              </span>
            </h1>

            {/* Sub */}
            <p className="cx-sub cx-hero-sub mt-5 max-w-[34ch] text-[15px] leading-[1.55] text-[rgba(230,238,239,0.82)] [text-shadow:0_1px_16px_rgba(0,0,0,0.9)] sm:mt-8 sm:max-w-xl sm:text-lg sm:leading-relaxed">
              {copy.sub}
            </p>

            {/* CTAs */}
            <div className="cx-hero-ctas mt-8 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:gap-5">
              <a
                href={buildStartProjectHref({ source: "home", intent: "operating-capability" })}
                aria-label="Start a fit review with Cyryx Labs"
                className="cx-cta cx-cta-primary cx-liquid-glass group relative inline-flex min-h-[48px] w-full items-center justify-center gap-2 overflow-hidden rounded-md px-6 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent-glow)] shadow-[0_10px_30px_-12px_color-mix(in_oklab,var(--accent-glow)_55%,transparent)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)] focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:w-auto sm:px-7 sm:py-3.5 sm:text-[11.5px] sm:tracking-[0.26em]"
                onClick={() =>
                  trackCta({
                    cta: "start_project",
                    section: "hero",
                    href: buildStartProjectHref({
                      source: "home",
                      intent: "operating-capability",
                    }),
                  })
                }
              >
                <span>{copy.ctaPrimary}</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="#maax"
                aria-label="Explore MAAX Studio — product in active development"
                className="cx-cta group inline-flex min-h-[44px] w-auto self-start items-center justify-start gap-2 px-1 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--silver-dim)] transition hover:text-[var(--accent-glow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)] focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:px-2 sm:text-[10.5px] sm:tracking-[0.24em]"
                onClick={() => trackCta({ cta: "explore_maax", section: "hero", href: "#maax" })}
              >
                <span>{copy.ctaSecondary}</span>
                <ArrowUpRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* A minimal affordance makes the pinned, scroll-driven sequence discoverable. */}
      <div
        aria-hidden="true"
        data-hero-scroll-cue
        className="cx-hero-scroll-cue pointer-events-none absolute bottom-6 right-5 flex items-center gap-3 sm:bottom-8 sm:right-8 sm:gap-4 xl:bottom-10 xl:right-12"
      >
        <span className="hidden font-mono text-[9px] uppercase tracking-[0.28em] text-white/55 sm:inline">
          Scroll to execute
        </span>
        <span className="cx-hero-scroll-track relative block h-px w-16 overflow-hidden bg-white/15 sm:w-24">
          <span
            data-scroll-progress
            className="absolute inset-0 origin-left scale-x-[0.06] bg-[var(--accent-glow)] will-change-transform"
          />
        </span>
      </div>
    </section>
  );
}
