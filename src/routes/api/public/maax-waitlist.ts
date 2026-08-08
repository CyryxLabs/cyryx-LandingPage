import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { isSuccessfulMaaxWaitlistRpcResult, MaaxWaitlistSchema } from "@/lib/maax-waitlist.schema";
import { clientIpHash, userAgentHash } from "@/lib/security/request.server";

const RESPONSE_HEADERS = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
};

function json(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), { status, headers: RESPONSE_HEADERS });
}

export const Route = createFileRoute("/api/public/maax-waitlist")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return json({ ok: false, message: "Invalid request." }, 400);
        }

        const parsed = MaaxWaitlistSchema.safeParse(payload);
        if (!parsed.success) {
          return json(
            {
              ok: false,
              message: "Check the highlighted fields and try again.",
              issues: parsed.error.flatten().fieldErrors,
            },
            400,
          );
        }

        // Honeypot submissions receive the generic success response without persistence.
        if (parsed.data.website) {
          return json({ ok: true, message: "Your request has been received." }, 200);
        }

        const elapsed = Date.now() - parsed.data.formStartedAt;
        if (elapsed < 1_500 || elapsed > 24 * 60 * 60 * 1_000) {
          return json({ ok: false, message: "Please reload the page and try again." }, 400);
        }

        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (!url || !key) {
          return json({ ok: false, message: "The waitlist is temporarily unavailable." }, 503);
        }

        const supabase = createClient(url, key, {
          auth: { persistSession: false, autoRefreshToken: false },
        });

        const { data, error } = await supabase.rpc("join_maax_waitlist_v2", {
          p_full_name: parsed.data.fullName,
          p_email: parsed.data.email,
          p_company: parsed.data.company,
          p_role: parsed.data.role,
          p_use_case: parsed.data.useCase,
          p_operating_constraint: parsed.data.operatingConstraint,
          p_country: parsed.data.country,
          p_consent_version: parsed.data.consentVersion,
          p_phone: parsed.data.phone ?? null,
          p_source: parsed.data.source,
          p_landing_path: parsed.data.landingPath,
          p_referrer: parsed.data.referrer || null,
          p_utm_source: parsed.data.utmSource ?? null,
          p_utm_medium: parsed.data.utmMedium ?? null,
          p_utm_campaign: parsed.data.utmCampaign ?? null,
          p_utm_content: parsed.data.utmContent ?? null,
          p_utm_term: parsed.data.utmTerm ?? null,
          p_ip_hash: clientIpHash(request),
          p_user_agent_hash: userAgentHash(request),
        });

        if (error) {
          const rateLimited = /rate_limited/i.test(error.message);
          console.error(
            "[maax-waitlist] submission failed",
            rateLimited ? "rate_limited" : error.code,
          );
          return json(
            {
              ok: false,
              message: rateLimited
                ? "Too many attempts. Please try again later."
                : "We could not save your request. Please try again.",
            },
            rateLimited ? 429 : 500,
          );
        }

        if (!isSuccessfulMaaxWaitlistRpcResult(data)) {
          console.error("[maax-waitlist] RPC returned an unsuccessful result");
          return json(
            { ok: false, message: "We could not save your request. Please try again." },
            500,
          );
        }

        return json({ ok: true, message: "Early-access request received for review." }, 200);
      },
    },
  },
});
