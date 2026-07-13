import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildHead } from "@/components/cyryx/seo/seo";
import { useCyryxScrollAnimations } from "@/hooks/useCyryxScrollAnimations";
import { trackCta } from "@/lib/track-cta";
import lyraGlyph from "@/assets/lyra-glyph-480.webp";
import lyraIcon from "@/assets/lyra-icon-512.webp";

const PATH = "/lyra";
const TITLE = "Lyra — Cyryx Labs' Governed AI Model";
const DESC =
  "Most AI models are built to answer. Lyra is built to execute — inside a system of gates, evidence, and human command. Cyryx Labs' proprietary governed model.";
const OG_IMAGE = "https://cyryxlabs.com/lyra-og.jpg";

const EARLY_ACCESS_HREF = "/#contact";

const PILLARS = [
  {
    title: "Governed by design",
    body: "Lyra's rules of conduct live in the model, not in a prompt. It declines unverified claims, protects data by default, and stays inside approved scope — because that is what it was trained to do.",
  },
  {
    title: "Local-first sovereignty",
    body: "Lyra is built to run on your hardware inside MAAX Studio. Your code, your data, and your missions stay on your machine by default.",
  },
  {
    title: "Verifiable by discipline",
    body: "Every Lyra release passes a dual-pass governance evaluation — identity, safety, and operational conduct probed with and without system instructions — and is promoted only after human review of raw outputs. Versioned lineage, every time.",
  },
  {
    title: "English-first, natively bilingual",
    body: "English by default, automatic mirroring of your language. Governance behavior is verified in English and Portuguese today, with verified expansion driven by demand.",
  },
];

const BUILD_STEPS = [
  {
    n: "01",
    title: "Curated proprietary data",
    body: "Every training example is authored and human-reviewed by Cyryx Labs. No scraped identity, no unreviewed behavior.",
  },
  {
    n: "02",
    title: "Staged training",
    body: "Identity and safety are anchored first, operational conduct layered on top. Behavior goes into weights; volatile facts stay in governed context, where they can be updated without retraining.",
  },
  {
    n: "03",
    title: "Gated evaluation",
    body: "A two-pass probe battery interrogates the model with no system prompt at all: what Lyra is, is what Lyra answers.",
  },
  {
    n: "04",
    title: "Human promotion",
    body: "No checkpoint becomes a Lyra version until a human reads the raw evaluation transcripts and signs the promotion record.",
  },
];

const SPECS: { k: string; v: string }[] = [
  { k: "Version", v: "Lyra 1.0" },
  { k: "Type", v: "Proprietary governed language model" },
  { k: "Modality", v: "Text" },
  { k: "Default language", v: "English (automatic language mirroring)" },
  { k: "Governance-verified languages", v: "English, Portuguese" },
  { k: "Deployment", v: "Local-first inside MAAX Studio (quantized builds)" },
  { k: "Evaluation", v: "Dual-pass governance battery, human-gated promotion" },
  { k: "Availability", v: "Early access with MAAX Studio" },
];

const FAQ = [
  {
    q: "Is Lyra available as a standalone API?",
    a: "Not today. Lyra ships inside MAAX Studio, where its governance model is enforced end to end. Standalone access is on the roadmap for enterprise deployments.",
  },
  {
    q: "What makes Lyra different from general-purpose models?",
    a: "Purpose and governance. General models optimize for answering anything; Lyra is trained for governed execution — scoped missions, verified claims, human command — and its conduct is evaluated release by release.",
  },
  {
    q: "Does my data leave my machine?",
    a: "Lyra runs locally inside MAAX Studio by default. Data leaves your machine only when you explicitly attach an external engine or tool to a mission.",
  },
  {
    q: "How is Lyra evaluated?",
    a: "Every release runs a dual-pass probe battery — with and without system instructions — covering identity, safety, honesty, and operational conduct. Raw transcripts are reviewed by a human before any version is promoted.",
  },
];

export const Route = createFileRoute("/lyra")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH, image: OG_IMAGE }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Lyra", path: PATH },
      ]),
      buildFaqJsonLd(FAQ),
    ]),
  component: LyraPage,
});

function EarlyAccessCta({
  cta,
  className,
}: {
  cta: "lyra_hero_cta" | "lyra_footer_cta";
  className?: string;
}) {
  return (
    <a
      href={EARLY_ACCESS_HREF}
      onClick={() => trackCta({ cta, section: "lyra", href: EARLY_ACCESS_HREF })}
      className={
        className ??
        "inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[var(--accent-glow)] px-7 hud-label font-semibold text-[var(--onyx)] shadow-[var(--shadow-glow-teal)] transition hover:brightness-110"
      }
    >
      Request early access
      <ArrowRight className="h-4 w-4" aria-hidden />
    </a>
  );
}

function LyraPage() {
  useCyryxScrollAnimations();
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content" className="relative">
        {/* ── 1 · HERO ─────────────────────────────────────────── */}
        <section className="relative isolate overflow-hidden pt-32 pb-24 lg:pt-44 lg:pb-32">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{ background: "var(--gradient-radial-teal)" }}
          />
          {/* Teal core line */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 -z-10 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[color-mix(in_oklab,var(--accent-glow)_45%,transparent)] to-transparent"
          />
          <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
            <div className="cx-reveal flex flex-col items-center">
              <HudLabel withDot>Cyryx Labs · Model</HudLabel>
              <img
                src={lyraGlyph}
                alt=""
                width={480}
                height={498}
                fetchPriority="high"
                decoding="async"
                className="mt-10 h-auto w-[180px] sm:w-[220px] lg:w-[260px] drop-shadow-[0_0_45px_rgba(13,148,136,0.25)]"
              />
              <h1 className="mt-8 font-display text-6xl font-semibold uppercase tracking-[0.28em] text-silver-gradient sm:text-7xl lg:text-8xl">
                Lyra
              </h1>
              <p className="mt-8 max-w-2xl text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg">
                The governed AI model at the core of MAAX Studio. Trained, evaluated, and operated
                by Cyryx Labs to execute real work under human command — locally, verifiably, in
                your language.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <EarlyAccessCta cta="lyra_hero_cta" />
                <Link
                  to="/products/maax-studio"
                  onClick={() =>
                    trackCta({
                      cta: "lyra_maax_click",
                      section: "lyra",
                      href: "/products/maax-studio",
                    })
                  }
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-[color-mix(in_oklab,var(--silver)_18%,transparent)] px-7 hud-label text-[var(--silver)] transition hover:border-[var(--accent-glow)] hover:text-[var(--accent-glow)]"
                >
                  See MAAX Studio
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2 · POSITIONING ─────────────────────────────────── */}
        <section className="relative bg-[var(--graphite)] py-20 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <p className="cx-reveal border-l-2 border-[var(--accent-glow)] pl-6 text-lg leading-relaxed text-[var(--silver)] sm:pl-10 sm:text-xl lg:text-2xl lg:leading-relaxed">
              Most AI models are built to answer. Lyra is built to execute — inside a system of
              gates, evidence, and human command. It is Cyryx Labs&rsquo; proprietary governed
              model: its identity, safety doctrine, and operating behavior are trained into the
              model itself, not bolted on with instructions that can be stripped away.
            </p>
          </div>
        </section>

        {/* ── 3 · PILLARS ─────────────────────────────────────── */}
        <section className="relative py-20 sm:py-28 lg:py-40">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="cx-reveal max-w-3xl">
              <HudLabel withDot>Doctrine</HudLabel>
              <h2 className="mt-6 font-display text-4xl font-semibold uppercase leading-[1.02] tracking-tight text-silver-gradient sm:text-5xl lg:text-6xl">
                Behavior in the weights. Not in the prompt.
              </h2>
            </div>
            <div className="cx-stagger mt-14 grid gap-5 sm:mt-20 md:grid-cols-2 lg:grid-cols-4">
              {PILLARS.map((p) => (
                <article
                  key={p.title}
                  className="cx-stagger-item glass-panel rounded-md border border-[#23272B] p-7"
                >
                  <h3 className="font-display text-lg font-semibold uppercase tracking-wider text-[var(--silver)]">
                    {p.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--silver-dim)]">{p.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4 · HOW LYRA IS BUILT ───────────────────────────── */}
        <section className="relative bg-[var(--graphite)] py-20 sm:py-28 lg:py-40">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="cx-reveal max-w-3xl">
              <HudLabel withDot>How Lyra Is Built</HudLabel>
              <h2 className="mt-6 font-display text-4xl font-semibold uppercase leading-[1.02] tracking-tight text-silver-gradient sm:text-5xl lg:text-6xl">
                Four gates between a checkpoint and a version.
              </h2>
            </div>
            <ol className="cx-stagger relative mt-14 grid gap-10 sm:mt-20 lg:grid-cols-4 lg:gap-6">
              {/* Horizontal connector (desktop) */}
              <span
                aria-hidden
                className="pointer-events-none absolute left-0 right-0 top-[7px] hidden h-px bg-gradient-to-r from-transparent via-[color-mix(in_oklab,var(--accent-glow)_40%,transparent)] to-transparent lg:block"
              />
              {BUILD_STEPS.map((s) => (
                <li key={s.n} className="cx-stagger-item relative">
                  <span
                    aria-hidden
                    className="block h-3.5 w-3.5 rounded-full border border-[var(--accent-glow)] bg-[var(--graphite)] shadow-[0_0_12px_color-mix(in_oklab,var(--accent-glow)_60%,transparent)]"
                  />
                  <span className="mt-5 block hud-label text-[var(--accent-glow)]">{s.n}</span>
                  <h3 className="mt-3 font-display text-lg font-semibold uppercase tracking-wider text-[var(--silver)]">
                    {s.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">{s.body}</p>
                </li>
              ))}
            </ol>
            <p className="cx-reveal mt-16 max-w-3xl font-display text-lg text-[var(--silver)] sm:text-xl">
              This is the same governance discipline MAAX Studio enforces on every mission — applied
              first to our own model.
            </p>
          </div>
        </section>

        {/* ── 5 · LYRA × MAAX STUDIO ──────────────────────────── */}
        <section className="relative py-20 sm:py-28 lg:py-40">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-16">
              <div className="cx-reveal">
                <HudLabel withDot>Lyra × MAAX Studio</HudLabel>
                <h2 className="mt-6 font-display text-4xl font-semibold uppercase leading-[1.02] tracking-tight text-silver-gradient sm:text-5xl">
                  One command layer. Your choice of engine.
                </h2>
                <p className="mt-8 max-w-xl text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg">
                  Lyra is the sovereign engine of MAAX Studio — the governed agentic IDE. MAAX is
                  engine-agnostic by design: Lyra provides local, governed, zero-marginal-cost
                  execution, and frontier APIs can be attached when a mission demands maximum
                  capability. One command layer, your choice of engine.
                </p>
              </div>
              <Link
                to="/products/maax-studio"
                onClick={() =>
                  trackCta({
                    cta: "lyra_maax_click",
                    section: "lyra",
                    href: "/products/maax-studio",
                  })
                }
                className="cx-reveal glass-panel group flex items-center gap-6 rounded-md border border-[#23272B] p-7 transition-colors hover:border-[color-mix(in_oklab,var(--accent-glow)_45%,transparent)] sm:p-9"
              >
                <img
                  src={lyraIcon}
                  alt=""
                  width={512}
                  height={512}
                  loading="lazy"
                  decoding="async"
                  className="h-20 w-20 shrink-0 rounded-xl sm:h-24 sm:w-24"
                />
                <span>
                  <span className="block font-display text-xl font-semibold uppercase tracking-wider text-[var(--silver)]">
                    Explore MAAX Studio
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-[var(--silver-dim)]">
                    The governed agentic IDE, powered by Lyra.
                  </span>
                  <span className="mt-4 inline-flex items-center gap-2 hud-label text-[var(--accent-glow)] transition-all group-hover:gap-3">
                    Explore <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── 6 · SPECS ───────────────────────────────────────── */}
        <section className="relative bg-[var(--graphite)] py-20 sm:py-28 lg:py-40">
          <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-10">
            <div className="cx-reveal">
              <HudLabel withDot>Specifications</HudLabel>
              <h2 className="mt-6 font-display text-4xl font-semibold uppercase leading-[1.02] tracking-tight text-silver-gradient sm:text-5xl">
                Lyra 1.0
              </h2>
            </div>
            <dl className="cx-reveal mt-14 overflow-hidden rounded-md border border-[#23272B] sm:mt-16">
              {SPECS.map((row, i) => (
                <div
                  key={row.k}
                  className={`grid gap-2 px-6 py-5 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] sm:gap-8 ${
                    i > 0 ? "border-t border-[#23272B]" : ""
                  }`}
                >
                  <dt className="hud-label self-center text-[var(--silver-dim)]">{row.k}</dt>
                  <dd className="text-[15px] leading-relaxed text-[var(--silver)]">{row.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── 7 · FAQ ─────────────────────────────────────────── */}
        <section className="relative py-20 sm:py-28 lg:py-40">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <div className="cx-reveal">
              <HudLabel withDot>FAQ</HudLabel>
              <h2 className="mt-6 font-display text-4xl font-semibold uppercase leading-[1.02] tracking-tight text-silver-gradient sm:text-5xl">
                Direct answers.
              </h2>
            </div>
            <Accordion
              type="single"
              collapsible
              className="cx-reveal mt-12"
              onValueChange={(value) => {
                if (value) trackCta({ cta: "lyra_faq_open", section: "lyra", href: `#${value}` });
              }}
            >
              {FAQ.map((item, i) => (
                <AccordionItem key={item.q} value={`faq-${i}`} className="border-[#23272B]">
                  <AccordionTrigger className="py-6 text-left font-display text-base font-semibold uppercase tracking-wider text-[var(--silver)] hover:text-[var(--accent-glow)] hover:no-underline sm:text-lg">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-[15px] leading-relaxed text-[var(--silver-dim)]">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* ── 8 · CTA BAND ────────────────────────────────────── */}
        <section className="relative isolate overflow-hidden py-24 sm:py-32 lg:py-40">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{ background: "var(--gradient-radial-teal)" }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 -z-10 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[color-mix(in_oklab,var(--accent-glow)_45%,transparent)] to-transparent"
          />
          <div className="cx-reveal mx-auto max-w-3xl px-5 text-center sm:px-8">
            <h2 className="font-display text-4xl font-semibold uppercase leading-[1.02] tracking-tight text-silver-gradient sm:text-5xl lg:text-6xl">
              Command the engine.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg">
              Get early access to MAAX Studio, powered by Lyra.
            </p>
            <div className="mt-10 flex justify-center">
              <EarlyAccessCta cta="lyra_footer_cta" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
