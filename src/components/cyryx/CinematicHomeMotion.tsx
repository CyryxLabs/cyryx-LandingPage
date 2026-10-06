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
          // A single entrance opens the branded architectural scene. Copy and
          // contact remain still and fully visible throughout the movement.
          const entrance = gsap.timeline({ defaults: { ease: "power3.inOut" } });
          entrance
            .fromTo(
              ".cinema-aperture-world",
              { scale: desktop ? 1.16 : 1.12 },
              { scale: 1, duration: 2.2 },
              0,
            )
            .fromTo(
              ".cinema-aperture-door-left",
              { xPercent: 0, opacity: 1 },
              { xPercent: -100, opacity: 0, duration: 1.9 },
              0,
            )
            .fromTo(
              ".cinema-aperture-door-right",
              { xPercent: 0, opacity: 1 },
              { xPercent: 100, opacity: 0, duration: 1.9 },
              0,
            )
            .fromTo(".cinema-aperture-light", { scaleY: 0.2 }, { scaleY: 1, duration: 1.7 }, 0.3);
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
          const openingScene = "[data-request-demo]";
          nearViewport(openingScene, () => {
            const demo = root.current?.querySelector<HTMLElement>(openingScene);
            const source = demo?.querySelector<HTMLElement>("[data-demo-source]");
            const target = demo?.querySelector<HTMLElement>("[data-demo-target] dd");
            const transfer = demo?.querySelector<HTMLElement>("[data-demo-transfer]");
            if (!demo || !source || !target || !transfer) return;
            const bounds = demo.getBoundingClientRect();
            const origin = source.getBoundingClientRect();
            const destination = target.getBoundingClientRect();
            gsap.set(transfer, { left: origin.left - bounds.left, top: origin.top - bounds.top });
            const opening = gsap.timeline({
              scrollTrigger: {
                trigger: openingScene,
                start: desktop ? "top 65%" : "top 45%",
                once: true,
              },
              defaults: { duration: 0.8, ease: "power3.out" },
            });
            opening
              .fromTo(
                "[data-request-line]",
                { scaleX: desktop ? 0 : 1, scaleY: desktop ? 1 : 0 },
                { scaleX: 1, scaleY: 1, duration: 0.8 },
                0,
              )
              .fromTo(
                transfer,
                { x: 0, y: 0, opacity: 0 },
                {
                  x: destination.left - origin.left,
                  y: destination.top - origin.top,
                  opacity: 1,
                  duration: 1.2,
                  ease: "power2.inOut",
                },
                0.2,
              )
              .to(transfer, { opacity: 0, duration: 0.25 }, 1.4)
              .fromTo(
                "[data-demo-target]",
                { backgroundColor: "#b4ded2" },
                { backgroundColor: "transparent", duration: 1 },
                1.25,
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
