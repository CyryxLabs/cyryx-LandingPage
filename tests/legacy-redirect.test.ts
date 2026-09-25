import { describe, expect, test } from "bun:test";
import { legacyRedirect } from "../src/lib/legacy-redirect";

const at = (url: string) => legacyRedirect(new Request(url));

describe("legacyRedirect", () => {
  test("sends every AEXOS subdomain path to the product page", () => {
    for (const url of ["https://aexos.cyryxlabs.com/", "https://aexos.cyryxlabs.com/aexos?x=1"]) {
      const response = at(url);
      expect(response?.status).toBe(308);
      expect(response?.headers.get("location")).toBe("https://www.cyryxlabs.com/products/aexos");
    }
  });

  test("moves the old internal console to the CRM", () => {
    for (const url of [
      "https://www.cyryxlabs.com/auth",
      "https://www.cyryxlabs.com/auth?redirect=/workspace",
      "https://www.cyryxlabs.com/workspace",
      "https://www.cyryxlabs.com/workspace/pipeline",
      "https://workspace.cyryxlabs.com/",
    ]) {
      const response = at(url);
      expect(response?.status).toBe(308);
      expect(response?.headers.get("location")).toBe("https://crm.cyryxlabs.com/");
    }
  });

  test("lands old newsletter links on the home page and retires /lovable", () => {
    expect(at("https://www.cyryxlabs.com/unsubscribe?token=abc")?.headers.get("location")).toBe(
      "https://www.cyryxlabs.com/",
    );
    expect(at("https://www.cyryxlabs.com/newsletter/confirm")?.status).toBe(308);
    expect(at("https://www.cyryxlabs.com/email/unsubscribe")?.status).toBe(308);
    expect(at("https://www.cyryxlabs.com/lovable/email/queue/process")?.status).toBe(410);
  });

  test("leaves every public page alone", () => {
    for (const path of ["/", "/authors", "/products/aexos", "/start", "/api/public/cta-events"]) {
      expect(at(`https://www.cyryxlabs.com${path}`)).toBeNull();
    }
  });
});
