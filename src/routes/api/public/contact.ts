import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
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

        const { clientIpHash, userAgentHash } = await import(
          "@/lib/security/request.server"
        );
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
        const { error } = await supabase.rpc("submit_contact_public", {
          p_name: data.name,
          p_email: normalizedEmail,
          p_company: data.company || "",
          p_message: data.message,
          p_interest: "project",
          p_consent_version: "website-contact-v1-2026-07-23",
          p_ip_hash: ipHash,
          p_user_agent_hash: uaHash,
        });
        if (error) {
          const rateLimited = /rate_limited/i.test(error.message);
          console.error("[contact] RPC failed", rateLimited ? "rate_limited" : error.code);
          return Response.json(
            { error: rateLimited ? "Too many submissions — please try again later." : "Could not save submission" },
            { status: rateLimited ? 429 : 500 },
          );
        }

        return Response.json({ ok: true });
      },
    },
  },
});
