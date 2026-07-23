import { describe, expect, test } from "bun:test";
import {
  MAAX_WAITLIST_CONSENT_VERSION,
  MaaxWaitlistSchema,
} from "../src/lib/maax-waitlist.schema";

const valid = {
  fullName: "Ada Lovelace",
  email: "ada@example.com",
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
  test("accepts the four required lead fields with explicit consent", () => {
    expect(MaaxWaitlistSchema.safeParse(valid).success).toBe(true);
  });

  test("rejects submission without consent", () => {
    const result = MaaxWaitlistSchema.safeParse({ ...valid, consent: false });
    expect(result.success).toBe(false);
  });

  test("rejects invalid email and telephone values", () => {
    expect(MaaxWaitlistSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
    expect(MaaxWaitlistSchema.safeParse({ ...valid, phone: "call me" }).success).toBe(false);
  });

  test("rejects honeypot content", () => {
    expect(MaaxWaitlistSchema.safeParse({ ...valid, website: "spam.example" }).success).toBe(false);
  });
});
