import "./lib/error-capture";

import appCss from "./styles.css?url";
import { BUILD_VERSION } from "./lib/build-info";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function withRuntimeHeaders(request: Request, response: Response): Response {
  const url = new URL(request.url);
  const headers = new Headers(response.headers);
  const contentType = headers.get("content-type") ?? "";

  headers.set("x-content-type-options", "nosniff");
  headers.set("referrer-policy", "strict-origin-when-cross-origin");
  headers.set("permissions-policy", "camera=(), microphone=(), geolocation=(), payment=()");
  headers.set("x-frame-options", "DENY");
  if (
    url.protocol === "https:" &&
    (url.hostname === "cyryxlabs.com" || url.hostname === "www.cyryxlabs.com")
  ) {
    headers.set("strict-transport-security", "max-age=31536000");
  }

  headers.set("x-cyryx-build", BUILD_VERSION);
  if (request.method === "GET" || request.method === "HEAD") {
    if (headers.get("x-cyryx-rescue") === "latest-css") {
      headers.set("cache-control", "no-store, no-cache, must-revalidate, max-age=0");
      headers.set("pragma", "no-cache");
      headers.set("expires", "0");
    } else if (url.pathname.startsWith("/assets/styles-") && contentType.includes("text/css")) {
      headers.set("cache-control", "no-store, no-cache, must-revalidate, max-age=0");
      headers.set("pragma", "no-cache");
      headers.set("expires", "0");
      headers.set("x-cyryx-cache-policy", "stylesheet-no-store");
    } else if (url.pathname.startsWith("/assets/") && response.ok) {
      headers.set("cache-control", "public, max-age=31536000, immutable");
      headers.set("x-cyryx-cache-policy", "hashed-asset-immutable");
    } else if (url.pathname.startsWith("/assets/")) {
      headers.set("cache-control", "no-store, no-cache, must-revalidate, max-age=0");
      headers.set("pragma", "no-cache");
      headers.set("expires", "0");
      headers.set("x-cyryx-cache-policy", "missing-asset-no-store");
    } else if (contentType.includes("text/html")) {
      headers.set("cache-control", "no-store, no-cache, must-revalidate, max-age=0");
      headers.set("pragma", "no-cache");
      headers.set("expires", "0");
      headers.set("x-cyryx-cache-policy", "html-no-store");
    } else {
      headers.set("cache-control", "private, no-store");
      headers.set("x-cyryx-cache-policy", "fail-closed-no-store");
    }
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function rescueStaleStylesheetRequest(
  request: Request,
  response: Response,
): Promise<Response> {
  if (response.status !== 404) return response;
  if (request.method !== "GET" && request.method !== "HEAD") return response;

  const url = new URL(request.url);
  if (!/^\/assets\/styles-[^/]+\.css$/.test(url.pathname)) return response;

  const latestCssUrl = new URL(appCss, url.origin);
  const latestCss = await fetch(latestCssUrl.toString(), {
    headers: { accept: "text/css,*/*" },
  }).catch(() => undefined);

  if (!latestCss?.ok) return response;

  const headers = new Headers(latestCss.headers);
  headers.set("content-type", "text/css; charset=utf-8");
  headers.set("cache-control", "no-store, no-cache, must-revalidate, max-age=0");
  headers.set("pragma", "no-cache");
  headers.set("expires", "0");
  headers.set("x-cyryx-cache-policy", "stale-css-rescue");
  headers.set("x-cyryx-rescue", "latest-css");

  return new Response(request.method === "HEAD" ? null : latestCss.body, {
    status: 200,
    statusText: "OK",
    headers,
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);
      const rescued = await rescueStaleStylesheetRequest(request, normalized);
      return withRuntimeHeaders(request, rescued);
    } catch (error) {
      console.error(error);
      return withRuntimeHeaders(
        request,
        new Response(renderErrorPage(), {
          status: 500,
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
      );
    }
  },
};
