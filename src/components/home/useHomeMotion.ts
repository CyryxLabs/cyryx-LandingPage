import { useEffect } from "react";

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

/**
 * Home motion (rebuild v9, cinematic pass of 2026-11-18). No library.
 *
 * - `[data-hm-in]` entrances, with masked word rises for `.hm-w` headings.
 * - Hero depth: `--hp` (0 → 1 while the hero scrolls away) drives the plate
 *   push-in, the copy lift and layered surfaces; `--mx/--my` follow a fine pointer.
 * - `[data-hm-scene]` publishes `--sp` (0 → 1 as it enters the viewport).
 * - `[data-hm-progress]` publishes `--dp` and switches its children `.is-on`.
 * - `[data-hm-scrub]` publishes `--wp` so its words light up while it passes.
 * - `[data-hm-tilt]` cards lean toward the pointer; `[data-hm-spot]` surfaces
 *   carry a light under it.
 *
 * Content is fully visible without JavaScript. `hm-js` on <html> arms the
 * hidden and scroll-linked states; reduced motion and the low-performance
 * path (Save-Data, weak devices) never get it.
 */
export function useHomeMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const still =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      root.classList.contains("cx-low-perf") ||
      !("IntersectionObserver" in window);
    const all = <T extends HTMLElement>(selector: string) =>
      Array.from(document.querySelectorAll<T>(selector));

    const targets = all(".hm [data-hm-in]");
    if (still) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }
    root.classList.add("hm-js");

    const pending = new Set(targets);
    const reveal = (el: Element) => {
      el.classList.add("is-in");
      pending.delete(el as HTMLElement);
      io.unobserve(el);
    };
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target);
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    targets.forEach((el) => io.observe(el));

    const hero = document.querySelector<HTMLElement>(".hm-hero");
    const plates = all(".hm [data-hm-par]");
    const scenes = all(".hm [data-hm-scene]");
    const progressions = all(".hm [data-hm-progress]");
    const scrubs = all(".hm [data-hm-scrub]");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let mx = 0;
    let my = 0;
    let raf = 0;
    const frame = () => {
      raf = 0;
      const vh = window.innerHeight;

      // A jump (anchor link, restored scroll) can skip past elements without
      // them ever intersecting; reveal anything already above the fold line.
      pending.forEach((el) => {
        if (el.getBoundingClientRect().top < vh * 0.92) reveal(el);
      });

      if (hero) {
        hero.style.setProperty("--mx", mx.toFixed(3));
        hero.style.setProperty("--my", my.toFixed(3));
        const height = hero.offsetHeight || vh;
        if (window.scrollY < height * 1.2)
          hero.style.setProperty("--hp", clamp(window.scrollY / height).toFixed(4));
      }

      plates.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom > 0 && r.top < vh)
          el.style.setProperty("--py", `${((r.top + r.height / 2 - vh / 2) * -0.06).toFixed(1)}px`);
      });

      scenes.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top > vh * 1.2 || r.bottom < -vh * 0.2) return;
        el.style.setProperty("--sp", clamp((vh - r.top) / (vh * 0.8)).toFixed(4));
      });

      progressions.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top > vh * 1.2 || r.bottom < -vh) return;
        const p = clamp((vh * 0.78 - r.top) / Math.max(1, r.height + vh * 0.25));
        el.style.setProperty("--dp", p.toFixed(4));
        const items = Array.from(el.children) as HTMLElement[];
        items.forEach((item, i) => item.classList.toggle("is-on", p >= (i + 0.35) / items.length));
      });

      scrubs.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top > vh * 1.2 || r.bottom < -vh) return;
        el.style.setProperty(
          "--wp",
          clamp((vh * 0.88 - r.top) / Math.max(1, r.height + vh * 0.32)).toFixed(4),
        );
      });
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    // Pointer: hero parallax, card tilt and spotlight surfaces.
    let tilted: HTMLElement | null = null;
    const resetTilt = () => {
      if (!tilted) return;
      tilted.style.removeProperty("--rx");
      tilted.style.removeProperty("--ry");
      tilted.classList.remove("is-tilt");
      tilted = null;
    };
    const onPointer = (event: PointerEvent) => {
      mx = event.clientX / window.innerWidth - 0.5;
      my = event.clientY / window.innerHeight - 0.5;
      const target = event.target instanceof Element ? event.target : null;

      const card = target?.closest<HTMLElement>(".hm [data-hm-tilt]") ?? null;
      if (card !== tilted) resetTilt();
      if (card) {
        const r = card.getBoundingClientRect();
        const px = (event.clientX - r.left) / r.width;
        const py = (event.clientY - r.top) / r.height;
        card.style.setProperty("--rx", `${((0.5 - py) * 5).toFixed(2)}deg`);
        card.style.setProperty("--ry", `${((px - 0.5) * 7).toFixed(2)}deg`);
        card.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
        card.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
        card.classList.add("is-tilt");
        tilted = card;
      }

      const spot = target?.closest<HTMLElement>(".hm [data-hm-spot]");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--sx", `${(event.clientX - r.left).toFixed(0)}px`);
        spot.style.setProperty("--sy", `${(event.clientY - r.top).toFixed(0)}px`);
      }
      request();
    };

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    if (fine) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.addEventListener("pointerleave", resetTilt);
    }
    frame();
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", resetTilt);
      root.classList.remove("hm-js");
    };
  }, []);
}
