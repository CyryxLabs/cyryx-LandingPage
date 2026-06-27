import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const Schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  company: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().min(10).max(2000),
  consent: z.literal(true),
  website: z.string().max(0).optional().default(""), // honeypot
});

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
        const parsed = Schema.safeParse(body);
        if (!parsed.success) {
          // Generic message — no field-level leakage to prevent probing.
          return Response.json({ error: "Invalid submission" }, { status: 400 });
        }
        const data = parsed.data;

        // Honeypot — silently accept then drop.
        if (data.website && data.website.length > 0) {
          return Response.json({ ok: true });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { clientIpHash, userAgentHash, checkRateLimit } = await import(
          "@/lib/security/request.server"
        );
        const { enqueueInternalEmail } = await import("@/lib/email/send-internal.server");

        const ipHash = clientIpHash(request);
        const uaHash = userAgentHash(request);

        // Rate limit: 5 contact submissions per IP per hour.
        const rl = await checkRateLimit(supabaseAdmin as any, "contact_submissions", ipHash, 5);
        if (!rl.allowed) {
          return Response.json(
            { error: "Too many submissions — please try again later." },
            { status: 429 },
          );
        }

        const normalizedEmail = data.email.toLowerCase();

        // Persist the submission (audit + LGPD consent record).
        const { error: insertError } = await supabaseAdmin
          .from("contact_submissions")
          .insert({
            name: data.name,
            email: normalizedEmail,
            company: data.company || null,
            message: data.message,
            ip_hash: ipHash,
            user_agent_hash: uaHash,
          });
        if (insertError) {
          console.error("[contact] insert failed", insertError.message);
          return Response.json({ error: "Could not save submission" }, { status: 500 });
        }

        const submittedAt = new Date().toISOString();

        // Fire-and-forget both emails; failures are logged in email_send_log.
        await Promise.all([
          enqueueInternalEmail({
            templateName: "contact-notification",
            templateData: {
              name: data.name,
              email: normalizedEmail,
              company: data.company || "",
              message: data.message,
              submittedAt,
              ipHash,
            },
            idempotencyKey: `contact-notify-${ipHash}-${submittedAt}`,
          }),
          enqueueInternalEmail({
            templateName: "contact-confirmation",
            recipientEmail: normalizedEmail,
            templateData: { name: data.name },
            idempotencyKey: `contact-confirm-${ipHash}-${submittedAt}`,
          }),
        ]);

        return Response.json({ ok: true });
      },
    },
  },
});