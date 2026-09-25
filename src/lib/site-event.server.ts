import { publicDestination, publicPath } from "./public-location";

/**
 * Maps a browser CTA/funnel beacon to the CRM `/event` contract (schemaVersion
 * "1", see docs/integration/intake-contract-v1.md in CyryxLabs/cyryx-crm).
 * Only public routing data leaves the site: no query strings, no e-mail
 * addresses, no IP. The CRM validates again against its own fixed event list.
 */

export type BeaconInput = {
  cta: string;
  section: string;
  path: string;
  href?: string | null;
  variant?: string | null;
  referrer?: string | null;
};

export type CrmSiteEvent = {
  schemaVersion: "1";
  event: string;
  section: string;
  path: string;
  href: string | null;
  variant: string | null;
  referrerHost: string | null;
  device: "mobile" | "tablet" | "desktop" | null;
};

const NAME = /^[a-z][a-z0-9_]{0,63}$/;
const VARIANT = /^[a-z0-9_-]{1,32}$/;

export function deviceClass(userAgent: string | null): CrmSiteEvent["device"] {
  if (!userAgent) return null;
  if (/iPad|Tablet|PlayBook|Silk|Android(?!.*Mobile)/i.test(userAgent)) return "tablet";
  if (/Mobi|iPhone|iPod|Android/i.test(userAgent)) return "mobile";
  return "desktop";
}

function referrerHost(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.hostname.toLowerCase().slice(0, 253) || null;
  } catch {
    return null;
  }
}

function destination(href: string | null | undefined, path: string): string | null {
  const value = publicDestination(href);
  if (!value) return null;
  if (value.startsWith("#")) return `${path}${value}`.slice(0, 512);
  if (value.startsWith("/")) return value.slice(0, 512);
  if (value.startsWith("mailto:")) return "mailto:";
  if (value.startsWith("https://")) return value.slice(0, 512);
  return null;
}

export function toCrmSiteEvent(input: BeaconInput, userAgent: string | null): CrmSiteEvent | null {
  const event = input.cta.trim().toLowerCase();
  const section = input.section.trim().toLowerCase();
  if (!NAME.test(event) || !NAME.test(section)) return null;
  const path = publicPath(input.path).slice(0, 512);
  const variant = input.variant?.trim().toLowerCase() || null;
  return {
    schemaVersion: "1",
    event,
    section,
    path,
    href: destination(input.href, path),
    variant: variant && VARIANT.test(variant) ? variant : null,
    referrerHost: referrerHost(input.referrer),
    device: deviceClass(userAgent),
  };
}

/**
 * Best-effort per-visitor limiter for one server instance. Serverless
 * instances do not share it; the CRM adds a global cap on its side.
 */
export function createVisitorLimiter(limit: number, windowMs: number, maxKeys = 5_000) {
  const buckets = new Map<string, { count: number; resetAt: number }>();
  return (key: string, now = Date.now()): boolean => {
    const bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      if (buckets.size >= maxKeys) {
        for (const [candidate, value] of buckets) {
          if (value.resetAt <= now) buckets.delete(candidate);
        }
        if (buckets.size >= maxKeys) buckets.clear();
      }
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    }
    bucket.count += 1;
    return bucket.count <= limit;
  };
}

/** Same-origin check: beacons from this site carry an Origin equal to the host. */
export function isSameOrigin(origin: string | null, host: string | null): boolean {
  if (!origin) return true; // Some browsers omit Origin on same-origin beacons.
  if (!host) return false;
  try {
    return new URL(origin).host.toLowerCase() === host.toLowerCase();
  } catch {
    return false;
  }
}
