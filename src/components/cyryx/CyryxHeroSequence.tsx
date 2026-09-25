import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

const FRAME_COUNT = 40;
const PRELOAD_BATCH_SIZE = 4;
// Portrait pull-back: from this frame to the last, the film eases from a cover
// fit to a fit that keeps the logo lockup visible. The lockup (mark + wordmark,
// with margin) spans 42% of the 1920px master frame. It is expressed in source
// pixels per 1080px of frame height so it holds for the cropped portrait frames.
const PULLBACK_START_FRAME = 32;
const LOCKUP_SOURCE_WIDTH = 0.42 * 1920;
const SOURCE_FRAME_HEIGHT = 1080;
const FRAME_BACKGROUND = "#020506";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
// Portrait phones load a 960x1080 centre crop of the master frames (about 45%
// lighter). Everything a portrait cover fit can show lives inside that crop.
const PORTRAIT_FRAMES_QUERY = "(max-width: 767px) and (orientation: portrait)";
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

function loadFrame(src: string, highPriority: boolean, signal: AbortSignal) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    let settled = false;

    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      signal.removeEventListener("abort", onAbort);
      callback();
    };
    const onAbort = () => {
      image.onload = null;
      image.onerror = null;
      image.src = "";
      finish(() => reject(new DOMException("Hero frame load aborted", "AbortError")));
    };

    if (signal.aborted) {
      onAbort();
      return;
    }

    signal.addEventListener("abort", onAbort, { once: true });
    image.decoding = "async";
    image.fetchPriority = highPriority ? "high" : "low";
    image.onload = () => {
      void image
        .decode()
        .catch(() => undefined)
        .finally(() => {
          if (signal.aborted) return;
          finish(() => resolve(image));
        });
    };
    image.onerror = () => finish(() => reject(new Error(`Unable to load hero frame: ${src}`)));
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
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [lowPerformance, setLowPerformance] = useState(false);
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

      // Full-bleed on every breakpoint, like desktop. On portrait screens the
      // closing frames pull back so the whole logo lockup (mark + wordmark)
      // stays inside the viewport instead of being cropped by the cover fit.
      const coverScale = Math.max(
        displayWidth / image.naturalWidth,
        displayHeight / image.naturalHeight,
      );
      let scale = coverScale;
      if (displayWidth < displayHeight) {
        const lockupWidth = LOCKUP_SOURCE_WIDTH * (image.naturalHeight / SOURCE_FRAME_HEIGHT);
        const lockupScale = Math.min(coverScale, displayWidth / lockupWidth);
        const frameNumber = frameIndex + 1;
        const t = Math.min(
          1,
          Math.max(0, (frameNumber - PULLBACK_START_FRAME) / (FRAME_COUNT - PULLBACK_START_FRAME)),
        );
        const eased = t * t * (3 - 2 * t);
        scale = coverScale + (lockupScale - coverScale) * eased;
      }
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
    const mediaQuery = window.matchMedia(PORTRAIT_FRAMES_QUERY);
    const syncVariant = () => setVariant(mediaQuery.matches ? "mobile" : "desktop");
    syncVariant();
    mediaQuery.addEventListener("change", syncVariant);
    return () => mediaQuery.removeEventListener("change", syncVariant);
  }, []);

  useEffect(() => {
    setLowPerformance(document.documentElement.classList.contains("cx-low-perf"));
  }, []);

  useEffect(() => {
    if (reducedMotion || lowPerformance || !variant) {
      framesRef.current = [];
      setReady(false);
      setFailed(false);
      return;
    }

    const controller = new AbortController();
    let loadedCount = 0;
    setReady(false);
    setFailed(false);
    framesRef.current = [];

    const loadSequence = async () => {
      const loadedFrames: HTMLImageElement[] = [];

      try {
        for (let offset = 0; offset < FRAME_COUNT; offset += PRELOAD_BATCH_SIZE) {
          const batchSize = Math.min(PRELOAD_BATCH_SIZE, FRAME_COUNT - offset);
          const batch = await Promise.all(
            Array.from({ length: batchSize }, (_, batchIndex) => {
              const frameIndex = offset + batchIndex;
              return loadFrame(
                // Same full-bleed film on every screen; portrait phones fetch
                // the cropped frames, which hold everything they can display.
                frameSource(variant, frameIndex + 1),
                frameIndex === 0,
                controller.signal,
              );
            }),
          );

          if (controller.signal.aborted) return;
          loadedFrames.push(...batch);
          loadedCount += batch.length;

          if (loadedCount < FRAME_COUNT) {
            await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
          }
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        framesRef.current = [];
        setFailed(true);
        setReady(false);
        return;
      }

      framesRef.current = loadedFrames;
      setReady(true);
      window.dispatchEvent(new CustomEvent("cyryx:hero-sequence-ready"));
    };

    const loadTimer = window.setTimeout(() => void loadSequence(), 0);
    return () => {
      window.clearTimeout(loadTimer);
      controller.abort();
      framesRef.current = [];
    };
  }, [lowPerformance, reducedMotion, variant]);

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

  const stillMode = reducedMotion || lowPerformance;
  const mode = stillMode ? "still" : ready ? "sequence" : failed ? "fallback" : "loading";

  return (
    <div
      ref={rootRef}
      className="cx-hero-sequence absolute inset-0"
      data-hero-sequence
      data-sequence-mode={mode}
      data-sequence-ready={ready ? "true" : "false"}
    >
      {/* The opening frame is the poster in every mode. The final frame (logo
          lockup) sat behind the headline in still mode and competed with it. */}
      <picture className="absolute inset-0">
        <source media={PORTRAIT_FRAMES_QUERY} srcSet={frameSource("mobile", 1)} />
        <img
          src={frameSource("desktop", 1)}
          alt=""
          fetchPriority="high"
          loading="eager"
          decoding="async"
          width={1920}
          height={1080}
          data-no3d="1"
          data-hero-poster
          className="cx-hero-sequence-poster absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
      </picture>

      {!stillMode && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          data-no3d="1"
          data-hero-canvas
          className={`cx-hero-sequence-canvas absolute inset-0 h-full w-full transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
        />
      )}

      {failed && (
        <p className="sr-only" role="status">
          The animated hero could not be loaded. A static Cyryx image is displayed instead.
        </p>
      )}
    </div>
  );
}
