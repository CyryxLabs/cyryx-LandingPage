import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { WORKFLOW_DEMO } from "@/data/home";
import { trackCta } from "@/lib/track-cta";

const STEPS = WORKFLOW_DEMO.steps;
const LAST = STEPS.length - 1;
/** Where each step begins inside the scroll track. The approval holds longest. */
const AT = [0, 0.16, 0.34, 0.52, 0.82] as const;
/** Screens with room for a sticky stage. Same condition as home-cinema.css. */
export const SCENE_QUERY =
  "(min-width: 901px) and (min-height: 700px), (max-width: 900px) and (min-height: 640px)";
const clamp = (value: number) => Math.min(1, Math.max(0, value));
const two = (n: number) => String(n).padStart(2, "0");

/**
 * Illustrative inquiry-to-reply workflow with deterministic sample data.
 * Nothing is sent or written. The visitor drives it with the step buttons,
 * previous/next, replay and the final state. Where motion is allowed the
 * section is a tall track with a sticky stage and the page scroll walks
 * through the steps; the controls then scroll to the step they name.
 */
export function WorkflowScene() {
  const [step, setStep] = useState(0);
  const [scrub, setScrub] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef(0);
  const started = useRef(false);
  const completed = useRef(false);

  const record = useCallback((value: number) => {
    if (!started.current && value !== 0) {
      started.current = true;
      trackCta({ cta: "demo_started", section: "workflow_demo" });
    }
    if (!completed.current && value === LAST) {
      completed.current = true;
      trackCta({ cta: "demo_completed", section: "workflow_demo" });
    }
    stepRef.current = value;
    setStep(value);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const root = document.documentElement;
    // Same gate as the tall track in home-cinema.css.
    const tall = window.matchMedia(SCENE_QUERY);
    let frame = 0;
    let on = false;
    const update = () => {
      frame = 0;
      if (!on) return;
      const rect = track.getBoundingClientRect();
      const span = Math.max(1, rect.height - window.innerHeight);
      const progress = clamp(-rect.top / span);
      track.style.setProperty("--wp", progress.toFixed(4));
      let next = 0;
      for (let k = 0; k < AT.length; k += 1) if (progress >= AT[k]) next = k;
      if (next !== stepRef.current) record(next);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const apply = () => {
      on = tall.matches && root.classList.contains("cy-js");
      track.classList.toggle("is-scrub", on);
      setScrub(on);
      onScroll();
    };
    apply();
    tall.addEventListener("change", apply);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      tall.removeEventListener("change", apply);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      track.classList.remove("is-scrub");
    };
  }, [record]);

  const go = (next: number, focus = false) => {
    const value = Math.max(0, Math.min(LAST, next));
    record(value);
    const track = trackRef.current;
    if (scrub && track) {
      const rect = track.getBoundingClientRect();
      const span = Math.max(1, rect.height - window.innerHeight);
      const at = value === LAST ? 0.94 : (AT[value] + AT[value + 1]) / 2;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({
        top: rect.top + window.scrollY + span * at,
        behavior: reduce ? "auto" : "smooth",
      });
    }
    if (focus)
      requestAnimationFrame(() =>
        viewRef.current?.querySelector("h3")?.focus({ preventScroll: true }),
      );
  };

  const current = STEPS[step];
  return (
    <div
      className="wf-track"
      data-hm-track
      ref={trackRef}
      style={scrub ? undefined : ({ "--wp": ((step / LAST) * 0.9).toFixed(3) } as CSSProperties)}
    >
      <div className="wf-pin">
        <div className="wrap">
          <div className="wf-head">
            <h2 id="wf-title">{WORKFLOW_DEMO.title}</h2>
            <p>{WORKFLOW_DEMO.lead}</p>
          </div>
          <div className="wf-demo">
            <div className="pipe">
              <span className="pipe-fill" aria-hidden="true" />
              <ol className="pipe-list" aria-label="Workflow steps">
                {STEPS.map((s, i) => (
                  <li key={s.name}>
                    <button
                      type="button"
                      className={i === 3 ? "is-approval" : undefined}
                      data-done={i < step ? "true" : undefined}
                      aria-current={i === step ? "step" : undefined}
                      onClick={() => go(i)}
                    >
                      <span className="dot" aria-hidden="true">
                        {two(i + 1)}
                      </span>
                      {s.name}
                    </button>
                  </li>
                ))}
              </ol>
            </div>
            <div className="wf-body">
              <div className="wf-num">
                <p className="n" aria-hidden="true" key={step}>
                  {two(step + 1)}
                </p>
                <p className="why">{current.why}</p>
                <div className="ctrl">
                  <Control
                    label="Previous"
                    short="Previous"
                    onClick={() => go(step - 1)}
                    disabled={step === 0}
                  />
                  <Control
                    label={step === 3 ? "Approve and continue" : "Next step"}
                    short={step === 3 ? "Approve" : "Next"}
                    onClick={() => go(step + 1)}
                    disabled={step === LAST}
                  />
                  <Control label="Replay" short="Replay" onClick={() => go(0, true)} />
                  <Control label="Show final state" short="Final" onClick={() => go(LAST, true)} />
                </div>
              </div>
              <div className="stage hm-stage" aria-live="polite">
                <span className="stage-prog" aria-hidden="true" />
                <div className="stage-bar">
                  <span className="sys" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="sample">Sample data</span>
                </div>
                <div className="view" ref={viewRef} key={step}>
                  <h3 tabIndex={-1}>
                    {two(step + 1)} · {current.name}
                  </h3>
                  <StepBody step={step} onApprove={() => go(LAST, true)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** One control. Narrow screens show the short label; the name stays the full one. */
function Control({
  label,
  short,
  onClick,
  disabled,
}: {
  label: string;
  short: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button type="button" aria-label={label} onClick={onClick} disabled={disabled}>
      <span className="full">{label}</span>
      <span className="short">{short}</span>
    </button>
  );
}

function StepBody({ step, onApprove }: { step: number; onApprove: () => void }) {
  if (step === 0)
    return (
      <div className="card">
        <dl className="kv">
          <dt>From</dt>
          <dd>Maria Chen · Northline Dental</dd>
          <dt>Subject</dt>
          <dd>Moving Thursday’s onboarding call</dd>
        </dl>
        <p style={{ marginTop: 10 }}>
          Hi—something came up on Thursday. Could we move our onboarding call to early next week?
          Mornings work best.
        </p>
      </div>
    );
  if (step === 1)
    return (
      <div className="card">
        <dl className="kv">
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
      <div className="card diff">
        <div>
          Contact · Maria Chen <span className="muted">(found)</span>
        </div>
        <div className="add">+ Activity: “Reschedule onboarding call”</div>
        <div className="add">+ Proposed slots: Tue 10:00 · Wed 10:30</div>
        <div className="pend">○ Status: prepared — not written yet</div>
      </div>
    );
  if (step === 3)
    return (
      <>
        <div className="card">
          <p>
            Hi Maria—no problem. Would Tuesday at 10:00 or Wednesday at 10:30 work for the
            onboarding call? Either way, we’ll send a new invite right after you confirm.
          </p>
        </div>
        <div className="approve">
          <span>● Waiting for your approval</span>
          <button type="button" onClick={onApprove}>
            Approve &amp; send
          </button>
        </div>
      </>
    );
  return (
    <>
      <p className="result">● Sent (simulated) · CRM record saved (simulated)</p>
      <div className="card">
        <ol className="log">
          {[
            ["09:12", "Inquiry received from Maria Chen"],
            ["09:12", "AI step: request summarized"],
            ["09:13", "CRM change prepared (not saved)"],
            ["09:20", "Reply approved by you"],
            ["09:20", "Reply sent · CRM record saved"],
          ].map(([time, event]) => (
            <li key={event}>
              <time>{time}</time>
              <span>{event}</span>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

/** The whole example as text, for every visitor and assistive technology. */
export function WorkflowAsText() {
  return (
    <details className="texteq hm-texteq">
      <summary>Read the whole example as text</summary>
      <ol>
        {STEPS.map((s) => (
          <li key={s.name}>
            {s.name}: {s.text}
          </li>
        ))}
      </ol>
    </details>
  );
}
