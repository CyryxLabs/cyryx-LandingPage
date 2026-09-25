import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUp, Loader2, MessageSquare, X } from "lucide-react";
import {
  ASSISTANT_OPEN_EVENT,
  isAssistantEnabled,
  type AssistantOpenSource,
} from "@/lib/assistant-client";
import { ASSISTANT_MAX_MESSAGE_CHARS, ASSISTANT_MAX_TURNS } from "@/lib/ai/assistant.schema";
import { FIT_REVIEW_PROJECT_TYPES } from "@/lib/contact.schema";
import { getLeadAttribution } from "@/lib/lead-attribution";
import { getActiveCopyVariant } from "@/lib/copy-variant";
import { trackCta } from "@/lib/track-cta";

type ChatMessage = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "cyryx_assistant_thread";
const HIDDEN_PREFIXES = ["/workspace", "/auth", "/newsletter", "/unsubscribe"];

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hi, I'm the Cyryx assistant. Ask me what we build, how an engagement runs or where to start. I answer from our public site, and I can pass your details to the team when you're ready.",
};

const SUGGESTIONS = [
  "Where should we start?",
  "How does an engagement run?",
  "What is AEXOS?",
  "Can you automate a workflow for us?",
];

function loadThread(): ChatMessage[] {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as ChatMessage[]) : null;
    return Array.isArray(parsed) && parsed.length ? parsed.slice(-ASSISTANT_MAX_TURNS) : [GREETING];
  } catch {
    return [GREETING];
  }
}

function saveThread(thread: ChatMessage[]) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(thread.slice(-ASSISTANT_MAX_TURNS)));
  } catch {
    // Session storage unavailable: the thread simply isn't kept across pages.
  }
}

function transcriptSummary(thread: ChatMessage[]): string {
  return thread
    .filter((m) => m !== GREETING)
    .slice(-8)
    .map((m) => `${m.role === "user" ? "Visitor" : "Assistant"}: ${m.content}`)
    .join("\n")
    .slice(0, 1900);
}

export function AssistantWidget() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const enabled = isAssistantEnabled();
  const [open, setOpen] = useState(false);
  const [thread, setThread] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [mode, setMode] = useState<"chat" | "lead" | "sent">("chat");
  // On the homepage the hero already offers the assistant; the floating
  // launcher appears once the visitor scrolls past the first screen.
  const [pastHero, setPastHero] = useState(true);
  const panelId = useId();
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  // Element that had focus when the panel opened (hero button, launcher…).
  const openerRef = useRef<HTMLElement | null>(null);
  const restoreFocusRef = useRef(false);

  useEffect(() => {
    if (enabled) setThread(loadThread());
  }, [enabled]);

  useEffect(() => {
    if (!enabled || pathname !== "/") {
      setPastHero(true);
      return;
    }
    const update = () => setPastHero(window.scrollY > window.innerHeight * 0.6);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [enabled, pathname]);

  const openPanel = useCallback((source: AssistantOpenSource) => {
    const active = document.activeElement;
    openerRef.current = active instanceof HTMLElement && active !== document.body ? active : null;
    setOpen(true);
    trackCta({ cta: "assistant_open", section: "assistant", href: `#${source}` });
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const onOpen = (event: Event) => {
      const source = (event as CustomEvent<{ source?: AssistantOpenSource }>).detail?.source;
      openPanel(source ?? "launcher");
    };
    window.addEventListener(ASSISTANT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(ASSISTANT_OPEN_EVENT, onOpen);
  }, [enabled, openPanel]);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => inputRef.current?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [thread, mode]);

  // Return focus after the panel has unmounted and the launcher is back.
  useEffect(() => {
    if (open || !restoreFocusRef.current) return;
    restoreFocusRef.current = false;
    const opener = openerRef.current;
    const target = opener && opener.isConnected ? opener : launcherRef.current;
    target?.focus();
  }, [open]);

  function closePanel() {
    restoreFocusRef.current = true;
    setOpen(false);
  }

  if (!enabled || HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  async function send(text: string) {
    const content = text.trim().slice(0, ASSISTANT_MAX_MESSAGE_CHARS);
    if (!content || busy) return;
    setNotice(null);
    const next: ChatMessage[] = [...thread, { role: "user", content }];
    const history = next.filter((m) => m !== GREETING).slice(-(ASSISTANT_MAX_TURNS - 1));
    setThread([...next, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    trackCta({ cta: "assistant_message", section: "assistant", href: pathname });

    try {
      const response = await fetch("/api/public/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: history, path: pathname }),
      });
      if (!response.ok || !response.body) {
        throw new Error(response.status === 429 ? "rate_limited" : "unavailable");
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        const partial = answer;
        setThread([...next, { role: "assistant", content: partial }]);
      }
      const final: ChatMessage[] = [
        ...next,
        {
          role: "assistant",
          content:
            answer.trim() ||
            "Sorry, I couldn't answer that. Try rephrasing, or leave your details for the team.",
        },
      ];
      setThread(final);
      saveThread(final);
    } catch (error) {
      trackCta({ cta: "assistant_error", section: "assistant", href: pathname });
      setThread(next);
      saveThread(next);
      setNotice(
        error instanceof Error && error.message === "rate_limited"
          ? "You've sent a lot of messages in a short time. Please wait a few minutes, or leave your details for the team."
          : "The assistant is unavailable right now. Leave your details and a person will reply.",
      );
      setMode("lead");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {!open && pastHero && (
        <button
          ref={launcherRef}
          type="button"
          onClick={() => openPanel("launcher")}
          aria-controls={panelId}
          aria-expanded={false}
          className="cx-assistant-launcher"
        >
          <MessageSquare className="h-4 w-4" aria-hidden />
          <span>Ask Cyryx</span>
        </button>
      )}

      {open && (
        <section
          id={panelId}
          role="dialog"
          aria-modal="false"
          aria-label="Cyryx assistant"
          className="cx-assistant-panel"
        >
          <header className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3">
            <div>
              <p className="font-display text-base font-semibold text-[var(--silver)]">
                Cyryx assistant
              </p>
              <p className="text-xs text-[var(--steel)]">AI answers from our public site</p>
            </div>
            <button
              type="button"
              onClick={closePanel}
              aria-label="Close assistant"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[var(--silver-dim)] hover:text-[var(--silver)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)]"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </header>

          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            aria-live="polite"
          >
            {thread.map((message, index) => (
              <div
                key={index}
                className={
                  message.role === "user"
                    ? "cx-assistant-msg cx-assistant-msg--user"
                    : "cx-assistant-msg"
                }
              >
                {message.content ||
                  (busy && index === thread.length - 1 ? (
                    <span className="inline-flex items-center gap-2 text-[var(--steel)]">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> Thinking…
                    </span>
                  ) : null)}
              </div>
            ))}

            {mode === "chat" && thread.length <= 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void send(s)}
                    className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-[var(--silver)] transition hover:border-[var(--accent-glow)] hover:text-[var(--accent-glow)]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {notice && (
              <p
                role="status"
                className="rounded-md border border-amber-300/25 bg-amber-300/5 p-3 text-xs text-amber-100"
              >
                {notice}
              </p>
            )}

            {mode === "lead" && (
              <AssistantLeadForm
                thread={thread}
                onSent={() => {
                  setMode("sent");
                  trackCta({ cta: "assistant_lead", section: "assistant", href: pathname });
                }}
                onCancel={() => setMode("chat")}
              />
            )}

            {mode === "sent" && (
              <p
                role="status"
                className="rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_40%,transparent)] p-3 text-sm text-[var(--silver)]"
              >
                Sent. The team has your details and this conversation, and a copy is on its way to
                your inbox.
              </p>
            )}
          </div>

          {mode === "chat" && (
            <form
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                void send(input);
              }}
              className="border-t border-white/10 px-3 pb-3 pt-2"
            >
              <div className="flex items-end gap-2">
                <label htmlFor={`${panelId}-input`} className="sr-only">
                  Your question
                </label>
                <textarea
                  id={`${panelId}-input`}
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void send(input);
                    }
                  }}
                  rows={1}
                  maxLength={ASSISTANT_MAX_MESSAGE_CHARS}
                  placeholder="Ask about our work…"
                  className="max-h-32 min-h-11 flex-1 resize-none rounded-md border border-white/15 bg-[var(--onyx)] px-3 py-2.5 text-sm text-[var(--silver)] placeholder:text-[var(--steel)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)]"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  aria-label="Send"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[var(--accent-glow)] text-[var(--onyx)] disabled:opacity-40"
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <ArrowUp className="h-4 w-4" aria-hidden />
                  )}
                </button>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[12px] text-[var(--steel)]">
                <span>
                  AI can be wrong. Don't share passwords or sensitive data.{" "}
                  <Link to="/privacy" className="underline hover:text-[var(--silver)]">
                    Privacy
                  </Link>
                </span>
                <button
                  type="button"
                  onClick={() => setMode("lead")}
                  className="font-mono uppercase tracking-[0.12em] text-[var(--accent-glow)] hover:underline"
                >
                  Talk to the team
                </button>
              </div>
            </form>
          )}
        </section>
      )}
    </>
  );
}

function AssistantLeadForm({
  thread,
  onSent,
  onCancel,
}: {
  thread: ChatMessage[];
  onSent: () => void;
  onCancel: () => void;
}) {
  const formId = useId();
  const firstQuestion = thread.find((m) => m.role === "user")?.content ?? "";
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const problem = String(fd.get("problem") ?? "").trim();
    setStatus("sending");
    setError(null);
    try {
      const response = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: String(fd.get("name") ?? ""),
          email: String(fd.get("email") ?? ""),
          company: String(fd.get("company") ?? ""),
          projectType: String(fd.get("projectType") ?? "Other"),
          problem,
          consent: fd.get("consent") === "on",
          website: String(fd.get("website") ?? ""),
          source: "assistant",
          assistantSummary: transcriptSummary(thread) || undefined,
          attribution: getLeadAttribution(getActiveCopyVariant()),
        }),
      });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok)
        throw new Error(result.error || "We couldn't send that. Please try again.");
      onSent();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "We couldn't send that. Please try again.");
    }
  }

  const field =
    "mt-1 w-full rounded-md border border-white/15 bg-[var(--onyx)] px-3 py-2 text-sm text-[var(--silver)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)]";

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-3 rounded-md border border-white/10 bg-[var(--graphite)] p-3"
    >
      <p className="text-sm text-[var(--silver)]">
        Leave your details and a person from Cyryx will follow up.
      </p>
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <label className="block text-xs text-[var(--silver-dim)]" htmlFor={`${formId}-name`}>
        Name
        <input
          id={`${formId}-name`}
          name="name"
          required
          maxLength={100}
          autoComplete="name"
          className={field}
        />
      </label>
      <label className="block text-xs text-[var(--silver-dim)]" htmlFor={`${formId}-email`}>
        Work email
        <input
          id={`${formId}-email`}
          name="email"
          type="email"
          required
          maxLength={255}
          autoComplete="email"
          className={field}
        />
      </label>
      <label className="block text-xs text-[var(--silver-dim)]" htmlFor={`${formId}-company`}>
        Company
        <input
          id={`${formId}-company`}
          name="company"
          required
          minLength={2}
          maxLength={160}
          autoComplete="organization"
          className={field}
        />
      </label>
      <label className="block text-xs text-[var(--silver-dim)]" htmlFor={`${formId}-type`}>
        Topic
        <select id={`${formId}-type`} name="projectType" defaultValue="Other" className={field}>
          {FIT_REVIEW_PROJECT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-xs text-[var(--silver-dim)]" htmlFor={`${formId}-problem`}>
        What do you want to change?
        <textarea
          id={`${formId}-problem`}
          name="problem"
          required
          minLength={10}
          maxLength={2000}
          rows={3}
          defaultValue={firstQuestion}
          className={field}
        />
      </label>
      <label className="flex items-start gap-2 text-xs text-[var(--silver-dim)]">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-0.5 h-4 w-4 accent-[var(--accent-glow)]"
        />
        <span>
          I agree that Cyryx Labs may contact me about this and keep this conversation with my
          request, as described in the{" "}
          <Link to="/privacy" className="text-[var(--accent-glow)] hover:underline">
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      {error && (
        <p role="alert" className="text-xs text-red-300">
          {error}
        </p>
      )}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={status === "sending"} className="cx-btn-primary cx-btn-sm">
          {status === "sending" ? "Sending…" : "Send to the team"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-[var(--steel)] hover:text-[var(--silver)]"
        >
          Back to chat
        </button>
      </div>
    </form>
  );
}
