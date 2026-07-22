import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import heroPoster960 from "@/assets/cyryx-hero-poster-960.webp";
import heroPoster1920 from "@/assets/cyryx-hero-poster-1920.webp";
import { useCopyVariant } from "@/lib/copy-variant";
import { getCopy } from "@/copy";
import { trackCta } from "@/lib/track-cta";

const HERO_VIDEO_MOBILE = "/media/cyryx-hero-720.mp4";
const HERO_VIDEO_DESKTOP = "/media/cyryx-hero-1080.mp4";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const copy = getCopy(useCopyVariant()).hero;
  const [debug, setDebug] = useState(false);
  const [hideOverlay, setHideOverlay] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const parallax = { y: 0, scale: 1, progress: 0 };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Pause video when offscreen to save CPU/battery
  useEffect(() => {
    if (typeof window === "undefined" || reducedMotion) return;
    const host = root.current;
    if (!host) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const v = videoRef.current;
        if (entry.isIntersecting) {
          if (host.dataset.scrollScrub === "true") {
            v?.pause();
            return;
          }
          if (v?.readyState && v.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
            setVideoReady(true);
          }
          v?.play()
            .then(() => setVideoReady(true))
            .catch(() => {});
        } else {
          v?.pause();
        }
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
        className="cx-bg absolute inset-0 -z-10"
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
            className="cx-bg-img absolute inset-0 h-full w-full object-cover object-center will-change-transform"
            draggable={false}
          />
        </picture>
        {!reducedMotion && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            disablePictureInPicture
            disableRemotePlayback
            onLoadedData={() => setVideoReady(true)}
            onCanPlay={() => setVideoReady(true)}
            onPlaying={() => setVideoReady(true)}
            aria-hidden="true"
            data-no3d="1"
            data-hero-video
            className={`cx-bg-img absolute inset-0 h-full w-full object-cover object-center will-change-transform transition-opacity duration-500 ${videoReady ? "opacity-100" : "opacity-0"}`}
          >
            <source media="(max-width: 767px)" src={HERO_VIDEO_MOBILE} type="video/mp4" />
            <source src={HERO_VIDEO_DESKTOP} type="video/mp4" />
          </video>
        )}
        {/* deep vignette to anchor copy — vertical on mobile, horizontal on desktop */}
        <div
          className="cx-hero-overlay absolute inset-0 data-[hide=true]:hidden"
          data-hide={hideOverlay ? "true" : "false"}
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.18) 38%, rgba(0,0,0,0.08) 60%, rgba(0,0,0,0.78) 100%)",
          }}
        />
        {/* Desktop copy field: keeps the message readable without flattening the cinematic center. */}
        <div
          className="cx-hero-overlay absolute inset-0 hidden data-[hide=true]:hidden lg:block"
          data-hide={hideOverlay ? "true" : "false"}
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.84) 0%, rgba(0,0,0,0.66) 34%, rgba(0,0,0,0.18) 64%, rgba(0,0,0,0.08) 100%)",
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
        className="cx-stage pointer-events-none absolute left-1/2 top-[58%] -z-[5] h-[55vh] w-[55vh] -translate-x-1/2 -translate-y-1/2 rounded-full lg:top-1/2"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--accent-glow) 22%, transparent) 0%, transparent 65%)",
          filter: "blur(50px)",
        }}
      />

      {/* Foreground content */}
      <div className="relative mx-auto w-full max-w-7xl px-5 pb-24 pt-28 sm:px-10 sm:pt-40 sm:pb-28 lg:px-14">
        <div className="mx-auto w-full max-w-[68rem] sm:mx-0">
          <div className="cx-hero-panel">
            <p className="cx-hero-kicker hud-label mb-5 text-[var(--accent-glow)] sm:mb-7">
              Cyryx Labs{" "}
              <span aria-hidden className="text-[var(--steel)]">
                /
              </span>{" "}
              AI systems &amp; product engineering
            </p>
            {/* Headline */}
            <h1
              id="hero-heading"
              className="cx-hero-heading font-display font-semibold tracking-[-0.035em] text-silver-gradient [text-shadow:0_2px_24px_rgba(0,0,0,0.6)]"
            >
              <span
                data-hero-line
                className="cx-line cx-hero-title-line block text-chrome-gradient"
              >
                {copy.headline}
              </span>
            </h1>

            {/* Sub */}
            <p className="cx-sub cx-hero-sub mt-5 max-w-[34ch] text-[15px] leading-[1.55] text-[var(--silver-dim)] [text-shadow:0_1px_12px_rgba(0,0,0,0.7)] sm:mt-8 sm:max-w-xl sm:text-lg sm:leading-relaxed">
              {copy.sub}
            </p>

            {/* CTAs */}
            <div className="cx-hero-ctas mt-8 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:gap-5">
              <a
                href="#contact"
                aria-label="Discuss your AI initiative with Cyryx Labs"
                className="cx-cta cx-cta-primary cx-liquid-glass group relative inline-flex min-h-[48px] w-full items-center justify-center gap-2 overflow-hidden rounded-md px-6 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent-glow)] shadow-[0_10px_30px_-12px_color-mix(in_oklab,var(--accent-glow)_55%,transparent)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)] focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:w-auto sm:px-7 sm:py-3.5 sm:text-[11.5px] sm:tracking-[0.26em]"
                onClick={() =>
                  trackCta({ cta: "start_project", section: "hero", href: "#contact" })
                }
              >
                <span>{copy.ctaPrimary}</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="#what-we-build"
                aria-label="See how Cyryx Labs delivers AI systems"
                className="cx-cta cx-cta-ghost cx-liquid-glass group inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-md px-6 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-silver-gradient transition hover:text-[var(--accent-glow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)] focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:w-auto sm:px-7 sm:py-3.5 sm:text-[11.5px] sm:tracking-[0.26em]"
                onClick={() =>
                  trackCta({ cta: "see_delivery", section: "hero", href: "#what-we-build" })
                }
              >
                <span>{copy.ctaSecondary}</span>
                <ArrowUpRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            </div>

            <ol
              aria-label="What Cyryx Labs brings to an AI initiative"
              className="cx-hero-proof mt-10 max-w-3xl grid-cols-3 gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 lg:mt-14"
            >
              {copy.rail.map((item, index) => (
                <li
                  key={item}
                  className="flex min-h-16 items-center gap-3 bg-black/45 px-4 py-3 backdrop-blur-sm"
                >
                  <span className="font-mono text-[9px] tracking-[0.2em] text-[var(--accent-glow)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[11px] font-medium uppercase leading-relaxed tracking-[0.13em] text-[var(--silver-dim)]">
                    {item}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div
        data-scroll-cue
        aria-hidden="true"
        className="pointer-events-none absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-4 lg:flex"
        style={{ bottom: "1.75rem" }}
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-[var(--steel)]">
          Scroll to direct the sequence
        </span>
        <span className="h-px w-24 overflow-hidden bg-white/10">
          <span
            data-scroll-progress
            className="block h-full origin-left scale-x-0 bg-[var(--accent-glow)] shadow-[0_0_8px_var(--accent-glow)]"
          />
        </span>
      </div>
    </section>
  );
}
