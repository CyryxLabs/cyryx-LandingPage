/**
 * Fixed, faded monolith silhouette behind the page.
 * Two mirrored brushed-steel halves with a transparent center gap —
 * the global teal scroll core-line shines through that gap, matching
 * the brand mark.
 */
export function BackgroundMonolith() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 hidden lg:flex items-center justify-center overflow-hidden"
    >
      <svg
        viewBox="0 0 600 1100"
        preserveAspectRatio="xMidYMid meet"
        className="h-[110vh] w-auto opacity-[0.22]"
        style={{
          filter: "drop-shadow(0 0 80px rgba(0,230,208,0.08))",
        }}
      >
        <defs>
          <linearGradient id="cx-mono-steel" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2a3438" />
            <stop offset="45%" stopColor="#c8d4d8" />
            <stop offset="100%" stopColor="#3a464a" />
          </linearGradient>
          <linearGradient id="cx-mono-steel-r" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#2a3438" />
            <stop offset="45%" stopColor="#c8d4d8" />
            <stop offset="100%" stopColor="#3a464a" />
          </linearGradient>
        </defs>

        {/* Left half of the hex monolith — gap in the middle for the core line */}
        <path
          d="M295 40 L120 180 L120 760 L210 880 L210 1060 L295 1060 Z"
          fill="url(#cx-mono-steel)"
          stroke="rgba(200,220,225,0.55)"
          strokeWidth="1.25"
        />
        <path
          d="M305 40 L480 180 L480 760 L390 880 L390 1060 L305 1060 Z"
          fill="url(#cx-mono-steel-r)"
          stroke="rgba(200,220,225,0.55)"
          strokeWidth="1.25"
        />
      </svg>
    </div>
  );
}