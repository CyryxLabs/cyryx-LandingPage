import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

const FRAME_COUNT = 40;
const FRAME_BACKGROUND = "#020506";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const MOBILE_QUERY = "(max-width: 767px)";
const HERO_PROGRESS_EVENT = "cyryx:hero-sequence-progress";

type FrameVariant = "desktop" | "mobile";

type HeroProgressDetail = {
  progress: number;
};

function subscribeToReducedMotion(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getServerReducedMotionSnapshot() {
  return false;
}

function frameSource(variant: FrameVariant, frame: number) {
  return `/media/hero-sequence/${variant}/cyryx-hero-frame-${String(frame).padStart(3, "0")}.webp`;
}

function loadFrame(src: string, highPriority: boolean) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    if (highPriority) image.fetchPriority = "high";
    image.onload = () => {
      void image
        .decode()
        .catch(() => undefined)
        .finally(() => resolve(image));
    };
    image.onerror = () => reject(new Error(`Unable to load hero frame: ${src}`));
    image.src = src;
  });
}

export function CyryxHeroSequence() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const progressRef = useRef(0);
  const rafRef = useRef(0);
  const [variant, setVariant] = useState<FrameVariant | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );

  const drawFrame = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      const image = framesRef.current[frameIndex];
      if (!canvas || !image) return;

      const context = canvas.getContext("2d", { alpha: false });
      if (!context) return;

      const bounds = canvas.getBoundingClientRect();
      if (bounds.width <= 0 || bounds.height <= 0) return;

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = Math.round(bounds.width * pixelRatio);
      const displayHeight = Math.round(bounds.height * pixelRatio);
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }

      const contain = variant === "mobile";
      const scale = contain
        ? Math.min(displayWidth / image.naturalWidth, displayHeight / image.naturalHeight)
        : Math.max(displayWidth / image.naturalWidth, displayHeight / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      const x = (displayWidth - drawWidth) / 2;
      const y = (displayHeight - drawHeight) / 2;

      context.fillStyle = FRAME_BACKGROUND;
      context.fillRect(0, 0, displayWidth, displayHeight);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(image, x, y, drawWidth, drawHeight);
      canvas.dataset.frameIndex = String(frameIndex + 1);
    },
    [variant],
  );

  const scheduleDraw = useCallback(() => {
    if (!ready || rafRef.current) return;
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = 0;
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.max(0, Math.round(progressRef.current * (FRAME_COUNT - 1))),
      );
      drawFrame(frameIndex);
    });
  }, [drawFrame, ready]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const syncVariant = () => setVariant(mediaQuery.matches ? "mobile" : "desktop");
    syncVariant();
    mediaQuery.addEventListener("change", syncVariant);
    return () => mediaQuery.removeEventListener("change", syncVariant);
  }, []);

  useEffect(() => {
    if (reducedMotion || !variant) {
      framesRef.current = [];
      setLoadProgress(reducedMotion ? 100 : 0);
      setReady(false);
      setFailed(false);
      return;
    }

    let cancelled = false;
    let loadedCount = 0;
    setReady(false);
    setFailed(false);
    setLoadProgress(0);
    framesRef.current = [];

    const loadSequence = async () => {
      const results = await Promise.allSettled(
        Array.from({ length: FRAME_COUNT }, (_, index) =>
          loadFrame(frameSource(variant, index + 1), index === 0).then((image) => {
            loadedCount += 1;
            if (!cancelled) setLoadProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
            return image;
          }),
        ),
      );
      if (cancelled) return;

      const rejected = results.some((result) => result.status === "rejected");
      if (rejected) {
        framesRef.current = [];
        setFailed(true);
        setReady(false);
        return;
      }

      framesRef.current = results.map(
        (result) => (result as PromiseFulfilledResult<HTMLImageElement>).value,
      );
      setLoadProgress(100);
      setReady(true);
      window.dispatchEvent(new CustomEvent("cyryx:hero-sequence-ready"));
    };

    void loadSequence();
    return () => {
      cancelled = true;
      framesRef.current = [];
    };
  }, [reducedMotion, variant]);

  useEffect(() => {
    const onProgress = (event: Event) => {
      const detail = (event as CustomEvent<HeroProgressDetail>).detail;
      progressRef.current = Math.min(1, Math.max(0, detail?.progress ?? 0));
      scheduleDraw();
    };
    window.addEventListener(HERO_PROGRESS_EVENT, onProgress);
    return () => window.removeEventListener(HERO_PROGRESS_EVENT, onProgress);
  }, [scheduleDraw]);

  useEffect(() => {
    if (!ready) return;
    scheduleDraw();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resizeObserver = new ResizeObserver(scheduleDraw);
    resizeObserver.observe(canvas);
    return () => resizeObserver.disconnect();
  }, [ready, scheduleDraw]);

  useEffect(
    () => () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const mode = reducedMotion ? "still" : ready ? "sequence" : failed ? "fallback" : "loading";

  return (
    <div
      ref={rootRef}
      className="cx-hero-sequence absolute inset-0"
      data-hero-sequence
      data-sequence-mode={mode}
      data-sequence-ready={ready ? "true" : "false"}
    >
      <picture className="absolute inset-0">
        <source
          media="(max-width: 767px)"
          srcSet={frameSource("mobile", reducedMotion ? FRAME_COUNT : 1)}
        />
        <img
          src={frameSource("desktop", reducedMotion ? FRAME_COUNT : 1)}
          alt=""
          fetchPriority="high"
          loading="eager"
          decoding="async"
          width={1920}
          height={1080}
          data-no3d="1"
          data-hero-poster
          className="cx-hero-sequence-poster absolute inset-0 h-full w-full object-contain sm:object-cover"
          draggable={false}
        />
      </picture>

      {!reducedMotion && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          data-no3d="1"
          data-hero-canvas
          className={`cx-hero-sequence-canvas absolute inset-0 h-full w-full transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
        />
      )}

      {!reducedMotion && !ready && !failed && (
        <div
          role="status"
          aria-live="polite"
          data-hero-loader
          className="cx-hero-sequence-loader absolute bottom-7 right-5 z-10 flex items-center gap-3 sm:bottom-10 sm:right-10"
        >
          <span className="cx-hero-sequence-spinner h-4 w-4 rounded-full border border-white/20 border-t-[var(--accent-glow)]" />
          <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/55">
            Loading experience {loadProgress}%
          </span>
        </div>
      )}

      {failed && (
        <p className="sr-only" role="status">
          The animated hero could not be loaded. A static Cyryx image is displayed instead.
        </p>
      )}
    </div>
  );
}
