import { createFileRoute } from "@tanstack/react-router";
import { CONTACT_CONSENT_VERSION } from "@/lib/contact.schema";
import { crmTalentInquiry, getCrmIntakeConfig } from "@/lib/crm-intake.server";
import { clientIpHash } from "@/lib/security/request.server";
import { createVisitorLimiter, isSameOrigin } from "@/lib/site-event.server";
import { TalentSchema } from "@/lib/talent.schema";

// Talent-network introductions from /careers. Same-origin only, limited per
// visitor, and sent signed to the CRM (route /talent), which stores them
// outside the sales pipeline and e-mails the team.

const MAX_BODY_BYTES = 8_192;
const allowVisitor = createVisitorLimiter(5, 60 * 60_000);
const NO_STORE = { "Cache-Control": "private, no-store" };

const json = (status: number, body: Record<string, unknown>) =>
  Response.json(body, { status, headers: NO_STORE });

export const Route = createFileRoute("/api/public/talent")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isSameOrigin(request.headers.get("origin"), request.headers.get("host"))) {
          return json(403, { error: "Forbidden" });
        }
        const raw = await request.text().catch(() => "");
        if (raw.length > MAX_BODY_BYTES) return json(413, { error: "Too large" });
        let payload: unknown;
        try {
          payload = JSON.parse(raw);
        } catch {
          return json(400, { error: "Invalid request" });
        }
        const parsed = TalentSchema.safeParse(payload);
        if (!parsed.success) {
          return json(422, { error: parsed.error.issues[0]?.message ?? "Invalid request" });
        }
        const data = parsed.data;
        if (data.website) return json(201, { ok: true });

        const ipHash = clientIpHash(request);
        if (!allowVisitor(ipHash)) {
          return json(429, { error: "Too many introductions from this connection. Try later." });
        }
        const config = getCrmIntakeConfig();
        if (!config) return json(503, { error: "Backend unavailable" });

        const result = await crmTalentInquiry(config, {
          name: data.name,
          email: data.email.toLowerCase(),
          area: data.area,
          profileUrl: data.profile ?? "",
          introduction: data.context,
          consent: {
            privacyNoticeVersion: CONTACT_CONSENT_VERSION,
            acceptedAt: new Date().toISOString(),
            ipHash,
          },
        });
        if (result.ok) return json(201, { ok: true });
        if (result.status === 429) {
          return json(429, { error: "Too many introductions for this email. Try later." });
        }
        return json(result.status === 422 ? 422 : 503, {
          error: "We could not record the introduction right now.",
        });
      },
    },
  },
});
