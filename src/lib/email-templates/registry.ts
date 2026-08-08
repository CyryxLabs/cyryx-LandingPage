import type { ElementType } from "react";
import { template as contactConfirmation } from "./contact-confirmation";
import { template as contactNotification } from "./contact-notification";
import { template as fitReviewConfirmation } from "./fit-review-confirmation";
import { template as fitReviewNotification } from "./fit-review-notification";
import { template as newsletterConfirm } from "./newsletter-confirm";
import { template as newsletterWelcome } from "./newsletter-welcome";

export interface TemplateEntry {
  component: ElementType;
  subject: string | ((data: Record<string, unknown>) => string);
  displayName?: string;
  previewData?: Record<string, unknown>;
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string;
}

/**
 * Template registry — maps template names to their React Email components.
 * Import and register new templates here after creating them in this directory.
 *
 * Example:
 *   import { template as welcomeTemplate } from './welcome'
 *   // then add to TEMPLATES: 'welcome': welcomeTemplate
 */
export const TEMPLATES: Record<string, TemplateEntry> = {
  "contact-confirmation": contactConfirmation,
  "contact-notification": contactNotification,
  "fit-review-confirmation": fitReviewConfirmation,
  "fit-review-notification": fitReviewNotification,
  "newsletter-confirm": newsletterConfirm,
  "newsletter-welcome": newsletterWelcome,
};
