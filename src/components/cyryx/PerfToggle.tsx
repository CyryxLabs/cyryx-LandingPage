import { useEffect, useState } from "react";

/**
 * Dev-only floating toggle to flip html.cx-low-perf (which disables backdrop
 * blur, hero aura, noise) so you can A/B liquid-glass vs low-perf live.
 * Enable with ?perf=1 or Alt/⌘ + P.
 */
export function PerfToggle() {
  if (!import.meta.env.DEV) return null;

  const [open, setOpen] = useState(false);
  const [lowPerf, setLowPerf] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setLowPerf(document.documentElement.classList.contains("cx-low-perf"));
    if (new URLSearchParams(window.location.search).get("perf") === "1") {
      setOpen(true);
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "p" && (e.altKey || e.metaKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggle = () => {
    const next = !lowPerf;
    document.documentElement.classList.toggle("cx-low-perf", next);
    setLowPerf(next);
  };

  if (!open) return null;

  return (
    <div
      className="cx-liquid-glass fixed bottom-4 left-4 z-[70] flex items-center gap-3 rounded-md px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/90"
      role="dialog"
      aria-label="Performance mode toggle"
    >
      <span className="text-[var(--accent-glow)]">Perf</span>
      <button
        type="button"
        onClick={toggle}
        className="cx-btn rounded border border-white/20 px-2 py-1 hover:border-[var(--accent-glow)]"
        aria-pressed={lowPerf}
      >
        {lowPerf ? "low-perf (no blur)" : "liquid-glass (blur)"}
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-label="Close perf toggle"
        className="text-white/60 hover:text-white"
      >
        ×
      </button>
    </div>
  );
}