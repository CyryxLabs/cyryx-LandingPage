import { useId } from "react";
import { HudLabel } from "../primitives/HudLabel";
import type { SolutionVisual } from "./SolutionMedia";

export interface SolutionDiagramNode {
  name: string;
  detail: string;
}

export function SolutionDiagram({
  visual,
  nodes,
}: {
  visual: SolutionVisual;
  nodes: readonly SolutionDiagramNode[];
}) {
  const headingId = useId();
  const captionId = useId();

  return (
    <figure
      data-solution-diagram
      data-diagram-variant={visual.diagramVariant}
      aria-labelledby={headingId}
      aria-describedby={captionId}
      className="cx-solution-diagram"
    >
      <figcaption className="grid gap-5 border-b border-white/10 pb-8 lg:grid-cols-[0.68fr_1.32fr] lg:gap-20">
        <HudLabel>System view · {visual.diagramVariant}</HudLabel>
        <div>
          <h2
            id={headingId}
            className="font-display text-3xl font-medium tracking-[-0.035em] text-[var(--silver)] sm:text-4xl"
          >
            {visual.diagramLabel}
          </h2>
          <p
            id={captionId}
            className="mt-4 max-w-3xl text-sm leading-relaxed text-[var(--silver-dim)]"
          >
            {visual.diagramCaption}
          </p>
        </div>
      </figcaption>

      {visual.diagramVariant === "matrix" ? (
        <Matrix nodes={nodes} caption={visual.diagramLabel} />
      ) : (
        <div className="relative">
          {visual.diagramVariant === "radial" ? (
            <div aria-hidden="true" className="cx-solution-radial-core">
              Defined
              <br />
              system
            </div>
          ) : null}
          <ol
            className="cx-solution-diagram-list"
            data-variant={visual.diagramVariant}
            aria-label={`${visual.diagramLabel} sequence`}
          >
            {nodes.map((node, index) => (
              <li key={node.name} className="cx-solution-diagram-node">
                <span className="cx-solution-diagram-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-xl font-medium tracking-[-0.02em] text-[var(--silver)]">
                    {node.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--silver-dim)]">
                    {node.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </figure>
  );
}

function Matrix({ nodes, caption }: { nodes: readonly SolutionDiagramNode[]; caption: string }) {
  return (
    <>
      <dl className="mt-8 border-t border-white/10 sm:hidden">
        {nodes.map((node, index) => (
          <div key={node.name} className="border-b border-white/10 py-5">
            <dt className="font-display text-lg font-medium text-[var(--silver)]">
              <span className="mr-3 font-mono text-[12px] tracking-[0.2em] text-[var(--accent-glow)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              {node.name}
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-[var(--silver-dim)]">{node.detail}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-8 hidden overflow-hidden rounded-md border border-white/10 sm:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="bg-[color-mix(in_oklab,var(--graphite)_82%,transparent)]">
              <th
                scope="col"
                className="w-[32%] border-b border-r border-white/10 px-5 py-4 font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--accent-glow)]"
              >
                Decision dimension
              </th>
              <th
                scope="col"
                className="border-b border-white/10 px-5 py-4 font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--accent-glow)]"
              >
                What it resolves
              </th>
            </tr>
          </thead>
          <tbody>
            {nodes.map((node, index) => (
              <tr key={node.name} className="border-b border-white/10 last:border-b-0">
                <th
                  scope="row"
                  className="border-r border-white/10 px-5 py-5 align-top font-display text-lg font-medium text-[var(--silver)]"
                >
                  <span className="mr-3 font-mono text-[12px] tracking-[0.2em] text-[var(--accent-glow)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {node.name}
                </th>
                <td className="px-5 py-5 text-sm leading-relaxed text-[var(--silver-dim)]">
                  {node.detail}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
