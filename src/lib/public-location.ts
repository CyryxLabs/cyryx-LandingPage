/**
 * Reduce navigation metadata to the minimum public routing information needed
 * for attribution. Query strings and fragments may contain user-provided data
 * or one-time tokens, so they are never included.
 */
export function publicPath(value: string): string {
  if (!value) return "/";
  try {
    const url = new URL(value, "https://cyryx.invalid");
    if (url.protocol !== "http:" && url.protocol !== "https:") return "/";
    return url.pathname || "/";
  } catch {
    return "/";
  }
}

export function publicReferrer(value: string): string {
  if (!value) return "";
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    return `${url.origin}${url.pathname}`;
  } catch {
    return "";
  }
}

export function publicDestination(value?: string | null): string | null {
  if (!value) return null;
  if (value.startsWith("#")) return value.slice(0, 128);

  try {
    const url = new URL(value, "https://cyryx.invalid");
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.origin === "https://cyryx.invalid"
        ? url.pathname || "/"
        : `${url.origin}${url.pathname}`;
    }
    if (url.protocol === "mailto:" || url.protocol === "tel:") {
      return `${url.protocol}${url.pathname}`.slice(0, 512);
    }
    return null;
  } catch {
    return null;
  }
}
