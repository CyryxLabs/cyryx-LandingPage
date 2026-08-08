import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { CONTACT_CONSENT_VERSION, ContactSchema, CONTACT_INTERESTS } from "./contact.schema";
import { clientIpHash, userAgentHash } from "./security/request.server";
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
      const url = process.env.SUPABASE_URL;
      const key = process.env.SUPABASE_PUBLISHABLE_KEY;
      if (!url || !key) throw new Error("backend_unavailable");

      const request = getRequest();
      const supabase = createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { error } = await supabase.rpc("submit_contact_public", {
        p_name: data.name,
        p_email: normalizedEmail,
        p_company: data.company || "",
        p_message: messageWithIntent,
        p_interest: data.interest,
        p_consent_version: CONTACT_CONSENT_VERSION,
        p_ip_hash: clientIpHash(request),
        p_user_agent_hash: userAgentHash(request),
      });
      if (error) throw error;

      // Email delivery is an enhancement, not a persistence dependency. It is
      // attempted only where a service credential is explicitly available.
      if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
        try {
          const { enqueueInternalEmail } = await import("@/lib/email/send-internal.server");
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
        } catch (emailError) {
          console.error("[contact] optional email queue failed", emailError);
        }
      }
    } catch (err) {
      console.error("[contact] submission pipeline failed", err);
      throw new Error("submission_failed");
    }
    return { ok: true as const, receivedAt: submittedAt };
  });
