import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

/**
 * Motion for the `.cy` pages, with no animation library.
 *
 * - Reveals: `[data-cy-reveal]`, word-split headings (`.cy-words`), masked lines.
 * - Scenes: `[data-cy-scene="pin"]` is a tall section with a sticky stage; its
 *   scroll progress is published as `--p` and switches `[data-cy-at]` beats on.
 *   `[data-cy-scene="enter"]` publishes progress through the viewport.
 *   `[data-cy-scene="rail"]` turns vertical scroll into a horizontal track.
 * - Ambient: scroll progress bar, pointer light, spotlight borders, magnetic
 *   primary buttons, parallax layers, counters.
 *
 * Content is fully visible without JavaScript. The pre-hydration script in
 * __root.tsx adds `cy-js` to <html>, which arms the hidden and pinned states
 * in cy.css; reduced-motion and low-performance devices never get them.
 */
export function useCyMotion() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    const root = document.documentElement;
    (window as unknown as { __cyMotionReady?: boolean }).__cyMotionReady = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const still =
      reduce || root.classList.contains("cx-low-perf") || !root.classList.contains("cy-js");
    const wide = window.matchMedia("(min-width: 900px) and (min-height: 700px)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const query = <T extends HTMLElement>(selector: string) =>
      Array.from(document.querySelectorAll<T>(selector));

    const pinned = wide && !still;
    root.classList.toggle("cy-pin", pinned);

    const beats = query(".cy [data-cy-at]");
    const targets = [
      ...query(
        ".cy [data-cy-reveal], .cy .cy-words, .cy .cy-lines:not(.cy-lines--auto), .cy .cy-pstep",
      ),
      // Without pinning, beats behave like ordinary reveals.
      ...(pinned ? [] : beats),
    ];
    const counters = query(".cy [data-cy-count]");

    const runCounter = (el: HTMLElement) => {
      if (el.dataset.cyCounted) return;
      el.dataset.cyCounted = "true";
      const end = Number(el.dataset.cyCount ?? "0");
      const started = performance.now();
      const tick = (now: number) => {
        const t = clamp((now - started) / 1500);
        el.textContent = String(Math.round(end * (1 - Math.pow(1 - t, 4))));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const switchOn = (el: HTMLElement) => {
      el.classList.add("is-in", "is-on");
      el.querySelectorAll<HTMLElement>("[data-cy-count]").forEach(runCounter);
    };

    if (still || !("IntersectionObserver" in window)) {
      [...targets, ...beats].forEach((el) => el.classList.add("is-in", "is-on"));
      counters.forEach((el) => (el.textContent = el.dataset.cyCount ?? el.textContent));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          switchOn(entry.target as HTMLElement);
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );
    targets.forEach((el) => io.observe(el));

    const countIo = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          countIo.unobserve(entry.target);
          runCounter(entry.target as HTMLElement);
        }
      },
      { threshold: 0.6 },
    );
    counters.forEach((el) => {
      el.textContent = "0";
      // Counters inside a pinned beat start when the beat switches on.
      if (!(pinned && el.closest("[data-cy-at]"))) countIo.observe(el);
    });

    const scenes = query(".cy [data-cy-scene]");
    const rails = query(".cy .cy-process__steps");
    const parallax = query(".cy [data-cy-parallax]");
    const railDistance = new Map<HTMLElement, number>();

    const measure = () => {
      for (const scene of scenes) {
        if (scene.dataset.cyScene !== "rail") continue;
        const track = scene.querySelector<HTMLElement>("[data-cy-track]");
        if (track) railDistance.set(scene, Math.max(0, track.scrollWidth - root.clientWidth));
      }
    };

    let frame = 0;
    let lastPass = window.scrollY;
    const revealPassed = () => {
      for (const el of targets) {
        if (el.classList.contains("is-in")) continue;
        if (el.getBoundingClientRect().top < window.innerHeight) {
          switchOn(el);
          io.unobserve(el);
        }
      }
    };

    const update = () => {
      frame = 0;
      const viewport = window.innerHeight;
      const max = root.scrollHeight - viewport;
      root.style.setProperty("--cy-scroll", max > 0 ? String(window.scrollY / max) : "0");

      for (const scene of scenes) {
        const rect = scene.getBoundingClientRect();
        if (rect.bottom < -viewport || rect.top > viewport * 2) continue;
        const kind = scene.dataset.cyScene;
        if (kind === "enter" || !pinned) {
          scene.style.setProperty(
            "--p",
            clamp((viewport - rect.top) / (viewport + rect.height)).toFixed(4),
          );
          continue;
        }
        const progress = clamp(-rect.top / Math.max(1, rect.height - viewport));
        scene.style.setProperty("--p", progress.toFixed(4));
        if (kind === "rail") {
          scene.style.setProperty(
            "--tx",
            `${(-progress * (railDistance.get(scene) ?? 0)).toFixed(1)}px`,
          );
        }
        scene.querySelectorAll<HTMLElement>("[data-cy-at]").forEach((beat) => {
          const on = progress >= Number(beat.dataset.cyAt ?? "0");
          if (on && !beat.classList.contains("is-on")) switchOn(beat);
          else if (!on && beat.classList.contains("is-on")) beat.classList.remove("is-on", "is-in");
        });
      }

      for (const rail of rails) {
        const rect = rail.getBoundingClientRect();
        rail.style.setProperty(
          "--cy-rail",
          String(clamp((viewport * 0.62 - rect.top) / Math.max(1, rect.height))),
        );
      }

      for (const layer of parallax) {
        const rect = layer.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > viewport) continue;
        const speed = Number(layer.dataset.cyParallax ?? "0.1");
        const offset = (rect.top + rect.height / 2 - viewport / 2) * speed;
        layer.style.setProperty("--cy-y", `${offset.toFixed(1)}px`);
      }

      if (Math.abs(window.scrollY - lastPass) > viewport * 0.4) {
        lastPass = window.scrollY;
        revealPassed();
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    void document.fonts?.ready.then(onResize).catch(() => {});

    // Keyboard focus inside a horizontal rail scrolls the page to that card.
    const onFocus = (event: FocusEvent) => {
      if (!pinned) return;
      const card =
        event.target instanceof HTMLElement
          ? event.target.closest<HTMLElement>("[data-cy-track] > *")
          : null;
      const scene = card?.closest<HTMLElement>('[data-cy-scene="rail"]');
      if (!card || !scene || !card.matches(":focus-visible")) return;
      const distance = railDistance.get(scene) ?? 0;
      const top = scene.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + clamp(card.offsetLeft - 120, 0, distance), behavior: "auto" });
    };
    document.addEventListener("focusin", onFocus);

    // Pointer: ambient light, spotlight borders and magnetic primary buttons.
    let pointerFrame = 0;
    let pointerEvent: PointerEvent | null = null;
    let magnet: HTMLElement | null = null;
    const light = document.querySelector<HTMLElement>(".cy-light");
    const applyPointer = () => {
      pointerFrame = 0;
      const event = pointerEvent;
      if (!event) return;
      light?.style.setProperty("--lx", `${event.clientX}px`);
      light?.style.setProperty("--ly", `${event.clientY}px`);
      const target = event.target instanceof Element ? event.target : null;
      const surface = target?.closest<HTMLElement>(".cy-spot");
      if (surface) {
        const rect = surface.getBoundingClientRect();
        surface.style.setProperty("--cy-mx", `${event.clientX - rect.left}px`);
        surface.style.setProperty("--cy-my", `${event.clientY - rect.top}px`);
      }
      const button = target?.closest<HTMLElement>(".cy-btn--primary") ?? null;
      if (magnet && magnet !== button) {
        magnet.style.removeProperty("--mgx");
        magnet.style.removeProperty("--mgy");
      }
      magnet = button;
      if (button) {
        const rect = button.getBoundingClientRect();
        button.style.setProperty(
          "--mgx",
          `${((event.clientX - rect.left - rect.width / 2) * 0.18).toFixed(1)}px`,
        );
        button.style.setProperty(
          "--mgy",
          `${((event.clientY - rect.top - rect.height / 2) * 0.3).toFixed(1)}px`,
        );
      }
    };
    const onMove = (event: PointerEvent) => {
      pointerEvent = event;
      if (!pointerFrame) pointerFrame = requestAnimationFrame(applyPointer);
    };
    if (fine) document.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      io.disconnect();
      countIo.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      root.style.removeProperty("--cy-scroll");
    };
  }, [pathname]);
}
