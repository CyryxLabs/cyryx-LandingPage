declare const __CYRYX_BUILD_VERSION__: string;

export const BUILD_VERSION = __CYRYX_BUILD_VERSION__;
export const BUILD_LABEL = BUILD_VERSION.replace(/[^0-9A-Za-z]/g, "").slice(0, 14) || "dev";
