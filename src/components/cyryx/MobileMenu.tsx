import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { gsap } from "gsap";
import { CyryxMark } from "./primitives/CyryxMark";
import { useCopyVariant } from "@/lib/copy-variant";
import { getCopy } from "@/copy";
import { trackCta } from "@/lib/track-cta";

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
  const headerCta = getCopy(useCopyVariant()).header.cta;

  useEffect(() => {
    if (!open) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(panelRef.current, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: 0.35 })
        .fromTo(
          linksRef.current?.children ?? [],
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.06 },
          "-=0.1",
        )
        .fromTo(ctaRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.1")
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
    const previousFocus = document.activeElement as HTMLElement | null;
    const focusFrame = requestAnimationFrame(() => closeRef.current?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", onKey);
      previousFocus?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      id="mobile-navigation"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Main navigation"
      className="cx-brand-chrome cx-liquid-glass fixed inset-0 z-[60] rounded-none border-none lg:hidden"
      style={{
        background:
          "linear-gradient(135deg, color-mix(in oklab, var(--onyx) 88%, transparent) 0%, color-mix(in oklab, var(--onyx) 78%, transparent) 100%)",
      }}
    >
      <div className="absolute inset-0 grid-floor opacity-30" aria-hidden />
      <div className="relative flex h-dvh flex-col px-6 pt-[max(env(safe-area-inset-top),1.25rem)] pb-[max(env(safe-area-inset-bottom),2.5rem)]">
        <div className="flex items-center justify-between h-12">
          <CyryxMark size={40} priority />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="cx-btn cx-liquid-glass inline-flex h-11 w-11 items-center justify-center rounded-md text-[var(--silver)]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav ref={linksRef} className="mt-14 flex flex-col gap-1" aria-label="Mobile primary">
          {links.map((l, i) => (
            <a
              key={l.label}
              href={l.href}
              onClick={onClose}
              className="group flex min-h-[56px] items-baseline justify-between border-b border-[color-mix(in_oklab,var(--silver)_8%,transparent)] py-5"
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
          href="/#contact"
          aria-label={headerCta}
          onClick={() => {
            trackCta({ cta: "start_project", section: "mobile_menu", href: "#contact" });
            onClose();
          }}
          className="cx-btn cx-liquid-glass mt-auto inline-flex h-14 items-center justify-center gap-2 rounded-md text-[var(--silver)] hud-label shadow-[var(--shadow-glow-teal)]"
        >
          {headerCta}
          <span aria-hidden className="text-[var(--accent-glow)]">
            →
          </span>
        </a>
      </div>
    </div>
  );
}
