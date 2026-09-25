import { createHash } from "node:crypto";

type Utm = Record<string, string>;

function pickString(value: unknown, max = 300): string {
  return typeof value === "string" ? value.slice(0, max) : "";
}

/** Source block for the CRM payload, from the allow-listed attribution the page sends. */
export function sourceFromRequest(request: Request, body: unknown, page: string) {
  const raw =
    (body && typeof body === "object" && "attribution" in body
      ? (body as { attribution?: Record<string, unknown> }).attribution
      : undefined) ?? {};
  const utm: Utm = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
    const value = pickString((raw as Record<string, unknown>)[key], 120);
    if (value) utm[key] = value;
  }
  return {
    site: "cyryxlabs.com",
    page,
    referrer:
      pickString((raw as Record<string, unknown>).referrer) ||
      pickString(request.headers.get("referer")),
    landingPath: pickString((raw as Record<string, unknown>).landing_path, 200),
    utm,
    copyVariant: pickString((raw as Record<string, unknown>).copy_variant, 20),
  };
}

/** Stable key per logical submission: a double click or retry never creates two leads. */
export function idempotencyKeyFor(payload: {
  contact: { email: string };
  kind: string;
  requirements?: unknown;
  intakeId?: string;
}): string {
  const digest = createHash("sha256")
    .update(
      JSON.stringify({
        email: payload.contact.email,
        kind: payload.kind,
        intakeId: payload.intakeId ?? "",
        requirements: payload.requirements ?? null,
      }),
    )
    .digest("hex");
  return `web_${payload.kind}_${digest.slice(0, 40)}`;
}
