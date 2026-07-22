import { useEffect } from "react";
import type { CyryxScrollDiagnosticPayload } from "@/types/cyryx-diagnostics";

declare global {
  interface Window {
    __CYRYX_SCROLL_DIAGNOSTICS__?: CyryxScrollDiagnosticPayload;
  }
}

function readScale(transform: string) {
  if (!transform || transform === "none") return { scaleX: 1, scaleY: 1 };

  const matrix = new DOMMatrixReadOnly(transform);
  return {
    scaleX: Math.hypot(matrix.a, matrix.b),
    scaleY: Math.hypot(matrix.c, matrix.d),
  };
}

function readBreakpoint(width: number): CyryxScrollDiagnosticPayload["breakpoint"] {
  if (width >= 1024) return "desktop";
  if (width >= 768) return "tablet";
  return "mobile";
}

/**
 * Purposeful homepage motion: editorial reveals, a short hero entrance, and
 * one product-context parallax. Every animation is transform/opacity based,
 * breakpoint scoped, and removed when this route unmounts.
 */
export function useCyryxScrollAnimations() {
  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    let diagnosticRaf = 0;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPerf = document.documentElement.classList.contains("cx-low-perf");

    const publishDiagnostics = (
      gsapStats: { tweenCount: number; scrollTriggerCount: number } = {
        tweenCount: 0,
        scrollTriggerCount: 0,
      },
    ) => {
      diagnosticRaf = 0;
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      if (!hero) return;

      const computed = getComputedStyle(hero);
      const { scaleX, scaleY } = readScale(computed.transform);
      const diagnostics: CyryxScrollDiagnosticPayload = {
        source: "useCyryxScrollAnimations",
        scrollY: window.scrollY,
        viewport: `${window.innerWidth}×${window.innerHeight}`,
        breakpoint: readBreakpoint(window.innerWidth),
        gsap: {
          enabled: !reduceMotion,
          reason: reduceMotion ? "reduced-motion" : lowPerf ? "low-perf" : "running",
          reduceMotion,
          lowPerf,
          tweenCount: gsapStats.tweenCount,
          scrollTriggerCount: gsapStats.scrollTriggerCount,
          desktopQuery: window.matchMedia("(min-width: 1024px)").matches,
          tabletQuery: window.matchMedia("(min-width: 768px) and (max-width: 1023px)").matches,
          mobileQuery: window.matchMedia("(max-width: 767px)").matches,
        },
        hero: {
          transform: computed.transform,
          inlineTransform: hero.style.transform,
          filter: computed.filter,
          inlineFilter: hero.style.filter,
          scaleX,
          scaleY,
          hasScale: Math.abs(scaleX - 1) > 0.003 || Math.abs(scaleY - 1) > 0.003,
          hasBlur: computed.filter.includes("blur(") || hero.style.filter.includes("blur("),
        },
        hookHeroTweenCount: 0,
        hookHeroScrollTriggerCount: gsapStats.scrollTriggerCount,
        updatedAt: new Date().toISOString(),
      };

      window.__CYRYX_SCROLL_DIAGNOSTICS__ = diagnostics;
      window.dispatchEvent(new CustomEvent("cyryx:scroll-diagnostics", { detail: diagnostics }));
    };

    const showFinalStates = () => {
      document
        .querySelectorAll<HTMLElement>(
          ".cx-reveal, .cx-stagger-item, [data-hero-line], .cx-hero-kicker, .cx-hero-sub, .cx-hero-ctas, .cx-hero-proof",
        )
        .forEach((element) => {
          element.style.opacity = "1";
          element.style.transform = "none";
        });
      publishDiagnostics();
    };

    if (reduceMotion) {
      showFinalStates();
      return () => {
        if (diagnosticRaf) cancelAnimationFrame(diagnosticRaf);
      };
    }

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      const preExistingTriggers = new Set(ScrollTrigger.getAll());
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: "(min-width: 1024px)",
          tablet: "(min-width: 768px) and (max-width: 1023px)",
          mobile: "(max-width: 767px)",
        },
        (context) => {
          const { desktop, mobile } = context.conditions as {
            desktop: boolean;
            tablet: boolean;
            mobile: boolean;
          };

          const heroSequence = gsap.timeline({ defaults: { ease: "power3.out" } });
          heroSequence
            .from(".cx-hero-kicker", { opacity: 0, y: mobile ? 12 : 18, duration: 0.55 })
            .from("[data-hero-line]", { opacity: 0, y: mobile ? 18 : 28, duration: 0.85 }, "-=0.25")
            .from(".cx-hero-sub", { opacity: 0, y: 16, duration: 0.65 }, "-=0.45")
            .from(".cx-hero-ctas", { opacity: 0, y: 14, duration: 0.6 }, "-=0.4")
            .from(".cx-hero-proof", { opacity: 0, y: 12, duration: 0.55 }, "-=0.35");

          gsap.utils.toArray<HTMLElement>(".cx-reveal").forEach((element) => {
            gsap.from(element, {
              opacity: 0,
              y: mobile ? 22 : 34,
              duration: mobile ? 0.7 : 0.85,
              ease: "power3.out",
              scrollTrigger: {
                trigger: element,
                start: mobile ? "top 90%" : "top 84%",
                once: true,
              },
            });
          });

          gsap.utils.toArray<HTMLElement>(".cx-stagger").forEach((group) => {
            const items = group.querySelectorAll<HTMLElement>(".cx-stagger-item");
            if (!items.length) return;

            gsap.from(items, {
              opacity: 0,
              y: mobile ? 16 : 24,
              duration: mobile ? 0.55 : 0.7,
              stagger: mobile ? 0.04 : 0.07,
              ease: "power2.out",
              scrollTrigger: {
                trigger: group,
                start: mobile ? "top 91%" : "top 86%",
                once: true,
              },
            });
          });

          if (desktop && !lowPerf) {
            const hero = document.querySelector<HTMLElement>("[data-hero]");
            const heroVideo = hero?.querySelector<HTMLVideoElement>("[data-hero-video]");
            const scrollProgress = hero?.querySelector<HTMLElement>("[data-scroll-progress]");
            let heroScrollTimeline: gsap.core.Timeline | undefined;

            const setupHeroScrollSequence = () => {
              if (
                !hero ||
                !heroVideo ||
                heroScrollTimeline ||
                !Number.isFinite(heroVideo.duration)
              ) {
                return;
              }

              hero.dataset.scrollScrub = "true";
              heroVideo.pause();
              heroVideo.currentTime = 0;

              heroScrollTimeline = gsap.timeline({
                scrollTrigger: {
                  trigger: hero,
                  start: "top top",
                  end: "+=120%",
                  pin: true,
                  pinSpacing: true,
                  scrub: 0.35,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                },
              });

              heroScrollTimeline
                .to(
                  heroVideo,
                  { currentTime: Math.max(0, heroVideo.duration - 0.08), ease: "none" },
                  0,
                )
                .to(".cx-hero-panel", { yPercent: -5, scale: 0.985, ease: "none" }, 0);

              if (scrollProgress) {
                heroScrollTimeline.to(scrollProgress, { scaleX: 1, ease: "none" }, 0);
              }
            };

            if (heroVideo?.readyState && heroVideo.readyState >= HTMLMediaElement.HAVE_METADATA) {
              setupHeroScrollSequence();
            } else {
              heroVideo?.addEventListener("loadedmetadata", setupHeroScrollSequence, {
                once: true,
              });
            }

            const productVisual = document.querySelector<HTMLElement>("[data-maax-visual]");
            if (productVisual) {
              gsap.fromTo(
                productVisual,
                { yPercent: 2, scale: 0.992 },
                {
                  yPercent: -2,
                  scale: 1,
                  ease: "none",
                  scrollTrigger: {
                    trigger: productVisual,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0.7,
                  },
                },
              );
            }

            return () => {
              heroVideo?.removeEventListener("loadedmetadata", setupHeroScrollSequence);
              if (hero) delete hero.dataset.scrollScrub;
              heroScrollTimeline?.kill();
            };
          }
        },
      );

      const stats = () => ({
        tweenCount: gsap.globalTimeline.getChildren(true, true, true).length,
        scrollTriggerCount: ScrollTrigger.getAll().length,
      });
      const scheduleDiagnostics = () => {
        if (diagnosticRaf) return;
        diagnosticRaf = requestAnimationFrame(() => publishDiagnostics(stats()));
      };
      const refresh = () => ScrollTrigger.refresh();

      requestAnimationFrame(refresh);
      void document.fonts?.ready.then(refresh).catch(() => {});
      window.addEventListener("resize", scheduleDiagnostics);
      window.addEventListener("cyryx:diagnostics-toggle", scheduleDiagnostics);
      scheduleDiagnostics();

      cleanup = () => {
        if (diagnosticRaf) cancelAnimationFrame(diagnosticRaf);
        window.removeEventListener("resize", scheduleDiagnostics);
        window.removeEventListener("cyryx:diagnostics-toggle", scheduleDiagnostics);
        mm.revert();
        ScrollTrigger.getAll().forEach((trigger) => {
          if (!preExistingTriggers.has(trigger)) trigger.kill();
        });
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);
}
