/**
 * Fire-and-forget CTA click tracker. Uses sendBeacon so the request survives
 * the same-tab navigation/hash change that follows the click.
 *
 * Endpoint: POST /api/public/cta-events (anon-insertable, admins-read-only).
 */
import { getActiveCopyVariant } from "./copy-variant";

export type CtaName =
  | "start_project"
  | "request_early_access"
  | "request_maax_access"
  | "explore_maax";

export type CtaSection =
  | "hero"
  | "header"
  | "mobile_menu"
  | "sticky"
  | "maax_spotlight"
  | "final_cta";

export interface TrackCtaInput {
  cta: CtaName;
  section: CtaSection;
  href?: string;
}

const ENDPOINT = "/api/public/cta-events";

export function trackCta({ cta, section, href }: TrackCtaInput): void {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify({
      cta,
      section,
      path: window.location.pathname + window.location.search,
      href: href ?? null,
      variant: getActiveCopyVariant(),
      referrer: document.referrer || null,
    });
    const ok =
      typeof navigator.sendBeacon === "function" &&
      navigator.sendBeacon(
        ENDPOINT,
        new Blob([body], { type: "application/json" }),
      );
    if (!ok) {
      void fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // analytics must never break a click
  }
}