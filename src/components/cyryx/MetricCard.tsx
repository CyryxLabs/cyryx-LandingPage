import { GlassPanel } from "./primitives/GlassPanel";
import { HudLabel } from "./primitives/HudLabel";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  format,
  decimals,
  suffix,
  status,
  className,
}: {
  label: string;
  value: number;
  format?: string;
  decimals?: number;
  suffix?: string;
  status?: string;
  className?: string;
}) {
  return (
    <GlassPanel className={cn("p-4 sm:p-5", className)}>
      <div className="flex items-start justify-between gap-2">
        <HudLabel>{label}</HudLabel>
        {status && (
          <span className="hud-label text-[var(--accent-glow)] inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-glow)] shadow-[0_0_8px_var(--accent-glow)]" />
            {status}
          </span>
        )}
      </div>
      <div className="mt-3 font-display text-2xl sm:text-3xl font-semibold text-silver-gradient">
        <span
          data-countup={value}
          data-countup-decimals={decimals ?? 0}
          data-countup-format={format ?? "{n}"}
        >
          {(format ?? "{n}").replace("{n}", "0")}
        </span>
        {suffix && <span className="ml-1 text-base text-[var(--silver-dim)]">{suffix}</span>}
      </div>
    </GlassPanel>
  );
}