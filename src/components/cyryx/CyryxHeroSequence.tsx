import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

// The scrub covers the monolith "ignition" (frames 1–15): the core line lights
// and the mark appears inside the monolith. The later full-screen logo reveal
// is not used, so it never competes with the hero copy.
const FRAME_NUMBERS = Array.from({ length: 15 }, (_, i) => i + 1);
const FRAME_COUNT = FRAME_NUMBERS.length;
const PRELOAD_BATCH_SIZE = 4;
// Frames start loading after the first interaction, or after this idle delay,
// so they never compete with first paint.
const LOAD_IDLE_DELAY_MS = 2500;
const FRAME_BACKGROUND = "#020506";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const MOBILE_QUERY = "(max-width: 767px)";
const HERO_PROGRESS_EVENT = "cyryx:hero-sequence-progress";

type FrameVariant = "desktop" | "mobile";

const INTERACTION_EVENTS = ["scroll", "wheel", "pointermove", "touchstart", "keydown"] as const;

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
    // Forced-colors mode hides the canvas, so frames would load for nothing.
    setLowPerformance(
      document.documentElement.classList.contains("cx-low-perf") ||
        window.matchMedia("(forced-colors: active)").matches,
    );
  }, []);

  useEffect(() => {
    if (reducedMotion || lowPerformance || !variant || variant === "mobile") {
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
                frameSource(variant, FRAME_NUMBERS[frameIndex]),
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

    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      window.clearTimeout(idleTimer);
      INTERACTION_EVENTS.forEach((type) => window.removeEventListener(type, start));
      void loadSequence();
    };
    const idleTimer = window.setTimeout(start, LOAD_IDLE_DELAY_MS);
    INTERACTION_EVENTS.forEach((type) =>
      window.addEventListener(type, start, { once: true, passive: true }),
    );
    return () => {
      window.clearTimeout(idleTimer);
      INTERACTION_EVENTS.forEach((type) => window.removeEventListener(type, start));
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

  const stillMode = reducedMotion || lowPerformance || variant === "mobile";
  const mode = stillMode ? "still" : ready ? "sequence" : failed ? "fallback" : "loading";

  return (
    <div
      ref={rootRef}
      className="cx-hero-sequence absolute inset-0"
      data-hero-sequence
      data-sequence-mode={mode}
      data-sequence-ready={ready ? "true" : "false"}
    >
      <picture className="absolute inset-0">
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
          className="cx-hero-sequence-poster absolute inset-0 h-full w-full object-cover object-[50%_40%] md:object-center"
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
