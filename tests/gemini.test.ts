import { describe, expect, test } from "bun:test";
import {
  buildGeminiBody,
  DEFAULT_GEMINI_MODEL,
  generateText,
  getGeminiConfig,
  streamText,
  textFromChunk,
} from "../src/lib/ai/gemini.server";

const config = { apiKey: "test-key", model: "test-model" };

function chunk(text: string) {
  return { candidates: [{ content: { parts: [{ text }] } }] };
}

async function readAll(stream: ReadableStream<Uint8Array>) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let out = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) return out;
    out += decoder.decode(value, { stream: true });
  }
}

describe("getGeminiConfig", () => {
  test("is disabled without an API key", () => {
    expect(getGeminiConfig({})).toBeNull();
    expect(getGeminiConfig({ GEMINI_API_KEY: "   " })).toBeNull();
  });

  test("uses the default model unless GEMINI_MODEL is set", () => {
    expect(getGeminiConfig({ GEMINI_API_KEY: " k " })).toEqual({
      apiKey: "k",
      model: DEFAULT_GEMINI_MODEL,
    });
    expect(getGeminiConfig({ GEMINI_API_KEY: "k", GEMINI_MODEL: "custom" })?.model).toBe("custom");
  });
});

describe("buildGeminiBody", () => {
  test("maps system prompt, turns and generation defaults", () => {
    expect(
      buildGeminiBody({
        system: "Be brief.",
        turns: [
          { role: "user", text: "Hi" },
          { role: "model", text: "Hello" },
        ],
      }),
    ).toEqual({
      systemInstruction: { parts: [{ text: "Be brief." }] },
      contents: [
        { role: "user", parts: [{ text: "Hi" }] },
        { role: "model", parts: [{ text: "Hello" }] },
      ],
      generationConfig: { temperature: 0.3, maxOutputTokens: 400 },
    });
  });

  test("honours explicit temperature and token limits, including zero", () => {
    const body = buildGeminiBody({ system: "s", turns: [], temperature: 0, maxOutputTokens: 64 });
    expect(body.generationConfig).toEqual({ temperature: 0, maxOutputTokens: 64 });
    expect(body.contents).toEqual([]);
  });
});

describe("textFromChunk", () => {
  test("joins the parts of the first candidate", () => {
    expect(
      textFromChunk({
        candidates: [
          { content: { parts: [{ text: "Most teams " }, { text: "start with Advise." }] } },
          { content: { parts: [{ text: "ignored" }] } },
        ],
      }),
    ).toBe("Most teams start with Advise.");
  });

  test("tolerates empty or partial chunks", () => {
    expect(textFromChunk({})).toBe("");
    expect(textFromChunk({ candidates: [] })).toBe("");
    expect(textFromChunk({ candidates: [{}] })).toBe("");
    expect(textFromChunk({ candidates: [{ content: { parts: [{}, { text: "x" }] } }] })).toBe("x");
  });
});

describe("generateText", () => {
  test("posts to generateContent with the API key header and returns trimmed text", async () => {
    let seen: { url: string; init: RequestInit } | undefined;
    const fakeFetch = (async (url: string, init: RequestInit) => {
      seen = { url, init };
      return new Response(JSON.stringify(chunk("  Build looks right.  ")), { status: 200 });
    }) as unknown as typeof fetch;

    const text = await generateText(
      config,
      { system: "s", turns: [{ role: "user", text: "q" }] },
      fakeFetch,
    );
    expect(text).toBe("Build looks right.");
    expect(seen?.url).toEndWith("/test-model:generateContent");
    expect((seen?.init.headers as Record<string, string>)["x-goog-api-key"]).toBe("test-key");
    expect(JSON.parse(String(seen?.init.body)).contents[0].parts[0].text).toBe("q");
  });

  test("returns null on HTTP errors, network errors and empty answers", async () => {
    const quiet = console.error;
    console.error = () => undefined;
    try {
      const failing = (async () =>
        new Response("nope", { status: 500 })) as unknown as typeof fetch;
      const throwing = (async () => {
        throw new TypeError("network");
      }) as unknown as typeof fetch;
      const empty = (async () =>
        new Response(JSON.stringify(chunk("   ")), { status: 200 })) as unknown as typeof fetch;
      const request = { system: "s", turns: [] };
      expect(await generateText(config, request, failing)).toBeNull();
      expect(await generateText(config, request, throwing)).toBeNull();
      expect(await generateText(config, request, empty)).toBeNull();
    } finally {
      console.error = quiet;
    }
  });
});

describe("streamText", () => {
  test("turns SSE events into plain-text deltas", async () => {
    const sse =
      `data: ${JSON.stringify(chunk("Most teams start with "))}\n\n` +
      ": keep-alive\n\n" +
      `data: ${JSON.stringify(chunk("Advise."))}\r\n\r\n` +
      "data: not-json\n\n" +
      "data: [DONE]\n\n";
    const encoder = new TextEncoder();
    // Split mid-event to exercise buffering across reads.
    const pieces = [sse.slice(0, 25), sse.slice(25, 90), sse.slice(90)];
    let seenUrl = "";
    const fakeFetch = (async (url: string) => {
      seenUrl = url;
      return new Response(
        new ReadableStream<Uint8Array>({
          start(controller) {
            for (const piece of pieces) controller.enqueue(encoder.encode(piece));
            controller.close();
          },
        }),
        { status: 200, headers: { "content-type": "text/event-stream" } },
      );
    }) as unknown as typeof fetch;

    const stream = await streamText(config, { system: "s", turns: [] }, fakeFetch);
    expect(stream).not.toBeNull();
    expect(await readAll(stream!)).toBe("Most teams start with Advise.");
    expect(seenUrl).toEndWith("/test-model:streamGenerateContent?alt=sse");
  });

  test("returns null when the upstream request fails before streaming", async () => {
    const quiet = console.error;
    console.error = () => undefined;
    try {
      const failing = (async () =>
        new Response("nope", { status: 429 })) as unknown as typeof fetch;
      expect(await streamText(config, { system: "s", turns: [] }, failing)).toBeNull();
    } finally {
      console.error = quiet;
    }
  });
});
