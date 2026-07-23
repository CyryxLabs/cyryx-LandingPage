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
          ".cx-reveal, .cx-stagger-item, [data-hero-line], .cx-hero-sub, .cx-hero-ctas, [data-chapter-line]",
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

          const heroLine = document.querySelector<HTMLElement>("[data-hero-line]");
          const heroSub = document.querySelector<HTMLElement>(".cx-hero-sub");
          const heroCtas = document.querySelector<HTMLElement>(".cx-hero-ctas");

          if (heroLine && heroSub && heroCtas) {
            const heroSequence = gsap.timeline({ defaults: { ease: "power3.out" } });
            heroSequence
              .from(heroLine, { opacity: 0, y: mobile ? 18 : 28, duration: 0.85 })
              .from(heroSub, { opacity: 0, y: 16, duration: 0.65 }, "-=0.45")
              .from(heroCtas, { opacity: 0, y: 14, duration: 0.6 }, "-=0.4");
          }

          gsap.utils.toArray<HTMLElement>("[data-story-section]").forEach((section) => {
            const reveals = section.querySelectorAll<HTMLElement>(".cx-reveal");
            if (!reveals.length) return;

            gsap.from(reveals, {
              opacity: 0,
              y: mobile ? 22 : 34,
              duration: mobile ? 0.7 : 0.85,
              stagger: mobile ? 0.04 : 0.08,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
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

          gsap.utils.toArray<HTMLElement>("[data-story-chapter]").forEach((chapter) => {
            const marker = chapter.querySelector<HTMLElement>(".cx-story-chapter-marker");
            const line = chapter.querySelector<HTMLElement>("[data-chapter-line]");
            if (!marker || !line) return;

            const markerText = marker.querySelectorAll<HTMLElement>("[data-chapter-text]");
            const chapterSequence = gsap.timeline({
              scrollTrigger: {
                trigger: marker,
                start: mobile ? "top 94%" : "top 88%",
                once: true,
              },
            });

            chapterSequence
              .from(markerText, {
                opacity: 0,
                x: mobile ? -8 : -14,
                duration: 0.5,
                stagger: 0.06,
                ease: "power2.out",
              })
              .to(line, { scaleX: 1, duration: 0.9, ease: "power3.out" }, 0.08);
          });

          if (desktop && !lowPerf) {
            const storyRoot = document.querySelector<HTMLElement>("[data-story-root]");
            const storyProgress = document.querySelector<HTMLElement>("[data-story-progress]");
            const storyProgressFill = document.querySelector<HTMLElement>(
              "[data-story-progress-fill]",
            );
            const storyChapters = gsap.utils.toArray<HTMLElement>("[data-story-chapter]");
            const progressItems = gsap.utils.toArray<HTMLElement>("[data-story-progress-item]");

            if (storyRoot && storyProgress && storyProgressFill && storyChapters.length) {
              const setActiveChapter = () => {
                const focusLine = window.innerHeight * 0.5;
                const containingIndex = storyChapters.findIndex((chapter) => {
                  const rect = chapter.getBoundingClientRect();
                  return rect.top <= focusLine && rect.bottom > focusLine;
                });
                let activeIndex = containingIndex >= 0 ? containingIndex : 0;
                if (containingIndex < 0) {
                  storyChapters.forEach((chapter, index) => {
                    if (chapter.getBoundingClientRect().top <= focusLine) activeIndex = index;
                  });
                }

                progressItems.forEach((item, index) => {
                  if (index === activeIndex) item.dataset.active = "true";
                  else delete item.dataset.active;
                });
              };

              gsap.to(storyProgress, {
                autoAlpha: 1,
                duration: 0.25,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: storyRoot,
                  start: "top 72%",
                  end: "bottom 28%",
                  toggleActions: "play reverse play reverse",
                },
              });

              gsap.to(storyProgressFill, {
                scaleY: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: storyRoot,
                  start: "top center",
                  end: "bottom center",
                  scrub: 0.35,
                  onUpdate: setActiveChapter,
                  onRefresh: setActiveChapter,
                },
              });
            }

            const capabilitySection = document.querySelector<HTMLElement>("#what-we-build");
            const capabilityMonolith = document.querySelector<HTMLElement>(
              "[data-capability-monolith]",
            );
            const capabilityCore = document.querySelector<HTMLElement>(
              "[data-capability-monolith-core]",
            );
            const capabilityPulse = document.querySelector<HTMLElement>(
              "[data-capability-monolith-pulse]",
            );

            if (capabilitySection && capabilityMonolith && capabilityCore && capabilityPulse) {
              const capabilityCoreSequence = gsap.timeline({
                scrollTrigger: {
                  trigger: capabilitySection,
                  start: "top 76%",
                  end: "bottom 30%",
                  scrub: 0.65,
                  invalidateOnRefresh: true,
                },
              });

              capabilityCoreSequence
                .fromTo(capabilityCore, { scaleY: 0 }, { scaleY: 1, duration: 1, ease: "none" }, 0)
                .fromTo(
                  capabilityPulse,
                  { autoAlpha: 0, y: 0 },
                  { autoAlpha: 1, y: 0, duration: 0.08, ease: "none" },
                  0,
                )
                .to(
                  capabilityPulse,
                  {
                    y: () =>
                      Math.max(
                        0,
                        (capabilityPulse.parentElement?.offsetHeight ??
                          capabilityMonolith.offsetHeight) - capabilityPulse.offsetHeight,
                      ),
                    duration: 0.84,
                    ease: "none",
                  },
                  0.08,
                )
                .to(capabilityPulse, { autoAlpha: 0, duration: 0.08, ease: "none" }, 0.92);
            }
          }

          if (desktop && lowPerf) {
            const capabilityCore = document.querySelector<HTMLElement>(
              "[data-capability-monolith-core]",
            );
            const capabilityPulse = document.querySelector<HTMLElement>(
              "[data-capability-monolith-pulse]",
            );
            if (capabilityCore) gsap.set(capabilityCore, { scaleY: 1 });
            if (capabilityPulse) gsap.set(capabilityPulse, { autoAlpha: 0 });
          }

          if (desktop) {
            const storySteps = gsap.utils.toArray<HTMLElement>("[data-story-step]");
            const storyCaptions = gsap.utils.toArray<HTMLElement>("[data-story-caption]");

            if (storySteps.length === storyCaptions.length && storyCaptions.length > 0) {
              gsap.set(storyCaptions, { autoAlpha: 0, y: 16 });
              gsap.set(storyCaptions[0], { autoAlpha: 1, y: 0 });
              let activeStoryIndex = 0;

              const activateStoryCaption = (activeIndex: number) => {
                if (activeIndex === activeStoryIndex) return;
                activeStoryIndex = activeIndex;
                gsap.killTweensOf(storyCaptions);
                storyCaptions.forEach((caption, captionIndex) => {
                  if (captionIndex === activeIndex) return;
                  gsap.set(caption, { autoAlpha: 0, y: -10 });
                });

                gsap.set(storyCaptions[activeIndex], { autoAlpha: 1, y: 0 });
                gsap.fromTo(
                  storyCaptions[activeIndex],
                  { y: 8 },
                  { y: 0, duration: 0.25, ease: "power3.out", overwrite: "auto" },
                );
              };

              const activateNearestStoryCaption = () => {
                const focusLine = window.innerHeight * 0.58;
                const nearestIndex = storySteps.reduce(
                  (nearest, step, index) => {
                    const rect = step.getBoundingClientRect();
                    const distance = Math.abs(rect.top + rect.height / 2 - focusLine);
                    return distance < nearest.distance ? { index, distance } : nearest;
                  },
                  { index: 0, distance: Number.POSITIVE_INFINITY },
                ).index;

                activateStoryCaption(nearestIndex);
              };

              const storyHost = storySteps[0]?.closest<HTMLElement>("#how-we-work");
              if (storyHost) {
                ScrollTrigger.create({
                  trigger: storyHost,
                  start: "top bottom",
                  end: "bottom top",
                  refreshPriority: 10,
                  invalidateOnRefresh: true,
                  onEnter: activateNearestStoryCaption,
                  onEnterBack: activateNearestStoryCaption,
                  onUpdate: activateNearestStoryCaption,
                  onRefresh: activateNearestStoryCaption,
                });
              }
            }
          }

          if (desktop && !lowPerf) {
            const hero = document.querySelector<HTMLElement>("[data-hero]");
            const heroVideo = hero?.querySelector<HTMLVideoElement>("[data-hero-video]");
            const heroMediaFrame = hero?.querySelector<HTMLElement>("[data-hero-media-frame]");
            const heroGrade = hero?.querySelector<HTMLElement>(".cx-hero-grade");
            const scrollProgress = hero?.querySelector<HTMLElement>("[data-scroll-progress]");
            let heroScrollTimeline: gsap.core.Timeline | undefined;

            const setupHeroScrollSequence = () => {
              if (
                !hero ||
                !heroVideo ||
                !heroMediaFrame ||
                !heroGrade ||
                heroScrollTimeline ||
                !Number.isFinite(heroVideo.duration)
              ) {
                return;
              }

              hero.dataset.scrollScrub = "true";
              heroVideo.pause();
              const scrubStart = Math.min(0.08, heroVideo.duration * 0.01);
              const scrubEnd = Math.max(scrubStart, heroVideo.duration - 0.12);
              heroVideo.currentTime = scrubStart;

              heroScrollTimeline = gsap.timeline({
                scrollTrigger: {
                  trigger: hero,
                  start: "top top",
                  end: "+=160%",
                  pin: true,
                  pinSpacing: true,
                  scrub: 0.5,
                  anticipatePin: 1,
                  // The hero pin changes every downstream section's document position.
                  // Refresh it first so later ScrollTriggers measure against its spacer.
                  refreshPriority: 1,
                  invalidateOnRefresh: true,
                },
              });

              heroScrollTimeline
                .to(heroVideo, { currentTime: scrubEnd, ease: "none" }, 0)
                .fromTo(heroMediaFrame, { scale: 1.018 }, { scale: 1, ease: "none" }, 0)
                .to(heroGrade, { opacity: 0.9, ease: "none" }, 0);

              if (scrollProgress) {
                heroScrollTimeline.to(scrollProgress, { scaleX: 1, ease: "none" }, 0);
              }

              requestAnimationFrame(() => {
                ScrollTrigger.sort();
                ScrollTrigger.refresh();
              });
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
