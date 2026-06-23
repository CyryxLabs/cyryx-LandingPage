import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function HudLabel({
  children,
  className,
  withDot = false,
}: {
  children: ReactNode;
  className?: string;
  withDot?: boolean;
}) {
  return (
    <span className={cn("hud-label inline-flex items-center gap-2", className)}>
      {withDot && (
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent-glow)] shadow-[0_0_8px_var(--accent-glow)]" />
      )}
      {children}
    </span>
  );
}