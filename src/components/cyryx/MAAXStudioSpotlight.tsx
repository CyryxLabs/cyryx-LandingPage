import { ArrowRight } from "lucide-react";
import { HudLabel } from "./primitives/HudLabel";
import { GlassPanel } from "./primitives/GlassPanel";
import maaxDevices from "@/assets/cyryx-maax-devices-1200.jpg";
import maaxDevices480Jpg from "@/assets/cyryx-maax-devices-480.jpg";
import maaxDevices800Jpg from "@/assets/cyryx-maax-devices-800.jpg";
import maaxDevices1200Jpg from "@/assets/cyryx-maax-devices-1200.jpg";
import maaxDevices480Webp from "@/assets/cyryx-maax-devices-480.webp";
import maaxDevices800Webp from "@/assets/cyryx-maax-devices-800.webp";
import maaxDevices1200Webp from "@/assets/cyryx-maax-devices-1200.webp";
import maaxLogo from "@/assets/cyryx-maax-visual.png.asset.json";
import { useCopyVariant } from "@/lib/copy-variant";
import { getCopy } from "@/copy";
import { trackCta } from "@/lib/track-cta";

const PILLARS: { title: string; body: string }[] = [
  { title: "Turn goals into structured missions", body: "Objectives resolve into stages, dependencies, evidence, and delivery outcomes." },
  { title: "Maintain persistent project memory", body: "Context that compounds across a project's life — not reset every session." },
  { title: "Map project context through an Atlas-style layer", body: "Structural retrieval built for precision, not volume." },
  { title: "Activate specialized operator cells and command units", body: "Reusable execution units for product, architecture, runtime, QA, security, and release work." },
  { title: "Validate output through Command Gates", body: "Quality, security, architecture, and cost gates before changes land. Default-fail." },
  { title: "Track mission activity through ledgers and decision memory", body: "An auditable record of agent activity: actions, rationale, authority, cost." },
  { title: "Keep humans in command of consequential delivery", body: "Autonomy is granted, bounded, and revocable — never assumed." },
];

function ProductPreview() {
  return (
    <GlassPanel glow className="overflow-hidden p-2 sm:p-3" data-macbook-figure>
      <picture>
        <source
          type="image/webp"
          srcSet={`${maaxDevices480Webp} 480w, ${maaxDevices800Webp} 800w, ${maaxDevices1200Webp} 1200w`}
          sizes="(min-width: 1024px) 560px, (min-width: 640px) 90vw, 100vw"
        />
        <img
          src={maaxDevices}
          srcSet={`${maaxDevices480Jpg} 480w, ${maaxDevices800Jpg} 800w, ${maaxDevices1200Jpg} 1200w`}
          sizes="(min-width: 1024px) 560px, (min-width: 640px) 90vw, 100vw"
          alt="MAAX Studio agentic IDE shown on an external monitor and MacBook side by side"
          width={1200}
          height={896}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full rounded-md object-contain"
        />
      </picture>
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
            The agentic execution OS for AI-native builders.
            </h2>
            <p className="mt-6 max-w-xl text-[15px] sm:text-base leading-relaxed text-[var(--silver-dim)]">
            MAAX Studio is Cyryx Labs' flagship product — a local-first
            agentic software execution environment for founders, agencies,
            and product teams building with AI. Not a prompt wrapper. Not a
            coding sidebar. Not a plugin. A runtime-first system for
            coordinating software work through missions, memory, operators,
            gates, and human-governed delivery.
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