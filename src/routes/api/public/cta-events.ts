import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "node:crypto";
import { z } from "zod";
import { crmSiteEvent, getCrmIntakeConfig } from "@/lib/crm-intake.server";
import { createVisitorLimiter, isSameOrigin, toCrmSiteEvent } from "@/lib/site-event.server";

// Funnel beacons from this site (CTA clicks, form start/step/lead, assistant
// usage). Same-origin only, limited per visitor, and forwarded server-to-server
// to the CRM with the intake signature. Nothing is stored on the site.

const Schema = z.object({
  cta: z.string().trim().min(1).max(64),
  section: z.string().trim().min(1).max(64),
  path: z.string().trim().min(1).max(2048),
  href: z.string().trim().max(2048).optional().nullable(),
  variant: z.string().trim().max(32).optional().nullable(),
  referrer: z.string().trim().max(2048).optional().nullable(),
});

const MAX_BODY_BYTES = 4_096;
const allowVisitor = createVisitorLimiter(60, 60_000);

const NO_STORE = { "Cache-Control": "private, no-store" };

function visitorKey(request: Request): string {
  const address =
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  return createHash("sha256").update(address).digest("hex").slice(0, 32);
}

export const Route = createFileRoute("/api/public/cta-events")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isSameOrigin(request.headers.get("origin"), request.headers.get("host"))) {
          return new Response(null, { status: 403, headers: NO_STORE });
        }
        const declared = Number(request.headers.get("content-length") ?? "0");
        if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
          return new Response(null, { status: 413, headers: NO_STORE });
        }
        if (!allowVisitor(visitorKey(request))) {
          return new Response(null, { status: 429, headers: { ...NO_STORE, "Retry-After": "60" } });
        }

        let payload: unknown;
        try {
          const raw = await request.text();
          if (raw.length > MAX_BODY_BYTES) {
            return new Response(null, { status: 413, headers: NO_STORE });
          }
          payload = JSON.parse(raw);
        } catch {
          return new Response(null, { status: 400, headers: NO_STORE });
        }
        const parsed = Schema.safeParse(payload);
        if (!parsed.success) return new Response(null, { status: 400, headers: NO_STORE });

        const event = toCrmSiteEvent(parsed.data, request.headers.get("user-agent"));
        if (!event) return new Response(null, { status: 400, headers: NO_STORE });

        const config = getCrmIntakeConfig();
        if (!config) return new Response(null, { status: 503, headers: NO_STORE });

        const result = await crmSiteEvent(config, event);
        if (!result.ok) {
          console.error("[cta-events] crm rejected", result.status);
          return new Response(null, {
            status: result.status === 422 ? 400 : 502,
            headers: NO_STORE,
          });
        }
        return new Response(null, { status: 204, headers: NO_STORE });
      },
    },
  },
});
