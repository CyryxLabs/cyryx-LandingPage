/**
 * Fire-and-forget CTA click tracker. Uses sendBeacon so the request survives
 * the same-tab navigation/hash change that follows the click.
 *
 * Endpoint: POST /api/public/cta-events (anon-insertable, admins-read-only).
 */
import { getActiveCopyVariant } from "./copy-variant";
import { publicDestination, publicPath, publicReferrer } from "./public-location";

export type CtaName =
  | "start_project"
  | "request_early_access"
  | "request_maax_access"
  | "explore_maax"
  | "see_delivery"
  | "careers_talent_network"
  | "careers_email"
  | "talent_network_signup"
  | "explore_products"
  | "contact_email"
  | "view_research"
  | "read_cgp"
  | "maax_waitlist_view"
  | "maax_waitlist_started"
  | "maax_waitlist_submitted"
  | "maax_waitlist_error"
  | "qualification_form_submitted"
  | "qualification_form_error";

export type CtaSection =
  | "hero"
  | "header"
  | "mobile_menu"
  | "sticky"
  | "maax_spotlight"
  | "final_cta"
  | "paths"
  | "solutions"
  | "careers"
  | "contact"
  | "footer"
  | "research_band"
  | "maax_product"
  | "start";

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
      path: publicPath(window.location.href),
      href: publicDestination(href),
      variant: getActiveCopyVariant(),
      referrer: publicReferrer(document.referrer) || null,
    });
    const ok =
      typeof navigator.sendBeacon === "function" &&
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }));
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
