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
        className="h-[120vh] w-auto opacity-[0.07]"
        style={{
          filter: "blur(0.4px) drop-shadow(0 0 60px rgba(0,0,0,0.6))",
          mixBlendMode: "screen",
        }}
      >
        <defs>
          <linearGradient id="cx-mono-steel" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1a2326" />
            <stop offset="45%" stopColor="#8a979b" />
            <stop offset="100%" stopColor="#222a2d" />
          </linearGradient>
          <linearGradient id="cx-mono-steel-r" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#1a2326" />
            <stop offset="45%" stopColor="#8a979b" />
            <stop offset="100%" stopColor="#222a2d" />
          </linearGradient>
        </defs>

        {/* Left half of the hex monolith — gap in the middle for the core line */}
        <path
          d="M295 40 L120 180 L120 760 L210 880 L210 1060 L295 1060 Z"
          fill="url(#cx-mono-steel)"
          stroke="rgba(180,200,205,0.35)"
          strokeWidth="1"
        />
        {/* Right half — mirrored */}
        <path
          d="M305 40 L480 180 L480 760 L390 880 L390 1060 L305 1060 Z"
          fill="url(#cx-mono-steel-r)"
          stroke="rgba(180,200,205,0.35)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}