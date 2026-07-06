/**
 * Canonical CTA hrefs. Keeping them here means every "Start a project"
 * button in the app opens the same pre-filled email — change once, ships
 * everywhere.
 */
export const CONTACT_EMAIL = "contact@cyryxlabs.com";

export const START_PROJECT_HREF = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Start a project with Cyryx Labs",
)}&body=${encodeURIComponent(
  [
    "Hi Cyryx team,",
    "",
    "I'd like to start a project. Here are a few details:",
    "",
    "• Company:",
    "• Use case / problem to solve:",
    "• Timeline:",
    "• Anything else we should know:",
    "",
    "Thanks,",
  ].join("\n"),
)}`;
