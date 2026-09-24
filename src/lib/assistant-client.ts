/**
 * Client helpers for the Cyryx AI assistant.
 *
 * The assistant UI renders only when `VITE_ASSISTANT_ENABLED=true` is set at
 * build time. Set it together with the server-side `GEMINI_API_KEY`; without
 * the key the API answers 503 and the widget falls back to lead capture.
 */
export const ASSISTANT_OPEN_EVENT = "cyryx:assistant-open";

export type AssistantOpenSource = "hero" | "final_cta" | "launcher" | "start" | "contact" | "footer";

export function isAssistantEnabled(): boolean {
  return import.meta.env?.VITE_ASSISTANT_ENABLED === "true";
}

export function openAssistant(source: AssistantOpenSource): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(ASSISTANT_OPEN_EVENT, { detail: { source } }));
}
