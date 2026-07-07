import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const Schema = z.object({
  email: z.string().trim().min(3).max(320),
  reason: z.enum(["sign_in", "password_recovery"]),
});

export const Route = createFileRoute("/api/public/auth/domain-block")({
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
          return Response.json({ error: "Invalid submission" }, { status: 400 });
        }
        const email = parsed.data.email.toLowerCase();

        // Reject if the email is actually on the allowed domain — this endpoint
        // only exists to log BLOCKED attempts.
        if (/^[^\s@]+@cyryxlabs\.com$/i.test(email)) {
          return Response.json({ error: "Not a blocked domain" }, { status: 400 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { clientIpHash, userAgentHash, checkRateLimit } = await import(
          "@/lib/security/request.server"
        );

        const ipHash = clientIpHash(request);
        const uaHash = userAgentHash(request);

        // Rate limit: 30 blocked-attempt logs per IP per hour.
        const rl = await checkRateLimit(
          supabaseAdmin as unknown as { from: (t: string) => any },
          "auth_domain_blocks",
          ipHash,
          30,
        );
        if (!rl.allowed) {
          return Response.json({ error: "Too many attempts" }, { status: 429 });
        }

        const { error } = await supabaseAdmin.from("auth_domain_blocks").insert({
          email,
          reason: parsed.data.reason,
          ip_hash: ipHash,
          user_agent_hash: uaHash,
        });
        if (error) {
          console.error("[auth-domain-block] insert failed", error.message);
          return Response.json({ error: "Could not persist" }, { status: 500 });
        }
        return Response.json({ ok: true, email, reason: parsed.data.reason });
      },
    },
  },
});