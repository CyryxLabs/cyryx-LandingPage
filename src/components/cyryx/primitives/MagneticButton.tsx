import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}

/**
 * Magnetic CTA — pointer pulls the button toward it within a small radius.
 * Pure inline transform, no GSAP needed; respects reduced motion via CSS.
 */
export function MagneticButton({ href, children, variant = "primary", className }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0,0)";
  };

  return (
    <a
      ref={ref}
      href={href}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn(
        "cx-liquid-glass group relative inline-flex h-12 items-center justify-center gap-2 rounded-md px-7 hud-label font-semibold transition-[transform,box-shadow,background-color,color] duration-300 ease-out will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--onyx)]",
        variant === "primary"
          ? "text-[var(--accent-glow)] shadow-[var(--shadow-glow-teal)] hover:brightness-110"
          : "text-[var(--silver)]",
        className,
      )}
    >
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </a>
  );
}