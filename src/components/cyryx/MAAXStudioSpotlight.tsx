import { ArrowRight, Check } from "lucide-react";
import { HudLabel } from "./primitives/HudLabel";
import { GlassPanel } from "./primitives/GlassPanel";
import maaxDevices from "@/assets/cyryx-maax-devices.jpg";
import maaxLogo from "@/assets/cyryx-maax-visual.png.asset.json";

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
    <GlassPanel glow className="overflow-hidden p-2 sm:p-3" data-macbook-figure>
      <img
        src={maaxDevices}
        alt="MAAX Studio agentic IDE shown on an external monitor and MacBook side by side"
        width={1600}
        height={1200}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full rounded-md object-contain"
      />
    </GlassPanel>
  );
}

export function MAAXStudioSpotlight() {
  return (
    <section id="maax" className="relative py-14 sm:py-20 lg:py-32 bg-[var(--graphite)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-radial-teal)" }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div className="cx-reveal">
            <HudLabel withDot>Flagship Product</HudLabel>
            <img
              src={maaxLogo.url}
              alt="MAAX Studio logo"
              width={1794}
              height={222}
              loading="lazy"
              decoding="async"
              className="mt-5 block w-full max-w-[320px] sm:max-w-[420px] lg:max-w-[520px] h-auto object-contain"
            />
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
                href="#contact"
                aria-label="Request early access — open contact form"
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