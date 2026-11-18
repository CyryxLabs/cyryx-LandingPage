import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { trackCta } from "@/lib/track-cta";

/**
 * Hero visual (2026-11-15): one cinematic shot. A hand in a suit sleeve
 * touches a pane of dark glass and teal pathways spread from the point of
 * touch: a person sets the work in motion and stays in control of it. The
 * shot was generated in Higgsfield (image: Nano Banana Pro, motion: Seedance
 * 2.5) on the founder's account; source notes in docs/design/hero-touch/.
 * No product appears in the hero (founder decision, 2026-11-13).
 *
 * The shot builds up (the light spreads), so it plays once, five seconds,
 * and holds on its last frame; a loop would jump back to the dark start.
 * First paint is the still of its first frame, so the largest element on the
 * first screen is an image and the video fades in over an identical picture.
 * The video is requested only after the page has loaded, and never with
 * reduced motion or on a low-end device: those visitors get the last frame
 * as a still. Below 900 px a vertical cut of the same shot is used. The
 * video is muted, plays
 * inline and is hidden from assistive technology; the still carries the
 * description.
 */
export const HERO_CHAPTERS = [
  { n: "01", label: "AI systems", href: "/solutions/custom-ai-product-development" },
  { n: "02", label: "Workflow automation", href: "/solutions/workflow-automation" },
  { n: "03", label: "System integration", href: "/solutions/ai-integrations" },
  { n: "04", label: "Governance and control", href: "/solutions/ai-governance-cost-control" },
] as const;

export const HERO_STILL_ALT =
  "A person's hand touches a pane of dark glass, and thin lines of teal light spread out from the point of touch.";

// Phones and portrait tablets get a vertical cut of the same shot.
const SOURCES = { wide: "/media/hero-touch-1920.mp4", tall: "/media/hero-touch-tall.mp4" };

export function useHeroVideo(
  hostRef: React.RefObject<HTMLElement | null>,
  videoRef: React.RefObject<HTMLVideoElement | null>,
) {
  useEffect(() => {
    const host = hostRef.current;
    const video = videoRef.current;
    if (!host || !video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const low = document.documentElement.classList.contains("cx-low-perf");
    if (reduce || low) {
      host.dataset.still = "end";
      return;
    }

    let cancelled = false;
    let timer = 0;
    const onPlaying = () => {
      if (!cancelled) host.dataset.live = "";
    };
    const start = () => {
      timer = window.setTimeout(() => {
        if (cancelled) return;
        video.src = window.innerWidth < 900 ? SOURCES.tall : SOURCES.wide;
        video.addEventListener("playing", onPlaying, { once: true });
        void video.play().catch(() => {
          host.dataset.still = "end";
        });
      }, 250);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener("load", start);
      video.removeEventListener("playing", onPlaying);
    };
  }, [hostRef, videoRef]);
}

export function HeroStill({ videoRef }: { videoRef: React.RefObject<HTMLVideoElement | null> }) {
  return (
    <div className="cy-hv__frame">
      <picture>
        <source
          media="(max-width: 899px) and (prefers-reduced-motion: reduce)"
          srcSet="/media/hero-touch-tall-end.webp"
        />
        <source media="(max-width: 899px)" srcSet="/media/hero-touch-tall.webp" />
        <source
          media="(prefers-reduced-motion: reduce)"
          srcSet="/media/hero-touch-end-1280.webp 1280w, /media/hero-touch-end-1920.webp 1920w"
          sizes="114vw"
        />
        <img
          src="/media/hero-touch-1920.webp"
          srcSet="/media/hero-touch-1280.webp 1280w, /media/hero-touch-1920.webp 1920w"
          sizes="114vw"
          alt={HERO_STILL_ALT}
          width={1920}
          height={1080}
          decoding="async"
          fetchPriority="high"
        />
      </picture>
      <picture className="cy-hv__end" aria-hidden="true">
        <source media="(max-width: 899px)" srcSet="/media/hero-touch-tall-end.webp" />
        <img
          src="/media/hero-touch-end-1920.webp"
          srcSet="/media/hero-touch-end-1280.webp 1280w, /media/hero-touch-end-1920.webp 1920w"
          sizes="114vw"
          alt=""
          width={1920}
          height={1080}
          loading="lazy"
          decoding="async"
        />
      </picture>
      <video
        ref={videoRef}
        className="cy-hv__video"
        muted
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}

export function HeroStrip() {
  return (
    <nav className="cy-cmd__nav" aria-label="What we build">
      <ul>
        {HERO_CHAPTERS.map((chapter) => (
          <li key={chapter.n}>
            <Link
              to={chapter.href}
              className="cy-cmd__item"
              onClick={() => trackCta({ cta: "see_delivery", section: "hero", href: chapter.href })}
            >
              <span className="cy-cmd__n" aria-hidden="true">
                {chapter.n}
              </span>
              {chapter.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
