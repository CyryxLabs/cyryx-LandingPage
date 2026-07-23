import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/newsletter/confirm")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const token = url.searchParams.get("token") ?? "";
        if (!token || token.length < 16) {
          return Response.json({ ok: false, reason: "invalid" }, { status: 400 });
        }
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { enqueueInternalEmail } = await import("@/lib/email/send-internal.server");

        const { data: row } = await supabaseAdmin
          .from("newsletter_subscribers")
          .select("id, email, status, confirm_token_expires_at")
          .eq("confirm_token", token)
          .maybeSingle();

        if (!row) return Response.json({ ok: false, reason: "invalid" }, { status: 404 });
        if (row.status === "confirmed") return Response.json({ ok: true, already: true });
        if (row.confirm_token_expires_at && new Date(row.confirm_token_expires_at) < new Date()) {
          return Response.json({ ok: false, reason: "expired" }, { status: 410 });
        }

        await supabaseAdmin
          .from("newsletter_subscribers")
          .update({
            status: "confirmed",
            confirmed_at: new Date().toISOString(),
            confirm_token: null,
            confirm_token_expires_at: null,
          })
          .eq("id", row.id);

        await enqueueInternalEmail({
          templateName: "newsletter-welcome",
          recipientEmail: row.email,
          idempotencyKey: `nl-welcome-${row.id}`,
        });

        return Response.json({ ok: true });
      },
    },
  },
});