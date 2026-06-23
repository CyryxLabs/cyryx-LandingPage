import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Global scroll storytelling for the Cyryx landing page.
 * Uses gsap.matchMedia for mobile / tablet / desktop tiers and
 * respects prefers-reduced-motion.
 */
export function useCyryxScrollAnimations() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      // Snap all reveals to final state, count-ups to target.
      document.querySelectorAll<HTMLElement>(".cx-reveal").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      document.querySelectorAll<HTMLElement>("[data-countup]").forEach((el) => {
        el.textContent = el.dataset.countupFormat
          ? el.dataset.countupFormat.replace("{n}", el.dataset.countup ?? "0")
          : (el.dataset.countup ?? "0");
      });
      return;
    }

    const mm = gsap.matchMedia();

    // ── Universal reveals ────────────────────────────────────────
    const reveals = gsap.utils.toArray<HTMLElement>(".cx-reveal");
    reveals.forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top bottom-=80",
          toggleActions: "play none none none",
        },
      });
    });

    // ── Stagger groups (a parent .cx-stagger reveals children) ──
    gsap.utils.toArray<HTMLElement>(".cx-stagger").forEach((group) => {
      const items = group.querySelectorAll<HTMLElement>(".cx-stagger-item");
      if (!items.length) return;
      gsap.set(items, { opacity: 0, y: 20 });
      gsap.to(items, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.06,
        scrollTrigger: {
          trigger: group,
          start: "top bottom-=80",
          toggleActions: "play none none none",
        },
      });
    });

    // ── Count-up metrics ─────────────────────────────────────────
    gsap.utils.toArray<HTMLElement>("[data-countup]").forEach((el) => {
      const target = parseFloat(el.dataset.countup ?? "0");
      const decimals = parseInt(el.dataset.countupDecimals ?? "0", 10);
      const format = el.dataset.countupFormat ?? "{n}";
      const obj = { n: 0 };
      gsap.to(obj, {
        n: target,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
        onUpdate() {
          el.textContent = format.replace(
            "{n}",
            obj.n.toLocaleString(undefined, {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            }),
          );
        },
      });
    });

    // ── Timeline draw (process steps) ────────────────────────────
    const timelineLine = document.querySelector<HTMLElement>("[data-timeline-line]");
    const timelineSection = document.querySelector<HTMLElement>("[data-timeline-section]");
    if (timelineLine && timelineSection) {
      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          isMobile: "(max-width: 1023px)",
        },
        (ctx) => {
          const { isDesktop } = ctx.conditions as { isDesktop: boolean };
          gsap.fromTo(
            timelineLine,
            isDesktop ? { scaleX: 0, transformOrigin: "left center" } : { scaleY: 0, transformOrigin: "top center" },
            {
              [isDesktop ? "scaleX" : "scaleY"]: 1,
              ease: "none",
              scrollTrigger: {
                trigger: timelineSection,
                start: "top 70%",
                end: "bottom 60%",
                scrub: 0.6,
              },
            },
          );

          gsap.utils.toArray<HTMLElement>("[data-timeline-step]").forEach((step) => {
            gsap.from(step, {
              opacity: 0,
              y: isDesktop ? 0 : 16,
              x: isDesktop ? 16 : 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: step,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            });
          });
        },
      );
    }

    // ── Desktop-only: hero dashboard slide-in + parallax visuals ─
    mm.add("(min-width: 1024px)", () => {
      const dash = document.querySelector("[data-hero-dashboard]");
      if (dash) {
        gsap.from(dash, {
          opacity: 0,
          x: 60,
          duration: 1.1,
          ease: "power3.out",
          delay: 0.2,
        });
      }
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        gsap.to(el, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    });

    // ── Mobile: lighter hero reveal ──────────────────────────────
    mm.add("(max-width: 1023px)", () => {
      const dash = document.querySelector("[data-hero-dashboard]");
      if (dash) {
        gsap.from(dash, {
          opacity: 0,
          y: 24,
          duration: 0.9,
          ease: "power3.out",
          delay: 0.15,
        });
      }
    });

    // ── Hero line-by-line headline ───────────────────────────────
    const heroLines = gsap.utils.toArray<HTMLElement>("[data-hero-line]");
    if (heroLines.length) {
      gsap.from(heroLines, {
        opacity: 0,
        y: 22,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.1,
      });
    }

    // Recalculate after images/fonts settle.
    const doRefresh = () => ScrollTrigger.refresh();
    requestAnimationFrame(doRefresh);
    const t1 = window.setTimeout(doRefresh, 400);
    const t2 = window.setTimeout(doRefresh, 1500);
    window.addEventListener("load", doRefresh);
    if (document.fonts?.ready) document.fonts.ready.then(doRefresh).catch(() => {});
    document.querySelectorAll("img").forEach((img) => {
      if (!img.complete) img.addEventListener("load", doRefresh, { once: true });
    });

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("load", doRefresh);
      mm.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);
}