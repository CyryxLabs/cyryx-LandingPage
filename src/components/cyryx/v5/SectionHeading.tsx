import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** The shared heading block of the home sections: kicker, H2 and an optional lead. */
export function SectionHeading({
  id,
  kicker,
  title,
  lead,
  align = "split",
  className,
}: {
  id: string;
  kicker?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "split" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "cx-reveal",
        align === "split"
          ? "grid gap-5 sm:gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20"
          : "mx-auto max-w-3xl text-center",
        className,
      )}
    >
      <div>
        {kicker && (
          <p className="mb-4 font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--accent-glow)]">
            {kicker}
          </p>
        )}
        <h2
          id={id}
          className={cn(
            "font-display text-[1.75rem] font-semibold leading-[1.02] tracking-[-0.04em] text-silver-gradient sm:text-[2.125rem] lg:text-[2.75rem] xl:text-[3.25rem]",
            align === "split" ? "max-w-[20ch]" : "mx-auto max-w-[22ch]",
          )}
        >
          {title}
        </h2>
      </div>
      {lead && (
        <p
          className={cn(
            "text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg",
            align === "split" ? "max-w-xl lg:pb-2" : "mx-auto mt-6 max-w-2xl",
          )}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
