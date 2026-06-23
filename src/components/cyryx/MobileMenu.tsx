import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { gsap } from "gsap";
import { CyryxMark, CyryxWordmark } from "./primitives/CyryxMark";

export function MobileMenu({
  open,
  onClose,
  links,
}: {
  open: boolean;
  onClose: () => void;
  links: { label: string; href: string }[];
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        panelRef.current,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.35 },
      )
        .fromTo(
          linksRef.current?.children ?? [],
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.06 },
          "-=0.1",
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.4 },
          "-=0.1",
        )
        .fromTo(
          closeRef.current,
          { rotate: -45, opacity: 0 },
          { rotate: 0, opacity: 1, duration: 0.4 },
          0,
        );
    }, panelRef);
    document.body.style.overflow = "hidden";
    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Main navigation"
      className="fixed inset-0 z-[60] bg-[color-mix(in_oklab,var(--onyx)_96%,transparent)] backdrop-blur-2xl lg:hidden"
    >
      <div className="absolute inset-0 grid-floor opacity-30" aria-hidden />
      <div className="relative flex h-dvh flex-col px-6 pt-5 pb-10">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center gap-2.5">
            <CyryxMark size={30} />
            <CyryxWordmark />
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_30%,transparent)] text-[var(--silver)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav ref={linksRef} className="mt-14 flex flex-col gap-1">
          {links.map((l, i) => (
            <a
              key={l.label}
              href={l.href}
              onClick={onClose}
              className="group flex items-baseline justify-between border-b border-[color-mix(in_oklab,var(--silver)_8%,transparent)] py-5"
            >
              <span className="font-display text-3xl font-semibold text-silver-gradient">
                {l.label}
              </span>
              <span className="hud-label text-[var(--silver-dim)] group-hover:text-[var(--accent-glow)] transition-colors">
                0{i + 1}
              </span>
            </a>
          ))}
        </nav>

        <a
          ref={ctaRef}
          href="#cta"
          onClick={onClose}
          className="mt-auto inline-flex h-14 items-center justify-center gap-2 rounded-md border border-[var(--accent-glow)] bg-[color-mix(in_oklab,var(--accent-glow)_12%,transparent)] text-[var(--silver)] hud-label shadow-[var(--shadow-glow-teal)]"
        >
          Schedule a Briefing
          <span aria-hidden className="text-[var(--accent-glow)]">→</span>
        </a>
      </div>
    </div>
  );
}