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

    // ── Split [data-hero-headline] into word spans for reveal ─
    document.querySelectorAll<HTMLElement>("[data-hero-headline]").forEach((el) => {
      if (el.dataset.split === "1") return;
      const text = el.textContent ?? "";
      el.textContent = "";
      text.split(/(\s+)/).forEach((part) => {
        if (/^\s+$/.test(part)) {
          el.appendChild(document.createTextNode(part));
        } else if (part.length) {
          const outer = document.createElement("span");
          outer.className = "cx-word-mask";
          const inner = document.createElement("span");
          inner.className = "cx-word";
          inner.textContent = part;
          outer.appendChild(inner);
          el.appendChild(outer);
        }
      });
      el.dataset.split = "1";
    });

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

    // ── Desktop-only: hero dashboard rise + parallax visuals + core line draw ─
    mm.add("(min-width: 1024px)", () => {
      const dash = document.querySelector("[data-hero-dashboard]");
      if (dash) {
        gsap.from(dash, {
          opacity: 0,
          y: 60,
          duration: 1.1,
          ease: "power3.out",
          delay: 0.4,
        });
      }

      // Continuous teal core line drawing the full <main> height as user scrolls.
      const coreLine = document.querySelector<HTMLElement>("[data-core-line]");
      const mainEl = coreLine?.parentElement;
      if (coreLine && mainEl) {
        gsap.fromTo(
          coreLine,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: mainEl,
              start: "top top+=120",
              end: "bottom bottom",
              scrub: 0.4,
            },
          },
        );
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

    // ── Hero headline word-by-word rise ────────────────────────
    const heroWords = gsap.utils.toArray<HTMLElement>("[data-hero-headline] .cx-word");
    if (heroWords.length) {
      gsap.set(heroWords, { yPercent: 110, rotate: 4 });
      gsap.to(heroWords, {
        yPercent: 0,
        rotate: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.07,
        delay: 0.25,
      });
    }

    // ── Desktop hero scrub: scale/lift the 3D stage as you scroll away ─
    mm.add("(min-width: 1024px)", () => {
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      if (hero) {
        gsap.to(hero, {
          scale: 0.94,
          y: -40,
          filter: "blur(2px)",
          opacity: 0.65,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "bottom bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }

      // 3D tilt on capability cards via mouse
      document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((card) => {
        const onMove = (e: PointerEvent) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = `perspective(900px) rotateX(${-py * 6}deg) rotateY(${px * 8}deg) translateZ(0)`;
        };
        const onLeave = () => {
          card.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
        };
        card.addEventListener("pointermove", onMove);
        card.addEventListener("pointerleave", onLeave);
      });
    });

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