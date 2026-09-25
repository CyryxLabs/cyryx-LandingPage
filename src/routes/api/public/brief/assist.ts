import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { toBriefDraft } from "@/lib/brief-assist-draft";

const PER_IP_LIMIT = 10;
const WINDOW_MS = 60 * 60 * 1000;

const AssistRequestSchema = z.object({
  description: z.string().trim().min(40).max(6000),
});

const ASSIST_RULES = `You turn a client's free-text description of software they need into a structured requirements draft.
Rules:
- Use ONLY what the description says or directly implies. Never invent numbers, integrations, deadlines, budgets or users that are not there.
- When something important is missing, add it to "openQuestions" as a short question instead of guessing.
- Features: short imperative titles, one-sentence descriptions, priority Must/Should/Could/Won't using MoSCoW (Must = the product is useless without it).
- Success metrics must be measurable only if the description gives a basis; otherwise ask in openQuestions.
- Write in clear, plain English.
Return JSON with these optional keys: projectName, summary, problem, goals (string[]), successMetrics (string[]), users ([{name, description, needs}] where each value is one string), scenarios (string[]), features ([{title, description, priority}]), mvpDefinition, outOfScope, platforms (string[] from: Web app, iOS, Android, Desktop, API / backend only, Chat / assistant, Internal back-office), integrations ([{system, purpose, direction: read|write|both}]), openQuestions (single string, one question per line).`;

/** Drafts structured brief fields from a free-text description (the visitor reviews every field). */
export const Route = createFileRoute("/api/public/brief/assist")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const [{ getGeminiConfig, generateText }, limiter, security] = await Promise.all([
          import("@/lib/ai/gemini.server"),
          import("@/lib/ai/rate-limit.server"),
          import("@/lib/security/request.server"),
        ]);
        const config = getGeminiConfig();
        if (!config) return Response.json({ error: "assist_unavailable" }, { status: 503 });

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "invalid_json" }, { status: 400 });
        }
        const parsed = AssistRequestSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { error: "Write at least a few sentences about what you need." },
            { status: 422 },
          );
        }
        if (
          !limiter.allowRequest(
            `brief-assist:${security.clientIpHash(request)}`,
            PER_IP_LIMIT,
            WINDOW_MS,
          )
        ) {
          return Response.json({ error: "rate_limited" }, { status: 429 });
        }

        const text = await generateText(config, {
          system: ASSIST_RULES,
          turns: [
            { role: "user", text: `Client description:\n"""\n${parsed.data.description}\n"""` },
          ],
          maxOutputTokens: 2000,
          temperature: 0.2,
          timeoutMs: 30_000,
          totalTimeoutMs: 50_000,
          responseMimeType: "application/json",
        });
        if (!text) {
          console.error("[brief-assist] no text from any model");
          return Response.json({ error: "assist_unavailable" }, { status: 503 });
        }

        let json: unknown;
        try {
          json = JSON.parse(text.replace(/^```(?:json)?\s*|\s*```$/g, ""));
        } catch {
          console.error("[brief-assist] model returned invalid JSON", { length: text.length });
          return Response.json({ error: "assist_unavailable" }, { status: 503 });
        }
        const { draft, dropped } = toBriefDraft(json);
        // Key names only; never the client's text.
        if (dropped.length) console.error("[brief-assist] dropped invalid keys", dropped);
        if (Object.keys(draft).length === 0) {
          return Response.json({ error: "assist_unavailable" }, { status: 503 });
        }
        return Response.json({ draft });
      },
    },
  },
});
