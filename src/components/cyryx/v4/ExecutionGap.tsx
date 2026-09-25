import { useEffect, useRef, useState } from "react";

/**
 * The problem, shown instead of quoted: four breaks between a capable model and
 * a business outcome. As the section scrolls through, each break is closed —
 * the part Cyryx builds. No third-party statistics.
 */
const BREAKS = [
  {
    key: "data",
    label: "Data",
    title: "Data the system can trust",
    body: "Sources, freshness and access are defined before a model reads anything.",
  },
  {
    key: "authority",
    label: "Authority",
    title: "Permissions someone decided",
    body: "What the system may read, change, spend and approve is written down and enforced.",
  },
  {
    key: "cost",
    label: "Cost",
    title: "Cost someone watches",
    body: "Budgets per task and per workflow, with alerts before a limit is crossed.",
  },
  {
    key: "owner",
    label: "Ownership",
    title: "An owner for the outcome",
    body: "A named person accepts the result and decides when the system earns more autonomy.",
  },
] as const;

function useClosedBreaks(sectionRef: React.RefObject<HTMLElement | null>) {
  // Server render, reduced motion and low-perf devices show the finished state.
  const [closed, setClosed] = useState<number>(BREAKS.length);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.documentElement.classList.contains("cx-low-perf")) return;

    let cancelled = false;
    let kill: (() => void) | undefined;
    setClosed(0);

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const trigger = ScrollTrigger.create({
        trigger: section.querySelector("[data-gap-track]") ?? section,
        start: "top 78%",
        end: "bottom 42%",
        onUpdate: (self) => {
          setClosed(Math.min(BREAKS.length, Math.floor(self.progress * (BREAKS.length + 0.6))));
        },
        onLeave: () => setClosed(BREAKS.length),
      });
      kill = () => trigger.kill();
    })();

    return () => {
      cancelled = true;
      kill?.();
    };
  }, [sectionRef]);

  return closed;
}

export function ExecutionGap() {
  const sectionRef = useRef<HTMLElement>(null);
  const closed = useClosedBreaks(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="execution-gap"
      aria-labelledby="execution-gap-heading"
      data-story-section
      className="relative overflow-hidden border-y border-[color-mix(in_oklab,var(--silver)_12%,transparent)] bg-[var(--obsidian)] py-12 sm:py-20 lg:py-24"
    >
      <div aria-hidden className="cx-aurora" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="cx-reveal grid gap-8 sm:gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:gap-24">
          <div>
            <p className="max-w-md text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg">
              Most AI projects don't fail on the model. They fail on the data, permissions, costs
              and ownership around it.
            </p>
          </div>
          <h2
            id="execution-gap-heading"
            className="max-w-[16ch] font-display text-[1.75rem] sm:text-[2.125rem] lg:text-[2.75rem] xl:text-[3.5rem] font-semibold leading-[0.98] tracking-[-0.045em] text-silver-gradient"
          >
            AI initiatives stall between the model and the business.
          </h2>
        </div>

        <div
          data-gap-track
          data-closed={closed}
          className="cx-gap mt-12 sm:mt-20"
          role="group"
          aria-label="Four breaks between a model and a business outcome"
        >
          <div className="cx-gap-ends" aria-hidden>
            <span className="cx-gap-end">
              <span className="cx-gap-end-dot" />
              Model
            </span>
            <span className="cx-gap-end cx-gap-end--outcome" data-lit={closed >= BREAKS.length}>
              Business outcome
              <span className="cx-gap-end-dot" />
            </span>
          </div>

          <ol className="cx-gap-list">
            {BREAKS.map((item, index) => {
              const isClosed = index < closed;
              return (
                <li key={item.key} className="cx-gap-item" data-closed={isClosed}>
                  <span aria-hidden className="cx-gap-bridge">
                    <span className="cx-gap-half cx-gap-half--left" />
                    <span className="cx-gap-node" />
                    <span className="cx-gap-half cx-gap-half--right" />
                  </span>
                  <div className="cx-gap-copy">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--accent-glow)]">
                        {String(index + 1).padStart(2, "0")} · {item.label}
                      </span>
                      <span className="cx-gap-status font-mono text-[12px] uppercase tracking-[0.12em]">
                        {isClosed ? "Built in" : "Often missing"}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-xl font-semibold tracking-[-0.025em] text-[var(--silver)] sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-[var(--silver-dim)]">
                      {item.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="cx-reveal mt-10 grid gap-5 border-t border-[color-mix(in_oklab,var(--silver)_14%,transparent)] pt-7 sm:mt-16 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-10 sm:pt-9">
          <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--accent-glow)]">
            Cyryx thesis
          </span>
          <p className="max-w-4xl font-display text-2xl font-medium leading-snug tracking-[-0.025em] text-[var(--silver)] sm:text-3xl">
            A capable model is not yet a working system. The missing layer is controlled execution,
            and that is what we build.
          </p>
        </div>
      </div>
    </section>
  );
}
