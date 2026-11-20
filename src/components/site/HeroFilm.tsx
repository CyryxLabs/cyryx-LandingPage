import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Pause, Play } from "lucide-react";
import { trackCta } from "@/lib/track-cta";

/**
 * Hero film: a 24-second institutional loop that shows what Cyryx Labs does,
 * one chapter per capability: an architecture view (your systems, integration,
 * AI agents, governance), a workflow with a human approval, the systems an AI
 * layer connects to, and the controls around it. The examples are labelled as
 * illustrative inside the film. No product appears in the hero (founder
 * decision, 2026-11-13); the products have their own section further down.
 *
 * The film is decorative for assistive technology (aria-hidden): the chapter
 * selector under it is a real nav with the same four items as links, and the
 * hero copy says the rest. The selector follows the film, and hovering or
 * focusing an item jumps to its chapter. A pause control is always offered.
 *
 * First paint is the poster (the frame at POSTER_AT). The video file is only
 * requested after the page has loaded, and never with reduced motion or on a
 * low-end device. Source: docs/design/hero-film/ (film.html, render.py).
 */
export const HERO_CHAPTERS = [
  { n: "01", label: "AI systems", href: "/solutions/custom-ai-product-development", at: 0 },
  { n: "02", label: "Workflow automation", href: "/solutions/workflow-automation", at: 5 },
  { n: "03", label: "System integration", href: "/solutions/ai-integrations", at: 10.5 },
  {
    n: "04",
    label: "Governance and control",
    href: "/solutions/ai-governance-cost-control",
    at: 15,
  },
] as const;

/** The closing card (wordmark) runs from here to the end of the loop. */
const CLOSING_AT = 20;
const POSTER_AT = 3.2;

export function HeroFilm() {
  const hostRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const pausedByUser = useRef(false);
  const [live, setLive] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    const video = videoRef.current;
    const nav = navRef.current;
    if (!host || !video || !nav) return;
    const section = host.closest("section");
    const items = Array.from(nav.querySelectorAll<HTMLElement>("[data-chapter]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Scroll progress drives the copy's exit even when the film is a still.
    let progress = -1;
    const onScroll = () => {
      const rect = (section ?? host).getBoundingClientRect();
      const next = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height * 0.82)));
      if (Math.abs(next - progress) < 0.002) return;
      progress = next;
      if (!reduced) section?.style.setProperty("--hp", next.toFixed(3));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    const cleanups: Array<() => void> = [() => window.removeEventListener("scroll", onScroll)];
    const dispose = () => cleanups.forEach((fn) => fn());

    if (reduced) return dispose;
    if (document.documentElement.classList.contains("cx-low-perf")) return dispose;

    let visible = true;
    let started = false;

    // Runs on timeupdate (a few times a second); the bar eases between updates in CSS.
    const mark = () => {
      const t = video.currentTime;
      let active = -1;
      if (t < CLOSING_AT) {
        for (let index = 0; index < HERO_CHAPTERS.length; index += 1) {
          if (t >= HERO_CHAPTERS[index].at) active = index;
        }
      }
      items.forEach((item, index) => {
        if (index !== active) {
          delete item.dataset.on;
          item.style.removeProperty("--f");
          return;
        }
        const from = HERO_CHAPTERS[index].at;
        const to = HERO_CHAPTERS[index + 1]?.at ?? CLOSING_AT;
        item.dataset.on = "true";
        item.style.setProperty("--f", Math.min(1, (t - from) / (to - from)).toFixed(3));
      });
    };

    const play = () => {
      if (pausedByUser.current || !visible || document.hidden) return;
      void video.play().catch(() => undefined);
    };
    const onPlaying = () => {
      setLive(true);
      host.dataset.live = "true";
      mark();
    };
    video.addEventListener("playing", onPlaying);
    video.addEventListener("timeupdate", mark);
    video.addEventListener("seeked", mark);

    const start = () => {
      if (started) return;
      started = true;
      video.src =
        window.innerWidth < 900 ? "/media/hero-film-960.mp4" : "/media/hero-film-1600.mp4";
      // Begin on the poster frame, so the still hands over to the film without a jump.
      video.addEventListener("loadedmetadata", () => (video.currentTime = POSTER_AT), {
        once: true,
      });
      play();
    };
    const boot = () => {
      const idle = (
        window as Window & {
          requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
        }
      ).requestIdleCallback;
      if (idle) idle(start, { timeout: 1500 });
      else window.setTimeout(start, 300);
    };
    if (document.readyState === "complete") boot();
    else window.addEventListener("load", boot, { once: true });

    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (!started) return;
      if (visible) play();
      else video.pause();
    });
    io.observe(host);

    const jump = (event: Event) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-chapter]");
      if (!target || !started || video.readyState < 1) return;
      const chapter = HERO_CHAPTERS[Number(target.dataset.chapter)];
      if (!chapter) return;
      if (video.currentTime >= chapter.at && video.currentTime < chapter.at + 1.2) return;
      video.currentTime = chapter.at + 0.05;
      play();
    };
    nav.addEventListener("pointerover", jump);
    nav.addEventListener("focusin", jump);

    cleanups.push(() => {
      io.disconnect();
      window.removeEventListener("load", boot);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("timeupdate", mark);
      video.removeEventListener("seeked", mark);
      nav.removeEventListener("pointerover", jump);
      nav.removeEventListener("focusin", jump);
    });
    return dispose;
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      pausedByUser.current = false;
      setPaused(false);
      void video.play().catch(() => undefined);
    } else {
      pausedByUser.current = true;
      setPaused(true);
      video.pause();
    }
  };

  return (
    <>
      <div ref={hostRef} className="cy-film" aria-hidden="true">
        <picture>
          <source media="(max-width: 899px)" srcSet="/media/hero-film-poster-960.webp" />
          <img
            className="cy-film__poster"
            src="/media/hero-film-poster.webp"
            alt=""
            width={1600}
            height={900}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <video
          ref={videoRef}
          className="cy-film__video"
          muted
          loop
          playsInline
          preload="none"
          tabIndex={-1}
          aria-hidden="true"
          width={1600}
          height={900}
        />
      </div>
      <nav ref={navRef} className="cy-forms cy-in" aria-label="What we build">
        <div className="cy-container">
          {live ? (
            <button type="button" className="cy-film__toggle" onClick={toggle}>
              {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
              {paused ? "Play video" : "Pause video"}
            </button>
          ) : null}
          <ul className="cy-forms__list">
            {HERO_CHAPTERS.map((chapter, index) => (
              <li key={chapter.n}>
                <Link
                  to={chapter.href}
                  className="cy-forms__item"
                  data-chapter={index}
                  onClick={() =>
                    trackCta({ cta: "see_delivery", section: "hero", href: chapter.href })
                  }
                >
                  <span className="cy-forms__bar" aria-hidden="true">
                    <i />
                  </span>
                  <span className="cy-forms__n" aria-hidden="true">
                    {chapter.n}
                  </span>
                  <span className="cy-forms__t">{chapter.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
