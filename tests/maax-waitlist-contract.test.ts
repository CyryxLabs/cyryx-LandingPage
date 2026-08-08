import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const migration = readFileSync(
  "supabase/migrations/20260803180000_qualify_maax_waitlist.sql",
  "utf8",
);
const apiRoute = readFileSync("src/routes/api/public/maax-waitlist.ts", "utf8");
const adminView = readFileSync("src/routes/_authenticated/workspace.marketing.tsx", "utf8");

describe("MAAX waitlist v2 persistence contract", () => {
  test("keeps public writes behind the versioned security-definer RPC", () => {
    expect(migration).toContain("ALTER TABLE public.maax_waitlist ENABLE ROW LEVEL SECURITY");
    expect(migration).toMatch(
      /REVOKE INSERT ON TABLE public\.maax_waitlist FROM PUBLIC, anon, authenticated/,
    );
    expect(migration).toContain("CREATE OR REPLACE FUNCTION public.join_maax_waitlist_v2(");
    expect(migration).toMatch(
      /REVOKE ALL ON FUNCTION public\.join_maax_waitlist_v2\([\s\S]*?\) FROM PUBLIC, anon, authenticated, service_role/,
    );
    expect(migration).toMatch(
      /GRANT EXECUTE ON FUNCTION public\.join_maax_waitlist_v2\([\s\S]*?\) TO anon, authenticated, service_role/,
    );
  });

  test("reactivates explicit resubscriptions without resetting reviewed statuses", () => {
    expect(migration).toMatch(
      /status = CASE\s+WHEN public\.maax_waitlist\.status = 'unsubscribed' THEN 'waiting'\s+ELSE public\.maax_waitlist\.status\s+END/,
    );
  });

  test("accepts only the published consent contract version", () => {
    expect(migration).toContain("v_consent_version <> 'maax-waitlist-v2-2026-08-03'");
  });

  test("maps every qualification field to v2 and fails closed on non-ok results", () => {
    expect(apiRoute).toContain('supabase.rpc("join_maax_waitlist_v2"');
    for (const argument of [
      "p_company",
      "p_role",
      "p_use_case",
      "p_operating_constraint",
      "p_country",
      "p_consent_version",
      "p_phone",
    ]) {
      expect(apiRoute).toContain(`${argument}:`);
    }
    expect(apiRoute).toContain("if (!isSuccessfulMaaxWaitlistRpcResult(data))");
  });

  test("exposes qualification context in the role-gated admin table", () => {
    expect(adminView).toContain('tableName="maax_waitlist"');
    for (const field of ["company", "role", "use_case", "operating_constraint"]) {
      expect(adminView).toContain(`key: "${field}"`);
    }
  });
});
