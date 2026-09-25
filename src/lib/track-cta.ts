/**
 * Fire-and-forget CTA click tracker. Uses sendBeacon so the request survives
 * the same-tab navigation/hash change that follows the click.
 *
 * Endpoint: POST /api/public/cta-events (same-origin; forwarded to the CRM
 * funnel ledger, no personal data).
 */
import { getActiveCopyVariant } from "./copy-variant";
import { publicDestination, publicPath, publicReferrer } from "./public-location";

export type CtaName =
  | "start_project"
  | "see_how_we_work"
  | "see_delivery"
  | "view_product"
  | "copy_command"
  | "careers_talent_network"
  | "careers_email"
  | "talent_network_signup"
  | "contact_email"
  | "view_research"
  | "read_cgp"
  | "proof_link"
  | "evidence_sample"
  // Lead funnel
  | "form_start"
  | "form_step_complete"
  | "generate_lead"
  | "qualification_form_submitted"
  | "qualification_form_error"
  // Real-time assistant
  | "assistant_open"
  | "assistant_message"
  | "assistant_lead"
  | "assistant_error";

export type CtaSection =
  | "hero"
  | "header"
  | "mobile_menu"
  | "sticky"
  | "final_cta"
  | "paths"
  | "solutions"
  | "careers"
  | "contact"
  | "footer"
  | "research_band"
  | "proof_strip"
  | "operating_model"
  | "product"
  | "evidence"
  | "assistant"
  | "start"
  | "brief";

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
