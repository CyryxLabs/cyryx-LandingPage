export const SITE_ORIGIN = "https://www.cyryxlabs.com";
export const SITE_URL = `${SITE_ORIGIN}/`;

/**
 * Returns an absolute URL on the single public Cyryx Labs origin.
 * Callers pass a site-relative path so metadata cannot accidentally drift to
 * an alternate host that redirects.
 */
export function absoluteSiteUrl(path = "/"): string {
  const sitePath = path.startsWith("/") ? path : `/${path}`;
  return new URL(sitePath, SITE_URL).href;
}
