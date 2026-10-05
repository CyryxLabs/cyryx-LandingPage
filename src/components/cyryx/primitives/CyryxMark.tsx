import markAsset from "@/assets/cyryx-brand-mark.png";
import wordmarkAsset from "@/assets/cyryx-brand-wordmark.png";
import markDisplayAsset from "@/assets/cyryx-brand-mark-display.webp";
import wordmarkDisplayAsset from "@/assets/cyryx-brand-wordmark-display.webp";

/**
 * Official Cyryx brand marks, deterministically cropped from the transparent
 * master artwork supplied by the brand owner.
 * Lossless WebP derivatives cover the current display sizes at 3x density;
 * the original PNGs remain fallbacks without changing layout or accessible names.
 */
export function CyryxMark({
  size = 28,
  className = "",
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <picture className="contents">
      <source className="hidden" type="image/webp" srcSet={markDisplayAsset} />
      <img
        src={markAsset}
        width={320}
        height={512}
        alt=""
        aria-hidden
        data-no3d="1"
        draggable={false}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className={`block object-contain select-none ${className}`}
        style={{ width: size, height: size, background: "transparent" }}
      />
    </picture>
  );
}

export function CyryxWordmark({
  className = "",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <picture className="contents">
      <source className="hidden" type="image/webp" srcSet={wordmarkDisplayAsset} />
      <img
        src={wordmarkAsset}
        alt="Cyryx Labs"
        data-no3d="1"
        width={1200}
        height={296}
        draggable={false}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className={`block w-auto object-contain align-middle select-none ${className || "h-7"}`}
        style={{ background: "transparent", aspectRatio: "1200 / 296" }}
      />
    </picture>
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
    <span
      className={`inline-flex items-center gap-[0.6em] ${className || "h-10"}`}
      data-cyryx-lockup
    >
      <picture className="contents">
        <source className="hidden" type="image/webp" srcSet={markDisplayAsset} />
        <img
          src={markAsset}
          width={320}
          height={512}
          alt=""
          aria-hidden
          data-no3d="1"
          draggable={false}
          decoding="async"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          className="block h-full w-auto shrink-0 object-contain select-none"
          style={{ background: "transparent", aspectRatio: "320 / 512" }}
        />
      </picture>
      <picture className="contents">
        <source className="hidden" type="image/webp" srcSet={wordmarkDisplayAsset} />
        <img
          src={wordmarkAsset}
          alt="Cyryx Labs"
          data-no3d="1"
          width={1200}
          height={296}
          draggable={false}
          decoding="async"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          className="block h-[64%] w-auto object-contain align-middle select-none"
          style={{ background: "transparent", aspectRatio: "1200 / 296" }}
        />
      </picture>
    </span>
  );
}
