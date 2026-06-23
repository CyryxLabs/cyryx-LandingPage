import monolith from "@/assets/cyryx-monolith.png.asset.json";

export function CyryxMark({
  size = 28,
  className = "",
}: { size?: number; className?: string }) {
  return (
    <img
      src={monolith.url}
      width={size}
      height={size}
      alt=""
      aria-hidden
      className={`block object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function CyryxWordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-display text-silver-gradient text-[15px] font-semibold tracking-[0.28em] uppercase ${className}`}
    >
      Cyryx<span className="text-[var(--accent-glow)]">·</span>Labs
    </span>
  );
}