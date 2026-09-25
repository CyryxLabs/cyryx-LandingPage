import { describe, expect, test } from "bun:test";
import {
  createVisitorLimiter,
  deviceClass,
  isSameOrigin,
  toCrmSiteEvent,
} from "../src/lib/site-event.server";

const IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1";
const IPAD =
  "Mozilla/5.0 (iPad; CPU OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1";
const MAC =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15";

describe("toCrmSiteEvent", () => {
  test("keeps only public routing data", () => {
    expect(
      toCrmSiteEvent(
        {
          cta: "start_project",
          section: "hero",
          path: "https://cyryxlabs.com/solutions/ai-agents?email=a@b.co#x",
          href: "/start?source=home&email=a@b.co",
          variant: "A",
          referrer: "https://www.google.com/search?q=cyryx",
        },
        IPHONE,
      ),
    ).toEqual({
      schemaVersion: "1",
      event: "start_project",
      section: "hero",
      path: "/solutions/ai-agents",
      href: "/start",
      variant: "a",
      referrerHost: "www.google.com",
      device: "mobile",
    });
  });

  test("maps hash, mail and external destinations to the CRM contract", () => {
    const base = { cta: "see_how_we_work", section: "hero", path: "/" };
    expect(toCrmSiteEvent({ ...base, href: "#how" }, MAC)?.href).toBe("/#how");
    expect(toCrmSiteEvent({ ...base, href: "mailto:contact@cyryxlabs.com" }, MAC)?.href).toBe(
      "mailto:",
    );
    expect(toCrmSiteEvent({ ...base, href: "https://github.com/cyryx?tab=1" }, MAC)?.href).toBe(
      "https://github.com/cyryx",
    );
    expect(toCrmSiteEvent({ ...base, href: "tel:+15550100" }, MAC)?.href).toBeNull();
    expect(toCrmSiteEvent({ ...base, href: "javascript:alert(1)" }, MAC)?.href).toBeNull();
  });

  test("refuses malformed names and drops invalid variants", () => {
    expect(toCrmSiteEvent({ cta: "Start Project", section: "hero", path: "/" }, MAC)).toBeNull();
    expect(
      toCrmSiteEvent({ cta: "start_project", section: "hero", path: "/", variant: "b c" }, MAC)
        ?.variant,
    ).toBeNull();
  });
});

describe("deviceClass", () => {
  test("classifies iPhone, iPad and desktop Safari", () => {
    expect(deviceClass(IPHONE)).toBe("mobile");
    expect(deviceClass(IPAD)).toBe("tablet");
    expect(deviceClass(MAC)).toBe("desktop");
    expect(deviceClass(null)).toBeNull();
  });
});

describe("visitor limiter and origin", () => {
  test("allows the limit per window, then refuses until the window resets", () => {
    const allow = createVisitorLimiter(2, 1_000);
    expect([allow("a", 0), allow("a", 10), allow("a", 20), allow("b", 20)]).toEqual([
      true,
      true,
      false,
      true,
    ]);
    expect(allow("a", 1_001)).toBe(true);
  });

  test("accepts same-origin beacons only", () => {
    expect(isSameOrigin("https://cyryxlabs.com", "cyryxlabs.com")).toBe(true);
    expect(isSameOrigin("https://evil.example", "cyryxlabs.com")).toBe(false);
    expect(isSameOrigin(null, "cyryxlabs.com")).toBe(true);
    expect(isSameOrigin("null", "cyryxlabs.com")).toBe(false);
  });
});
