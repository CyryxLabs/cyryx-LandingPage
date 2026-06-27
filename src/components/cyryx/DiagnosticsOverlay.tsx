import { useEffect, useMemo, useState } from "react";
import { BUILD_LABEL, BUILD_VERSION } from "@/lib/build-info";
import type { CyryxScrollDiagnosticPayload } from "@/types/cyryx-diagnostics";

type CssDiagnosticPayload = {
  href: string;
  file: string;
  hash: string;
  version: string;
  cssRulesReadable: boolean;
  cssLength: number;
  hasMdMedia: boolean;
  hasLgMedia: boolean;
  hasLgFlex: boolean;
  active: {
    sm: boolean;
    md: boolean;
    lg: boolean;
    xl: boolean;
    desktop: boolean;
  };
};

declare global {
  interface Window {
    __CYRYX_SCROLL_DIAGNOSTICS__?: CyryxScrollDiagnosticPayload;
  }
}

const isDiagnosticUrl = () => {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("cyryxDiag") === "1" || params.get("diagnostics") === "1";
};

function readDiagnostics(): CyryxScrollDiagnosticPayload | undefined {
  if (typeof window === "undefined") return undefined;
  return window.__CYRYX_SCROLL_DIAGNOSTICS__;
}

function readCssDiagnostics(): CssDiagnosticPayload | undefined {
  if (typeof window === "undefined") return undefined;

  const appLink = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'))
    .find((link) => /(?:\/src\/styles\.css|\/assets\/styles-|styles\.css)/.test(link.href));

  let cssText = "";
  let readable = true;
  for (const sheet of Array.from(document.styleSheets)) {
    const href = sheet.href ?? "";
    if (href && !/(?:\/src\/styles\.css|\/assets\/styles-|styles\.css)/.test(href)) continue;
    try {
      for (const rule of Array.from(sheet.cssRules ?? [])) {
        cssText += `${rule.cssText}\n`;
      }
    } catch {
      readable = false;
    }
  }

  const href = appLink?.href ?? "not found";
  const url = appLink ? new URL(appLink.href) : undefined;
  const file = url?.pathname.split("/").pop() ?? "not found";
  const hash = file.match(/^styles-([^.]+)\.css$/)?.[1] ?? (file === "styles.css" ? "dev-src" : "unknown");
  const version = url?.searchParams.get("v") ?? BUILD_LABEL;

  return {
    href,
    file,
    hash,
    version,
    cssRulesReadable: readable,
    cssLength: cssText.length,
    hasMdMedia: /@media[^{}]*(48rem|768px)/.test(cssText),
    hasLgMedia: /@media[^{}]*(64rem|1024px)/.test(cssText),
    hasLgFlex: cssText.includes(".lg\\:flex"),
    active: {
      sm: window.matchMedia("(min-width: 640px)").matches,
      md: window.matchMedia("(min-width: 768px)").matches,
      lg: window.matchMedia("(min-width: 1024px)").matches,
      xl: window.matchMedia("(min-width: 1280px)").matches,
      desktop: window.matchMedia("(min-width: 1024px)").matches,
    },
  };
}

function Status({ ok }: { ok: boolean }) {
  return <span className={ok ? "text-[var(--accent-glow)]" : "text-destructive"}>{ok ? "yes" : "no"}</span>;
}

export function DiagnosticsOverlay() {
  const [visible, setVisible] = useState(false);
  const [sample, setSample] = useState<CyryxScrollDiagnosticPayload | undefined>(() => readDiagnostics());
  const [css, setCss] = useState<CssDiagnosticPayload | undefined>(() => readCssDiagnostics());

  useEffect(() => {
    const initial = isDiagnosticUrl();
    setVisible((current) => current || initial);
    document.documentElement.dataset.cyryxDiag = initial ? "1" : "0";

    const refreshCss = () => setCss(readCssDiagnostics());

    const onDiagnostics = (event: Event) => {
      const detail = (event as CustomEvent<CyryxScrollDiagnosticPayload>).detail;
      if (detail) setSample(detail);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "d" || !event.altKey || !event.shiftKey) return;
      setVisible((current) => {
        const next = !current;
        document.documentElement.dataset.cyryxDiag = next ? "1" : "0";
        if (next) refreshCss();
        window.dispatchEvent(new Event("cyryx:diagnostics-toggle"));
        return next;
      });
    };

    window.addEventListener("cyryx:scroll-diagnostics", onDiagnostics as EventListener);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", refreshCss);
    if (initial) refreshCss();
    return () => {
      window.removeEventListener("cyryx:scroll-diagnostics", onDiagnostics as EventListener);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", refreshCss);
    };
  }, []);

  const heroStatus = useMemo(() => {
    if (!sample) return "waiting";
    return sample.hero.hasScale || sample.hero.hasBlur ? "alert" : "clean";
  }, [sample]);

  if (!visible) {
    return null;
  }

  return (
    <aside className="fixed bottom-3 left-3 z-[80] max-h-[calc(100svh-1.5rem)] w-[min(32rem,calc(100vw-1.5rem))] overflow-auto rounded-md border border-[var(--border)] bg-[var(--onyx)]/95 p-3 font-mono text-[10px] text-[var(--silver)] shadow-[var(--shadow-panel)] backdrop-blur-md">
      <div className="mb-2 flex items-start justify-between gap-3 border-b border-[var(--border)] pb-2">
        <div className="min-w-0">
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

      <div className="space-y-3">
        <div className="space-y-1.5 border-b border-[var(--border)] pb-2">
          <div className="uppercase tracking-[0.18em] text-[var(--silver-dim)]">CSS</div>
          <div>file: <span className="break-all text-[var(--accent-glow)]">{css?.file ?? "—"}</span></div>
          <div>hash: {css?.hash ?? "—"}</div>
          <div>version: {css?.version ?? "—"}</div>
          <div>rules readable: <Status ok={css?.cssRulesReadable ?? false} /> · bytes: {css?.cssLength ?? "—"}</div>
          <div>md media: <Status ok={css?.hasMdMedia ?? false} /> · lg media: <Status ok={css?.hasLgMedia ?? false} /> · lg:flex: <Status ok={css?.hasLgFlex ?? false} /></div>
          <div>href: <span className="break-all text-[var(--silver-dim)]">{css?.href ?? "—"}</span></div>
        </div>

        <div className="space-y-1.5 border-b border-[var(--border)] pb-2">
          <div className="uppercase tracking-[0.18em] text-[var(--silver-dim)]">Breakpoints</div>
          <div>viewport: {sample?.viewport ?? (typeof window !== "undefined" ? `${window.innerWidth}×${window.innerHeight}` : "—")}</div>
          <div>mode: <span className="text-[var(--accent-glow)]">{sample?.breakpoint ?? "—"}</span></div>
          <div>sm: <Status ok={css?.active.sm ?? false} /> · md: <Status ok={css?.active.md ?? false} /> · lg: <Status ok={css?.active.lg ?? false} /> · xl: <Status ok={css?.active.xl ?? false} /></div>
        </div>

        <div className="space-y-1.5 border-b border-[var(--border)] pb-2">
          <div className="uppercase tracking-[0.18em] text-[var(--silver-dim)]">GSAP</div>
          <div>enabled: <Status ok={sample?.gsap.enabled ?? false} /> · reason: {sample?.gsap.reason ?? "waiting"}</div>
          <div>desktop query: <Status ok={sample?.gsap.desktopQuery ?? false} /> · tablet: <Status ok={sample?.gsap.tabletQuery ?? false} /> · mobile: <Status ok={sample?.gsap.mobileQuery ?? false} /></div>
          <div>tweens: {sample?.gsap.tweenCount ?? "—"} · ScrollTriggers: {sample?.gsap.scrollTriggerCount ?? "—"}</div>
          <div>reduced motion: <Status ok={sample?.gsap.reduceMotion ?? false} /> · low perf: <Status ok={sample?.gsap.lowPerf ?? false} /></div>
        </div>

        <div className="space-y-1.5">
          <div className="uppercase tracking-[0.18em] text-[var(--silver-dim)]">Hero</div>
        <div className={heroStatus === "clean" ? "text-[var(--accent-glow)]" : "text-destructive"}>
          hero root: {heroStatus === "clean" ? "no scale / no blur" : heroStatus}
        </div>
        <div>scrollY: {sample?.scrollY.toFixed(0) ?? "—"}</div>
        <div>transform: {sample?.hero.transform ?? "—"}</div>
        <div>inline transform: {sample?.hero.inlineTransform || "none"}</div>
        <div>filter: {sample?.hero.filter ?? "—"}</div>
        <div>
          scale: {sample ? `${sample.hero.scaleX.toFixed(3)} × ${sample.hero.scaleY.toFixed(3)}` : "—"}
        </div>
        <div>hook hero tweens: {sample?.hookHeroTweenCount ?? "—"}</div>
        <div>hook hero ScrollTriggers: {sample?.hookHeroScrollTriggerCount ?? "—"}</div>
          <div>updated: {sample?.updatedAt ?? "—"}</div>
        </div>
        <div className="pt-1 text-[var(--silver-dim)]">toggle: Alt + Shift + D · query: ?cyryxDiag=1</div>
      </div>
    </aside>
  );
}
