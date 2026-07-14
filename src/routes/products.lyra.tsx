import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { ArrowRight } from "lucide-react";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";
import { CONTACT_EMAIL } from "@/lib/cta";

const PATH = "/products/lyra";
const TITLE = "Lyra — The Governed AI Model at the Core of MAAX Studio";
const DESC =
  "Lyra is Cyryx Labs' proprietary model — built to execute real work under human command. Local, sovereign, and honest about what it knows. In active development.";
const LYRA_EMAIL = `${CONTACT_EMAIL}?subject=${encodeURIComponent("Lyra early access")}`;

const PILLARS = [
  {
    name: "Governed by design",
    copy:
      "Lyra's rules of conduct live in the model, not in a prompt. It declines unverified claims, protects data by default, and stays within approved scope — because that is what it was trained to do.",
  },
  {
    name: "Local-first sovereignty",
    copy:
      "Lyra is built to run in your environment. Your code, your data, and your work stay on your machine by default — not sent to someone else's servers.",
  },
  {
    name: "Honest about evidence",
    copy:
      "Lyra answers from sources it can point to. It won't invent a citation, fake a tool it doesn't have, or dress a guess as a fact. When it doesn't have grounded information, it says so.",
  },
  {
    name: "Verifiable by discipline",
    copy:
      "Every Lyra release passes a dual-pass evaluation — its behavior tested with and without instructions — and is promoted only after a human reads the raw results. Versioned, auditable, every time.",
  },
];

export const Route = createFileRoute("/products/lyra")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH, ogType: "product" }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
        { name: "Lyra", path: PATH },
      ]),
    ]),
  component: LyraPage,
});

function LyraPage() {
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content" className="relative">
        <section className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pt-32 pb-16 lg:pt-44">
          <nav aria-label="Breadcrumb" className="text-xs text-[var(--silver-dim)]">
            <Link to="/" className="hover:text-[var(--accent-glow)]">Home</Link>
            <span className="mx-2 opacity-60">/</span>
            <Link to="/products" className="hover:text-[var(--accent-glow)]">Products</Link>
            <span className="mx-2 opacity-60">/</span>
            <span className="text-[var(--silver)]">Lyra</span>
          </nav>
          <HudLabel withDot className="mt-6 text-[var(--accent-glow)]">
            Cyryx Labs · Lyra · In active development
          </HudLabel>
          <h1 className="mt-4 max-w-3xl font-display text-[40px] sm:text-6xl lg:text-7xl font-semibold leading-[1.02] tracking-[-0.02em] text-silver-gradient">
            Lyra. The governed AI model at the core of MAAX Studio.
          </h1>
          <p className="mt-6 max-w-2xl text-base lg:text-lg leading-relaxed text-[var(--silver-dim)]">
            Cyryx Labs' proprietary model — built to execute real work under
            human command. Local, sovereign, and honest about what it knows.
          </p>
          <p className="mt-4 max-w-2xl text-sm lg:text-base leading-relaxed text-[var(--silver-dim)]">
            Most AI models are built to answer. Lyra is built to execute —
            inside a system of gates, evidence, and human command. Its
            identity, safety doctrine, and operating conduct are trained into
            the model itself, not applied as instructions that can be stripped
            away. Volatile facts live in governed context, where they can
            change without retraining the model.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`mailto:${LYRA_EMAIL}`}
              className="cx-btn cx-liquid-glass inline-flex items-center gap-2 h-11 px-5 rounded-md text-[var(--silver)] hud-label"
            >
              Request early access
              <ArrowRight className="h-3.5 w-3.5 text-[var(--accent-glow)]" />
            </a>
            <Link
              to="/products/maax-studio"
              className="inline-flex items-center gap-2 hud-label text-[var(--silver-dim)] hover:text-[var(--accent-glow)] transition-colors px-3 h-11"
            >
              See MAAX Studio
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pb-16">
          <HudLabel className="text-[var(--accent-glow)]">Pillars</HudLabel>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {PILLARS.map((p) => (
              <article key={p.name} className="glass-panel rounded-md p-6">
                <h2 className="font-display text-xl font-semibold tracking-tight text-[var(--silver)]">
                  {p.name}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">
                  {p.copy}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pb-16">
          <HudLabel className="text-[var(--accent-glow)]">Lyra × MAAX Studio</HudLabel>
          <h2 className="mt-4 max-w-2xl font-display text-2xl sm:text-3xl font-semibold tracking-[-0.01em] text-[var(--silver)]">
            One command layer. Your choice of engine.
          </h2>
          <p className="mt-6 max-w-3xl text-sm lg:text-base leading-relaxed text-[var(--silver-dim)]">
            Lyra is the sovereign engine of MAAX Studio — the governed agentic
            IDE. MAAX is engine-agnostic by design: Lyra provides local,
            governed, zero-marginal-cost execution, and frontier models can be
            attached when a mission demands maximum capability.
          </p>
        </section>

        <section className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pb-24 lg:pb-32">
          <HudLabel className="text-[var(--accent-glow)]">Access</HudLabel>
          <p className="mt-4 max-w-3xl text-sm lg:text-base leading-relaxed text-[var(--silver-dim)]">
            Lyra is in active development, available today through early
            access with MAAX Studio. Direct access to Lyra may open as the
            model matures.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`mailto:${LYRA_EMAIL}`}
              className="cx-btn cx-liquid-glass inline-flex items-center gap-2 h-11 px-5 rounded-md text-[var(--silver)] hud-label"
            >
              Request early access
              <ArrowRight className="h-3.5 w-3.5 text-[var(--accent-glow)]" />
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}