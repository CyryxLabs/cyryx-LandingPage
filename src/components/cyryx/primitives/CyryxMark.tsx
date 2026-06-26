import markAsset from "@/assets/cyryx-mark.png.asset.json";
import wordmarkAsset from "@/assets/cyryx-logo-header-transparent.png.asset.json";

/**
 * Official Cyryx brand marks. Header wordmark uses the recut transparent
 * chrome artwork supplied by the brand owner (no white matte box).
 */
export function CyryxMark({
  size = 28,
  className = "",
  priority = false,
}: { size?: number; className?: string; priority?: boolean }) {
  return (
    <img
      src={markAsset.url}
      width={size}
      height={size}
      alt=""
      aria-hidden
      draggable={false}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      className={`block object-contain select-none ${className}`}
      style={{ width: size, height: size, background: "transparent" }}
    />
  );
}

export function CyryxWordmark({
  className = "",
  priority = false,
}: { className?: string; priority?: boolean }) {
  return (
    <img
      src={wordmarkAsset.url}
      alt="Cyryx Labs"
      width={1682}
      height={517}
      draggable={false}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      className={`block w-auto object-contain align-middle select-none opacity-90 ${className || "h-7"}`}
      style={{ background: "transparent", aspectRatio: "1682 / 517" }}
    />
  );
}