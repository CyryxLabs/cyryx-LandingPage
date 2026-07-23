import * as React from "react";
import { render } from "react-email";
import { TEMPLATES } from "@/lib/email-templates/registry";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const SITE_NAME = "Cyryx Labs";
const SENDER_DOMAIN = "notify.cyryxlabs.com";
const FROM_DOMAIN = "cyryxlabs.com";

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function redact(email: string): string {
  const [l, d] = email.split("@");
  if (!l || !d) return "***";
  return `${l[0]}***@${d}`;
}

/**
 * Server-only helper used by internal public API routes (contact, newsletter)
 * to render + enqueue branded emails without requiring a user JWT.
 * The queue dispatcher (process-email-queue) handles delivery, retries, suppression.
 */
export async function enqueueInternalEmail(opts: {
  templateName: string;
  recipientEmail?: string;
  templateData?: Record<string, unknown>;
  idempotencyKey?: string;
}): Promise<
  | { ok: true; messageId: string }
  | { ok: false; reason: "suppressed" | "template_missing" | "enqueue_failed" }
> {
  const template = TEMPLATES[opts.templateName];
  if (!template) {
    console.error("[email] template missing", { template: opts.templateName });
    return { ok: false, reason: "template_missing" };
  }
  const recipient = (template.to || opts.recipientEmail || "").trim().toLowerCase();
  if (!recipient) {
    return { ok: false, reason: "template_missing" };
  }

  // Suppression check
  const { data: suppressed } = await supabaseAdmin
    .from("suppressed_emails")
    .select("email")
    .eq("email", recipient)
    .maybeSingle();
  if (suppressed) {
    console.warn("[email] recipient suppressed", { recipient_redacted: redact(recipient) });
    return { ok: false, reason: "suppressed" };
  }

  const messageId = crypto.randomUUID();
  const idempotencyKey = opts.idempotencyKey ?? messageId;
  const data = opts.templateData ?? {};

  // Unsubscribe token (only attached to opt-in newsletter sends)
  let unsubscribeToken: string | null = null;
  if (template.to || /newsletter|update|marketing/i.test(opts.templateName)) {
    unsubscribeToken = generateToken();
    await supabaseAdmin
      .from("email_unsubscribe_tokens")
      .insert({ email: recipient, token: unsubscribeToken });
  }

  const element = React.createElement(template.component, {
    ...data,
    unsubscribeUrl: unsubscribeToken
      ? `https://cyryxlabs.com/unsubscribe?token=${unsubscribeToken}`
      : undefined,
  });
  const html = await render(element);
  const text = await render(element, { plainText: true });

  const subject =
    typeof template.subject === "function" ? template.subject(data) : template.subject;

  await supabaseAdmin.from("email_send_log").insert({
    message_id: messageId,
    template_name: opts.templateName,
    recipient_email: recipient,
    status: "pending",
  });

  const { error } = await supabaseAdmin.rpc("enqueue_email", {
    queue_name: "transactional_emails",
    payload: {
      message_id: messageId,
      to: recipient,
      from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject,
      html,
      text,
      purpose: "transactional",
      label: opts.templateName,
      idempotency_key: idempotencyKey,
      unsubscribe_token: unsubscribeToken,
      queued_at: new Date().toISOString(),
    },
  });

  if (error) {
    console.error("[email] enqueue failed", { error: error.message, template: opts.templateName });
    await supabaseAdmin.from("email_send_log").insert({
      message_id: messageId,
      template_name: opts.templateName,
      recipient_email: recipient,
      status: "failed",
      error_message: "enqueue_failed: " + error.message,
    });
    return { ok: false, reason: "enqueue_failed" };
  }

  return { ok: true, messageId };
}

export { redact as redactEmail };