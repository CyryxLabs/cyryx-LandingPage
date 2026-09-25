/**
 * First-touch marketing attribution for leads.
 *
 * Captures only allow-listed campaign parameters (utm_*), the referrer origin
 * and path, and the landing path. No other query values are read, so tokens or
 * user data in URLs are never stored. Kept in localStorage for 30 days and sent
 * with a lead submission; nothing is sent anywhere else.
 */
import { z } from "zod";
import { publicPath, publicReferrer } from "./public-location";

const STORAGE_KEY = "cyryx_first_touch";
const TTL_MS = 30 * 24 * 60 * 60 * 1000;
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

const shortText = z.string().trim().max(200).optional();

export const LeadAttributionSchema = z
  .object({
    utm_source: shortText,
    utm_medium: shortText,
    utm_campaign: shortText,
    utm_term: shortText,
    utm_content: shortText,
    referrer: z.string().trim().max(500).optional(),
    landing_path: z.string().trim().max(300).optional(),
    first_seen_at: z.string().trim().max(40).optional(),
    copy_variant: z.string().trim().max(16).optional(),
  })
  .strict();

export type LeadAttribution = z.infer<typeof LeadAttributionSchema>;

type Stored = LeadAttribution & { expires_at: number };

function read(): Stored | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as Stored;
    if (!value || typeof value.expires_at !== "number" || value.expires_at < Date.now()) {
      return null;
    }
    return value;
  } catch {
    return null;
  }
}

/** Call once per page load. Keeps the first touch; never overwrites it inside the TTL. */
export function captureFirstTouch(): void {
  if (typeof window === "undefined") return;
  if (read()) return;
  const params = new URLSearchParams(window.location.search);
  const record: Stored = { expires_at: Date.now() + TTL_MS };
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) record[key] = value.slice(0, 200);
  }
  const referrer = publicReferrer(document.referrer);
  if (referrer && !referrer.startsWith(window.location.origin)) record.referrer = referrer;
  record.landing_path = publicPath(window.location.href);
  record.first_seen_at = new Date().toISOString();
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Storage unavailable: attribution is best-effort.
  }
}

/** Attribution payload to send with a lead, or undefined when nothing was captured. */
export function getLeadAttribution(copyVariant?: string): LeadAttribution | undefined {
  if (typeof window === "undefined") return undefined;
  const stored = read();
  const { expires_at: _expires, ...rest } = stored ?? { expires_at: 0 };
  const payload: LeadAttribution = { ...rest };
  if (copyVariant) payload.copy_variant = copyVariant.slice(0, 16);
  const parsed = LeadAttributionSchema.safeParse(payload);
  return parsed.success && Object.keys(parsed.data).length > 0 ? parsed.data : undefined;
}
