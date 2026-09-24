import { useEffect, useRef, useState } from "react";

type TraceStep = {
  key: string;
  label: string;
  detail: string;
  done: string;
  tone?: "review";
};

/**
 * Illustrative execution trace for the hero. It shows how a governed AI
 * workflow moves from intent to evidence. The data is a labelled example, never
 * presented as a client record.
 */
const STEPS: readonly TraceStep[] = [
  {
    key: "intent",
    label: "Intent",
    detail: "Classify inbound supplier invoices and route exceptions",
    done: "defined",
  },
  {
    key: "authority",
    label: "Authority",
    detail: "May read the ERP · may not approve payments above $5,000",
    done: "scoped",
  },
  {
    key: "execution",
    label: "Execution",
    detail: "142 invoices processed · 9 exceptions found",
    done: "complete",
  },
  {
    key: "review",
    label: "Human review",
    detail: "3 exceptions sent to the finance lead",
    done: "approved",
    tone: "review",
  },
  {
    key: "evidence",
    label: "Evidence",
    detail: "Decision log, cost per task and acceptance check recorded",
    done: "recorded",
  },
];

const STEP_MS = 1500;
const HOLD_MS = 3200;
const COST_BY_STEP = [0.18, 0.42, 3.64, 3.88, 4.12];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () =>
      setReduced(query.matches || document.documentElement.classList.contains("cx-low-perf"));
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return reduced;
}

export function ExecutionTrace() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  // Server render and reduced motion both show the completed trace.
  const [active, setActive] = useState(STEPS.length);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.25,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion || !visible) {
      setActive(STEPS.length);
      return;
    }
    let step = 0;
    setActive(0);
    let timer = 0;
    const tick = () => {
      step += 1;
      setActive(step);
      timer = window.setTimeout(
        () => {
          if (step >= STEPS.length) {
            step = 0;
            setActive(0);
            timer = window.setTimeout(tick, STEP_MS);
          } else {
            tick();
          }
        },
        step >= STEPS.length ? HOLD_MS : STEP_MS,
      );
    };
    timer = window.setTimeout(tick, STEP_MS);
    return () => window.clearTimeout(timer);
  }, [reducedMotion, visible]);

  const cost = COST_BY_STEP[Math.min(active, STEPS.length) - 1] ?? 0;

  return (
    <div
      ref={rootRef}
      className="cx-trace"
      role="figure"
      aria-label="Illustrative example of a governed AI workflow: intent, authority, execution, human review and evidence."
      data-execution-trace
    >
      <div className="cx-trace-head">
        <span>Execution trace</span>
        <span className="cx-trace-tag">Illustrative example</span>
      </div>
      <ol className="cx-trace-steps">
        {STEPS.map((step, index) => {
          const state = index < active ? "done" : index === active ? "active" : "pending";
          const reviewing = step.tone === "review" && state === "active";
          return (
            <li key={step.key} className="cx-trace-step" data-state={state} data-tone={step.tone}>
              <span className="cx-trace-dot" aria-hidden />
              <span className="min-w-0">
                <span className="cx-trace-label">{step.label}</span>
                <span className="cx-trace-detail">{step.detail}</span>
              </span>
              <span className="cx-trace-status">
                {state === "done"
                  ? step.done
                  : reviewing
                    ? "awaiting"
                    : state === "active"
                      ? "running"
                      : "queued"}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="cx-trace-foot">
        <span>Model cost for this run</span>
        <span className="tabular-nums">
          ${cost.toFixed(2)} <span className="text-[var(--steel)]">/ budget $20.00</span>
        </span>
      </div>
    </div>
  );
}
