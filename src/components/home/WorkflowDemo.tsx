import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { WORKFLOW_DEMO } from "@/data/home";
import { trackCta, type CtaSection } from "@/lib/track-cta";

const STEPS = WORKFLOW_DEMO.steps.length;
const LAST = STEPS - 1;
const clamp = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Illustrative inquiry-to-reply workflow. Deterministic sample data, driven by
 * the visitor: step buttons, previous/next, replay and the final state. Nothing
 * is sent or written; the text equivalent repeats every step.
 *
 * With `scrub`, on large screens and with motion allowed, the demo sits in a
 * sticky stage inside a tall `[data-hm-track]` and the page scroll walks
 * through the steps. The controls still work: they scroll to the step.
 */
export function WorkflowDemo({
  section = "workflow_demo",
  scrub = false,
}: {
  section?: CtaSection;
  scrub?: boolean;
}) {
  const [step, setStep] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);
  const started = useRef(false);
  const completed = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef(0);

  const record = useCallback(
    (value: number) => {
      if (!started.current && value !== 0) {
        started.current = true;
        trackCta({ cta: "demo_started", section });
      }
      if (!completed.current && value === LAST) {
        completed.current = true;
        trackCta({ cta: "demo_completed", section });
      }
      stepRef.current = value;
      setStep(value);
    },
    [section],
  );

  useEffect(() => {
    if (!scrub) return;
    const track = rootRef.current?.closest<HTMLElement>("[data-hm-track]");
    if (!track) return;
    // Same gate as the tall track in CSS: `cy-pin` is set before first paint
    // on large screens with motion allowed (see __root.tsx and motion.ts).
    const root = document.documentElement;
    const large = window.matchMedia("(min-width: 900px) and (min-height: 700px)");
    let frame = 0;
    let on = false;
    const update = () => {
      frame = 0;
      if (!on) return;
      const rect = track.getBoundingClientRect();
      const span = Math.max(1, rect.height - window.innerHeight);
      const progress = clamp(-rect.top / span);
      track.style.setProperty("--wp", progress.toFixed(4));
      const next = Math.min(LAST, Math.floor(progress * STEPS));
      if (next !== stepRef.current) record(next);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const apply = () => {
      on = large.matches && root.classList.contains("cy-pin");
      track.classList.toggle("is-scrub", on);
      setScrubbing(on);
      onScroll();
    };
    apply();
    large.addEventListener("change", apply);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      large.removeEventListener("change", apply);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      track.classList.remove("is-scrub");
    };
  }, [scrub, record]);

  const go = (next: number, focus = false) => {
    const value = Math.max(0, Math.min(LAST, next));
    record(value);
    const track = scrubbing ? rootRef.current?.closest<HTMLElement>("[data-hm-track]") : null;
    if (track) {
      const rect = track.getBoundingClientRect();
      const span = Math.max(1, rect.height - window.innerHeight);
      const top = rect.top + window.scrollY + ((value + 0.5) / STEPS) * span;
      window.scrollTo({ top, behavior: "smooth" });
    }
    if (focus)
      requestAnimationFrame(() =>
        stageRef.current?.querySelector("h3")?.focus({ preventScroll: true }),
      );
  };

  return (
    <div className="hm-wf" ref={rootRef} data-scrub={scrubbing ? "true" : undefined}>
      <div className="hm-wf-grid">
        <div className="hm-wf-side">
          <ol
            className="hm-steps"
            aria-label="Workflow steps"
            style={{ "--prog": (step / LAST).toFixed(3) } as CSSProperties}
          >
            {WORKFLOW_DEMO.steps.map((s, i) => (
              <li key={s.name}>
                <button
                  type="button"
                  className="hm-step"
                  data-done={i < step ? "true" : undefined}
                  aria-current={i === step ? "step" : undefined}
                  onClick={() => go(i)}
                >
                  <span className="hm-step-n" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span>{s.name}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="hm-ctrl">
            <button type="button" onClick={() => go(step - 1)} disabled={step === 0}>
              Previous
            </button>
            <button type="button" onClick={() => go(step + 1)} disabled={step === LAST}>
              {step === 3 ? "Approve and continue" : "Next step"}
            </button>
            <button type="button" onClick={() => go(0, true)}>
              Replay
            </button>
            <button type="button" onClick={() => go(LAST, true)}>
              Show final state
            </button>
          </div>
        </div>

        <div className="hm-stage" ref={stageRef} aria-live="polite">
          <div className="hm-stage-bar">
            <span className="hm-sys" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="hm-sample">Sample data</span>
          </div>
          <span className="hm-stage-prog" aria-hidden="true" />
          <div className="hm-view" key={step}>
            <h3 tabIndex={-1}>
              {step + 1} · {WORKFLOW_DEMO.steps[step].name}
            </h3>
            <p className="hm-why">{WORKFLOW_DEMO.steps[step].why}</p>
            <StepBody step={step} onApprove={() => go(LAST, true)} />
          </div>
        </div>
      </div>

      {scrub ? (
        <p className="hm-scroll-hint" aria-hidden="true">
          Scroll to follow the request
        </p>
      ) : (
        <WorkflowText />
      )}
    </div>
  );
}

/** The whole example as text, for every visitor and assistive technology. */
export function WorkflowText() {
  return (
    <details className="hm-texteq">
      <summary>Read the whole example as text</summary>
      <ol>
        {WORKFLOW_DEMO.steps.map((s) => (
          <li key={s.name}>
            {s.name}: {s.text}
          </li>
        ))}
      </ol>
    </details>
  );
}

function StepBody({ step, onApprove }: { step: number; onApprove: () => void }) {
  if (step === 0)
    return (
      <div className="hm-card hm-mail">
        <dl>
          <dt>From</dt>
          <dd>Maria Chen · Northline Dental</dd>
          <dt>Subject</dt>
          <dd>Moving Thursday’s onboarding call</dd>
        </dl>
        <p>
          Hi—something came up on Thursday. Could we move our onboarding call to early next week?
          Mornings work best.
        </p>
      </div>
    );
  if (step === 1)
    return (
      <div className="hm-card">
        <dl className="hm-kv">
          <dt>Intent</dt>
          <dd>Reschedule a meeting</dd>
          <dt>Account</dt>
          <dd>Northline Dental</dd>
          <dt>Constraint</dt>
          <dd>Early next week, mornings preferred</dd>
          <dt>Suggested next step</dt>
          <dd>Offer two open morning slots</dd>
        </dl>
      </div>
    );
  if (step === 2)
    return (
      <div className="hm-card hm-diff">
        <div>
          Contact · Maria Chen <span className="hm-mute">(found)</span>
        </div>
        <div className="hm-add">+ Activity: “Reschedule onboarding call”</div>
        <div className="hm-add">+ Proposed slots: Tue 10:00 · Wed 10:30</div>
        <div className="hm-pend">○ Status: prepared — not written yet</div>
      </div>
    );
  if (step === 3)
    return (
      <>
        <div className="hm-card">
          <p>
            Hi Maria—no problem. Would Tuesday at 10:00 or Wednesday at 10:30 work for the
            onboarding call? Either way, we’ll send a new invite right after you confirm.
          </p>
        </div>
        <div className="hm-approve">
          <span className="hm-who">
            <span className="hm-dot" aria-hidden="true" />
            Waiting for your approval
          </span>
          <button type="button" className="hm-approve-btn" onClick={onApprove}>
            Approve &amp; send
          </button>
        </div>
      </>
    );
  return (
    <>
      <p className="hm-result">
        <span className="hm-dot" aria-hidden="true" />
        Sent (simulated) · CRM record saved (simulated)
      </p>
      <div className="hm-card">
        <ol className="hm-log">
          {[
            ["09:12", "Inquiry received from Maria Chen"],
            ["09:12", "AI step: request summarized"],
            ["09:13", "CRM change prepared (not saved)"],
            ["09:20", "Reply approved by you"],
            ["09:20", "Reply sent · CRM record saved"],
          ].map(([t, e]) => (
            <li key={e}>
              <time>{t}</time>
              <span>{e}</span>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
