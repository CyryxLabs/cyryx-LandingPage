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

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
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
        "group relative inline-flex h-12 items-center justify-center gap-2 rounded-md px-7 hud-label font-semibold transition-[transform,box-shadow,background-color,color] duration-300 ease-out will-change-transform",
        variant === "primary"
          ? "bg-[var(--accent-glow)] text-[var(--onyx)] shadow-[var(--shadow-glow-teal)] hover:brightness-110"
          : "border border-[color-mix(in_oklab,var(--silver)_18%,transparent)] text-[var(--silver)] hover:border-[var(--accent-glow)] hover:bg-[color-mix(in_oklab,var(--accent-glow)_8%,transparent)]",
        className,
      )}
    >
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </a>
  );
}