import type { ContactInterest } from "./contact.schema";

const STORAGE_KEY = "cyryx-contact-intent";
export const CONTACT_INTENT_EVENT = "cyryx:contact-intent";

/**
 * Records which CTA sent the visitor to the contact form so the form can
 * preselect the matching interest (e.g. "Request Early Access" → MAAX).
 * Survives the scroll/navigation via sessionStorage and notifies an
 * already-mounted form via a window event.
 */
export function setContactIntent(intent: ContactInterest) {
  try {
    sessionStorage.setItem(STORAGE_KEY, intent);
  } catch {
    // Storage unavailable (private mode) — the event still covers same-page CTAs.
  }
  window.dispatchEvent(new CustomEvent<ContactInterest>(CONTACT_INTENT_EVENT, { detail: intent }));
}

export function getContactIntent(): ContactInterest | null {
  try {
    const value = sessionStorage.getItem(STORAGE_KEY);
    if (
      value === "project" ||
      value === "maax-early-access" ||
      value === "research" ||
      value === "other"
    ) {
      return value;
    }
  } catch {
    // ignore
  }
  return null;
}
