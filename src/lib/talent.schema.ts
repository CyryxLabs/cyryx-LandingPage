import { z } from "zod";

/** Areas offered on /careers. The CRM accepts exactly this list. */
export const TALENT_AREAS = [
  "Applied Research",
  "Product Engineering",
  "Solutions & Systems Delivery",
  "Design & Product Experience",
  "Operations",
  "Other",
] as const;

export const TalentSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email").max(254),
  area: z.enum(TALENT_AREAS),
  profile: z
    .string()
    .trim()
    .max(400)
    .optional()
    .transform((value) => value || undefined)
    .refine((value) => !value || /^https:\/\/\S+$/i.test(value), "Use an https:// link"),
  context: z.string().trim().max(1200).optional().default(""),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent is required" }) }),
  // Honeypot: any value means a bot; the route answers success and drops it.
  website: z.string().max(200).optional().default(""),
});

export type TalentInput = z.infer<typeof TalentSchema>;
