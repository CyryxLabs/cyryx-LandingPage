import { ArrowRight, Check, LayoutDashboard, FolderOpen, Image as Img, Cpu, Workflow, Settings, Plus, Sparkles } from "lucide-react";
import { HudLabel } from "./primitives/HudLabel";
import { GlassPanel } from "./primitives/GlassPanel";
import { CyryxMark } from "./primitives/CyryxMark";

const BULLETS = [
  "Turn goals into structured missions",
  "Maintain persistent project memory",
  "Map project context through an Atlas-style context layer",
  "Activate specialized command units and operator cells",
  "Route work through execution protocols",
  "Validate output through quality, security, architecture, and cost gates",
  "Track mission activity through ledgers and decision memory",
  "Keep humans in command of critical delivery decisions",
  "Provide a clear Mission Control surface for visibility and review",
];

function ProductPreview() {
  return (
    <GlassPanel glow className="overflow-hidden p-0">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden sm:flex w-14 lg:w-44 flex-col border-r border-[color-mix(in_oklab,var(--silver)_8%,transparent)] bg-[color-mix(in_oklab,var(--onyx)_60%,transparent)] p-3 gap-1">
          <div className="flex items-center gap-2 px-2 py-3 mb-2">
            <CyryxMark size={20} />
            <span className="hidden lg:inline hud-label">MAAX</span>
          </div>
          {[
            [LayoutDashboard, "Dashboard"],
            [FolderOpen, "Projects"],
            [Img, "Assets"],
            [Cpu, "Models"],
            [Workflow, "Workflows"],
            [Settings, "Settings"],
          ].map(([Ic, label], i) => {
            const Icon = Ic as typeof LayoutDashboard;
            return (
              <div
                key={label as string}
                className={`cx-stagger-item flex items-center gap-2.5 rounded-md px-2 py-2 text-[12px] ${i === 0 ? "bg-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)] text-[var(--silver)]" : "text-[var(--silver-dim)]"}`}
              >
                <Icon className="h-3.5 w-3.5 text-[var(--accent-glow)]" />
                <span className="hidden lg:inline">{label as string}</span>
              </div>
            );
          })}
        </aside>

        {/* Main */}
        <div className="flex-1 p-4 sm:p-5 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <HudLabel>Welcome back, Operator</HudLabel>
              <h4 className="mt-2 font-display text-lg sm:text-xl font-semibold text-silver-gradient">
                What will you build today?
              </h4>
            </div>
            <span className="hud-label text-[var(--accent-glow)] hidden sm:inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-glow)] shadow-[0_0_8px_var(--accent-glow)]" />
              3 Agents Live
            </span>
          </div>

          <div className="cx-stagger mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {[
              [Plus, "Create New"],
              [Sparkles, "Generate"],
              [Workflow, "Automate"],
              [Cpu, "Collaborate"],
            ].map(([Ic, label]) => {
              const Icon = Ic as typeof Plus;
              return (
                <button
                  key={label as string}
                  className="cx-stagger-item rounded-md border border-[color-mix(in_oklab,var(--silver)_10%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_70%,transparent)] p-3 text-left hover:border-[color-mix(in_oklab,var(--accent-glow)_40%,transparent)] transition"
                >
                  <Icon className="h-4 w-4 text-[var(--accent-glow)]" />
                  <div className="mt-2 text-[12px] text-[var(--silver)]">{label as string}</div>
                </button>
              );
            })}
          </div>

          <div className="mt-5">
            <HudLabel>Recent Projects</HudLabel>
            <div className="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-2">
              {["Obsidian Signal", "Elysium Sequence", "Nexus Interface", "Echoes of Tomorrow"].map((n, i) => (
                <div
                  key={n}
                  className="overflow-hidden rounded-md border border-[color-mix(in_oklab,var(--silver)_8%,transparent)]"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-[var(--charcoal)] via-[var(--deep-space)] to-[var(--charcoal)] relative">
                    <div
                      className="absolute inset-0 opacity-60"
                      style={{
                        background: `radial-gradient(ellipse at ${20 + i * 18}% 60%, color-mix(in oklab, var(--accent-glow) 30%, transparent), transparent 70%)`,
                      }}
                    />
                  </div>
                  <div className="p-2">
                    <div className="text-[11px] text-[var(--silver)] truncate">{n}</div>
                    <div className="hud-label text-[var(--silver-dim)] mt-0.5">{20 + i}h ago</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}

export function MAAXStudioSpotlight() {
  return (
    <section id="maax" className="relative py-20 lg:py-32 bg-[var(--graphite)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-radial-teal)" }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div className="cx-reveal">
            <HudLabel withDot>Flagship Product</HudLabel>
            <h2 className="mt-5 font-display text-[36px] sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-[0.04em] text-silver-gradient">
              MAAX&nbsp;STUDIO
            </h2>
            <p className="mt-3 font-display text-base sm:text-lg text-[var(--accent-glow)]">
              The agentic execution OS for AI-native builders.
            </p>
            <p className="mt-6 max-w-xl text-[15px] sm:text-base leading-relaxed text-[var(--silver-dim)]">
              MAAX Studio is Cyryx Labs' flagship product: a local-first
              agentic software factory environment for founders, agencies, and
              product teams building with AI. It is being built as a
              runtime-first system for coordinating software work through
              structured missions, project memory, specialized operators,
              command units, gates, delivery packages, and human-governed
              execution.
            </p>
            <ul className="mt-7 space-y-3">
              {BULLETS.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-[var(--silver)]">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-sm border border-[color-mix(in_oklab,var(--accent-glow)_40%,transparent)]">
                    <Check className="h-3 w-3 text-[var(--accent-glow)]" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="#cta"
                className="inline-flex h-12 items-center gap-2 rounded-md bg-[var(--accent-glow)] px-6 hud-label text-[var(--onyx)] font-semibold shadow-[var(--shadow-glow-teal)] hover:brightness-110 transition"
              >
                Request Early Access
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="cx-reveal">
            <ProductPreview />
          </div>
        </div>
      </div>
    </section>
  );
}