import { createServerFn } from "@tanstack/react-start";
import { ContactSchema, CONTACT_INTERESTS } from "./contact.schema";
export { ContactSchema } from "./contact.schema";
export type { ContactInput } from "./contact.schema";

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ContactSchema.parse(input))
  .handler(async ({ data }) => {
    // Silent drop for bots that filled the honeypot.
    if (data.website && data.website.length > 0) {
      return { ok: true as const, receivedAt: new Date().toISOString() };
    }
    const submittedAt = new Date().toISOString();
    const normalizedEmail = data.email.toLowerCase();
    const interestLabel = CONTACT_INTERESTS[data.interest];
    // Interest travels inside the message as a structured prefix so it reaches
    // the existing contact_submissions table and email templates without a
    // schema migration.
    const messageWithIntent =
      data.interest === "project" ? data.message : `[${interestLabel}] ${data.message}`;
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { enqueueInternalEmail } = await import("@/lib/email/send-internal.server");
      await supabaseAdmin.from("contact_submissions").insert({
        name: data.name,
        email: normalizedEmail,
        company: data.company || null,
        message: messageWithIntent,
      });
      await Promise.all([
        enqueueInternalEmail({
          templateName: "contact-notification",
          templateData: {
            name: data.name,
            email: normalizedEmail,
            company: data.company || "",
            message: messageWithIntent,
            interest: interestLabel,
            submittedAt,
          },
          idempotencyKey: `contact-notify-fn-${submittedAt}`,
        }),
        enqueueInternalEmail({
          templateName: "contact-confirmation",
          recipientEmail: normalizedEmail,
          templateData: { name: data.name },
          idempotencyKey: `contact-confirm-fn-${submittedAt}`,
        }),
      ]);
    } catch (err) {
      console.error("[contact] submission pipeline failed", err);
      throw new Error("submission_failed");
    }
    return { ok: true as const, receivedAt: submittedAt };
  });