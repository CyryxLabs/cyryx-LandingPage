import { useId, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { getLeadAttribution } from "@/lib/lead-attribution";
import { getActiveCopyVariant } from "@/lib/copy-variant";
import { trackCta } from "@/lib/track-cta";

/**
 * AI readiness check: five questions, an instant result, and an optional
 * request for a written plan. The score is a simple self-assessment (0–2 per
 * answer), shown to the visitor before any contact detail is asked for.
 * Submissions go to the same CRM intake as /start.
 */
const QUESTIONS = [
  {
    id: "use",
    q: "How is AI used in your company today?",
    options: [
      "Hardly at all, or only by a few people on their own",
      "Several teams use AI tools, each in their own way",
      "AI is built into at least one core process",
    ],
  },
  {
    id: "data",
    q: "If an AI assistant needed your company knowledge, where would it find it?",
    options: [
      "Scattered across drives, inboxes and people's heads",
      "Mostly organized, but not all current or permissioned",
      "In maintained systems with clear owners and access rules",
    ],
  },
  {
    id: "systems",
    q: "How well do your main systems talk to each other?",
    options: [
      "People copy data between them by hand",
      "Some are connected, with gaps we work around",
      "They share data through integrations we trust",
    ],
  },
  {
    id: "rules",
    q: "Do you have rules for what staff may put into AI tools?",
    options: [
      "No, everyone decides for themselves",
      "Informal guidance, nothing written or enforced",
      "A written policy and approved tools",
    ],
  },
  {
    id: "value",
    q: "Could you say what AI has returned for what you spend on it?",
    options: [
      "No, we have never measured it",
      "Roughly, for one or two uses",
      "Yes, we track it against a baseline",
    ],
  },
] as const;

type Level = { name: string; summary: string; next: string; href: string; projectType: string };

const LEVELS: readonly Level[] = [
  {
    name: "Getting started",
    summary:
      "You are early, which is a good place to be: nothing to untangle. One well-chosen automation and some basic rules are a sensible first step.",
    next: "Start with one automation",
    href: "/solutions/workflow-automation",
    projectType: "Workflow Automation",
  },
  {
    name: "Using it, not yet scaling it",
    summary:
      "AI is in use, but it sits beside your systems rather than inside them. The gains come from connecting it to your data and tools, and measuring one process properly.",
    next: "See AI systems integration",
    href: "/solutions/ai-integrations",
    projectType: "AI Strategy & Advisory",
  },
  {
    name: "Ready to scale",
    summary:
      "Your foundations are in place. The next step is agents on real processes, with permissions, approvals and cost controls agreed first.",
    next: "See AI agents and assistants",
    href: "/solutions/internal-ai-assistants",
    projectType: "Internal AI Assistant",
  },
];

export function Scorecard() {
  const formId = useId();
  const [answers, setAnswers] = useState<number[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const step = answers.length;
  const finished = step >= QUESTIONS.length;
  const score = answers.reduce((sum, value) => sum + value, 0);
  const level = LEVELS[score <= 3 ? 0 : score <= 7 ? 1 : 2];

  function answer(value: number) {
    if (step === 0) trackCta({ cta: "form_start", section: "paths", href: "#readiness" });
    const next = [...answers, value];
    setAnswers(next);
    if (next.length === QUESTIONS.length)
      trackCta({ cta: "form_step_complete", section: "paths", href: "#readiness" });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const summary = QUESTIONS.map(
      (question, index) => `${question.q} — ${question.options[answers[index] ?? 0]}`,
    ).join("\n");
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
          projectType: level.projectType,
          problem: `AI readiness check: ${score}/10 (${level.name}). Please send a written plan for the next step.`,
          notes: summary.slice(0, 1500),
          consent: fd.get("consent") === "on",
          website: String(fd.get("website") ?? ""),
          source: "home",
          attribution: getLeadAttribution(getActiveCopyVariant()),
        }),
      });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!response.ok || !result.ok)
        throw new Error(result.error || "We couldn't send that. Please try again.");
      setStatus("sent");
      trackCta({ cta: "generate_lead", section: "paths", href: "#readiness" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "We couldn't send that. Please try again.");
    }
  }

  return (
    <div className="cy-score__card" data-cy-reveal="scale">
      <div className="cy-score__bar" aria-hidden="true">
        {QUESTIONS.map((question, index) => (
          <i key={question.id} data-on={index < step ? "true" : "false"} />
        ))}
      </div>

      {!finished ? (
        <div key={step} className="cy-score__result" aria-live="polite">
          <p className="cy-eyebrow">
            Question {step + 1} of {QUESTIONS.length}
          </p>
          <p className="cy-score__q" id={`${formId}-q`}>
            {QUESTIONS[step].q}
          </p>
          <div className="cy-score__opts" role="group" aria-labelledby={`${formId}-q`}>
            {QUESTIONS[step].options.map((option, value) => (
              <button key={option} type="button" className="cy-opt" onClick={() => answer(value)}>
                {option}
              </button>
            ))}
          </div>
          {step > 0 ? (
            <button
              type="button"
              className="cy-link cy-muted"
              style={{ fontWeight: 500, fontSize: "0.875rem" }}
              onClick={() => setAnswers(answers.slice(0, -1))}
            >
              <span aria-hidden="true">←</span> Back
            </button>
          ) : null}
        </div>
      ) : (
        <div className="cy-score__result" aria-live="polite">
          <p className="cy-eyebrow">Your result</p>
          <p className="cy-score__num">
            {score}
            <small> / 10</small>
          </p>
          <h3 className="cy-h3">{level.name}</h3>
          <p>{level.summary}</p>
          <Link to={level.href} className="cy-link">
            {level.next} <span aria-hidden="true">→</span>
          </Link>

          {status === "sent" ? (
            <p className="cy-note" role="status">
              Received. A person from Cyryx Labs will reply by email with your next step.
            </p>
          ) : (
            <form className="cy-form" onSubmit={onSubmit} noValidate={false}>
              <p style={{ color: "var(--cy-ink)", fontWeight: 600 }}>
                Want this as a written plan? We will send the next step for your score.
              </p>
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                hidden
              />
              <div className="cy-form__row">
                <label className="cy-field">
                  <span>Name</span>
                  <input
                    className="cy-input"
                    name="name"
                    required
                    maxLength={100}
                    autoComplete="name"
                  />
                </label>
                <label className="cy-field">
                  <span>Work email</span>
                  <input
                    className="cy-input"
                    type="email"
                    name="email"
                    required
                    maxLength={255}
                    autoComplete="email"
                  />
                </label>
              </div>
              <label className="cy-field">
                <span>Company</span>
                <input
                  className="cy-input"
                  name="company"
                  required
                  minLength={2}
                  maxLength={160}
                  autoComplete="organization"
                />
              </label>
              <label className="cy-consent">
                <input type="checkbox" name="consent" required />
                <span>
                  I agree that Cyryx Labs may use these details to reply, as described in the{" "}
                  <Link to="/privacy">privacy policy</Link>.
                </span>
              </label>
              {error ? (
                <p className="cy-error" role="alert">
                  {error}
                </p>
              ) : null}
              <div className="cy-actions">
                <button
                  type="submit"
                  className="cy-btn cy-btn--primary"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Sending…" : "Send me the plan"}
                  <ArrowRight aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="cy-link cy-muted"
                  style={{ fontWeight: 500, fontSize: "0.875rem" }}
                  onClick={() => {
                    setAnswers([]);
                    setStatus("idle");
                  }}
                >
                  Start over
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
