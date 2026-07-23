import { z } from "zod";

const optionalAttribution = z
  .string()
  .trim()
  .max(255)
  .optional()
  .transform((value) => value || undefined);

export const MAAX_WAITLIST_CONSENT_VERSION = "maax-waitlist-v1-2026-07-23";

export const MaaxWaitlistSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(120, "Name must be 120 characters or fewer."),
  email: z
    .string()
    .trim()
    .email("Enter a valid work email.")
    .max(254, "Email must be 254 characters or fewer."),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid telephone number, including country code.")
    .max(40, "Telephone number must be 40 characters or fewer.")
    .regex(/^[0-9+().\-\s/x]+$/i, "Enter a valid telephone number."),
  country: z
    .string()
    .trim()
    .min(2, "Enter your country.")
    .max(80, "Country must be 80 characters or fewer."),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Consent is required to join the early-access list." }),
  }),
  consentVersion: z.literal(MAAX_WAITLIST_CONSENT_VERSION),
  website: z.string().max(0).optional().default(""),
  formStartedAt: z.number().int().positive(),
  source: z.string().trim().min(1).max(64).default("maax_studio_waitlist"),
  landingPath: z.string().trim().min(1).max(2048),
  referrer: z.string().trim().max(2048).optional().default(""),
  utmSource: optionalAttribution,
  utmMedium: optionalAttribution,
  utmCampaign: optionalAttribution,
  utmContent: optionalAttribution,
  utmTerm: optionalAttribution,
});

export type MaaxWaitlistInput = z.infer<typeof MaaxWaitlistSchema>;
