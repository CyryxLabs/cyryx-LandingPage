import { expect, test } from "@playwright/test";

test("active runtime boundary returns baseline security headers, short edge cache for public HTML and fail-closed elsewhere", async ({
  request,
}) => {
  const pageResponse = await request.get("/");
  expect(pageResponse.status()).toBe(200);
  const pageHeaders = pageResponse.headers();
  expect(pageHeaders["x-content-type-options"]).toBe("nosniff");
  expect(pageHeaders["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(pageHeaders["permissions-policy"]).toBe(
    "camera=(), microphone=(), geolocation=(), payment=()",
  );
  expect(pageHeaders["x-frame-options"]).toBe("DENY");
  expect(pageHeaders["cache-control"]).toBe("public, max-age=0, must-revalidate");
  expect(pageHeaders["cdn-cache-control"]).toContain("s-maxage=300");
  expect(pageHeaders["x-cyryx-cache-policy"]).toBe("html-edge-short");
  expect(pageHeaders["strict-transport-security"]).toBeUndefined();

  const privatePage = await request.get("/auth");
  expect(privatePage.headers()["cache-control"]).toContain("no-store");

  const dynamicResponse = await request.get("/sitemap.xml");
  expect(dynamicResponse.status()).toBe(200);
  expect(dynamicResponse.headers()["cache-control"]).toBe("private, no-store");
  expect(dynamicResponse.headers()["x-cyryx-cache-policy"]).toBe("fail-closed-no-store");
});
