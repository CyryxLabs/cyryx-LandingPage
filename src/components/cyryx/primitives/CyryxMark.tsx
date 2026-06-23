/**
 * Cyryx brand marks rendered as inline SVG (no PNG backgrounds, no halos,
 * truly transparent at any size). The metallic look comes from a linear
 * gradient + a soft teal core line that mirrors the brand monolith.
 */

function SteelDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-steel`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e8edef" />
        <stop offset="35%" stopColor="#aeb9bd" />
        <stop offset="55%" stopColor="#7a868a" />
        <stop offset="100%" stopColor="#cfd6d9" />
      </linearGradient>
      <linearGradient id={`${id}-core`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#00e6d0" stopOpacity="0" />
        <stop offset="50%" stopColor="#00e6d0" stopOpacity="1" />
        <stop offset="100%" stopColor="#00e6d0" stopOpacity="0" />
      </linearGradient>
    </defs>
  );
}

export function CyryxMark({
  size = 28,
  className = "",
}: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={`block ${className}`}
      style={{ width: size, height: size }}
    >
      <SteelDefs id="cx-mark" />
      {/* Hexagonal monolith shield, split with transparent gap */}
      <path
        d="M32 3 L57 17 V47 L32 61 L7 47 V17 Z"
        fill="url(#cx-mark-steel)"
        stroke="#cfd6d9"
        strokeOpacity="0.55"
        strokeWidth="1.25"
      />
      {/* Central gap mask */}
      <rect x="30.4" y="3" width="3.2" height="58" fill="#000" />
      {/* Teal core line */}
      <rect x="31.2" y="6" width="1.6" height="52" fill="url(#cx-mark-core)" />
    </svg>
  );
}

export function CyryxWordmark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 260 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Cyryx Labs"
      className={`block w-auto ${className || "h-7"}`}
    >
      <SteelDefs id="cx-word" />
      {/* Mark on the left */}
      <g transform="translate(0,2)">
        <path
          d="M26 2 L48 14 V38 L26 50 L4 38 V14 Z"
          fill="url(#cx-word-steel)"
          stroke="#cfd6d9"
          strokeOpacity="0.55"
          strokeWidth="1.1"
        />
        <rect x="24.6" y="2" width="2.8" height="48" fill="#0b0f10" />
        <rect x="25.3" y="6" width="1.4" height="40" fill="url(#cx-word-core)" />
      </g>
      {/* Wordmark */}
      <text
        x="64"
        y="36"
        fill="url(#cx-word-steel)"
        fontFamily="'Space Grotesk', 'Inter', system-ui, sans-serif"
        fontWeight={600}
        fontSize="28"
        letterSpacing="6"
      >
        CYRYX
      </text>
      <text
        x="196"
        y="36"
        fill="#00e6d0"
        fontFamily="'Space Grotesk', 'Inter', system-ui, sans-serif"
        fontWeight={400}
        fontSize="14"
        letterSpacing="4"
      >
        LABS
      </text>
    </svg>
  );
}