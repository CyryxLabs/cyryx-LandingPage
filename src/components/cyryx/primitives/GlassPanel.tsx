import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glow?: boolean;
}

export function GlassPanel({ className, children, glow, ...rest }: Props) {
  return (
    <div
      className={cn(
        "relative rounded-xl glass-panel",
        glow && "shadow-[var(--shadow-glow-teal)]",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}