import { useRef, useState, type CSSProperties } from "react";
import { WORKFLOW_DEMO } from "@/data/home";
import { trackCta, type CtaSection } from "@/lib/track-cta";

const LAST = WORKFLOW_DEMO.steps.length - 1;

/**
 * Illustrative inquiry-to-reply workflow. Deterministic sample data, driven by
 * the visitor: step buttons, previous/next, replay and the final state. Nothing
 * is sent or written; the text equivalent below repeats every step.
 */
export function WorkflowDemo({ section = "workflow_demo" }: { section?: CtaSection }) {
  const [step, setStep] = useState(0);
  const started = useRef(false);
  const completed = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const go = (next: number, focus = false) => {
    const value = Math.max(0, Math.min(LAST, next));
    if (!started.current && value !== 0) {
      started.current = true;
      trackCta({ cta: "demo_started", section });
    }
    if (!completed.current && value === LAST) {
      completed.current = true;
      trackCta({ cta: "demo_completed", section });
    }
    setStep(value);
    if (focus) requestAnimationFrame(() => stageRef.current?.querySelector("h3")?.focus());
  };

  return (
    <div className="hm-wf">
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
          <div className="hm-view" key={step}>
            <h3 tabIndex={-1}>
              {step + 1} · {WORKFLOW_DEMO.steps[step].name}
            </h3>
            <p className="hm-why">{WORKFLOW_DEMO.steps[step].why}</p>
            <StepBody step={step} onApprove={() => go(LAST, true)} />
          </div>
        </div>
      </div>

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
    </div>
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
