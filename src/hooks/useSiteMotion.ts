import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Site-wide motion for content pages (the homepage keeps its own scroll
 * choreography in useCyryxScrollAnimations).
 *
 * - Automatic reveals: every content section below the first screen enters
 *   with a short fade/rise; grids and lists stagger their items.
 * - Opt-in attributes: [data-reveal], [data-reveal-stagger], [data-draw],
 *   [data-parallax="0.12"], [data-count="64"].
 * - Pointer spotlight for `.cx-spotlight` surfaces.
 *
 * Everything is transform/opacity based, runs only for elements that start
 * below the fold (so first paint never flashes), and is skipped entirely for
 * reduced motion or low-performance devices. Without JavaScript all content is
 * simply visible.
 */
export function useSiteMotion() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  // Pointer spotlight: one delegated listener, CSS does the drawing.
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let frame = 0;
    let pending: { el: HTMLElement; x: number; y: number } | null = null;
    const onMove = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const surface = target?.closest<HTMLElement>(".cx-spotlight, .cx-material-panel");
      if (!surface) return;
      const rect = surface.getBoundingClientRect();
      pending = { el: surface, x: event.clientX - rect.left, y: event.clientY - rect.top };
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (!pending) return;
        pending.el.style.setProperty("--cx-mx", `${pending.x}px`);
        pending.el.style.setProperty("--cx-my", `${pending.y}px`);
      });
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (pathname === "/" || pathname.startsWith("/workspace")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.documentElement.classList.contains("cx-low-perf")) return;

    let cancelled = false;
    let revert: (() => void) | undefined;

    const frame = window.requestAnimationFrame(() => {
      void (async () => {
        const [{ gsap }, { ScrollTrigger }] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        const main = document.getElementById("main-content");
        if (!main) return;

        const ctx = gsap.context(() => {
          const viewport = window.innerHeight;
          const startsBelowFold = (el: Element) => el.getBoundingClientRect().top > viewport * 0.9;
          const handled = new WeakSet<Element>();

          const reveal = (targets: Element[], trigger: Element, stagger = 0) => {
            const pending = targets.filter((el) => !handled.has(el) && startsBelowFold(el));
            if (!pending.length) return;
            pending.forEach((el) => handled.add(el));
            // Opacity only (not visibility): content stays in the accessibility tree.
            gsap.from(pending, {
              opacity: 0,
              y: 26,
              duration: 0.8,
              stagger,
              ease: "power3.out",
              clearProps: "transform,opacity",
              scrollTrigger: { trigger, start: "top 86%", once: true },
            });
          };

          const isDecorative = (el: Element) =>
            el.getAttribute("aria-hidden") === "true" ||
            getComputedStyle(el).position === "absolute" ||
            el.hasAttribute("data-motion-skip");

          // Opt-in reveals first, so the automatic pass does not repeat them.
          gsap.utils.toArray<HTMLElement>("[data-reveal]", main).forEach((el) => reveal([el], el));
          gsap.utils.toArray<HTMLElement>("[data-reveal-stagger]", main).forEach((group) => {
            reveal(Array.from(group.children), group, 0.08);
          });

          // Automatic reveals for every content section after the hero.
          const sections = gsap.utils
            .toArray<HTMLElement>("section", main)
            .filter(
              (section) =>
                !section.closest("[data-internal-hero]") &&
                !section.hasAttribute("data-story-section") &&
                !section.closest("[data-motion-skip]"),
            );

          sections.forEach((section) => {
            if (section.querySelector("section")) return; // nested sections handle themselves
            const children = Array.from(section.children).filter((el) => !isDecorative(el));
            const root = children.length === 1 ? children[0] : section;
            const blocks = Array.from(root.children).filter((el) => !isDecorative(el));

            blocks.forEach((block) => {
              const items = Array.from(block.children).filter((el) => !isDecorative(el));
              const isCollection =
                (block.matches("ul, ol, dl, .grid, [role='list']") && items.length >= 2) ||
                (items.length >= 3 && getComputedStyle(block).display.includes("grid"));
              if (isCollection) reveal(items, block, 0.07);
              else reveal([block], block);
            });
          });

          gsap.utils.toArray<HTMLElement>("[data-draw]", main).forEach((line) => {
            gsap.fromTo(
              line,
              { scaleX: 0, transformOrigin: "left center" },
              {
                scaleX: 1,
                duration: 1.1,
                ease: "power3.out",
                scrollTrigger: { trigger: line, start: "top 92%", once: true },
              },
            );
          });

          gsap.utils.toArray<HTMLElement>("[data-parallax]", main).forEach((layer) => {
            const speed = Number.parseFloat(layer.dataset.parallax ?? "0.1") || 0.1;
            gsap.fromTo(
              layer,
              { yPercent: -speed * 100 },
              {
                yPercent: speed * 100,
                ease: "none",
                scrollTrigger: {
                  trigger: layer.parentElement ?? layer,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.6,
                },
              },
            );
          });

          gsap.utils.toArray<HTMLElement>("[data-count]", main).forEach((el) => {
            const target = Number.parseFloat(el.dataset.count ?? "");
            if (!Number.isFinite(target)) return;
            const format = new Intl.NumberFormat("en-US");
            const counter = { value: 0 };
            el.textContent = "0";
            gsap.to(counter, {
              value: target,
              duration: 1.6,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = format.format(Math.round(counter.value));
              },
              scrollTrigger: { trigger: el, start: "top 90%", once: true },
            });
          });
        }, main);

        ScrollTrigger.refresh();
        revert = () => ctx.revert();
      })();
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      revert?.();
    };
  }, [pathname]);
}
