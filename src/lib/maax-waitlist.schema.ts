import { z } from "zod";

const optionalAttribution = z
  .string()
  .trim()
  .max(255)
  .optional()
  .transform((value) => value || undefined);

const optionalPhone = z
  .string()
  .trim()
  .max(40, "Telephone number must be 40 characters or fewer.")
  .refine(
    (value) => !value || (value.length >= 7 && /^[0-9+().\-\s/x]+$/i.test(value)),
    "Enter a valid telephone number, including country code.",
  )
  .optional()
  .transform((value) => value || undefined);

export const MAAX_WAITLIST_CONSENT_VERSION = "maax-waitlist-v2-2026-08-03";

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
  company: z
    .string()
    .trim()
    .min(2, "Enter your company.")
    .max(160, "Company must be 160 characters or fewer."),
  role: z
    .string()
    .trim()
    .min(2, "Enter your role.")
    .max(120, "Role must be 120 characters or fewer."),
  useCase: z
    .string()
    .trim()
    .min(10, "Describe the use case in at least 10 characters.")
    .max(2000, "Use case must be 2,000 characters or fewer."),
  operatingConstraint: z
    .string()
    .trim()
    .min(10, "Describe the operating constraint in at least 10 characters.")
    .max(2000, "Operating constraint must be 2,000 characters or fewer."),
  phone: optionalPhone,
  country: z
    .string()
    .trim()
    .min(2, "Enter your country.")
    .max(80, "Country must be 80 characters or fewer."),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Consent is required to request early-access review." }),
  }),
  consentVersion: z.literal(MAAX_WAITLIST_CONSENT_VERSION),
  website: z.string().max(200).optional().default(""),
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

export function isSuccessfulMaaxWaitlistRpcResult(data: unknown): data is { ok: true } {
  return typeof data === "object" && data !== null && "ok" in data && data.ok === true;
}
