import { useEffect } from "react";

/**
 * Delegated smooth-scroll for in-page hash anchors.
 *
 * - Listens once on `document` for clicks on `a[href^="#"]`.
 * - Computes the target offset against the fixed header, then animates with
 *   `window.scrollTo({ behavior: "smooth" })` — falls back to "auto" when the
 *   user prefers reduced motion.
 * - Mirrors the hash into the URL via `history.replaceState` so deep links
 *   keep working without triggering the global scroll-restoration script.
 * - Adds a `data-cx-flash` attribute to the target for ~1.2s so the user can
 *   visually locate the section they jumped to (used by MAAX Runtime → Ecosystem).
 */
export function useSmoothScroll(): void {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const headerOffset = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue("--header-h");
      const n = parseInt(v, 10);
      if (!Number.isNaN(n) && n > 0) return n;
      return window.innerWidth >= 1024 ? 96 : 64;
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (event.button !== 0) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const raw = anchor.getAttribute("href") ?? "";
      if (!raw.startsWith("#") || raw === "#") return;
      // Allow opt-out for components that need native jump-link behaviour.
      if (anchor.dataset.noSmoothScroll === "true") return;

      const id = raw.slice(1);
      const el = document.getElementById(id);
      if (!el) return;

      event.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - headerOffset() - 8;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
      try {
        history.replaceState(null, "", `#${id}`);
      } catch {}

      el.setAttribute("data-cx-flash", "true");
      window.setTimeout(() => el.removeAttribute("data-cx-flash"), 1400);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
}