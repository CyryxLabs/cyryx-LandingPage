/**
 * Minimal Gemini client (REST, no SDK) used by the website assistant and the
 * instant first reply. Server-only: the API key never reaches the browser.
 *
 * Env:
 *   GEMINI_API_KEY  required to enable AI features
 *   GEMINI_MODEL    optional, defaults to DEFAULT_GEMINI_MODEL
 */
export const DEFAULT_GEMINI_MODEL = "gemini-3.8-flash";
const DEFAULT_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

/** GEMINI_API_BASE exists only so tests can point at a local mock server. */
function apiBase(): string {
  return process.env.GEMINI_API_BASE?.trim() || DEFAULT_API_BASE;
}

export type GeminiTurn = { role: "user" | "model"; text: string };

export type GeminiRequest = {
  system: string;
  turns: readonly GeminiTurn[];
  maxOutputTokens?: number;
  temperature?: number;
  timeoutMs?: number;
};

export type GeminiConfig = { apiKey: string; model: string };

export function getGeminiConfig(
  env: Record<string, string | undefined> = process.env,
): GeminiConfig | null {
  const apiKey = env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;
  const model = env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
  return { apiKey, model };
}

export function buildGeminiBody(request: GeminiRequest) {
  return {
    systemInstruction: { parts: [{ text: request.system }] },
    contents: request.turns.map((turn) => ({ role: turn.role, parts: [{ text: turn.text }] })),
    generationConfig: {
      temperature: request.temperature ?? 0.3,
      maxOutputTokens: request.maxOutputTokens ?? 400,
    },
  };
}

type GeminiChunk = {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
};

export function textFromChunk(chunk: GeminiChunk): string {
  return (chunk.candidates?.[0]?.content?.parts ?? []).map((part) => part.text ?? "").join("");
}

/** One-shot completion. Resolves to null on any failure or timeout. */
export async function generateText(
  config: GeminiConfig,
  request: GeminiRequest,
  fetchImpl: typeof fetch = fetch,
): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), request.timeoutMs ?? 8000);
  try {
    const response = await fetchImpl(
      `${apiBase()}/${encodeURIComponent(config.model)}:generateContent`,
      {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": config.apiKey },
        body: JSON.stringify(buildGeminiBody(request)),
        signal: controller.signal,
      },
    );
    if (!response.ok) {
      console.error("[gemini] generateContent failed", response.status);
      return null;
    }
    const text = textFromChunk((await response.json()) as GeminiChunk).trim();
    return text || null;
  } catch (error) {
    console.error(
      "[gemini] generateContent error",
      error instanceof Error ? error.name : "unknown",
    );
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Streaming completion. Returns a ReadableStream of plain-text deltas, or null
 * when the upstream request fails before streaming starts.
 */
export async function streamText(
  config: GeminiConfig,
  request: GeminiRequest,
  fetchImpl: typeof fetch = fetch,
): Promise<ReadableStream<Uint8Array> | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), request.timeoutMs ?? 25000);
  let upstream: Response;
  try {
    upstream = await fetchImpl(
      `${apiBase()}/${encodeURIComponent(config.model)}:streamGenerateContent?alt=sse`,
      {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": config.apiKey },
        body: JSON.stringify(buildGeminiBody(request)),
        signal: controller.signal,
      },
    );
  } catch {
    clearTimeout(timer);
    return null;
  }
  if (!upstream.ok || !upstream.body) {
    clearTimeout(timer);
    console.error("[gemini] streamGenerateContent failed", upstream.status);
    return null;
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = upstream.body.getReader();
  let buffer = "";

  return new ReadableStream<Uint8Array>({
    async pull(streamController) {
      try {
        const { done, value } = await reader.read();
        if (done) {
          clearTimeout(timer);
          streamController.close();
          return;
        }
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split(/\r?\n\r?\n/);
        buffer = events.pop() ?? "";
        for (const event of events) {
          for (const line of event.split(/\r?\n/)) {
            if (!line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (!payload || payload === "[DONE]") continue;
            try {
              const text = textFromChunk(JSON.parse(payload) as GeminiChunk);
              if (text) streamController.enqueue(encoder.encode(text));
            } catch {
              // Ignore malformed keep-alive lines.
            }
          }
        }
      } catch (error) {
        clearTimeout(timer);
        streamController.error(error);
      }
    },
    cancel() {
      clearTimeout(timer);
      controller.abort();
    },
  });
}
