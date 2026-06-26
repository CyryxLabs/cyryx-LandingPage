import { createFileRoute } from "@tanstack/react-router";

// Sink for navigator.sendBeacon() Web Vitals payloads. We accept and
// drop — the goal is to keep the beacon endpoint stable (no 404 noise
// in DevTools) until a real analytics destination is wired up.
export const Route = createFileRoute("/api/public/web-vitals")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // Read+discard so the request body is consumed cleanly.
          await request.text();
        } catch {
          /* ignore */
        }
        return new Response(null, { status: 204 });
      },
    },
  },
});