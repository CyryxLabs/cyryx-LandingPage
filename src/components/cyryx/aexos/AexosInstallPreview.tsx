import { AEXOS_PRODUCT } from "@/data/site-taxonomy";
import { AEXOS_ENVIRONMENTS } from "@/data/aexos";
import { useSimulationClock, useTypewriter } from "./useSimulationClock";

const OUTPUT = [
  "Installing AEXOS Core into ./my-project",
  "✓ 12 core roles and 9 squads",
  "✓ 291 tasks · 33 workflows · 62 checklists",
  `✓ Agents synced for ${AEXOS_ENVIRONMENTS.join(", ")}`,
  "✓ Quality gates: pre-commit, pre-push, CI",
  "Ready. Ask @aexos-master for *help",
] as const;

const LOOP = OUTPUT.length + 4;

/** Terminal preview of a Core install. Output lines summarise the documented package contents. */
export function AexosInstallPreview() {
  const { ref, tick, still } = useSimulationClock<HTMLDivElement>(650);
  const phase = still ? LOOP - 1 : tick % LOOP;
  const command = `npx ${AEXOS_PRODUCT.installCommand.replace(/^npx /, "")}`;
  const typed = useTypewriter(command, !still && phase === 0, 900);
  const shown = still ? OUTPUT.length : Math.max(0, Math.min(OUTPUT.length, phase - 1));

  return (
    <div
      ref={ref}
      className="cx-sim flex min-h-[21rem] flex-col overflow-hidden rounded-xl border border-white/10"
      role="img"
      aria-label={`Terminal preview: ${command} installs the AEXOS Core roles, squads, tasks and quality gates`}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--steel)]">
          terminal
        </span>
      </div>
      <div
        aria-hidden
        className="flex-1 space-y-2 p-5 font-mono text-[12.5px] leading-relaxed sm:p-6 sm:text-[13px]"
      >
        <p className="text-[var(--silver)]">
          <span className="text-[var(--steel)]">$ </span>
          {still || phase > 0 ? command : typed}
          {!still && phase === 0 ? <span className="cx-caret" /> : null}
        </p>
        {OUTPUT.slice(0, shown).map((line, index) => (
          <p
            key={`${line}-${still ? "still" : Math.floor(tick / LOOP)}`}
            className={`cx-sim-line ${
              index === OUTPUT.length - 1
                ? "text-[var(--accent-glow)]"
                : line.startsWith("✓")
                  ? "text-[var(--silver)]"
                  : "text-[var(--silver-dim)]"
            }`}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
