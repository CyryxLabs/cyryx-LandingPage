import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Optional finite choreography; all content and illustrations are server-rendered. */
export function CinematicHomeMotion({ root }: { root: RefObject<HTMLDivElement | null> }) {
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        { motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 768px)" },
        (context) => {
          if (
            !context.conditions?.motion ||
            document.documentElement.classList.contains("cx-low-perf")
          )
            return;
          const desktop = context.conditions.desktop;
          const opening = gsap.timeline({ defaults: { duration: 0.8, ease: "power3.out" } });
          opening
            .fromTo("[data-opening] .studio-input", { x: -12 }, { x: 0 }, 0)
            .fromTo(
              "[data-opening] .studio-processor",
              { y: 18, opacity: 0.6 },
              { y: 0, opacity: 1 },
              0.1,
            )
            .fromTo("[data-opening] .studio-screen", { x: 16 }, { x: 0 }, 0.2)
            .fromTo(
              "[data-opening] [data-signal]",
              { strokeDashoffset: 1 },
              { strokeDashoffset: 0, duration: 1.1 },
              0.2,
            );
          gsap.fromTo(
            "[data-hero-rule]",
            { scaleX: 0.3 },
            { scaleX: 1, duration: 1, ease: "power2.out" },
          );
          // Prepare each later scene near the viewport. This avoids forcing all
          // SVG/style measurements into the opening task on a mobile CPU.
          const observers: IntersectionObserver[] = [];
          const nearViewport = (selector: string, prepare: () => void) => {
            const target = root.current?.querySelector(selector);
            if (!target) return;
            const observer = new IntersectionObserver(
              (entries) => {
                if (!entries.some((entry) => entry.isIntersecting)) return;
                observer.disconnect();
                context.add(prepare);
              },
              { rootMargin: "0px 0px 25% 0px" },
            );
            observers.push(observer);
            observer.observe(target);
          };
          nearViewport("#service-visual", () => {
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: "#service-visual",
                  start: "top 82%",
                  end: "bottom 55%",
                  scrub: 0.35,
                },
                defaults: { ease: "none" },
              })
              .fromTo("#service-visual .studio-input", { x: -18 }, { x: 0 }, 0)
              .fromTo("#service-visual .studio-screen", { x: 20 }, { x: 0 }, 0)
              .fromTo(
                "#service-visual [data-signal]",
                { strokeDashoffset: 1 },
                { strokeDashoffset: 0 },
                0.15,
              );
          });
          nearViewport("[data-invoice-example]", () => {
            const invoice = gsap.timeline({
              scrollTrigger: { trigger: "[data-invoice-example]", start: "top 82%", once: true },
              defaults: { duration: 0.65, ease: "power2.out" },
            });
            invoice
              .fromTo(".cinema-invoice", { y: 18, rotation: -2 }, { y: 0, rotation: 0 })
              .fromTo(
                "[data-cinema-invoice-line]",
                { scaleX: desktop ? 0 : 1, scaleY: desktop ? 1 : 0 },
                { scaleX: 1, scaleY: 1, stagger: 0.18 },
                0.25,
              )
              .fromTo(".cinema-structured", { y: 12 }, { y: 0 }, 0.4)
              .fromTo(".cinema-draft", { y: 12 }, { y: 0 }, 0.6);
          });
          nearViewport("[data-product-terminal]", () => {
            gsap.fromTo(
              "[data-product-command]",
              { x: 14 },
              {
                x: 0,
                duration: 0.7,
                stagger: 0.12,
                scrollTrigger: { trigger: "[data-product-terminal]", start: "top 85%", once: true },
              },
            );
          });
          nearViewport("#consulting", () => {
            gsap.fromTo(
              "[data-consulting-line]",
              { scaleX: 0 },
              {
                scaleX: 1,
                duration: 0.85,
                stagger: 0.15,
                scrollTrigger: { trigger: "#consulting", start: "top 70%", once: true },
              },
            );
          });
          return () => observers.forEach((observer) => observer.disconnect());
        },
      );
      return () => media.revert();
    },
    { scope: root },
  );
  return null;
}
