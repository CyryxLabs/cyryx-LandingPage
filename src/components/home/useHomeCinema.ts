import { useEffect, type RefObject } from "react";
import { SCENE_QUERY } from "./WorkflowScene";

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const INK = "#f5f7f7";
const SILVER = "#c7c9cc";

/**
 * Motion for the home (v10, approved 2026-11-18).
 *
 * - The thread: one teal line through the whole page, drawn as you scroll.
 * - The chapter rail on the left edge.
 * - GSAP + ScrollTrigger scenes: hero depth, "what we do" (the sentence, one
 *   capability at a time), the two paths opening from the dividing line, the
 *   Onyx capture tilting into place, the AEXOS terminal typing itself, the
 *   acceptance checklist, the company statement and the closing glow.
 *
 * The pinned scenes are tall CSS tracks with a sticky stage (see
 * home-cinema.css), not ScrollTrigger pins: normal scrolling, no pin spacers.
 * Reduced motion, Save-Data and the low-performance path get the page at rest
 * with the thread drawn in full. GSAP loads on demand, after first paint.
 */
export function useHomeCinema(ref: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;
    const $ = <T extends Element = HTMLElement>(s: string) => el.querySelector<T>(s);
    const $$ = <T extends Element = HTMLElement>(s: string) =>
      Array.from(el.querySelectorAll<T>(s));
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    const still =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      root.classList.contains("cx-low-perf") ||
      !root.classList.contains("cy-js") ||
      Boolean(connection?.saveData);
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const disposers: Array<() => void> = [];
    let disposed = false;

    /* ── the thread ── */
    const svg = $<SVGSVGElement>(".thread");
    const path = $<SVGPathElement>(".thread .live");
    const ghost = $<SVGPathElement>(".thread .ghost");
    const tip = $<SVGCircleElement>(".thread circle");
    let pts: Array<[number, number, boolean]> = [];
    let cum: number[] = [];
    let total = 0;
    let origin = 0;
    const drawThread = () => {
      if (!path || !tip || pts.length < 2) return;
      if (still) {
        path.style.strokeDashoffset = "0";
        return;
      }
      const line = window.scrollY - origin + window.innerHeight * 0.62;
      let len = 0;
      if (line >= pts[pts.length - 1][1]) len = total;
      else if (line > pts[0][1]) {
        for (let i = 0; i < pts.length - 1; i += 1) {
          if (line >= pts[i][1] && line <= pts[i + 1][1]) {
            const t = (line - pts[i][1]) / Math.max(1, pts[i + 1][1] - pts[i][1]);
            len = cum[i] + (cum[i + 1] - cum[i]) * t;
            break;
          }
        }
      }
      path.style.strokeDashoffset = String(total - len);
      const p = path.getPointAtLength(Math.max(0.1, len));
      tip.setAttribute("cx", String(p.x));
      tip.setAttribute("cy", String(p.y));
      tip.style.opacity = len > 1 ? "1" : "0";
    };
    const buildThread = () => {
      if (!svg || !path || !ghost) return;
      const box = el.getBoundingClientRect();
      const w = el.clientWidth;
      const h = el.offsetHeight;
      const narrow = w < 900;
      origin = box.top + window.scrollY;
      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      svg.style.height = `${h}px`;
      pts = $$("[data-anchor]").map((a) => {
        const r = a.getBoundingClientRect();
        const mode = (narrow && a.dataset.mx) || a.dataset.x || "50";
        if (mode === "self")
          return [r.left - box.left + r.width / 2, r.top - box.top + r.height / 2, true];
        const pct = parseFloat(mode);
        // On narrow screens the line keeps to the page gutters.
        const x = narrow && pct !== 50 ? (pct < 50 ? 9 : w - 9) : (w * pct) / 100;
        return [x, r.top - box.top + Number(a.dataset.dy ?? 0), false];
      });
      if (pts.length < 2) return;
      // S-curves that always travel downwards, so the line can follow the scroll.
      // From a step marker it runs along that step's rule, then turns down.
      let d = `M${pts[0][0]},${pts[0][1]}`;
      const segs: string[] = [];
      for (let i = 0; i < pts.length - 1; i += 1) {
        const [x1, y1, along] = pts[i];
        const [x2, y2] = pts[i + 1];
        let seg: string;
        if (along && Math.abs(x2 - x1) > 80) {
          const xa = x2 - Math.sign(x2 - x1) * 60;
          seg = `L${xa},${y1}C${x2},${y1} ${x2},${y1} ${x2},${y2}`;
        } else {
          const k = (y2 - y1) / 2;
          seg = `C${x1},${y1 + k} ${x2},${y2 - k} ${x2},${y2}`;
        }
        d += seg;
        segs.push(`M${x1},${y1}${seg}`);
      }
      path.setAttribute("d", d);
      ghost.setAttribute("d", d);
      const probe = document.createElementNS("http://www.w3.org/2000/svg", "path");
      svg.appendChild(probe);
      cum = [0];
      for (const s of segs) {
        probe.setAttribute("d", s);
        cum.push(cum[cum.length - 1] + probe.getTotalLength());
      }
      probe.remove();
      total = path.getTotalLength();
      path.style.strokeDasharray = `${total} ${total}`;
      drawThread();
    };
    let threadFrame = 0;
    const onScroll = () => {
      if (!threadFrame)
        threadFrame = requestAnimationFrame(() => {
          threadFrame = 0;
          drawThread();
        });
    };
    let lastHeight = 0;
    const observer = new ResizeObserver(() => {
      if (Math.abs(el.offsetHeight - lastHeight) < 2 && pts.length) return;
      lastHeight = el.offsetHeight;
      buildThread();
    });
    observer.observe(el);
    buildThread();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", buildThread);
    disposers.push(() => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", buildThread);
      if (threadFrame) cancelAnimationFrame(threadFrame);
    });

    /* ── chapter rail ── */
    const railLinks = $$<HTMLAnchorElement>(".rail a");
    const railNow = $(".rail-now");
    if ("IntersectionObserver" in window && railNow) {
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const link = railLinks.find((a) => a.getAttribute("href") === `#${entry.target.id}`);
            if (!link) return;
            railLinks.forEach((a) => a.setAttribute("aria-current", String(a === link)));
            railNow.replaceChildren(
              Object.assign(document.createElement("b"), { textContent: link.dataset.ch ?? "" }),
              ` ${link.dataset.label ?? ""}`,
            );
          }),
        { rootMargin: "-45% 0px -50% 0px" },
      );
      $$("[data-chapter]").forEach((s) => io.observe(s));
      disposers.push(() => io.disconnect());
    }

    if (still) return () => disposers.forEach((dispose) => dispose());

    /* ── scenes ── */
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
      .then(([{ gsap }, { ScrollTrigger }]) => {
        if (disposed) return;
        gsap.registerPlugin(ScrollTrigger);
        el.classList.add("hx-on");
        const words = (node: Element | null) =>
          node ? Array.from(node.querySelectorAll(".w > span")) : [];
        const once = (trigger: Element | string, start = "top 86%") => ({
          trigger,
          start,
          once: true,
        });
        const mm = gsap.matchMedia(el);

        const ctx = gsap.context(() => {
          // hero: depth while it scrolls away
          const hero = $(".hero");
          if (hero) {
            gsap
              .timeline({
                scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
              })
              .to(".hero .wrap", { yPercent: -18, autoAlpha: 0.1, ease: "none" }, 0)
              .fromTo(
                ".hero-plate img",
                { scale: 1.04 },
                { scale: 1.22, filter: "brightness(0.45)", ease: "none" },
                0,
              );
            ScrollTrigger.create({
              trigger: hero,
              start: "top bottom",
              end: "bottom top",
              toggleClass: { targets: hero, className: "is-live" },
            });
            if (fine) {
              const plateX = gsap.quickTo(".hero-plate picture", "x", {
                duration: 1.4,
                ease: "power3",
              });
              const plateY = gsap.quickTo(".hero-plate picture", "y", {
                duration: 1.4,
                ease: "power3",
              });
              const onMove = (event: PointerEvent) => {
                plateX((event.clientX / window.innerWidth - 0.5) * -22);
                plateY((event.clientY / window.innerHeight - 0.5) * -14);
              };
              hero.addEventListener("pointermove", onMove);
              disposers.push(() => hero.removeEventListener("pointermove", onMove));
            }
          }

          // headings: words rise out of their masks
          $$("[data-split]")
            .filter((h) => !h.closest(".hero") && !h.closest(".quiet") && !h.closest(".orbit"))
            .forEach((h) => {
              gsap.from(words(h), {
                yPercent: 115,
                duration: 1.1,
                ease: "expo.out",
                stagger: 0.045,
                scrollTrigger: once(h),
              });
            });
          $$(".kicker")
            .filter((k) => !k.closest(".hero"))
            .forEach((k) => {
              gsap.from(k, {
                autoAlpha: 0,
                x: -24,
                duration: 0.9,
                ease: "expo.out",
                scrollTrigger: once(k, "top 90%"),
              });
            });

          // products
          gsap.fromTo(
            "[data-tilt-in]",
            { rotateX: 26, scale: 0.82, yPercent: 10, autoAlpha: 0.4 },
            {
              rotateX: 0,
              scale: 1,
              yPercent: 0,
              autoAlpha: 1,
              ease: "none",
              scrollTrigger: {
                trigger: ".prod-media",
                start: "top 95%",
                end: "top 30%",
                scrub: true,
              },
            },
          );
          $$(".prod-name")
            .filter((n) => !n.closest(".orbit"))
            .forEach((n) => {
              gsap.fromTo(
                n,
                { yPercent: 45, autoAlpha: 0 },
                {
                  yPercent: 0,
                  autoAlpha: 1,
                  ease: "none",
                  scrollTrigger: { trigger: n, start: "top 98%", end: "top 55%", scrub: 0.4 },
                },
              );
            });
          const shot = $(".shot");
          if (shot)
            ScrollTrigger.create({
              trigger: shot,
              start: "top 38%",
              once: true,
              onEnter: () => shot.classList.add("is-lit"),
            });
          const typing = gsap.timeline({ paused: true });
          $$("[data-type]").forEach((line) => {
            const n = (line.textContent ?? "").length;
            typing.fromTo(
              line,
              { clipPath: "inset(0 100% 0 0)" },
              { clipPath: "inset(0 0% 0 0)", duration: n * 0.028, ease: `steps(${n})` },
              "+=0.18",
            );
          });
          gsap.set("[data-type]", { clipPath: "inset(0 100% 0 0)" });
          ScrollTrigger.create({
            trigger: ".term",
            start: "top 75%",
            once: true,
            onEnter: () => typing.play(),
          });
          gsap.from(words($("#orbit-name")), {
            yPercent: 115,
            duration: 1.8,
            ease: "expo.out",
            scrollTrigger: once(".orbit", "top 60%"),
          });
          gsap.from(".orbit .status", {
            autoAlpha: 0,
            duration: 1.2,
            delay: 0.6,
            scrollTrigger: once(".orbit", "top 60%"),
          });

          // solutions, evidence, delivery steps
          gsap.from("[data-row]", {
            x: -60,
            autoAlpha: 0,
            duration: 1,
            ease: "expo.out",
            stagger: 0.1,
            scrollTrigger: once(".rows", "top 80%"),
          });
          gsap.from("[data-card]", {
            y: 60,
            autoAlpha: 0,
            duration: 1,
            ease: "expo.out",
            stagger: 0.1,
            scrollTrigger: once(".ev-grid", "top 82%"),
          });
          $$(".stair").forEach((s) => {
            gsap.from(s, {
              y: 50,
              autoAlpha: 0,
              duration: 1,
              ease: "expo.out",
              scrollTrigger: once(s),
            });
          });

          // company: parallax plate; the statement lights up as you read
          gsap.fromTo(
            ".co-plate",
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: ".co",
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
          gsap.fromTo(
            ".say .w2",
            { opacity: 0.16 },
            {
              opacity: 1,
              stagger: 0.08,
              ease: "none",
              scrollTrigger: { trigger: ".say", start: "top 82%", end: "bottom 45%", scrub: true },
            },
          );

          // close
          gsap.fromTo(
            ".close-glow",
            { scale: 0.45, autoAlpha: 0 },
            {
              scale: 1.15,
              autoAlpha: 1,
              ease: "none",
              scrollTrigger: {
                trigger: ".close",
                start: "top 90%",
                end: "center center",
                scrub: true,
              },
            },
          );
          gsap.from(".chips label", {
            autoAlpha: 0,
            y: 14,
            stagger: 0.07,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: once(".chips", "top 88%"),
          });
        }, el);

        // Scenes on a sticky stage need room: same gate as the CSS tracks.
        mm.add(SCENE_QUERY, () => {
          const sec = $(".what");
          const panels = $$("[data-wpanel]");
          const phs = $$(".ph");
          if (sec && panels.length === phs.length) {
            sec.classList.add("is-pin");
            gsap.set(panels, { autoAlpha: (i: number) => (i ? 0 : 1) });
            gsap.set(phs[0], { color: INK, "--u": 1 });
            const tl = gsap.timeline({
              defaults: { ease: "power2.out" },
              scrollTrigger: {
                trigger: ".what-track",
                start: "top top",
                end: "bottom bottom",
                scrub: 0.5,
              },
            });
            panels.forEach((panel, i) => {
              if (!i) return;
              tl.to(phs[i - 1], { color: SILVER, "--u": 0, duration: 0.3 }, i - 0.2)
                .to(phs[i], { color: INK, "--u": 1, duration: 0.35 }, i - 0.2)
                .to(
                  panels[i - 1],
                  { autoAlpha: 0, yPercent: -8, duration: 0.3, ease: "power2.in" },
                  i - 0.3,
                )
                .fromTo(
                  panel,
                  { autoAlpha: 0, yPercent: 10 },
                  { autoAlpha: 1, yPercent: 0, duration: 0.4 },
                  i,
                );
            });
            tl.from(
              ".wnet .nd",
              {
                autoAlpha: 0,
                scale: 0.8,
                transformOrigin: "50% 50%",
                stagger: 0.05,
                duration: 0.25,
              },
              1.05,
            )
              .from(
                ".wnet .ln",
                { strokeDashoffset: 1, stagger: 0.07, duration: 0.4, ease: "none" },
                1.15,
              )
              .from(".wpipe-fill", { scaleX: 0, duration: 0.6, ease: "none" }, 2.1)
              .from(
                ".wpipe li i",
                { scale: 0, stagger: 0.12, duration: 0.18, ease: "back.out(3)" },
                2.1,
              )
              .from(".wwire .wb", { autoAlpha: 0, y: 16, stagger: 0.08, duration: 0.25 }, 3.1)
              .from(".wchips span", { autoAlpha: 0, y: 8, stagger: 0.06, duration: 0.2 }, 3.35)
              .to({}, { duration: 0.5 });
            gsap.from(".wplate", {
              y: 34,
              autoAlpha: 0,
              stagger: 0.12,
              duration: 1,
              ease: "expo.out",
              scrollTrigger: once(sec, "top 55%"),
            });
            gsap.from(".wvis--metal > img", {
              scale: 1.25,
              duration: 2.2,
              ease: "power2.out",
              scrollTrigger: once(sec, "top 55%"),
            });
          }
          // the acceptance checklist: a held, quiet beat
          gsap
            .timeline({
              scrollTrigger: {
                trigger: ".quiet-track",
                start: "top top",
                end: "bottom bottom",
                scrub: 0.5,
              },
            })
            .from(
              ".checks li",
              { autoAlpha: 0.12, y: 18, stagger: 0.25, duration: 0.3, ease: "power2.out" },
              0,
            )
            .fromTo(
              ".checks path",
              { strokeDasharray: 1, strokeDashoffset: 1 },
              { strokeDashoffset: 0, stagger: 0.25, duration: 0.25, ease: "none" },
              0.12,
            )
            .from(
              words($(".quiet h2")),
              { yPercent: 115, stagger: 0.04, duration: 0.5, ease: "expo.out" },
              1.15,
            )
            .to({}, { duration: 0.45 });
          return () => {
            sec?.classList.remove("is-pin");
            gsap.set([...panels, ...phs], { clearProps: "all" });
          };
        });
        mm.add(
          "(min-width: 901px) and (max-height: 699px), (max-width: 900px) and (max-height: 639px)",
          () => {
            $$("[data-wpanel]").forEach((panel) => {
              gsap.from(panel, {
                y: 50,
                autoAlpha: 0,
                duration: 1,
                ease: "expo.out",
                scrollTrigger: once(panel),
              });
            });
            gsap
              .timeline({ scrollTrigger: once(".quiet", "top 60%") })
              .from(".checks li", {
                autoAlpha: 0,
                y: 16,
                duration: 0.6,
                stagger: 0.18,
                ease: "power3.out",
              })
              .fromTo(
                ".checks path",
                { strokeDasharray: 1, strokeDashoffset: 1 },
                { strokeDashoffset: 0, duration: 0.5, stagger: 0.18, ease: "power2.inOut" },
                0.2,
              )
              .from(
                words($(".quiet h2")),
                { yPercent: 115, duration: 1.2, stagger: 0.04, ease: "expo.out" },
                0.9,
              );
          },
        );

        // two paths: a curtain opens from the dividing line (side by side) or
        // each half unrolls downwards (stacked)
        mm.add("(min-width: 901px)", () => {
          gsap
            .timeline({
              scrollTrigger: { trigger: ".split", start: "top 90%", end: "top 28%", scrub: 0.4 },
            })
            .fromTo(".split", { "--dv": 0 }, { "--dv": 1, ease: "none", duration: 0.4 }, 0)
            .fromTo(
              ".half--prod",
              { clipPath: "inset(0 0 0 100%)" },
              { clipPath: "inset(0 0 0 0%)", ease: "power2.out", duration: 0.8 },
              0.15,
            )
            .fromTo(
              ".half--sol",
              { clipPath: "inset(0 100% 0 0)" },
              { clipPath: "inset(0 0% 0 0)", ease: "power2.out", duration: 0.8 },
              0.15,
            )
            .from(
              ".half > *:not(.half-art)",
              { autoAlpha: 0, y: 24, stagger: 0.03, duration: 0.4 },
              0.55,
            )
            .from(".half-art", { scale: 1.2, ease: "none", duration: 1 }, 0.1);
        });
        mm.add("(max-width: 900px)", () => {
          $$(".half").forEach((half) => {
            gsap
              .timeline({
                scrollTrigger: { trigger: half, start: "top 92%", end: "top 40%", scrub: 0.4 },
              })
              .fromTo(
                half,
                { clipPath: "inset(0 0 100% 0)" },
                { clipPath: "inset(0 0 0% 0)", ease: "power2.out", duration: 0.8 },
                0,
              )
              .from(
                half.querySelectorAll(":scope > *:not(.half-art)"),
                { autoAlpha: 0, y: 20, stagger: 0.05, duration: 0.4 },
                0.4,
              )
              .from(half.querySelector(".half-art"), { scale: 1.2, ease: "none", duration: 1 }, 0);
          });
        });

        // pointer: a ring that follows, and actions that lean towards it
        if (fine) {
          const ring = $(".cring");
          if (ring) {
            const rx = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3" });
            const ry = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3" });
            const onMove = (event: PointerEvent) => {
              const target = event.target instanceof Element ? event.target : null;
              const inside = Boolean(target && el.contains(target));
              ring.classList.toggle("is-on", inside);
              if (!inside) return;
              rx(event.clientX);
              ry(event.clientY);
              ring.classList.toggle("is-big", Boolean(target?.closest("a, button, label")));
            };
            window.addEventListener("pointermove", onMove, { passive: true });
            disposers.push(() => window.removeEventListener("pointermove", onMove));
          }
          $$("[data-magnet]").forEach((button) => {
            const mx = gsap.quickTo(button, "x", { duration: 0.4, ease: "power3" });
            const my = gsap.quickTo(button, "y", { duration: 0.4, ease: "power3" });
            const onMove = (event: PointerEvent) => {
              const r = button.getBoundingClientRect();
              mx((event.clientX - r.left - r.width / 2) * 0.22);
              my((event.clientY - r.top - r.height / 2) * 0.35);
            };
            const onLeave = () => {
              mx(0);
              my(0);
            };
            button.addEventListener("pointermove", onMove);
            button.addEventListener("pointerleave", onLeave);
            disposers.push(() => {
              button.removeEventListener("pointermove", onMove);
              button.removeEventListener("pointerleave", onLeave);
            });
          });
        }

        const refresh = () => ScrollTrigger.refresh();
        window.addEventListener("load", refresh);
        void document.fonts?.ready.then(refresh).catch(() => {});
        disposers.push(() => {
          window.removeEventListener("load", refresh);
          mm.revert();
          ctx.revert();
          el.classList.remove("hx-on");
        });
      })
      .catch(() => {
        // Without the motion library the page simply stays at rest.
      });

    return () => {
      disposed = true;
      disposers.forEach((dispose) => dispose());
    };
  }, [ref]);
}
