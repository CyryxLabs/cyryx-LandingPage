import { useEffect, useRef, useState } from "react";

type Step = { label: string; meta: string; tag: string; human?: boolean };

/**
 * Illustrative workflows. They show the shape of what Cyryx builds (systems
 * connected, AI on the reading steps, a person approving what matters); they
 * are not a record of a client system and state no result.
 */
const FLOWS: readonly { id: string; name: string; steps: readonly Step[] }[] = [
  {
    id: "lead",
    name: "Lead intake",
    steps: [
      {
        label: "New inquiry arrives from the website",
        meta: "Form · email · chat",
        tag: "Trigger",
      },
      { label: "AI reads it and extracts the need", meta: "Company, request, urgency", tag: "AI" },
      { label: "Record created in the CRM", meta: "No retyping", tag: "System" },
      {
        label: "Reply drafted for the account owner",
        meta: "Waits for approval",
        tag: "Human",
        human: true,
      },
      {
        label: "Approved reply sent, follow-up scheduled",
        meta: "Logged with time and cost",
        tag: "Done",
      },
    ],
  },
  {
    id: "invoice",
    name: "Invoice processing",
    steps: [
      { label: "Invoice PDF lands in the inbox", meta: "Any layout", tag: "Trigger" },
      { label: "AI extracts vendor, lines and totals", meta: "Checked against rules", tag: "AI" },
      { label: "Matched to the purchase order", meta: "ERP lookup", tag: "System" },
      {
        label: "Mismatch flagged to finance",
        meta: "Waits for approval",
        tag: "Human",
        human: true,
      },
      { label: "Posted to accounting", meta: "Logged with time and cost", tag: "Done" },
    ],
  },
  {
    id: "support",
    name: "Support triage",
    steps: [
      { label: "Customer ticket opened", meta: "Help desk", tag: "Trigger" },
      { label: "AI classifies topic and priority", meta: "From your own categories", tag: "AI" },
      { label: "Answer drafted from the knowledge base", meta: "Sources attached", tag: "AI" },
      { label: "Agent reviews and sends", meta: "Waits for approval", tag: "Human", human: true },
      {
        label: "Ticket closed, knowledge gap recorded",
        meta: "Logged with time and cost",
        tag: "Done",
      },
    ],
  },
];

export function WorkflowConsole() {
  const [flowIndex, setFlowIndex] = useState(0);
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const flow = FLOWS[flowIndex];

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setActive(flow.steps.length);
      return;
    }
    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry?.isIntersecting ?? true));
    if (ref.current) io.observe(ref.current);
    const timer = window.setInterval(() => {
      if (!visible || document.hidden) return;
      setActive((current) => {
        if (current < flow.steps.length) return current + 1;
        if (auto) setFlowIndex((index) => (index + 1) % FLOWS.length);
        return 0;
      });
    }, 1500);
    return () => {
      window.clearInterval(timer);
      io.disconnect();
    };
  }, [flow.steps.length, auto, flowIndex]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      el.style.setProperty("--cy-ry", `${(x * 5).toFixed(2)}deg`);
      el.style.setProperty("--cy-rx", `${(-y * 4).toFixed(2)}deg`);
    };
    const onLeave = () => {
      el.style.setProperty("--cy-ry", "0deg");
      el.style.setProperty("--cy-rx", "0deg");
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const done = Math.min(active, flow.steps.length);

  return (
    <figure style={{ margin: 0 }} aria-labelledby="console-caption">
      <div ref={ref} className="cy-console">
        <div className="cy-console__bar">
          <span>
            <b>Workflow</b> · example
          </span>
          <span aria-hidden="true">
            {String(done).padStart(2, "0")} / {String(flow.steps.length).padStart(2, "0")}
          </span>
        </div>
        <div className="cy-console__meter" aria-hidden="true">
          <i style={{ "--cy-p": done / flow.steps.length } as React.CSSProperties} />
        </div>
        <div className="cy-console__tabs" role="tablist" aria-label="Example workflows">
          {FLOWS.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`console-tab-${item.id}`}
              aria-selected={index === flowIndex}
              aria-controls="console-panel"
              className="cy-console__tab"
              onClick={() => {
                setAuto(false);
                setFlowIndex(index);
                setActive(0);
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
        <div id="console-panel" role="tabpanel" aria-labelledby={`console-tab-${flow.id}`}>
          <ol className="cy-console__body">
            {flow.steps.map((step, index) => (
              <li
                key={step.label}
                className="cy-step"
                data-state={index < active ? "done" : index === active ? "active" : "idle"}
              >
                <span className="cy-step__dot" aria-hidden="true">
                  {index < active ? "✓" : index + 1}
                </span>
                <span className="cy-step__label">
                  {step.label}
                  <span className="cy-step__meta">{step.meta}</span>
                </span>
                <span className="cy-step__tag" data-kind={step.human ? "human" : undefined}>
                  {step.tag}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="cy-console__foot">
          <span>Approval points set in the scope</span>
          <span>Logging set in the scope</span>
        </div>
      </div>
      <figcaption
        id="console-caption"
        className="cy-source"
        style={{ marginTop: 14, display: "block" }}
      >
        Illustrative workflow. Each system we build is mapped to your own tools and rules.
      </figcaption>
    </figure>
  );
}
