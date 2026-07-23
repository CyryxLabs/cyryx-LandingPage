import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const Schema = z.object({
  email: z.string().trim().min(3).max(320),
});

/**
 * Server-side password-recovery gate. Rejects any email whose domain is not
 * @cyryxlabs.com — even when the caller crafts the request directly, bypassing
 * the client. Only after the domain check passes does it invoke Supabase's
 * password-recovery flow.
 */
export const Route = createFileRoute("/api/public/auth/recover")({
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
        const email = parsed.data.email.trim().toLowerCase();

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { clientIpHash, userAgentHash, checkRateLimit } = await import(
          "@/lib/security/request.server"
        );

        const ipHash = clientIpHash(request);
        const uaHash = userAgentHash(request);

        const rl = await checkRateLimit(
          supabaseAdmin as unknown as { from: (t: string) => any },
          "auth_domain_blocks",
          ipHash,
          30,
        );
        if (!rl.allowed) {
          return Response.json({ error: "Too many attempts" }, { status: 429 });
        }

        if (!/^[^\s@]+@cyryxlabs\.com$/i.test(email)) {
          // Persist the blocked recovery attempt for audit.
          await supabaseAdmin.from("auth_domain_blocks").insert({
            email,
            reason: "password_recovery",
            ip_hash: ipHash,
            user_agent_hash: uaHash,
          });
          return Response.json(
            {
              error:
                "Invalid domain. Please use your @cyryxlabs.com company email to recover access.",
            },
            { status: 403 },
          );
        }

        const origin = new URL(request.url).origin;
        const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
          redirectTo: `${origin}/auth`,
        });
        if (error) {
          console.error("[auth-recover] supabase error", error.message);
          // Do NOT leak whether the email exists.
          return Response.json({ ok: true });
        }
        return Response.json({ ok: true });
      },
    },
  },
});