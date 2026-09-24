type EmailEnqueueResult =
  | { ok: true; messageId: string }
  | { ok: false; reason: "suppressed" | "template_missing" | "enqueue_failed" };

type EmailJob = {
  templateName: "fit-review-notification" | "fit-review-confirmation";
  recipientEmail?: string;
  templateData: Record<string, unknown>;
  idempotencyKey: string;
};

type EnqueueEmail = (job: EmailJob) => Promise<EmailEnqueueResult>;

export type FitReviewEmailInput = {
  submissionId: string;
  name: string;
  email: string;
  company: string;
  message: string;
  submittedAt: string;
  /** Instant first reply drafted by the website AI, shown to the lead and the team. */
  aiReply?: string;
};

export type FitReviewEmailDelivery = {
  notification: "queued" | "failed" | "skipped";
  confirmation: "queued" | "failed" | "skipped";
};

export function buildFitReviewEmailJobs(input: FitReviewEmailInput): [EmailJob, EmailJob] {
  const templateData = {
    name: input.name,
    email: input.email,
    company: input.company,
    message: input.message,
    submittedAt: input.submittedAt,
    submissionId: input.submissionId,
    aiReply: input.aiReply ?? "",
  };

  return [
    {
      templateName: "fit-review-notification",
      templateData,
      idempotencyKey: `fit-review-notification-${input.submissionId}`,
    },
    {
      templateName: "fit-review-confirmation",
      recipientEmail: input.email,
      templateData: { name: input.name, aiReply: input.aiReply ?? "" },
      idempotencyKey: `fit-review-confirmation-${input.submissionId}`,
    },
  ];
}

function deliveryState(
  result: PromiseSettledResult<EmailEnqueueResult> | undefined,
): "queued" | "failed" {
  return result?.status === "fulfilled" && result.value.ok ? "queued" : "failed";
}

export async function enqueueFitReviewEmails(
  input: FitReviewEmailInput,
  enqueueOverride?: EnqueueEmail,
): Promise<FitReviewEmailDelivery> {
  if (!enqueueOverride && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { notification: "skipped", confirmation: "skipped" };
  }

  const enqueue =
    enqueueOverride ?? (await import("@/lib/email/send-internal.server")).enqueueInternalEmail;
  const jobs = buildFitReviewEmailJobs(input);
  const results = await Promise.allSettled(jobs.map((job) => enqueue(job)));

  return {
    notification: deliveryState(results[0]),
    confirmation: deliveryState(results[1]),
  };
}
