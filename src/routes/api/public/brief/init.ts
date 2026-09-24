import { createFileRoute } from "@tanstack/react-router";
import { FileManifestSchema } from "@/lib/brief.schema";

const PER_IP_LIMIT = 20;
const WINDOW_MS = 60 * 60 * 1000;

/** Reserves an intake in the CRM and returns signed upload URLs for the declared files. */
export const Route = createFileRoute("/api/public/brief/init")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const [crm, limiter, security] = await Promise.all([
          import("@/lib/crm-intake.server"),
          import("@/lib/ai/rate-limit.server"),
          import("@/lib/security/request.server"),
        ]);
        const config = crm.getCrmIntakeConfig();
        if (!config) return Response.json({ error: "uploads_unavailable" }, { status: 503 });

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "invalid_json" }, { status: 400 });
        }
        const parsed = FileManifestSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { error: "Check the files: up to 10 files, 25 MB each, 100 MB in total." },
            { status: 422 },
          );
        }
        if (
          !limiter.allowRequest(
            `brief-init:${security.clientIpHash(request)}`,
            PER_IP_LIMIT,
            WINDOW_MS,
          )
        ) {
          return Response.json({ error: "rate_limited" }, { status: 429 });
        }

        const result = await crm.crmIntakeInit(config, parsed.data);
        if (!result.ok) {
          return Response.json(
            { error: "uploads_unavailable" },
            { status: crm.publicStatusFor(result.status) },
          );
        }
        return Response.json({
          intakeId: result.data.intakeId,
          expiresAt: result.data.expiresAt,
          uploads: result.data.uploads.map((upload) => ({
            name: upload.name,
            path: upload.path,
            signedUrl: upload.signedUrl,
          })),
        });
      },
    },
  },
});
