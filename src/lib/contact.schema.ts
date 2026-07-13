import { z } from "zod";

export const CONTACT_INTERESTS = {
  project: "Start a project",
  "maax-early-access": "MAAX Studio early access",
  research: "Research & partnerships",
  other: "Something else",
} as const;

export type ContactInterest = keyof typeof CONTACT_INTERESTS;

export const ContactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  company: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().min(10, "Tell us a bit more").max(2000),
  interest: z
    .enum(["project", "maax-early-access", "research", "other"])
    .optional()
    .default("project"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Consent is required" }),
  }),
  // Honeypot — must be empty. Real users never fill this field.
  website: z.string().max(0).optional().default(""),
});

export type ContactInput = z.infer<typeof ContactSchema>;