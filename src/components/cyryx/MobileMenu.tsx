import { useEffect, useRef, useState, useMemo } from "react";
import { X } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import { CyryxMark, CyryxWordmark } from "./primitives/CyryxMark";
import { trackCta } from "@/lib/track-cta";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  PRIMARY_NAVIGATION,
  PRIMARY_NAVIGATION_CTA,
  getActiveNavigationGroup,
  isNavigationItemActive,
  isPrimaryNavigationCTAActive,
} from "@/lib/navigation";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  const pathname = useMemo(() => location.pathname, [location.pathname]);

  // Accordion state
  const activeGroup = useMemo(() => getActiveNavigationGroup(pathname), [pathname]);
  const [expandedGroup, setExpandedGroup] = useState("");

  // Sync expanded group with current route on open
  useEffect(() => {
    if (open) {
      setExpandedGroup(activeGroup ?? "");
    }
  }, [open, activeGroup]);

  // Entrance/Exit Animation
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    let cancelled = false;
    let ctx: { revert: () => void } | null = null;

    // Use reduced motion check
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion) {
      import("gsap").then(({ gsap }) => {
        if (cancelled) return;
        ctx = gsap.context(() => {
          gsap.fromTo(
            panelRef.current,
            { opacity: 0, y: -16 },
            { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" },
          );
        }, panelRef);
      });
    } else {
      // Immediate state for reduced motion
      if (panelRef.current) {
        panelRef.current.style.opacity = "1";
        panelRef.current.style.transform = "none";
      }
    }

    return () => {
      cancelled = true;
      ctx?.revert();
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Focus trap
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const focusFirst = window.requestAnimationFrame(() => closeRef.current?.focus());

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      const visibleFocusable = Array.from(focusable).filter((el) => {
        const style = window.getComputedStyle(el);
        return (
          style.display !== "none" && style.visibility !== "hidden" && el.offsetParent !== null
        );
      });

      if (visibleFocusable.length === 0) return;
      const first = visibleFocusable[0];
      const last = visibleFocusable[visibleFocusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFirst);
      document.removeEventListener("keydown", onKeyDown);
      opener?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      id="cyryx-mobile-navigation"
      role="dialog"
      aria-modal="true"
      aria-label="Main navigation"
      className="cx-liquid-glass fixed inset-0 z-[60] rounded-none border-none lg:hidden overflow-y-auto overflow-x-hidden w-full max-w-[100vw]"
      style={{
        background:
          "linear-gradient(135deg, color-mix(in oklab, var(--onyx) 88%, transparent) 0%, color-mix(in oklab, var(--onyx) 78%, transparent) 100%)",
      }}
    >
      <div className="absolute inset-0 grid-floor opacity-30 pointer-events-none" aria-hidden />

      <div className="relative flex min-h-full flex-col px-6 pt-[max(env(safe-area-inset-top),1.25rem)] pb-[max(env(safe-area-inset-bottom),2.5rem)]">
        <div className="flex items-center justify-between h-12 shrink-0">
          <div className="flex items-center gap-2.5">
            <CyryxMark size={30} />
            <CyryxWordmark />
          </div>
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

        <nav className="mt-14 flex flex-col gap-1" aria-label="Mobile primary">
          <Accordion
            type="single"
            collapsible
            value={expandedGroup}
            onValueChange={setExpandedGroup}
            className="w-full"
          >
            {PRIMARY_NAVIGATION.map((group) => {
              const isActive = activeGroup === group.id;
              return (
                <AccordionItem key={group.id} value={group.id} className="border-none">
                  <AccordionTrigger
                    className={cn(
                      "hud-label text-[var(--silver)] hover:text-white py-5 min-h-[44px]",
                      isActive && "text-[var(--accent-glow)]",
                      expandedGroup === group.id && "text-white",
                    )}
                  >
                    {group.label}
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-0.5 pb-2">
                    {group.children.map((item) => {
                      const isItemActive = isNavigationItemActive(pathname, item.href);
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          resetScroll
                          onClick={onClose}
                          className={cn(
                            "flex items-center min-h-[44px] px-4 py-3 rounded-md transition-colors",
                            "text-[var(--silver)] hover:text-white hover:bg-[color-mix(in_oklab,var(--silver)_5%,transparent)]",
                            isItemActive && "text-[var(--accent-glow)] font-medium",
                          )}
                          aria-current={isItemActive ? "page" : undefined}
                        >
                          <span className="hud-label text-sm uppercase tracking-wider">
                            {item.label}
                          </span>
                        </Link>
                      );
                    })}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          <div className="mt-6 pt-6 border-t border-[color-mix(in_oklab,var(--silver)_8%,transparent)]">
            <Link
              to={PRIMARY_NAVIGATION_CTA.href}
              resetScroll
              onClick={() => {
                trackCta({
                  cta: "start_project",
                  section: "mobile_menu",
                  href: PRIMARY_NAVIGATION_CTA.href,
                });
                onClose();
              }}
              aria-current={isPrimaryNavigationCTAActive(pathname) ? "page" : undefined}
              className={cn(
                "cx-btn cx-liquid-glass flex min-h-[44px] w-full items-center justify-center rounded-md hud-label text-[var(--silver)] transition-all",
                isPrimaryNavigationCTAActive(pathname)
                  ? "border-[var(--accent-glow)] text-white shadow-[0_0_12px_var(--accent-glow)]"
                  : "hover:text-white",
              )}
            >
              {PRIMARY_NAVIGATION_CTA.label}
              <span aria-hidden className="ml-2 text-[var(--accent-glow)]">
                →
              </span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
