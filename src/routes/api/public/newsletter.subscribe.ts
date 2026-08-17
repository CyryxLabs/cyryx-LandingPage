import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const Schema = z.object({
  email: z.string().trim().email().max(255),
  consent: z.literal(true),
  website: z.string().max(0).optional().default(""),
});

function token(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Generic response to prevent email enumeration.
const GENERIC_OK = { ok: true, message: "If the address is valid, a confirmation email is on its way." };

export const Route = createFileRoute("/api/public/newsletter/subscribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json(GENERIC_OK);
        }
        const parsed = Schema.safeParse(body);
        if (!parsed.success) return Response.json(GENERIC_OK);
        const { email, website } = parsed.data;
        if (website && website.length > 0) return Response.json(GENERIC_OK);

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { clientIpHash, userAgentHash, checkRateLimit } = await import(
          "@/lib/security/request.server"
        );
        const { enqueueInternalEmail } = await import("@/lib/email/send-internal.server");

        const ipHash = clientIpHash(request);
        const uaHash = userAgentHash(request);

        const rl = await checkRateLimit(supabaseAdmin as any, "newsletter_subscribers", ipHash, 3);
        if (!rl.allowed) {
          // Log the 429 so admins can graph rate-limit hits over time.
          await supabaseAdmin
            .from("rate_limit_events")
            .insert({
              endpoint: "/api/public/newsletter/subscribe",
              ip_hash: ipHash,
              ua_hash: uaHash,
            })
            .then(() => {}, () => {});
          return new Response(JSON.stringify(GENERIC_OK), {
            status: 429,
            headers: { "Content-Type": "application/json", "Retry-After": "3600" },
          });
        }

        const normalized = email.toLowerCase();

        // Suppressed (unsubscribed/bounced) — silently drop.
        const { data: suppressed } = await supabaseAdmin
          .from("suppressed_emails")
          .select("email")
          .eq("email", normalized)
          .maybeSingle();
        if (suppressed) return Response.json(GENERIC_OK);

        const confirmToken = token();
        const expires = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

        // Upsert: a re-subscribe overwrites the pending token, but doesn't
        // reveal whether the address was previously known.
        const { data: existing } = await supabaseAdmin
          .from("newsletter_subscribers")
          .select("id, status")
          .eq("email", normalized)
          .maybeSingle();

        if (existing?.status === "confirmed") {
          // Don't re-send confirmation; respond generically.
          return Response.json(GENERIC_OK);
        }

        if (existing) {
          await supabaseAdmin
            .from("newsletter_subscribers")
            .update({
              status: "pending",
              confirm_token: confirmToken,
              confirm_token_expires_at: expires,
              ip_hash: ipHash,
              user_agent_hash: uaHash,
              consent_given_at: new Date().toISOString(),
            })
            .eq("id", existing.id);
        } else {
          await supabaseAdmin.from("newsletter_subscribers").insert({
            email: normalized,
            status: "pending",
            confirm_token: confirmToken,
            confirm_token_expires_at: expires,
            ip_hash: ipHash,
            user_agent_hash: uaHash,
          });
        }

        const confirmUrl = `https://www.cyryxlabs.com/newsletter/confirm?token=${confirmToken}`;
        await enqueueInternalEmail({
          templateName: "newsletter-confirm",
          recipientEmail: normalized,
          templateData: { confirmUrl },
          idempotencyKey: `nl-confirm-${confirmToken}`,
        });

        return Response.json(GENERIC_OK);
      },
    },
  },
});
