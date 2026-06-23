import markAsset from "@/assets/cyryx-mark.png.asset.json";
import wordmarkAsset from "@/assets/cyryx-wordmark.png.asset.json";

/**
 * Official Cyryx brand marks. Both files are transparent PNGs uploaded by
 * the brand owner (no white/dark box, no halo).
 */
export function CyryxMark({
  size = 28,
  className = "",
}: { size?: number; className?: string }) {
  return (
    <img
      src={markAsset.url}
      width={size}
      height={size}
      alt=""
      aria-hidden
      draggable={false}
      className={`block object-contain select-none ${className}`}
      style={{ width: size, height: size, background: "transparent" }}
    />
  );
}

export function CyryxWordmark({ className = "" }: { className?: string }) {
  return (
    <img
      src={wordmarkAsset.url}
      alt="Cyryx Labs"
      draggable={false}
      className={`block w-auto object-contain select-none ${className || "h-7"}`}
      style={{ background: "transparent" }}
    />
  );
}