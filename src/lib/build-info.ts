declare const __CYRYX_BUILD_VERSION__: string;

// Vite replaces the constant at build time. The dev server can serve a module
// before the define is applied (seen on Windows), so fall back instead of
// throwing during hydration.
export const BUILD_VERSION =
  typeof __CYRYX_BUILD_VERSION__ === "string" ? __CYRYX_BUILD_VERSION__ : "dev";
export const BUILD_LABEL = BUILD_VERSION.replace(/[^0-9A-Za-z]/g, "").slice(0, 14) || "dev";
