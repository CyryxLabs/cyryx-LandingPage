import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { ArrowRight } from "lucide-react";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";
import { CONTACT_EMAIL } from "@/lib/cta";

const PATH = "/careers";
const TITLE = "Careers — Cyryx Labs Talent Network";
const DESC =
  "Cyryx Labs is not actively hiring right now. Join our talent network to hear first when we open roles across applied research, product engineering, and agentic runtime.";
const CAREERS_EMAIL = "careers@cyryxlabs.com";
const TALENT_NETWORK_MAILTO = `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(
  "Talent network — introduction",
)}&body=${encodeURIComponent(
  [
    "Hi Cyryx team,",
    "",
    "I'd like to join your talent network for future roles.",
    "",
    "• Name:",
    "• Location / time zone:",
    "• Area of interest (applied AI, product engineering, research, solutions):",
    "• LinkedIn / GitHub / portfolio:",
    "• Short intro:",
    "",
    "Thanks,",
  ].join("\n"),
)}`;

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
            Cyryx Labs · Careers · Talent network
          </HudLabel>
          <h1 className="mt-4 max-w-3xl font-display text-[40px] sm:text-6xl lg:text-7xl font-semibold leading-[1.02] tracking-[-0.02em] text-silver-gradient">
            Build the agentic era with us.
          </h1>
          <p className="mt-6 max-w-2xl text-base lg:text-lg leading-relaxed text-[var(--silver-dim)]">
            We are a small, senior team shipping governed AI execution systems
            for production. Remote-first, high-agency, engineering-led.
          </p>
        </section>

        <section className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pb-24 lg:pb-32">
          <HudLabel className="text-[var(--accent-glow)]">Open roles</HudLabel>
          <div className="mt-6 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_25%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_60%,transparent)] p-8 backdrop-blur-sm">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--silver)]">
              No open roles right now.
            </h2>
            <p className="mt-3 max-w-2xl text-sm lg:text-base leading-relaxed text-[var(--silver-dim)]">
              Cyryx Labs is not actively hiring at the moment. New positions
              across applied AI, product engineering, research, and solutions
              will open as the team grows.
            </p>
            <p className="mt-3 max-w-2xl text-sm lg:text-base leading-relaxed text-[var(--silver-dim)]">
              Join our talent network and we&apos;ll reach out first when a
              relevant role opens.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={TALENT_NETWORK_MAILTO}
                className="cx-btn cx-liquid-glass inline-flex items-center gap-2 h-11 px-5 rounded-md text-[var(--silver)] hud-label"
              >
                Join the talent network
                <ArrowRight className="h-3.5 w-3.5 text-[var(--accent-glow)]" />
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Careers inquiry")}`}
                className="inline-flex items-center gap-2 hud-label text-[var(--silver-dim)] hover:text-[var(--accent-glow)] transition-colors px-3 h-11"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}