import { ArrowRight } from "lucide-react";
import { HudLabel } from "./primitives/HudLabel";
import { GlassPanel } from "./primitives/GlassPanel";
import maaxDevices from "@/assets/cyryx-maax-devices.jpg";
import maaxLogo from "@/assets/cyryx-maax-visual.png.asset.json";
import { useCopyVariant } from "@/lib/copy-variant";
import { getCopy } from "@/copy";
import { trackCta } from "@/lib/track-cta";

const PILLARS: { title: string; body: string }[] = [
  {
    title: "Mission-based execution",
    body: "Work runs as governed missions with explicit states and completion criteria.",
  },
  {
    title: "Project memory",
    body: "Context that compounds across a project's life, grounded in a structural graph of the codebase.",
  },
  {
    title: "Command Gates",
    body: "Diff review, security analysis, and configuration audit before changes land. Default-fail.",
  },
  {
    title: "Mission Ledger",
    body: "An auditable record of agent activity: actions, rationale, authority, cost.",
  },
  {
    title: "Cost visibility",
    body: "Token, latency, and spend telemetry at mission level — a control input, not a post-mortem.",
  },
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
  const copy = getCopy(useCopyVariant()).maaxSpotlight;
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
            <HudLabel withDot>{copy.eyebrow}</HudLabel>
            <img
              src={maaxLogo.url}
              alt="MAAX Studio logo"
              width={1794}
              height={222}
              loading="lazy"
              decoding="async"
              className="mt-5 block w-full max-w-[320px] sm:max-w-[420px] lg:max-w-[520px] h-auto object-contain"
            />
            <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold uppercase leading-[1.05] tracking-tight text-silver-gradient">
              Governed autonomy for AI-native builders.
            </h2>
            <p className="mt-6 max-w-xl text-[15px] sm:text-base leading-relaxed text-[var(--silver-dim)]">
              MAAX Studio is being engineered as a local-first agentic execution
              environment: autonomous agents operating under explicit human
              command, with governance built into the runtime — not layered on
              top.
            </p>
            <ul className="mt-7 space-y-4">
              {PILLARS.map((p) => (
                <li key={p.title} className="text-sm text-[var(--silver)]">
                  <span className="font-display uppercase tracking-[0.08em] text-[var(--silver)]">
                    {p.title}.
                  </span>{" "}
                  <span className="text-[var(--silver-dim)]">{p.body}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--accent-glow)]">
              MAAX Studio is in active development. Early access opens to a limited cohort.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="#contact"
                aria-label={`${copy.cta} — open contact form`}
                onClick={() =>
                  trackCta({
                    cta: "request_early_access",
                    section: "maax_spotlight",
                    href: "#contact",
                  })
                }
                className="inline-flex h-12 items-center gap-2 rounded-md bg-[var(--accent-glow)] px-6 hud-label text-[var(--onyx)] font-semibold shadow-[var(--shadow-glow-teal)] hover:brightness-110 transition"
              >
                {copy.cta}
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