/** Stream public HTML with negotiated gzip; APIs and already encoded bodies pass through. */
export function compressPublicHtml(request: Request, response: Response): Response {
  const url = new URL(request.url);
  if (
    request.method !== "GET" ||
    response.status !== 200 ||
    !response.body ||
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_serverFn") ||
    request.headers.has("range") ||
    response.headers.has("content-encoding") ||
    response.headers.has("set-cookie") ||
    !response.headers.get("content-type")?.includes("text/html") ||
    /\bno-transform\b/i.test(response.headers.get("cache-control") ?? "")
  )
    return response;

  const encodings = new Map(
    (request.headers.get("accept-encoding") ?? "").split(",").map((entry) => {
      const [name, ...params] = entry.trim().toLowerCase().split(";");
      const quality = params
        .find((param) => param.trim().startsWith("q="))
        ?.trim()
        .slice(2);
      const q = quality === undefined ? 1 : Number(quality);
      return [name, Number.isFinite(q) && q >= 0 && q <= 1 ? q : 0] as const;
    }),
  );
  const headers = new Headers(response.headers);
  const vary =
    headers
      .get("vary")
      ?.split(",")
      .map((value) => value.trim()) ?? [];
  if (!vary.some((value) => /^(accept-encoding|\*)$/i.test(value))) vary.push("Accept-Encoding");
  headers.set("vary", vary.join(", "));
  const gzipQuality = encodings.get("gzip") ?? encodings.get("*") ?? 0;
  if (gzipQuality <= 0)
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  headers.set("content-encoding", "gzip");
  headers.delete("content-length");
  const etag = headers.get("etag");
  if (etag && !etag.startsWith("W/")) headers.set("etag", `W/${etag}`);
  return new Response(response.body.pipeThrough(new CompressionStream("gzip")), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
