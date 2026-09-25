import { createFileRoute } from "@tanstack/react-router";
import { AssistantRequestSchema, ASSISTANT_MAX_MESSAGE_CHARS } from "@/lib/ai/assistant.schema";

const PER_IP_LIMIT = 30;
const PER_IP_WINDOW_MS = 10 * 60 * 1000;

export const Route = createFileRoute("/api/public/assistant")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const [
          { getGeminiConfig, streamText },
          { ASSISTANT_RULES, CYRYX_KNOWLEDGE },
          limiter,
          security,
        ] = await Promise.all([
          import("@/lib/ai/gemini.server"),
          import("@/lib/ai/knowledge"),
          import("@/lib/ai/rate-limit.server"),
          import("@/lib/security/request.server"),
        ]);

        const config = getGeminiConfig();
        if (!config) {
          return Response.json({ error: "assistant_unavailable" }, { status: 503 });
        }

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "invalid_json" }, { status: 400 });
        }
        const parsed = AssistantRequestSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json({ error: "invalid_payload" }, { status: 400 });
        }
        const last = parsed.data.messages.at(-1);
        if (!last || last.role !== "user" || last.content.length > ASSISTANT_MAX_MESSAGE_CHARS) {
          return Response.json({ error: "invalid_payload" }, { status: 400 });
        }

        if (!limiter.allowRequest(security.clientIpHash(request), PER_IP_LIMIT, PER_IP_WINDOW_MS)) {
          return Response.json({ error: "rate_limited" }, { status: 429 });
        }

        const pageNote = parsed.data.path
          ? `\n\nThe visitor is currently on the page ${parsed.data.path.replace(/[^\w/.-]/g, "")}.`
          : "";
        const stream = await streamText(config, {
          system: `${ASSISTANT_RULES}${pageNote}\n\n# Knowledge\n${CYRYX_KNOWLEDGE}`,
          turns: parsed.data.messages.map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            text: m.content.slice(0, ASSISTANT_MAX_MESSAGE_CHARS * 2),
          })),
          maxOutputTokens: 400,
          temperature: 0.3,
          timeoutMs: 20_000,
          totalTimeoutMs: 40_000,
        });
        if (!stream) {
          return Response.json({ error: "assistant_unavailable" }, { status: 503 });
        }

        return new Response(stream, {
          headers: {
            "content-type": "text/plain; charset=utf-8",
            "cache-control": "no-store",
            "x-content-type-options": "nosniff",
          },
        });
      },
    },
  },
});
