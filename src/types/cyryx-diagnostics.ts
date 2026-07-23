export type CyryxScrollDiagnosticPayload = {
  source: "useCyryxScrollAnimations";
  scrollY: number;
  viewport: string;
  breakpoint: "mobile" | "tablet" | "desktop";
  gsap: {
    enabled: boolean;
    reason: "running" | "reduced-motion" | "low-perf";
    reduceMotion: boolean;
    lowPerf: boolean;
    tweenCount: number;
    scrollTriggerCount: number;
    desktopQuery: boolean;
    tabletQuery: boolean;
    mobileQuery: boolean;
  };
  hero: {
    transform: string;
    inlineTransform: string;
    filter: string;
    inlineFilter: string;
    scaleX: number;
    scaleY: number;
    hasScale: boolean;
    hasBlur: boolean;
  };
  hookHeroTweenCount: number;
  hookHeroScrollTriggerCount: number;
  updatedAt: string;
};
