import { describe, expect, test } from "bun:test";
import { gunzipSync } from "node:zlib";
import { compressPublicHtml } from "../src/lib/html-compression";

const html = "<!doctype html><h1>Cyryx — software e IA</h1>";
const response = (headers: Record<string, string> = {}, status = 200) =>
  new Response(html, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "content-length": String(Buffer.byteLength(html)),
      ...headers,
    },
  });
const request = (encoding: string, extra: RequestInit = {}, path = "/") =>
  new Request(`http://localhost${path}`, {
    ...extra,
    headers: { "accept-encoding": encoding, ...extra.headers },
  });
describe("public HTML delivery", () => {
  test("gzip preserves exactly the rendered UTF-8 HTML and headers", async () => {
    const result = compressPublicHtml(
      request("br, gzip"),
      response({ "x-cyryx-build": "review", vary: "Origin" }),
    );
    expect(result.headers.get("content-encoding")).toBe("gzip");
    expect(result.headers.get("content-length")).toBeNull();
    expect(result.headers.get("vary")).toBe("Origin, Accept-Encoding");
    expect(result.headers.get("x-cyryx-build")).toBe("review");
    expect(gunzipSync(Buffer.from(await result.arrayBuffer())).toString()).toBe(html);
  });
  test("identity, unsupported encodings and explicit gzip refusal retain unencoded HTML", async () => {
    for (const encoding of ["", "identity", "br", "gzip;q=0, *;q=1", "gzip;q=invalid"]) {
      const result = compressPublicHtml(request(encoding), response());
      expect(result.headers.get("content-encoding")).toBeNull();
      expect(await result.text()).toBe(html);
      expect(result.headers.get("vary")).toContain("Accept-Encoding");
    }
  });
  test("positive wildcard quality negotiates gzip and validators become weak", async () => {
    const result = compressPublicHtml(request("*;q=0.5"), response({ etag: '"original"' }));
    expect(result.headers.get("content-encoding")).toBe("gzip");
    expect(result.headers.get("etag")).toBe('W/"original"');
    expect(gunzipSync(Buffer.from(await result.arrayBuffer())).toString()).toBe(html);
  });
  test("APIs, signed requests, errors, cookies, ranges, streams and existing encodings pass through", () => {
    for (const [req, res] of [
      [request("gzip", {}, "/api/public/contact"), response()],
      [request("gzip", { method: "POST" }), response()],
      [request("gzip", { method: "HEAD" }), response()],
      [request("gzip", { headers: { range: "bytes=0-10" } }), response()],
      [request("gzip"), response({}, 500)],
      [request("gzip"), response({ "set-cookie": "session=sample" })],
      [request("gzip"), response({ "cache-control": "no-transform" })],
      [request("gzip"), response({ "content-type": "text/event-stream" })],
      [request("gzip"), response({ "content-encoding": "br" })],
    ])
      expect(compressPublicHtml(req as Request, res as Response)).toBe(res);
  });
});
