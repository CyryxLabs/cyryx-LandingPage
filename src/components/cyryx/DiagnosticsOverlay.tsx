import { useEffect, useMemo, useState } from "react";
import { BUILD_LABEL, BUILD_VERSION } from "@/lib/build-info";

type ScrollDiagnosticPayload = {
  source: "useCyryxScrollAnimations";
  scrollY: number;
  viewport: string;
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

declare global {
  interface Window {
    __CYRYX_SCROLL_DIAGNOSTICS__?: ScrollDiagnosticPayload;
  }
}

const isDiagnosticUrl = () => {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("cyryxDiag") === "1" || params.get("diagnostics") === "1";
};

function readDiagnostics(): ScrollDiagnosticPayload | undefined {
  if (typeof window === "undefined") return undefined;
  return window.__CYRYX_SCROLL_DIAGNOSTICS__;
}

export function DiagnosticsOverlay() {
  const [visible, setVisible] = useState(false);
  const [sample, setSample] = useState<ScrollDiagnosticPayload | undefined>(() => readDiagnostics());

  useEffect(() => {
    const initial = isDiagnosticUrl();
    setVisible(initial);
    document.documentElement.dataset.cyryxDiag = initial ? "1" : "0";

    const onDiagnostics = (event: Event) => {
      const detail = (event as CustomEvent<ScrollDiagnosticPayload>).detail;
      if (detail) setSample(detail);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "d" || !event.altKey || !event.shiftKey) return;
      setVisible((current) => {
        const next = !current;
        document.documentElement.dataset.cyryxDiag = next ? "1" : "0";
        window.dispatchEvent(new Event("cyryx:diagnostics-toggle"));
        return next;
      });
    };

    window.addEventListener("cyryx:scroll-diagnostics", onDiagnostics as EventListener);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("cyryx:scroll-diagnostics", onDiagnostics as EventListener);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const heroStatus = useMemo(() => {
    if (!sample) return "waiting";
    return sample.hero.hasScale || sample.hero.hasBlur ? "alert" : "clean";
  }, [sample]);

  if (!visible) {
    return (
      <div className="fixed bottom-3 left-3 z-[70] rounded border border-[var(--border)] bg-[var(--onyx)]/85 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--silver-dim)] backdrop-blur-sm">
        build {BUILD_LABEL}
      </div>
    );
  }

  return (
    <aside className="fixed bottom-3 left-3 z-[80] w-[min(24rem,calc(100vw-1.5rem))] rounded-md border border-[var(--border)] bg-[var(--onyx)]/95 p-3 font-mono text-[10px] text-[var(--silver)] shadow-[var(--shadow-panel)] backdrop-blur-md">
      <div className="mb-2 flex items-start justify-between gap-3 border-b border-[var(--border)] pb-2">
        <div>
          <div className="uppercase tracking-[0.24em] text-[var(--accent-glow)]">Cyryx diagnostics</div>
          <div className="mt-1 break-all text-[var(--silver-dim)]">build {BUILD_VERSION}</div>
        </div>
        <button
          type="button"
          onClick={() => {
            setVisible(false);
            document.documentElement.dataset.cyryxDiag = "0";
          }}
          className="rounded border border-[var(--border)] px-2 py-1 uppercase tracking-[0.18em] text-[var(--silver-dim)] hover:text-[var(--silver)]"
        >
          close
        </button>
      </div>

      <div className="space-y-1.5">
        <div className={heroStatus === "clean" ? "text-[var(--accent-glow)]" : "text-destructive"}>
          hero root: {heroStatus === "clean" ? "no scale / no blur" : heroStatus}
        </div>
        <div>scrollY: {sample?.scrollY.toFixed(0) ?? "—"}</div>
        <div>viewport: {sample?.viewport ?? "—"}</div>
        <div>transform: {sample?.hero.transform ?? "—"}</div>
        <div>inline transform: {sample?.hero.inlineTransform || "none"}</div>
        <div>filter: {sample?.hero.filter ?? "—"}</div>
        <div>
          scale: {sample ? `${sample.hero.scaleX.toFixed(3)} × ${sample.hero.scaleY.toFixed(3)}` : "—"}
        </div>
        <div>hook hero tweens: {sample?.hookHeroTweenCount ?? "—"}</div>
        <div>hook hero ScrollTriggers: {sample?.hookHeroScrollTriggerCount ?? "—"}</div>
        <div className="pt-1 text-[var(--silver-dim)]">toggle: Alt + Shift + D · query: ?cyryxDiag=1</div>
      </div>
    </aside>
  );
}
