import markAsset from "@/assets/cyryx-mark.png.asset.json";
import wordmarkAsset from "@/assets/cyryx-wordmark.png.asset.json";

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
      className={`block object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function CyryxWordmark({ className = "" }: { className?: string }) {
  return (
    <img
      src={wordmarkAsset.url}
      alt="Cyryx Labs"
      className={`block w-auto object-contain ${className || "h-7"}`}
      draggable={false}
    />
  );
}