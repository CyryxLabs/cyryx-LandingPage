import { createFileRoute } from "@tanstack/react-router";
import {
  buildQualification,
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

        const [{ clientIpHash, userAgentHash }, leads] = await Promise.all([
          import("@/lib/security/request.server"),
          import("@/lib/leads.server"),
        ]);
        const normalizedEmail = data.email.toLowerCase();
        const submittedAt = new Date().toISOString();
        const message = formatFitReviewMessage(data);

        const brief = [
          `Project type: ${data.projectType}`,
          `Problem: ${data.problem}`,
          data.outcome ? `Desired outcome: ${data.outcome}` : "",
          data.whyNow ? `Why now: ${data.whyNow}` : "",
        ]
          .filter(Boolean)
          .join("\n");
        const viaCrm = await leads.crmIntakeEnabled();
        // With the CRM as system of record, the first read is drafted before
        // saving so it is stored with the lead; the CRM notifies the team.
        const earlyReply = viaCrm ? await leads.draftFirstReply(brief) : null;

        const saved = await leads.saveLead({
          name: data.name,
          email: normalizedEmail,
          company: data.company || "",
          message,
          interest: data.assistantSummary ? "assistant" : "project",
          consentVersion: CONTACT_CONSENT_VERSION,
          ipHash: clientIpHash(request),
          userAgentHash: userAgentHash(request),
          qualification: buildQualification(data),
          attribution: data.attribution,
          details: {
            projectType: data.projectType,
            problem: data.problem,
            outcome: data.outcome,
            whyNow: data.whyNow,
            role: data.role,
            website: data.companyWebsite,
            stage: data.stage,
            budget: data.investment,
            timeline: data.timeline,
            systems: data.systems,
            entrySource: data.source,
            entryIntent: data.intent,
          },
          aiFirstReply: earlyReply,
        });
        if (!saved.ok) {
          return Response.json({ error: saved.error }, { status: saved.status });
        }

        if (viaCrm) {
          return Response.json({ ok: true, confirmationQueued: false, firstReply: earlyReply });
        }

        // Legacy website database: real-time first read of the brief, bounded
        // by a short timeout and always optional (the lead is already saved).
        const firstReply = await leads.draftFirstReply(brief);
        if (firstReply) await leads.recordFirstReply(saved.submissionId, firstReply);

        let confirmationQueued = false;
        try {
          const { enqueueFitReviewEmails } =
            await import("@/lib/email/fit-review-notifications.server");
          const delivery = await enqueueFitReviewEmails({
            submissionId: saved.submissionId,
            name: data.name,
            email: normalizedEmail,
            company: data.company,
            message,
            submittedAt,
            aiReply: firstReply ?? undefined,
          });
          confirmationQueued = delivery.confirmation === "queued";
          if (delivery.notification !== "queued" || delivery.confirmation !== "queued") {
            console.warn("[contact] lead email delivery incomplete", delivery);
          }
        } catch (emailError) {
          console.error("[contact] optional lead email queue failed", emailError);
        }

        return Response.json({ ok: true, confirmationQueued, firstReply });
      },
    },
  },
});
