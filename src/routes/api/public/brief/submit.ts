import { createFileRoute } from "@tanstack/react-router";
import {
  BRIEF_CONSENT_VERSION,
  BriefSubmissionSchema,
  briefQuality,
  briefToMarkdown,
} from "@/lib/brief.schema";

const PER_IP_LIMIT = 8;
const WINDOW_MS = 60 * 60 * 1000;
const MIN_FILL_MS = 8_000;

/** Submits a full requirements brief to the CRM (lead + requirements packet + attachments). */
export const Route = createFileRoute("/api/public/brief/submit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
        const parsed = BriefSubmissionSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            {
              error: "Check the highlighted fields and try again.",
              issues: parsed.error.issues.slice(0, 20).map((issue) => ({
                path: issue.path.join("."),
                message: issue.message,
              })),
            },
            { status: 400 },
          );
        }
        const data = parsed.data;
        // Honeypot and minimum fill time: accept silently, store nothing.
        if (data.nickname || (data.startedAt && Date.now() - data.startedAt < MIN_FILL_MS)) {
          return Response.json({ ok: true, status: "received" });
        }

        const [crm, limiter, security, attributionModule] = await Promise.all([
          import("@/lib/crm-intake.server"),
          import("@/lib/ai/rate-limit.server"),
          import("@/lib/security/request.server"),
          import("@/lib/brief-attribution.server"),
        ]);
        const ipHash = security.clientIpHash(request);
        if (!limiter.allowRequest(`brief-submit:${ipHash}`, PER_IP_LIMIT, WINDOW_MS)) {
          return Response.json(
            { error: "Too many submissions — please try again later." },
            { status: 429 },
          );
        }
        const config = crm.getCrmIntakeConfig();
        if (!config) {
          return Response.json(
            { error: "We couldn't save your brief right now." },
            { status: 503 },
          );
        }

        const quality = briefQuality({
          ...data.requirements,
          hasAttachments: data.attachments.length > 0,
        });
        const payload = {
          intakeId: data.intakeId,
          kind: "brief",
          source: attributionModule.sourceFromRequest(request, body, "/brief"),
          contact: data.contact,
          engagement: data.engagement,
          requirements: data.requirements,
          attachments: data.attachments,
          quality,
          consent: {
            privacyNoticeVersion: BRIEF_CONSENT_VERSION,
            processingBasis: "consent",
            marketingOptIn: data.marketingOptIn,
            acceptedAt: new Date().toISOString(),
            ipHash,
            userAgentHash: security.userAgentHash(request),
          },
        };
        const idempotencyKey = attributionModule.idempotencyKeyFor(payload);
        const result = await crm.crmIntakeSubmit(config, payload, idempotencyKey);
        if (!result.ok) {
          const status = crm.publicStatusFor(result.status);
          return Response.json(
            {
              error:
                status === 429
                  ? "Too many submissions — please try again later."
                  : status === 422
                    ? "Some of the brief could not be accepted. Check the attachments and try again."
                    : "We couldn't save your brief right now.",
            },
            { status },
          );
        }
        return Response.json({
          ok: true,
          status: "received",
          reference: result.data.requirementsId,
          quality,
          markdown: briefToMarkdown({
            contact: data.contact,
            engagement: data.engagement,
            requirements: data.requirements,
            attachments: data.attachments,
          }),
        });
      },
    },
  },
});
