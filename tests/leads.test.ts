import { describe, expect, test } from "bun:test";
import type { SupabaseClient } from "@supabase/supabase-js";
import { saveLead, sanitizeReply, type SaveLeadInput } from "../src/lib/leads.server";

type RpcCall = { fn: string; args: Record<string, unknown> };
type RpcResult = { data: unknown; error: { code?: string; message?: string } | null };

/** Minimal stand-in for the Supabase client: only `rpc` is used by saveLead. */
function fakeClient(responses: Record<string, RpcResult>) {
  const calls: RpcCall[] = [];
  const client = {
    rpc: async (fn: string, args: Record<string, unknown>) => {
      calls.push({ fn, args });
      return responses[fn] ?? { data: null, error: { code: "UNEXPECTED", message: fn } };
    },
  };
  return { client: client as unknown as SupabaseClient, calls };
}

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

const SUBMISSION_ID = "00000000-0000-4000-8000-000000000001";

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

describe("saveLead", () => {
  test("returns 503 when no backend client is configured", async () => {
    expect(await saveLead(lead, null)).toEqual({
      ok: false,
      status: 503,
      error: "Backend unavailable",
    });
  });

  test("stores structured qualification and attribution through v2", async () => {
    const { client, calls } = fakeClient({
      submit_contact_public_v2: { data: { ok: true, id: SUBMISSION_ID }, error: null },
    });
    const result = await saveLead(lead, client);
    expect(result).toEqual({ ok: true, submissionId: SUBMISSION_ID, structured: true });
    expect(calls.map((call) => call.fn)).toEqual(["submit_contact_public_v2"]);
    expect(calls[0].args).toMatchObject({
      p_name: lead.name,
      p_email: lead.email,
      p_interest: "assistant",
      p_qualification: { project_type: "Workflow Automation" },
      p_attribution: { utm_source: "newsletter", landing_path: "/" },
    });
  });

  test("falls back to v1 when v2 is missing (PGRST202)", async () => {
    const { client, calls } = fakeClient({
      submit_contact_public_v2: {
        data: null,
        error: { code: "PGRST202", message: "Could not find the function" },
      },
      submit_contact_public: { data: { ok: true, id: SUBMISSION_ID }, error: null },
    });
    const result = await saveLead(lead, client);
    expect(result).toEqual({ ok: true, submissionId: SUBMISSION_ID, structured: false });
    expect(calls.map((call) => call.fn)).toEqual([
      "submit_contact_public_v2",
      "submit_contact_public",
    ]);
    const v1 = calls[1].args;
    // v1 has no structured columns: attribution is folded into the message and
    // the "assistant" interest is mapped to a value the v1 enum accepts.
    expect(v1).not.toHaveProperty("p_qualification");
    expect(v1).not.toHaveProperty("p_attribution");
    expect(v1.p_interest).toBe("other");
    expect(String(v1.p_message)).toContain(lead.message);
    expect(String(v1.p_message)).toContain('Attribution: {"utm_source":"newsletter"');
    expect(String(v1.p_message).length).toBeLessThanOrEqual(2000);
  });

  test("also falls back when Postgres reports the function does not exist", async () => {
    const { client, calls } = fakeClient({
      submit_contact_public_v2: {
        data: null,
        error: { code: "42883", message: "function does not exist" },
      },
      submit_contact_public: { data: { ok: true, id: SUBMISSION_ID }, error: null },
    });
    expect((await saveLead(lead, client)).ok).toBe(true);
    expect(calls).toHaveLength(2);
  });

  test("does not fall back on other v2 errors", async () => {
    const { client, calls } = fakeClient({
      submit_contact_public_v2: {
        data: null,
        error: { code: "23514", message: "check violation" },
      },
    });
    expect(await saveLead(lead, client)).toEqual({
      ok: false,
      status: 500,
      error: "Could not save submission",
    });
    expect(calls).toHaveLength(1);
  });

  test("maps rate limiting to 429", async () => {
    const { client } = fakeClient({
      submit_contact_public_v2: { data: null, error: { code: "P0001", message: "rate_limited" } },
    });
    const result = await saveLead(lead, client);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.status).toBe(429);
  });

  test("reports a v1 failure after a fallback", async () => {
    const { client } = fakeClient({
      submit_contact_public_v2: { data: null, error: { code: "PGRST202" } },
      submit_contact_public: { data: null, error: { code: "500", message: "boom" } },
    });
    const result = await saveLead(lead, client);
    expect(result).toEqual({ ok: false, status: 500, error: "Could not save submission" });
  });

  test("generates a submission id when the RPC returns none", async () => {
    const { client } = fakeClient({
      submit_contact_public_v2: { data: { ok: true }, error: null },
    });
    const result = await saveLead(lead, client);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.submissionId).toMatch(/^[0-9a-f-]{36}$/);
  });
});
