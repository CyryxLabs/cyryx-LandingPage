import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  company: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().min(10, "Tell us a bit more").max(2000),
});

export type ContactInput = z.infer<typeof ContactSchema>;

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ContactSchema.parse(input))
  .handler(async ({ data }) => {
    // Persisted to server logs for now; swap for DB insert when Cloud is enabled.
    console.log("[contact] submission", {
      name: data.name,
      email: data.email,
      company: data.company,
      messageLength: data.message.length,
      at: new Date().toISOString(),
    });
    return { ok: true as const, receivedAt: new Date().toISOString() };
  });