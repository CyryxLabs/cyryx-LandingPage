import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glow?: boolean;
  liquid?: boolean;
}

export function GlassPanel({ className, children, glow, liquid, ...rest }: Props) {
  return (
    <div
      className={cn(
        "relative rounded-xl",
        liquid ? "cx-liquid-glass" : "glass-panel",
        glow && "shadow-[var(--shadow-glow-teal)]",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}