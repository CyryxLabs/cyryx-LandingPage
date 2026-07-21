import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const Schema = z.object({
  cta: z.string().trim().min(1).max(64),
  section: z.string().trim().min(1).max(64),
  path: z.string().trim().min(1).max(2048),
  href: z.string().trim().max(2048).optional().nullable(),
  variant: z.string().trim().max(32).optional().nullable(),
  referrer: z.string().trim().max(2048).optional().nullable(),
});

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const Route = createFileRoute("/api/public/cta-events")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400, headers: CORS });
        }
        const parsed = Schema.safeParse(payload);
        if (!parsed.success) {
          return new Response("Invalid payload", { status: 400, headers: CORS });
        }
        const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
        const key =
          process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        if (!url || !key) {
          return new Response("Backend unavailable", { status: 503, headers: CORS });
        }
        const supabase = createClient(url, key, {
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const userAgent = request.headers.get("user-agent")?.slice(0, 1024) ?? null;
        const { error } = await supabase.from("cta_events").insert({
          cta: parsed.data.cta,
          section: parsed.data.section,
          path: parsed.data.path,
          href: parsed.data.href ?? null,
          variant: parsed.data.variant ?? null,
          referrer: parsed.data.referrer ?? null,
          user_agent: userAgent,
        });
        if (error) {
          console.error("[cta-events] insert failed", error.message);
          return new Response("Insert failed", { status: 500, headers: CORS });
        }
        return new Response(null, { status: 204, headers: CORS });
      },
    },
  },
});
