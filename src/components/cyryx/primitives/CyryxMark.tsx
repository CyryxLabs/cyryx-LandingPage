// 480px rendition of the approved master (assets/cyryx-brand-wordmark.png),
// resampled only: the artwork itself is unchanged.
import wordmarkAsset from "@/assets/cyryx-wordmark-480.webp";

/**
 * Official Cyryx Labs wordmark, used exactly as supplied by the brand owner.
 *
 * Founder decision 2026-11-13: the site uses the wordmark only. The crest
 * (monolith) mark is no longer shown anywhere, so `CyryxLockup` renders the
 * wordmark alone and `CyryxMark` renders nothing.
 */
export function CyryxWordmark({
  className = "",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <img
      src={wordmarkAsset}
      alt="Cyryx Labs"
      data-no3d="1"
      data-cyryx-wordmark
      width={480}
      height={118}
      draggable={false}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      className={`block w-auto object-contain align-middle select-none ${className || "h-7"}`}
      style={{ background: "transparent", aspectRatio: "480 / 118" }}
    />
  );
}

export function CyryxLockup({
  className = "",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <span className={`inline-flex items-center ${className || "h-10"}`} data-cyryx-lockup>
      <CyryxWordmark priority={priority} className="h-full" />
    </span>
  );
}

/** Retired crest mark. Kept as a no-op so older imports keep compiling. */
export function CyryxMark(_props: { size?: number; className?: string; priority?: boolean }) {
  return null;
}
