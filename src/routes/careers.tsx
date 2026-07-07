import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { ArrowRight } from "lucide-react";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";
import { CONTACT_EMAIL } from "@/lib/cta";

const PATH = "/careers";
const TITLE = "Careers — Build the Agentic Era at Cyryx Labs";
const DESC =
  "Join Cyryx Labs to build governed AI execution systems. Open roles across applied research, product engineering, and agentic runtime.";
const CAREERS_EMAIL = "careers@cyryxlabs.com";

const ROLES = [
  {
    title: "Founding Applied AI Engineer",
    location: "Remote · Global",
    type: "Full-time",
    summary:
      "Design and ship agentic runtimes: mission execution, command gates, evaluators. Strong Python/TypeScript and LLM systems experience.",
  },
  {
    title: "Senior Product Engineer (MAAX Studio)",
    location: "Remote · Global",
    type: "Full-time",
    summary:
      "Own end-to-end features of MAAX Studio. Deep React/TypeScript, thoughtful about UX for high-stakes tooling.",
  },
  {
    title: "AI Research Engineer — Lyra",
    location: "Remote · Global",
    type: "Full-time",
    summary:
      "Contribute to the training and evaluation stack behind Lyra, our proprietary model line. Background in ML research, RL, or post-training.",
  },
  {
    title: "Solutions Architect",
    location: "Remote · Americas / EMEA",
    type: "Full-time",
    summary:
      "Partner with enterprise customers to design governed AI systems on top of MAAX. Consulting mindset, strong technical breadth.",
  },
];

function applyHref(role: string) {
  return `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(
    `Application — ${role}`,
  )}&body=${encodeURIComponent(
    [
      "Hi Cyryx team,",
      "",
      `I'd like to apply for the ${role} role.`,
      "",
      "• Name:",
      "• Location / time zone:",
      "• LinkedIn / GitHub / portfolio:",
      "• Short intro (why Cyryx, relevant experience):",
      "",
      "Resume attached.",
      "",
      "Thanks,",
    ].join("\n"),
  )}`;
}

export const Route = createFileRoute("/careers")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Careers", path: PATH },
      ]),
    ]),
  component: CareersPage,
});

function CareersPage() {
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content" className="relative">
        <section className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pt-32 pb-16 lg:pt-44">
          <nav aria-label="Breadcrumb" className="text-xs text-[var(--silver-dim)]">
            <Link to="/" className="hover:text-[var(--accent-glow)]">Home</Link>
            <span className="mx-2 opacity-60">/</span>
            <span className="text-[var(--silver)]">Careers</span>
          </nav>
          <HudLabel withDot className="mt-6 text-[var(--accent-glow)]">
            Cyryx Labs · Careers
          </HudLabel>
          <h1 className="mt-4 max-w-3xl font-display text-[40px] sm:text-6xl lg:text-7xl font-semibold leading-[1.02] tracking-[-0.02em] text-silver-gradient">
            Build the agentic era with us.
          </h1>
          <p className="mt-6 max-w-2xl text-base lg:text-lg leading-relaxed text-[var(--silver-dim)]">
            We are a small, senior team shipping governed AI execution systems for
            production. Remote-first, high-agency, engineering-led.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent("General application")}`}
              className="cx-btn cx-liquid-glass inline-flex items-center gap-2 h-11 px-5 rounded-md text-[var(--silver)] hud-label"
            >
              General application
              <ArrowRight className="h-3.5 w-3.5 text-[var(--accent-glow)]" />
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Careers inquiry")}`}
              className="inline-flex items-center gap-2 hud-label text-[var(--silver-dim)] hover:text-[var(--accent-glow)] transition-colors px-3 h-11"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pb-24 lg:pb-32">
          <HudLabel className="text-[var(--accent-glow)]">Open roles</HudLabel>
          <ul className="mt-6 grid gap-4">
            {ROLES.map((r) => (
              <li
                key={r.title}
                className="glass-panel flex flex-col gap-4 rounded-md p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8"
              >
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[var(--silver)]">
                    {r.title}
                  </h2>
                  <p className="mt-2 text-sm text-[var(--silver-dim)]">{r.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.14em] text-[var(--silver-dim)]">
                    <span className="rounded-sm border border-[color-mix(in_oklab,var(--silver)_18%,transparent)] px-2 py-1">
                      {r.location}
                    </span>
                    <span className="rounded-sm border border-[color-mix(in_oklab,var(--silver)_18%,transparent)] px-2 py-1">
                      {r.type}
                    </span>
                  </div>
                </div>
                <a
                  href={applyHref(r.title)}
                  className="inline-flex items-center gap-2 hud-label text-[var(--accent-glow)] hover:opacity-80 transition-opacity"
                >
                  Apply
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-12 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_25%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_60%,transparent)] p-8 backdrop-blur-sm">
            <HudLabel withDot>Don't see your role?</HudLabel>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--silver-dim)]">
              We hire for exceptional engineers, researchers, and operators outside
              posted roles. Email us with what you'd want to build.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent("Open application")}`}
                className="cx-btn cx-liquid-glass inline-flex items-center gap-2 h-11 px-5 rounded-md text-[var(--silver)] hud-label"
              >
                Write to {CAREERS_EMAIL}
                <ArrowRight className="h-3.5 w-3.5 text-[var(--accent-glow)]" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}