/**
 * Minimal Gemini client (REST, no SDK) used by the website assistant and the
 * instant first reply. Server-only: the API key never reaches the browser.
 *
 * Env:
 *   GEMINI_API_KEY  required to enable AI features
 *   GEMINI_MODEL    optional, defaults to DEFAULT_GEMINI_MODEL
 *   GEMINI_FALLBACK_MODELS  optional, comma-separated; tried in order when the
 *                   primary model is overloaded or unavailable (429/5xx/network)
 */
export const DEFAULT_GEMINI_MODEL = "gemini-3.8-flash";
// Measured on the production key (2026-09-24, 4 rounds): 3.5-flash-lite answered
// every time in 0.6–0.9 s; flash-lite-latest every time in 1–2.5 s; 3.5-flash
// failed or took 7–30 s under load. Fast, reliable models first.
export const DEFAULT_GEMINI_FALLBACK_MODELS = ["gemini-3.5-flash-lite", "gemini-flash-lite-latest"] as const;

/** Upstream statuses worth retrying on the next model in the chain. */
export function isRetryableGeminiStatus(status: number): boolean {
  return status === 404 || status === 429 || status >= 500;
}
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
  /** Per-attempt timeout (one-shot: whole call; streaming: until headers arrive). */
  timeoutMs?: number;
  /** Cap across retries and fallback models. Defaults to twice `timeoutMs`. */
  totalTimeoutMs?: number;
  /** Streaming only: cap on the stream once it has started. */
  streamTimeoutMs?: number;
  /** "application/json" asks the model for a JSON-only response. */
  responseMimeType?: string;
};

export type GeminiConfig = { apiKey: string; model: string; fallbackModels?: string[] };

/** Primary model first, then distinct fallbacks. */
export function modelChain(config: GeminiConfig): string[] {
  return [...new Set([config.model, ...(config.fallbackModels ?? [])].filter(Boolean))];
}

export function getGeminiConfig(
  env: Record<string, string | undefined> = process.env,
): GeminiConfig | null {
  const apiKey = env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;
  const model = env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
  const configured = env.GEMINI_FALLBACK_MODELS?.split(",")
    .map((name) => name.trim())
    .filter(Boolean);
  const fallbackModels = (
    configured?.length ? configured : [...DEFAULT_GEMINI_FALLBACK_MODELS]
  ).filter((name) => name !== model);
  return { apiKey, model, fallbackModels };
}

export function buildGeminiBody(request: GeminiRequest) {
  return {
    systemInstruction: { parts: [{ text: request.system }] },
    contents: request.turns.map((turn) => ({ role: turn.role, parts: [{ text: turn.text }] })),
    generationConfig: {
      temperature: request.temperature ?? 0.3,
      maxOutputTokens: request.maxOutputTokens ?? 400,
      ...(request.responseMimeType ? { responseMimeType: request.responseMimeType } : {}),
    },
  };
}

type GeminiChunk = {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
};

export function textFromChunk(chunk: GeminiChunk): string {
  return (chunk.candidates?.[0]?.content?.parts ?? []).map((part) => part.text ?? "").join("");
}

type Attempt = { model: string; timeoutMs: number };

/**
 * Plans the attempts for one request: every model in the chain, with one quick
 * retry of the primary (Gemini returns short-lived 503s under load). Each
 * attempt gets its own timeout, capped by what is left of the total budget.
 */
function* attempts(config: GeminiConfig, attemptMs: number, totalMs: number): Generator<Attempt> {
  const startedAt = Date.now();
  const [primary, ...rest] = modelChain(config);
  const plan = primary ? [primary, primary, ...rest] : [];
  for (const model of plan) {
    const remaining = totalMs - (Date.now() - startedAt);
    if (remaining < 1500) return;
    yield { model, timeoutMs: Math.min(attemptMs, remaining) };
  }
}

async function postWithFallback(
  config: GeminiConfig,
  method: "generateContent" | "streamGenerateContent?alt=sse",
  request: GeminiRequest,
  attemptMs: number,
  totalMs: number,
  fetchImpl: typeof fetch,
): Promise<{
  response: Response;
  controller: AbortController;
  timer: ReturnType<typeof setTimeout>;
} | null> {
  const body = JSON.stringify(buildGeminiBody(request));
  for (const { model, timeoutMs } of attempts(config, attemptMs, totalMs)) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(`${apiBase()}/${encodeURIComponent(model)}:${method}`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": config.apiKey },
        body,
        signal: controller.signal,
      });
      if (response.ok && response.body !== null) return { response, controller, timer };
      clearTimeout(timer);
      console.error("[gemini]", method.split("?")[0], "failed", model, response.status);
      if (!isRetryableGeminiStatus(response.status)) return null;
    } catch (error) {
      clearTimeout(timer);
      console.error(
        "[gemini]",
        method.split("?")[0],
        "error",
        model,
        error instanceof Error ? error.name : "unknown",
      );
    }
  }
  return null;
}

/**
 * One-shot completion. Resolves to null on any failure or when the budget runs
 * out. `timeoutMs` is per attempt; `totalTimeoutMs` (default 2x) caps retries.
 */
export async function generateText(
  config: GeminiConfig,
  request: GeminiRequest,
  fetchImpl: typeof fetch = fetch,
): Promise<string | null> {
  const attemptMs = request.timeoutMs ?? 8000;
  const result = await postWithFallback(
    config,
    "generateContent",
    request,
    attemptMs,
    request.totalTimeoutMs ?? attemptMs * 2,
    fetchImpl,
  );
  if (!result) return null;
  try {
    const text = textFromChunk((await result.response.json()) as GeminiChunk).trim();
    return text || null;
  } catch (error) {
    console.error("[gemini] generateContent body", error instanceof Error ? error.name : "unknown");
    return null;
  } finally {
    clearTimeout(result.timer);
  }
}

/**
 * Streaming completion. Returns a ReadableStream of plain-text deltas, or null
 * when no model starts streaming within the budget. `timeoutMs` bounds the wait
 * for each attempt's response headers; once streaming, the stream is capped at
 * `streamTimeoutMs` (default 45 s).
 */
export async function streamText(
  config: GeminiConfig,
  request: GeminiRequest,
  fetchImpl: typeof fetch = fetch,
): Promise<ReadableStream<Uint8Array> | null> {
  const attemptMs = request.timeoutMs ?? 20000;
  const result = await postWithFallback(
    config,
    "streamGenerateContent?alt=sse",
    request,
    attemptMs,
    request.totalTimeoutMs ?? attemptMs * 2,
    fetchImpl,
  );
  const upstreamBody = result?.response.body;
  if (!result || !upstreamBody) return null;
  clearTimeout(result.timer);
  const { controller } = result;
  const timer = setTimeout(() => controller.abort(), request.streamTimeoutMs ?? 45000);

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = upstreamBody.getReader();
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
