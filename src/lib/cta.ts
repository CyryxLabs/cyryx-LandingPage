/**
 * Canonical CTA hrefs. Keeping them here means every "Start a project"
 * button in the app opens the same pre-filled email — change once, ships
 * everywhere.
 */
export const CONTACT_EMAIL = "contact@cyryxlabs.com";

// Canonical project-qualification entry point. Every "Start a project"
// CTA on the site routes here. The mailto fallback is kept for legacy
// consumers that import it explicitly.
export const START_PROJECT_HREF = "/start";

export const START_PROJECT_MAILTO = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Start a project with Cyryx Labs",
)}`;
