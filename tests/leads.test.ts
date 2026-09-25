import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { saveLead, sanitizeReply, type SaveLeadInput } from "../src/lib/leads.server";

const lead: SaveLeadInput = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  company: "Analytical Engines Ltd",
  message: "Project type: Workflow Automation\n\nWhat do you want to change?\nManual handoffs.",
  interest: "assistant",
  consentVersion: "2026-09",
  ipHash: "ip-hash",
  userAgentHash: "ua-hash",
  qualification: { project_type: "Workflow Automation" },
  attribution: { utm_source: "newsletter", landing_path: "/" },
};

describe("sanitizeReply", () => {
  test("strips markdown emphasis, headings, code and quote markers", () => {
    const out = sanitizeReply(
      "## Next step\n**Build** looks right. Use `Control` for _limits_.\n> quoted",
    );
    expect(out).not.toMatch(/[*_#`>]/);
    expect(out).toContain("Next step");
    expect(out).toContain("Build looks right. Use Control for limits.");
  });

  test("removes links to other hosts and keeps cyryxlabs.com links", () => {
    const out = sanitizeReply(
      "See https://evil.example.com/phish?x=1 and http://other.io, or https://www.cyryxlabs.com/engagement-model and https://cyryxlabs.com/start.",
    );
    expect(out).not.toContain("evil.example.com");
    expect(out).not.toContain("other.io");
    expect(out).toContain("https://www.cyryxlabs.com/engagement-model");
    expect(out).toContain("https://cyryxlabs.com/start");
  });

  test("removes the URL of a markdown link to another host", () => {
    const out = sanitizeReply("Read [the guide](https://evil.example.com/guide) first.");
    expect(out).not.toContain("evil.example.com");
  });

  test("collapses blank-line runs, trims and bounds the length", () => {
    expect(sanitizeReply("  One.\n\n\n\n\nTwo.  ")).toBe("One.\n\nTwo.");
    expect(sanitizeReply("a".repeat(5000))).toHaveLength(1200);
  });

  // Hosts are matched exactly, so a lookalike that starts with "cyryxlabs.com" is removed.
  test("removes lookalike hosts that only start with cyryxlabs.com", () => {
    const out = sanitizeReply("Pay here: https://cyryxlabs.com.evil.example/pay");
    expect(out).not.toContain("evil.example");
  });

  test("keeps links to the AEXOS product site", () => {
    expect(sanitizeReply("Docs: https://aexos.cyryxlabs.com/.")).toContain(
      "https://aexos.cyryxlabs.com/",
    );
  });
});

describe("saveLead (CRM is the only system of record)", () => {
  const originalFetch = globalThis.fetch;
  const env = { url: process.env.CRM_INTAKE_URL, secret: process.env.CRM_INTAKE_SECRET };
  let calls: Array<{ url: string; body: Record<string, unknown>; headers: Headers }> = [];

  function mockCrm(status: number, body: unknown) {
    globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      calls.push({
        url: String(input),
        body: JSON.parse(String(init?.body ?? "{}")),
        headers: new Headers(init?.headers),
      });
      return new Response(JSON.stringify(body), { status });
    }) as typeof fetch;
  }

  beforeEach(() => {
    calls = [];
    process.env.CRM_INTAKE_URL = "https://crm.example.test/functions/v1/astra-public-intake";
    process.env.CRM_INTAKE_SECRET = "test-crm-intake-secret-0123456789abcdef";
  });
  afterEach(() => {
    globalThis.fetch = originalFetch;
    process.env.CRM_INTAKE_URL = env.url;
    process.env.CRM_INTAKE_SECRET = env.secret;
    if (env.url === undefined) delete process.env.CRM_INTAKE_URL;
    if (env.secret === undefined) delete process.env.CRM_INTAKE_SECRET;
  });

  test("returns 503 when the CRM intake is not configured", async () => {
    delete process.env.CRM_INTAKE_URL;
    expect(await saveLead(lead)).toEqual({
      ok: false,
      status: 503,
      error: "Backend unavailable",
    });
  });

  test("submits a signed, structured intake and returns the requirements id", async () => {
    mockCrm(200, {
      intakeId: "int_abc12345",
      leadId: "lead_1",
      requirementsId: "req_1",
      status: "received",
      duplicate: false,
    });
    const result = await saveLead(lead);
    expect(result).toEqual({ ok: true, submissionId: "req_1", structured: true });
    expect(calls).toHaveLength(1);
    expect(calls[0].url).toEndWith("/submit");
    expect(calls[0].headers.get("x-cyryx-signature")).toMatch(/^v1=[0-9a-f]{64}$/);
    expect(calls[0].headers.get("idempotency-key")).toBeTruthy();
    expect(calls[0].body).toMatchObject({
      schemaVersion: "1",
      kind: "assistant",
      contact: { name: lead.name, email: lead.email },
      source: { utm: { utm_source: "newsletter" }, landingPath: "/" },
    });
  });

  test("maps a CRM rate limit to 429", async () => {
    mockCrm(429, { ok: false, error: "rate-limited" });
    expect(await saveLead(lead)).toEqual({
      ok: false,
      status: 429,
      error: "Too many submissions — please try again later.",
    });
  });

  test("maps other CRM failures to 500", async () => {
    mockCrm(500, { ok: false, error: "service-unavailable" });
    expect(await saveLead(lead)).toEqual({
      ok: false,
      status: 500,
      error: "We couldn't save your brief right now.",
    });
  });
});
