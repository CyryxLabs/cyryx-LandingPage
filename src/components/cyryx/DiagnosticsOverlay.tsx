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
  desktopNavFlex: boolean;
  coreLineVisible: boolean;
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

type AuditTarget = {
  label: string;
  selector: string;
  required?: boolean;
};

type AuditResult = AuditTarget & {
  found: boolean;
  count: number;
  visible: boolean;
};

const AUDIT_TARGETS: AuditTarget[] = [
  { label: "Header", selector: "header", required: true },
  { label: "Main", selector: "main#main-content", required: true },
  { label: "Hero", selector: "section[data-hero]", required: true },
  { label: "Hero heading", selector: "#hero-heading", required: true },
  { label: "Core line (desktop)", selector: "[data-core-line]" },
  { label: "Capability strip", selector: "[data-capability-strip], section[aria-label*='Capabilit' i]" },
  { label: "Why Cyryx (#problem)", selector: "section#problem", required: true },
  { label: "Core capabilities", selector: "section#products", required: true },
  { label: "Product ecosystem", selector: "section#product-ecosystem", required: true },
  { label: "MAAX spotlight (#maax)", selector: "section#maax", required: true },
  { label: "Command layer (#solutions)", selector: "section#solutions", required: true },
  { label: "Applied AI lab (#applied-lab)", selector: "section#applied-lab", required: true },
  { label: "Process timeline (#process)", selector: "section#process[data-timeline-section]", required: true },
  { label: "Metrics band (#metrics)", selector: "section#metrics", required: true },
  { label: "Who we serve (#audience)", selector: "section#audience", required: true },
  { label: "Ecosystem (#ecosystem)", selector: "section#ecosystem", required: true },
  { label: "CTA (#cta)", selector: "section#cta", required: true },
  { label: "Contact (#contact)", selector: "section#contact", required: true },
  { label: "Footer", selector: "footer", required: true },
  { label: "Sticky mobile CTA", selector: "[data-sticky-mobile-cta], [aria-label*='mobile cta' i]" },
];

function runAudit(): AuditResult[] {
  if (typeof document === "undefined") return [];
  return AUDIT_TARGETS.map((target) => {
    let nodes: NodeListOf<Element> | [] = [];
    try {
      nodes = document.querySelectorAll(target.selector);
    } catch {
      nodes = [] as never;
    }
    const first = nodes[0] as HTMLElement | undefined;
    let visible = false;
    if (first) {
      const rect = first.getBoundingClientRect();
      const style = getComputedStyle(first);
      visible =
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        rect.width > 0 &&
        rect.height > 0;
    }
    return {
      ...target,
      found: nodes.length > 0,
      count: nodes.length,
      visible,
    };
  });
}

function findDuplicateIds(): string[] {
  if (typeof document === "undefined") return [];
  const counts = new Map<string, number>();
  for (const el of Array.from(document.querySelectorAll<HTMLElement>("[id]"))) {
    const id = el.id;
    if (!id) continue;
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return Array.from(counts.entries()).filter(([, n]) => n > 1).map(([id, n]) => `${id} ×${n}`);
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
  const desktopNav = document.querySelector<HTMLElement>('header nav[class*="lg:flex"], header .lg\\:flex');
  const coreLine = document.querySelector<HTMLElement>('[data-core-line]');

  return {
    href,
    file,
    hash,
    version,
    cssRulesReadable: readable,
    cssLength: cssText.length,
    hasMdMedia: /@media[^{}]*(48rem|768px)/.test(cssText),
    hasLgMedia: /@media[^{}]*(64rem|1024px)/.test(cssText),
    hasLgFlex: /(?:\.lg\\:flex|lg\\:flex|lg\\\\:flex)/.test(cssText),
    desktopNavFlex: desktopNav ? getComputedStyle(desktopNav).display === "flex" : false,
    coreLineVisible: coreLine ? getComputedStyle(coreLine).display !== "none" : false,
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
  if (!import.meta.env.DEV) return null;

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [sample, setSample] = useState<CyryxScrollDiagnosticPayload | undefined>();
  const [css, setCss] = useState<CssDiagnosticPayload | undefined>();
  const [audit, setAudit] = useState<AuditResult[]>([]);
  const [dupIds, setDupIds] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    document.documentElement.dataset.cyryxDiag = "1";

    const refreshCss = () => setCss(readCssDiagnostics());
    const refreshSample = () => {
      const next = readDiagnostics();
      if (next) setSample(next);
    };
    const refreshAudit = () => {
      setAudit(runAudit());
      setDupIds(findDuplicateIds());
    };

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
    refreshCss();
    refreshSample();
    refreshAudit();
    const interval = window.setInterval(() => {
      refreshCss();
      refreshSample();
      refreshAudit();
    }, 1000);
    return () => {
      window.removeEventListener("cyryx:scroll-diagnostics", onDiagnostics as EventListener);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", refreshCss);
      window.clearInterval(interval);
    };
  }, []);

  const heroStatus = useMemo(() => {
    if (!sample) return "waiting";
    return sample.hero.hasScale || sample.hero.hasBlur ? "alert" : "clean";
  }, [sample]);

  const auditSummary = useMemo(() => {
    const missing = audit.filter((a) => !a.found);
    const invisible = audit.filter((a) => a.found && !a.visible);
    const missingRequired = missing.filter((a) => a.required);
    return { missing, invisible, missingRequired };
  }, [audit]);

  if (!mounted || !visible) {
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
          <div>md media: <Status ok={css?.hasMdMedia ?? false} /> · lg media: <Status ok={css?.hasLgMedia ?? false} /> · lg:flex rule: <Status ok={css?.hasLgFlex ?? false} /></div>
          <div>desktop nav flex: <Status ok={css?.desktopNavFlex ?? false} /> · core line visible: <Status ok={css?.coreLineVisible ?? false} /></div>
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

        <div className="space-y-1.5 border-t border-[var(--border)] pt-2">
          <div className="flex items-center justify-between uppercase tracking-[0.18em] text-[var(--silver-dim)]">
            <span>DOM audit</span>
            <span className={auditSummary.missingRequired.length ? "text-destructive" : "text-[var(--accent-glow)]"}>
              {audit.length - auditSummary.missing.length}/{audit.length} found
            </span>
          </div>
          {dupIds.length > 0 ? (
            <div className="text-destructive">⚠ duplicate ids: {dupIds.join(", ")}</div>
          ) : null}
          {auditSummary.missing.length === 0 && auditSummary.invisible.length === 0 ? (
            <div className="text-[var(--accent-glow)]">all expected elements present & visible</div>
          ) : (
            <ul className="space-y-1">
              {auditSummary.missing.map((a) => (
                <li key={`m-${a.selector}-${a.label}`} className={a.required ? "text-destructive" : "text-[var(--silver-dim)]"}>
                  ✗ missing{a.required ? " (required)" : ""}: <span className="text-[var(--silver)]">{a.label}</span>
                  <div className="break-all pl-3 text-[var(--silver-dim)]">selector: <code>{a.selector}</code></div>
                </li>
              ))}
              {auditSummary.invisible.map((a) => (
                <li key={`i-${a.selector}-${a.label}`} className="text-[#f5c451]">
                  ⚠ hidden: <span className="text-[var(--silver)]">{a.label}</span>
                  <div className="break-all pl-3 text-[var(--silver-dim)]">selector: <code>{a.selector}</code></div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="pt-1 text-[var(--silver-dim)]">toggle: Alt + Shift + D · query: ?cyryxDiag=1</div>
      </div>
    </aside>
  );
}
