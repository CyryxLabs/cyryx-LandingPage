import { GlassPanel } from "./primitives/GlassPanel";
import { HudLabel } from "./primitives/HudLabel";

function MiniGlobe() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="h-full w-full"
      aria-hidden
    >
      <defs>
        <radialGradient id="g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent-glow)" stopOpacity="0.35" />
          <stop offset="60%" stopColor="var(--teal)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="var(--onyx)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="80" fill="url(#g)" />
      <circle cx="100" cy="100" r="80" fill="none" stroke="var(--accent-glow)" strokeOpacity="0.25" />
      {[60, 40, 20].map((r) => (
        <ellipse
          key={r}
          cx="100"
          cy="100"
          rx="80"
          ry={r}
          fill="none"
          stroke="var(--accent-glow)"
          strokeOpacity="0.18"
        />
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <line
          key={i}
          x1={20 + i * 40}
          y1="20"
          x2={20 + i * 40}
          y2="180"
          stroke="var(--accent-glow)"
          strokeOpacity="0.12"
        />
      ))}
      {[
        [50, 80],
        [130, 60],
        [90, 120],
        [150, 140],
        [70, 150],
        [120, 95],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2" fill="var(--accent-glow)">
          <animate
            attributeName="opacity"
            values="0.3;1;0.3"
            dur={`${2 + i * 0.4}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
}

function MiniBars() {
  const bars = [40, 60, 35, 80, 55, 70, 45, 90, 65, 75, 50, 85];
  return (
    <div className="flex h-12 items-end gap-[3px]">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm bg-gradient-to-t from-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)] to-[color-mix(in_oklab,var(--accent-glow)_70%,transparent)]"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

function RingMetric({ pct, label }: { pct: number; label: string }) {
  const c = 2 * Math.PI * 30;
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-20 w-20">
        <svg viewBox="0 0 72 72" className="h-full w-full -rotate-90">
          <circle cx="36" cy="36" r="30" stroke="var(--charcoal)" strokeWidth="4" fill="none" />
          <circle
            cx="36"
            cy="36"
            r="30"
            stroke="var(--accent-glow)"
            strokeWidth="4"
            fill="none"
            strokeDasharray={c}
            strokeDashoffset={c - (c * pct) / 100}
            strokeLinecap="round"
            className="drop-shadow-[0_0_4px_var(--accent-glow)]"
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center font-display text-sm font-semibold text-[var(--silver)]">
          {pct}%
        </div>
      </div>
      <span className="mt-2 hud-label">{label}</span>
    </div>
  );
}

export function DashboardPanel() {
  return (
    <GlassPanel
      data-hero-dashboard
      glow
      className="relative overflow-hidden p-4 sm:p-5 lg:p-6"
    >
      {/* Window-chrome header bar */}
      <div className="flex items-center justify-between border-b border-[color-mix(in_oklab,var(--silver)_8%,transparent)] pb-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[color-mix(in_oklab,var(--silver)_30%,transparent)]" />
          <span className="h-2 w-2 rounded-full bg-[color-mix(in_oklab,var(--silver)_30%,transparent)]" />
          <span className="h-2 w-2 rounded-full bg-[var(--accent-glow)] shadow-[0_0_8px_var(--accent-glow)]" />
          <span className="ml-3 hud-label text-[var(--silver-dim)]">cyryx_console / system_overview</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hud-label text-[var(--silver-dim)]">v1.04</span>
          <span className="hud-label text-[var(--accent-glow)]">UTC 04:21</span>
        </div>
      </div>

      {/* Main grid: globe + side widgets */}
      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1.4fr_1fr]">
        {/* Left widgets - hide on mobile, show on lg */}
        <div className="hidden lg:flex flex-col gap-3">
          <div className="rounded-md border border-[color-mix(in_oklab,var(--silver)_8%,transparent)] p-3">
            <HudLabel>Reasoning Engines</HudLabel>
            <div className="mt-3 flex items-end gap-3">
              <RingMetric pct={87} label="Active" />
              <RingMetric pct={62} label="Inference" />
            </div>
          </div>
          <div className="rounded-md border border-[color-mix(in_oklab,var(--silver)_8%,transparent)] p-3">
            <HudLabel>Execution Status</HudLabel>
            <div className="mt-3 space-y-2">
              {[
                ["Workflows", 92],
                ["Agents", 78],
                ["Pipelines", 65],
              ].map(([l, v]) => (
                <div key={l as string}>
                  <div className="flex justify-between text-[11px] text-[var(--silver-dim)]">
                    <span>{l}</span>
                    <span>{v}%</span>
                  </div>
                  <div className="mt-1 h-1 rounded-full bg-[var(--charcoal)]">
                    <div
                      className="h-full rounded-full bg-[var(--accent-glow)] shadow-[0_0_6px_var(--accent-glow)]"
                      style={{ width: `${v}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Globe */}
        <div className="relative rounded-md border border-[color-mix(in_oklab,var(--silver)_8%,transparent)] p-3 min-h-[180px] sm:min-h-[220px] lg:min-h-[300px]">
          <HudLabel>Global Mesh</HudLabel>
          <div className="absolute inset-3 top-8">
            <MiniGlobe />
          </div>
        </div>

        {/* Right metrics 2x2 on mobile, stacked on desktop */}
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-1 lg:gap-2">
          {[
            { l: "Network", v: "98.7%", s: "Secure" },
            { l: "Active Nodes", v: "2,468", s: "Online" },
            { l: "Uptime", v: "99.99%", s: null },
            { l: "Health", v: "Optimal", s: null },
          ].map((m) => (
            <div
              key={m.l}
              className="rounded-md border border-[color-mix(in_oklab,var(--silver)_8%,transparent)] p-2.5 sm:p-3"
            >
              <HudLabel>{m.l}</HudLabel>
              <div className="mt-1 font-display text-lg font-semibold text-silver-gradient">
                {m.v}
              </div>
              {m.s && <span className="hud-label text-[var(--accent-glow)]">{m.s}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Telemetry bars */}
      <div className="mt-4 hidden sm:block rounded-md border border-[color-mix(in_oklab,var(--silver)_8%,transparent)] p-3">
        <div className="flex items-center justify-between">
          <HudLabel>System Telemetry</HudLabel>
          <span className="hud-label text-[var(--silver-dim)]">2.6 PB/s</span>
        </div>
        <div className="mt-3"><MiniBars /></div>
      </div>

      {/* Bottom metric strip */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-[1px] overflow-hidden rounded-md border border-[color-mix(in_oklab,var(--silver)_8%,transparent)] bg-[color-mix(in_oklab,var(--silver)_8%,transparent)]">
        {[
          ["Uptime", "99.99%"],
          ["Throughput", "2.6 PB/s"],
          ["Latency", "8ms"],
          ["Security", "Active"],
          ["Regions", "12"],
          ["Compliance", "ISO 27001"],
          ["Encryption", "AES-256"],
        ].map(([l, v]) => (
          <div key={l} className="bg-[var(--graphite)] p-2.5">
            <div className="hud-label text-[var(--silver-dim)]">{l}</div>
            <div className="mt-1 text-[13px] font-medium text-[var(--silver)]">{v}</div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}