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
    const heroRoot = document.querySelector<HTMLElement>("[data-hero]");

    if (heroRoot) {
      if (!reduceMotion && !lowPerf) heroRoot.dataset.scrollScrub = "true";
      else delete heroRoot.dataset.scrollScrub;
    }

    // Scroll diagnostics are a development aid: off in production unless the
    // page is opened with ?cx-diagnostics.
    const diagnosticsEnabled =
      Boolean(import.meta.env?.DEV) ||
      new URLSearchParams(window.location.search).has("cx-diagnostics");

    const publishDiagnostics = (
      gsapStats: { tweenCount: number; scrollTriggerCount: number } = {
        tweenCount: 0,
        scrollTriggerCount: 0,
      },
    ) => {
      diagnosticRaf = 0;
      if (!diagnosticsEnabled) return;
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
          ".cx-reveal, .cx-stagger-item, [data-hero-line], .cx-hero-sub, .cx-hero-ctas, [data-chapter-line], [data-governance-core], [data-governance-gate]",
        )
        .forEach((element) => {
          element.style.opacity = "1";
          element.style.transform = "none";
        });
      document
        .querySelectorAll<HTMLElement>("[data-governance-node], [data-governance-label]")
        .forEach((element) => {
          element.style.opacity = "1";
        });
      publishDiagnostics();
    };

    if (reduceMotion) {
      showFinalStates();
      return () => {
        if (diagnosticRaf) cancelAnimationFrame(diagnosticRaf);
        if (heroRoot) delete heroRoot.dataset.scrollScrub;
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
          const { desktop, tablet, mobile } = context.conditions as {
            desktop: boolean;
            tablet: boolean;
            mobile: boolean;
          };
          const localCleanups: Array<() => void> = [];

          const heroLine = document.querySelector<HTMLElement>("[data-hero-line]");
          const heroSub = document.querySelector<HTMLElement>(".cx-hero-sub");
          const heroCtas = document.querySelector<HTMLElement>(".cx-hero-ctas");

          // The hero message and CTAs are readable in the first frame: no entrance
          // animation delays what the visitor needs to read or click.
          if (heroLine && heroSub && heroCtas) {
            gsap.set([heroLine, heroSub, heroCtas], { opacity: 1, x: 0, y: 0 });
          }

          /*
           * The Hero uses native CSS sticky positioning over a short (190svh)
           * scene on tablet/desktop. Phones render a static poster.
           * ScrollTrigger owns only the normalized playhead and compositor-safe
           * text/media transforms; the canvas renderer coalesces frame draws in
           * its own requestAnimationFrame loop.
           */
          const hero = document.querySelector<HTMLElement>("[data-hero]");
          const heroScrollScene = hero?.querySelector<HTMLElement>("[data-hero-scroll-scene]");
          const heroMediaFrame = hero?.querySelector<HTMLElement>("[data-hero-media-frame]");
          const heroGrade = hero?.querySelector<HTMLElement>(".cx-hero-grade");
          const heroAura = hero?.querySelector<HTMLElement>("[data-hero-aura]");
          const heroContent = hero?.querySelector<HTMLElement>("[data-hero-content]");
          const heroScrollCue = hero?.querySelector<HTMLElement>("[data-hero-scroll-cue]");
          const scrollProgress = hero?.querySelector<HTMLElement>("[data-scroll-progress]");
          const heroStoryPanels = hero
            ? gsap.utils.toArray<HTMLElement>("[data-hero-story-panel]", hero)
            : [];

          if (
            hero &&
            heroScrollScene &&
            heroMediaFrame &&
            heroGrade &&
            heroContent &&
            !lowPerf &&
            !mobile
          ) {
            hero.dataset.scrollScrub = "true";
            if (heroStoryPanels.length) {
              gsap.set(heroStoryPanels, { autoAlpha: 0, y: mobile ? 14 : 24 });
            }

            const heroScrollTimeline = gsap.timeline({
              onUpdate: () => {
                window.dispatchEvent(
                  new CustomEvent("cyryx:hero-sequence-progress", {
                    detail: { progress: heroScrollTimeline.progress() },
                  }),
                );
              },
              scrollTrigger: {
                trigger: heroScrollScene,
                start: "top top",
                end: "bottom bottom",
                scrub: desktop ? 0.65 : tablet ? 0.45 : 0.3,
                refreshPriority: -20,
                invalidateOnRefresh: true,
              },
            });

            heroScrollTimeline
              .fromTo(
                heroMediaFrame,
                { scale: mobile ? 1.022 : 1.04 },
                { scale: 1, ease: "none", duration: 1 },
                0,
              )
              .to(heroGrade, { opacity: 0.88, ease: "none", duration: 1 }, 0);

            // Copy stays pinned and fully visible for the whole scene.
            gsap.set(heroContent, { autoAlpha: 1, x: 0, y: 0 });

            const storyWindows = [
              { enter: 0.25, leave: 0.43, enterDuration: 0.07, leaveDuration: 0.07 },
              { enter: 0.46, leave: 0.58, enterDuration: 0.07, leaveDuration: 0.07 },
              { enter: 0.6, leave: 0.71, enterDuration: 0.05, leaveDuration: 0.04 },
            ] as const;

            heroStoryPanels.forEach((panel, index) => {
              const storyWindow = storyWindows[index];
              if (!storyWindow) return;
              heroScrollTimeline.fromTo(
                panel,
                {
                  autoAlpha: 0,
                  y: mobile ? 14 : 24,
                  filter: mobile ? "none" : "blur(8px)",
                },
                {
                  autoAlpha: 1,
                  y: 0,
                  filter: "blur(0px)",
                  duration: storyWindow.enterDuration,
                  ease: "power2.out",
                },
                storyWindow.enter,
              );
              if (storyWindow.leave !== null) {
                heroScrollTimeline.to(
                  panel,
                  {
                    autoAlpha: 0,
                    y: mobile ? -10 : -18,
                    filter: mobile ? "none" : "blur(6px)",
                    duration: storyWindow.leaveDuration,
                    ease: "power1.in",
                  },
                  storyWindow.leave,
                );
              }
            });

            if (heroAura) {
              heroScrollTimeline.fromTo(
                heroAura,
                { scale: 0.92, autoAlpha: 0.7 },
                { scale: 1.16, autoAlpha: 0.28, ease: "none", duration: 1 },
                0,
              );
            }

            if (heroScrollCue) {
              heroScrollTimeline.to(
                heroScrollCue,
                { autoAlpha: 0, y: 8, ease: "power1.out", duration: 0.2 },
                0.16,
              );
            }

            if (scrollProgress) {
              heroScrollTimeline.to(scrollProgress, { scaleX: 1, ease: "none", duration: 1 }, 0);
            }

            localCleanups.push(() => {
              delete hero.dataset.scrollScrub;
              heroScrollTimeline.kill();
            });
          } else if (hero && heroContent) {
            delete hero.dataset.scrollScrub;
            gsap.set(heroContent, { autoAlpha: 1, x: 0, y: 0 });
            if (heroStoryPanels.length) gsap.set(heroStoryPanels, { autoAlpha: 0 });
          }

          if (lowPerf) {
            gsap.set(".cx-reveal, .cx-stagger-item, [data-chapter-text]", {
              opacity: 1,
              x: 0,
              y: 0,
            });
            gsap.set("[data-chapter-line]", { scaleX: 1 });
          } else {
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
          }

          if ((desktop || tablet) && !lowPerf) {
            const executionSystem = document.querySelector<HTMLElement>("[data-execution-system]");
            const executionRail =
              executionSystem?.querySelector<HTMLElement>("[data-execution-rail]");
            const executionPulse =
              executionSystem?.querySelector<HTMLElement>("[data-execution-pulse]");
            const executionNodes = executionSystem
              ? gsap.utils.toArray<HTMLElement>("[data-execution-node]", executionSystem)
              : [];

            if (executionSystem && executionRail && executionPulse && executionNodes.length) {
              const executionTrack = executionRail.parentElement;
              gsap.set(executionNodes, { autoAlpha: 0.38, y: 12 });

              const executionSequence = gsap.timeline({
                scrollTrigger: {
                  trigger: executionSystem,
                  start: "top 68%",
                  end: "bottom 36%",
                  scrub: 0.6,
                  invalidateOnRefresh: true,
                  refreshPriority: 3,
                },
              });

              if (desktop) {
                executionSequence
                  .fromTo(executionRail, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "none" }, 0)
                  .fromTo(
                    executionPulse,
                    { autoAlpha: 0, x: 0 },
                    {
                      autoAlpha: 1,
                      x: () =>
                        Math.max(
                          0,
                          (executionTrack?.offsetWidth ?? 0) - executionPulse.offsetWidth,
                        ),
                      duration: 1,
                      ease: "none",
                    },
                    0,
                  );
              } else {
                executionSequence
                  .fromTo(executionRail, { scaleY: 0 }, { scaleY: 1, duration: 1, ease: "none" }, 0)
                  .fromTo(
                    executionPulse,
                    { autoAlpha: 0, y: 0 },
                    {
                      autoAlpha: 1,
                      y: () =>
                        Math.max(
                          0,
                          (executionTrack?.offsetHeight ?? 0) - executionPulse.offsetHeight,
                        ),
                      duration: 1,
                      ease: "none",
                    },
                    0,
                  );
              }

              executionSequence
                .to(
                  executionNodes,
                  {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.16,
                    stagger: 0.17,
                    ease: "power2.out",
                  },
                  0.04,
                )
                .to(executionPulse, { autoAlpha: 0, duration: 0.08, ease: "none" }, 0.92);
            }

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

            const capabilitySection = document.querySelector<HTMLElement>("#security");
            const capabilityMonolith = document.querySelector<HTMLElement>(
              "[data-capability-monolith]",
            );
            const capabilityCore = document.querySelector<HTMLElement>(
              "[data-capability-monolith-core]",
            );
            const capabilityPulse = document.querySelector<HTMLElement>(
              "[data-capability-monolith-pulse]",
            );

            const governanceCore =
              capabilitySection?.querySelector<HTMLElement>("[data-governance-core]");
            const governancePulse =
              capabilitySection?.querySelector<HTMLElement>("[data-governance-pulse]");
            const governanceGates = capabilitySection
              ? gsap.utils.toArray<HTMLElement>("[data-governance-gate]", capabilitySection)
              : [];
            const governanceNodes = capabilitySection
              ? gsap.utils.toArray<HTMLElement>("[data-governance-node]", capabilitySection)
              : [];
            const governanceLabels = capabilitySection
              ? gsap.utils.toArray<HTMLElement>("[data-governance-label]", capabilitySection)
              : [];

            if (
              desktop &&
              capabilitySection &&
              capabilityMonolith &&
              capabilityCore &&
              capabilityPulse &&
              governanceCore &&
              governancePulse
            ) {
              const capabilityCoreSequence = gsap.timeline({
                scrollTrigger: {
                  trigger: capabilitySection,
                  start: "top 76%",
                  end: "bottom 30%",
                  scrub: 0.65,
                  invalidateOnRefresh: true,
                  refreshPriority: 5,
                },
              });

              capabilityCoreSequence
                .fromTo(capabilityCore, { scaleY: 0 }, { scaleY: 1, duration: 1, ease: "none" }, 0)
                .fromTo(governanceCore, { scaleY: 0 }, { scaleY: 1, duration: 1, ease: "none" }, 0)
                .fromTo(
                  governanceGates,
                  { scaleX: 0, autoAlpha: 0.3 },
                  {
                    scaleX: 1,
                    autoAlpha: 1,
                    duration: 0.12,
                    stagger: 0.18,
                    ease: "power2.out",
                  },
                  0.12,
                )
                .fromTo(
                  governanceNodes,
                  { scale: 0.55, autoAlpha: 0.35 },
                  {
                    scale: 1,
                    autoAlpha: 1,
                    duration: 0.12,
                    stagger: 0.18,
                    ease: "power2.out",
                  },
                  0.12,
                )
                .fromTo(
                  governanceLabels,
                  { autoAlpha: 0.4, y: 5 },
                  {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.16,
                    stagger: 0.18,
                    ease: "power2.out",
                  },
                  0.14,
                )
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

              capabilityCoreSequence
                .fromTo(
                  governancePulse,
                  { autoAlpha: 0, y: 0 },
                  { autoAlpha: 1, y: 0, duration: 0.08, ease: "none" },
                  0,
                )
                .to(
                  governancePulse,
                  {
                    y: () =>
                      Math.max(
                        0,
                        (governancePulse.parentElement?.offsetHeight ?? 0) -
                          governancePulse.offsetHeight,
                      ),
                    duration: 0.84,
                    ease: "none",
                  },
                  0.08,
                )
                .to(governancePulse, { autoAlpha: 0, duration: 0.08, ease: "none" }, 0.92);
            }

            if (tablet) {
              if (capabilityCore) gsap.set(capabilityCore, { scaleY: 1 });
              if (capabilityPulse) gsap.set(capabilityPulse, { autoAlpha: 0 });
              if (governanceCore) gsap.set(governanceCore, { scaleY: 1 });
              if (governancePulse) gsap.set(governancePulse, { autoAlpha: 0 });
              if (governanceGates.length) {
                gsap.set(governanceGates, { scaleX: 1, autoAlpha: 1 });
              }
              if (governanceNodes.length) {
                gsap.set(governanceNodes, { scale: 1, autoAlpha: 1 });
              }
              if (governanceLabels.length) {
                gsap.set(governanceLabels, { y: 0, autoAlpha: 1 });
              }
            }
          }

          if (lowPerf) {
            const capabilityCore = document.querySelector<HTMLElement>(
              "[data-capability-monolith-core]",
            );
            const capabilityPulse = document.querySelector<HTMLElement>(
              "[data-capability-monolith-pulse]",
            );
            if (capabilityCore) gsap.set(capabilityCore, { scaleY: 1 });
            if (capabilityPulse) gsap.set(capabilityPulse, { autoAlpha: 0 });
            const executionRail = document.querySelector<HTMLElement>("[data-execution-rail]");
            const executionPulse = document.querySelector<HTMLElement>("[data-execution-pulse]");
            const governanceCore = document.querySelector<HTMLElement>("[data-governance-core]");
            const governancePulse = document.querySelector<HTMLElement>("[data-governance-pulse]");
            const governanceGates = gsap.utils.toArray<HTMLElement>("[data-governance-gate]");
            const governanceNodes = gsap.utils.toArray<HTMLElement>("[data-governance-node]");
            const governanceLabels = gsap.utils.toArray<HTMLElement>("[data-governance-label]");
            if (executionRail) {
              gsap.set(executionRail, desktop ? { scaleX: 1 } : { scaleY: 1 });
            }
            if (executionPulse) gsap.set(executionPulse, { autoAlpha: 0 });
            if (governanceCore) gsap.set(governanceCore, { scaleY: 1 });
            if (governancePulse) gsap.set(governancePulse, { autoAlpha: 0 });
            if (governanceGates.length) gsap.set(governanceGates, { scaleX: 1, autoAlpha: 1 });
            if (governanceNodes.length) gsap.set(governanceNodes, { scale: 1, autoAlpha: 1 });
            if (governanceLabels.length) gsap.set(governanceLabels, { y: 0, autoAlpha: 1 });
          }

          return () => {
            localCleanups.forEach((dispose) => dispose());
          };
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
      if (heroRoot) delete heroRoot.dataset.scrollScrub;
    };
  }, []);
}
