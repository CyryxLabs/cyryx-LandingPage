/**
 * Section-bound brand architecture for the Capabilities chapter.
 * Unlike the legacy page-fixed monolith, this visual is clipped to one
 * narrative surface so it never crosses unrelated content or the form.
 */
export function CapabilityMonolith({
  className = "pointer-events-none absolute inset-y-0 left-1/2 z-0 hidden w-[min(46rem,58vw)] -translate-x-1/2 overflow-hidden lg:block",
  surfaceOpacity = "opacity-[0.075]",
}: {
  /** Positioning of the visual. Defaults to the full-section background. */
  className?: string;
  /** Opacity utility for the steel surfaces. */
  surfaceOpacity?: string;
} = {}) {
  return (
    <div data-capability-monolith aria-hidden="true" className={className}>
      <svg
        viewBox="0 0 600 1100"
        preserveAspectRatio="xMidYMid meet"
        className={`absolute inset-0 h-full w-full ${surfaceOpacity}`}
      >
        <defs>
          <linearGradient id="cx-capability-steel-left" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#263034" />
            <stop offset="58%" stopColor="#b8c2c6" />
            <stop offset="100%" stopColor="#354044" />
          </linearGradient>
          <linearGradient id="cx-capability-steel-right" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#263034" />
            <stop offset="58%" stopColor="#b8c2c6" />
            <stop offset="100%" stopColor="#354044" />
          </linearGradient>
        </defs>
        <path
          d="M292 6 L92 128 L92 690 L214 834 L214 1094 L292 1094 Z"
          fill="url(#cx-capability-steel-left)"
          stroke="rgba(200,220,225,0.62)"
          strokeWidth="1.2"
        />
        <path
          d="M308 6 L508 128 L508 690 L386 834 L386 1094 L308 1094 Z"
          fill="url(#cx-capability-steel-right)"
          stroke="rgba(200,220,225,0.62)"
          strokeWidth="1.2"
        />
      </svg>

      <span className="absolute inset-y-[3%] left-1/2 w-px -translate-x-1/2 bg-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)]">
        <span
          data-capability-monolith-core
          className="absolute inset-0 origin-top [transform:scaleY(0)] bg-[linear-gradient(180deg,transparent_0%,var(--accent-glow)_10%,var(--accent-glow)_88%,transparent_100%)] shadow-[0_0_18px_2px_color-mix(in_oklab,var(--accent-glow)_32%,transparent)]"
        />
        <span
          data-capability-monolith-pulse
          className="absolute left-1/2 top-0 h-24 w-[3px] -translate-x-1/2 opacity-0 bg-[linear-gradient(180deg,transparent,var(--accent-glow),white,var(--accent-glow),transparent)] shadow-[0_0_28px_7px_color-mix(in_oklab,var(--accent-glow)_48%,transparent)]"
        />
      </span>
    </div>
  );
}
