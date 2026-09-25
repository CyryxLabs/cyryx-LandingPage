import { createHmac } from "node:crypto";

/**
 * Server-to-server client for the CRM public intake (contract v1,
 * `docs/integration/intake-contract-v1.md` in CyryxLabs/cyryx-crm).
 *
 * The browser never talks to the CRM directly: every call is signed here with
 * `CRM_INTAKE_SECRET` (HMAC-SHA256 over `timestamp + "." + rawBody`).
 */

export type CrmIntakeConfig = { url: string; secret: string };

export function getCrmIntakeConfig(): CrmIntakeConfig | null {
  const url = process.env.CRM_INTAKE_URL?.trim();
  const secret = process.env.CRM_INTAKE_SECRET?.trim();
  if (!url || !secret || secret.length < 32) return null;
  if (!/^https:\/\//.test(url) && !/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?\//.test(url)) {
    return null;
  }
  return { url: url.replace(/\/+$/, ""), secret };
}

export function signIntakeBody(secret: string, timestamp: string, rawBody: string): string {
  return `v1=${createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex")}`;
}

export type CrmCallResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; error: string };

async function call<T>(
  config: CrmIntakeConfig,
  route: "init" | "submit" | "event",
  body: unknown,
  idempotencyKey?: string,
  fetchImpl: typeof fetch = fetch,
  timeoutMs = 12_000,
): Promise<CrmCallResult<T>> {
  const rawBody = JSON.stringify(body);
  const timestamp = String(Math.floor(Date.now() / 1000));
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Cyryx-Timestamp": timestamp,
    "X-Cyryx-Signature": signIntakeBody(config.secret, timestamp, rawBody),
  };
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;

  try {
    const response = await fetchImpl(`${config.url}/${route}`, {
      method: "POST",
      headers,
      body: rawBody,
      signal: AbortSignal.timeout(timeoutMs),
    });
    const text = await response.text();
    let parsed: unknown = null;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = null;
    }
    if (!response.ok) {
      console.error("[crm-intake]", route, "failed", response.status);
      return { ok: false, status: response.status, error: "crm_rejected" };
    }
    return { ok: true, status: response.status, data: parsed as T };
  } catch (error) {
    console.error("[crm-intake]", route, "unreachable", (error as Error).name);
    return { ok: false, status: 503, error: "crm_unreachable" };
  }
}

export type IntakeFileManifest = { name: string; bytes: number; mime: string };
export type IntakeInitResponse = {
  intakeId: string;
  expiresAt: string;
  uploads: Array<{ name: string; path: string; signedUrl: string; token: string }>;
};
export type IntakeSubmitResponse = {
  intakeId: string;
  leadId: string;
  requirementsId: string;
  status: string;
  duplicate: boolean;
};

export function crmIntakeInit(
  config: CrmIntakeConfig,
  input: { email: string; files: IntakeFileManifest[] },
  fetchImpl?: typeof fetch,
) {
  return call<IntakeInitResponse>(
    config,
    "init",
    { schemaVersion: "1", email: input.email, files: input.files },
    undefined,
    fetchImpl,
  );
}

export function crmIntakeSubmit(
  config: CrmIntakeConfig,
  payload: Record<string, unknown>,
  idempotencyKey: string,
  fetchImpl?: typeof fetch,
) {
  return call<IntakeSubmitResponse>(
    config,
    "submit",
    { schemaVersion: "1", ...payload },
    idempotencyKey,
    fetchImpl,
  );
}

/** Forwards one funnel event (route /event). Short timeout: it is telemetry. */
export function crmSiteEvent(
  config: CrmIntakeConfig,
  event: Record<string, unknown>,
  fetchImpl?: typeof fetch,
) {
  return call<{ ok: boolean }>(config, "event", event, undefined, fetchImpl, 4_000);
}

/** Maps the CRM status code to a visitor-safe HTTP status. */
export function publicStatusFor(status: number): 409 | 413 | 422 | 429 | 503 {
  if (status === 409) return 409;
  if (status === 413) return 413;
  if (status === 422 || status === 400) return 422;
  if (status === 429) return 429;
  return 503;
}
