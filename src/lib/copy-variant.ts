/**
 * Hidden copy-variant toggle. Default is "v3". A visitor can pin a different
 * variant for their browser by appending `?copy=v4` (or any other key listed
 * in the registry) — the choice is persisted in localStorage. Search engines
 * and first-load visitors always see v3.
 */
import { useSyncExternalStore } from "react";
import { AVAILABLE_COPY_VARIANTS, type CopyVariant } from "@/copy";

const STORAGE_KEY = "cyryx_copy_variant";
const URL_PARAM = "copy";
const DEFAULT_VARIANT: CopyVariant = "v3";

function isVariant(value: string | null | undefined): value is CopyVariant {
  if (!value) return false;
  return (AVAILABLE_COPY_VARIANTS as readonly string[]).includes(value);
}

/**
 * Synchronous getter — safe to call from client code or analytics helpers.
 * Always returns "v3" on the server.
 */
export function getActiveCopyVariant(): CopyVariant {
  if (typeof window === "undefined") return DEFAULT_VARIANT;
  try {
    const url = new URL(window.location.href);
    const fromUrl = url.searchParams.get(URL_PARAM);
    if (isVariant(fromUrl)) {
      try {
        window.localStorage.setItem(STORAGE_KEY, fromUrl);
      } catch {}
      return fromUrl;
    }
    const fromStorage = window.localStorage.getItem(STORAGE_KEY);
    if (isVariant(fromStorage)) return fromStorage;
  } catch {}
  return DEFAULT_VARIANT;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback();
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

/**
 * React hook — returns the active variant and re-renders on storage changes.
 * On the server it returns "v3" so SSR markup matches a fresh visitor.
 */
export function useCopyVariant(): CopyVariant {
  return useSyncExternalStore(
    subscribe,
    () => getActiveCopyVariant(),
    () => DEFAULT_VARIANT,
  );
}

/**
 * Hydration helper — call from a client effect to set the doc-level marker
 * and a window-scoped global other modules (analytics) can read.
 */
export function syncCopyVariantToDocument(): void {
  if (typeof window === "undefined") return;
  const variant = getActiveCopyVariant();
  document.documentElement.dataset.copy = variant;
  (window as unknown as { __cyryxCopyVariant?: CopyVariant }).__cyryxCopyVariant =
    variant;
}