import { useEffect, useRef, useState } from "react";

/**
 * Drives a looping, step-based simulation while it is on screen.
 *
 * Returns `{ ref, tick, still }`. `tick` increases every `intervalMs` while the
 * element is visible; `still` is true for reduced motion and low-performance
 * devices, where callers render the finished state instead of animating.
 */
export function useSimulationClock<T extends HTMLElement>(intervalMs: number) {
  const ref = useRef<T>(null);
  const [tick, setTick] = useState(0);
  const [still, setStill] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () =>
      setStill(reduce.matches || document.documentElement.classList.contains("cx-low-perf"));
    sync();
    reduce.addEventListener("change", sync);
    return () => reduce.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.3,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (still || !visible) return;
    const id = window.setInterval(() => setTick((value) => value + 1), intervalMs);
    return () => window.clearInterval(id);
  }, [still, visible, intervalMs]);

  return { ref, tick, still };
}

/** Types `text` over `durationMs` once `active` becomes true. */
export function useTypewriter(text: string, active: boolean, durationMs = 700) {
  const [count, setCount] = useState(active ? 0 : text.length);

  useEffect(() => {
    if (!active) {
      setCount(text.length);
      return;
    }
    setCount(0);
    const step = Math.max(12, durationMs / Math.max(1, text.length));
    const id = window.setInterval(() => {
      setCount((value) => {
        if (value >= text.length) {
          window.clearInterval(id);
          return value;
        }
        return value + 1;
      });
    }, step);
    return () => window.clearInterval(id);
  }, [text, active, durationMs]);

  return text.slice(0, count);
}
