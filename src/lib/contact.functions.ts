import { createServerFn } from "@tanstack/react-start";
import { ContactSchema } from "./contact.schema";
export { ContactSchema } from "./contact.schema";
export type { ContactInput } from "./contact.schema";

export const submitContact = createServerFn({ method: "POST" })
  .validator((input: unknown) => ContactSchema.parse(input))
  .handler(async ({ data }) => {
    // Silent drop for bots that filled the honeypot.
    if (data.website && data.website.length > 0) {
      return { ok: true as const, receivedAt: new Date().toISOString() };
    }
    // Persisted to server logs for now; swap for DB insert when Cloud is enabled.
    console.log("[contact] submission", {
      name: data.name,
      email: data.email,
      company: data.company,
      messageLength: data.message.length,
      consent: data.consent,
      at: new Date().toISOString(),
    });
    return { ok: true as const, receivedAt: new Date().toISOString() };
  });
