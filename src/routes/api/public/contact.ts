import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import {
  CONTACT_CONSENT_VERSION,
  FitReviewSchema,
  formatFitReviewMessage,
} from "@/lib/contact.schema";

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
        const parsed = FitReviewSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            {
              error: "Check the highlighted fields and try again.",
              issues: parsed.error.flatten().fieldErrors,
            },
            { status: 400 },
          );
        }
        const data = parsed.data;

        // Honeypot — silently accept then drop.
        if (data.website && data.website.length > 0) {
          return Response.json({ ok: true });
        }

        const { clientIpHash, userAgentHash } = await import("@/lib/security/request.server");
        const ipHash = clientIpHash(request);
        const uaHash = userAgentHash(request);
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (!url || !key) {
          return Response.json({ error: "Backend unavailable" }, { status: 503 });
        }
        const supabase = createClient(url, key, {
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const normalizedEmail = data.email.toLowerCase();
        const submittedAt = new Date().toISOString();
        const message = formatFitReviewMessage(data);
        const { data: submission, error } = await supabase.rpc("submit_contact_public", {
          p_name: data.name,
          p_email: normalizedEmail,
          p_company: data.company || "",
          p_message: message,
          p_interest: "project",
          p_consent_version: CONTACT_CONSENT_VERSION,
          p_ip_hash: ipHash,
          p_user_agent_hash: uaHash,
        });
        if (error) {
          const rateLimited = /rate_limited/i.test(error.message);
          console.error("[contact] RPC failed", rateLimited ? "rate_limited" : error.code);
          return Response.json(
            {
              error: rateLimited
                ? "Too many submissions — please try again later."
                : "Could not save submission",
            },
            { status: rateLimited ? 429 : 500 },
          );
        }

        let confirmationQueued = false;
        try {
          const { enqueueFitReviewEmails } =
            await import("@/lib/email/fit-review-notifications.server");
          const submissionId =
            submission &&
            typeof submission === "object" &&
            "id" in submission &&
            typeof submission.id === "string"
              ? submission.id
              : crypto.randomUUID();
          const delivery = await enqueueFitReviewEmails({
            submissionId,
            name: data.name,
            email: normalizedEmail,
            company: data.company,
            message,
            submittedAt,
          });
          confirmationQueued = delivery.confirmation === "queued";
          if (delivery.notification !== "queued" || delivery.confirmation !== "queued") {
            console.warn("[contact] fit-review email delivery incomplete", delivery);
          }
        } catch (emailError) {
          console.error("[contact] optional fit-review email queue failed", emailError);
        }

        return Response.json({ ok: true, confirmationQueued });
      },
    },
  },
});
