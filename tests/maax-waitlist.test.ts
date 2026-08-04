import { describe, expect, test } from "bun:test";
import {
  isSuccessfulMaaxWaitlistRpcResult,
  MAAX_WAITLIST_CONSENT_VERSION,
  MaaxWaitlistSchema,
} from "../src/lib/maax-waitlist.schema";

const valid = {
  fullName: "Ada Lovelace",
  email: "ada@example.com",
  company: "Analytical Engines Ltd",
  role: "Engineering lead",
  useCase: "Coordinate a reviewable multi-file software delivery mission.",
  operatingConstraint: "Human approval must precede any consequential repository change.",
  phone: "+44 20 7946 0958",
  country: "United Kingdom",
  consent: true as const,
  consentVersion: MAAX_WAITLIST_CONSENT_VERSION,
  website: "",
  formStartedAt: Date.now() - 2_000,
  source: "maax_studio_waitlist",
  landingPath: "/products/maax-studio?utm_source=research",
  referrer: "",
};

describe("MAAX waitlist schema", () => {
  test("pins the reviewed consent contract", () => {
    expect(MAAX_WAITLIST_CONSENT_VERSION).toBe("maax-waitlist-v2-2026-08-03");
  });

  test("accepts the required qualification fields with explicit consent", () => {
    expect(MaaxWaitlistSchema.safeParse(valid).success).toBe(true);
  });

  test("accepts an omitted or empty optional telephone", () => {
    expect(MaaxWaitlistSchema.safeParse({ ...valid, phone: undefined }).success).toBe(true);
    expect(MaaxWaitlistSchema.safeParse({ ...valid, phone: "" }).success).toBe(true);
  });

  test("requires company, role, use case, and operating constraint", () => {
    for (const field of ["company", "role", "useCase", "operatingConstraint"] as const) {
      expect(MaaxWaitlistSchema.safeParse({ ...valid, [field]: "" }).success).toBe(false);
    }
  });

  test("rejects submission without consent", () => {
    const result = MaaxWaitlistSchema.safeParse({ ...valid, consent: false });
    expect(result.success).toBe(false);
  });

  test("rejects invalid email and supplied telephone values", () => {
    expect(MaaxWaitlistSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
    expect(MaaxWaitlistSchema.safeParse({ ...valid, phone: "call me" }).success).toBe(false);
  });

  test("accepts bounded honeypot content so the server can silently drop it", () => {
    expect(MaaxWaitlistSchema.safeParse({ ...valid, website: "spam.example" }).success).toBe(true);
    expect(MaaxWaitlistSchema.safeParse({ ...valid, website: "x".repeat(201) }).success).toBe(
      false,
    );
  });

  test("accepts only an explicit ok result from the persistence RPC", () => {
    expect(isSuccessfulMaaxWaitlistRpcResult({ ok: true })).toBe(true);
    expect(isSuccessfulMaaxWaitlistRpcResult({ ok: false })).toBe(false);
    expect(isSuccessfulMaaxWaitlistRpcResult(null)).toBe(false);
    expect(isSuccessfulMaaxWaitlistRpcResult(undefined)).toBe(false);
  });
});
