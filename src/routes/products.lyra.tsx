import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { ArrowRight } from "lucide-react";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildHead,
} from "@/components/cyryx/seo/seo";
import { CONTACT_EMAIL, START_PROJECT_HREF } from "@/lib/cta";
import { trackCta } from "@/lib/track-cta";
import lyraOgAsset from "@/assets/lyra-og-1200x630.jpg.asset.json";

const PATH = "/products/lyra";
const TITLE = "Lyra — Governed AI Model for Enterprise | Cyryx Labs";
const DESC =
  "Lyra is Cyryx Labs' proprietary AI model — governed, local-first, and honest about evidence. Built to execute real work under human command.";
const LYRA_OG_IMAGE = `https://cyryxlabs.com${lyraOgAsset.url}`;
const LYRA_EMAIL = `${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Lyra enterprise early access",
)}`;
const LYRA_MAILTO = `mailto:${LYRA_EMAIL}`;
const CANONICAL_URL = `https://cyryxlabs.com${PATH}`;

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

const FAQS = [
  {
    q: "What is Lyra?",
    a: "Lyra is Cyryx Labs' proprietary AI model, purpose-built to execute real work inside a system of command gates, evidence, and human authority. Its identity, safety doctrine, and operating conduct are trained into the model itself — not layered as prompts that can be stripped away.",
  },
  {
    q: "How is Lyra different from a frontier chat model?",
    a: "Frontier chat models are optimized to answer. Lyra is optimized to execute under governance: it declines unverified claims, refuses to fabricate citations or tools, and stays within approved scope by default. It is designed to operate as the sovereign engine of MAAX Studio, not as a general-purpose assistant.",
  },
  {
    q: "Where does Lyra run — cloud, on-prem, or local?",
    a: "Lyra is local-first. It is built to run inside your environment so that your code, your data, and your work stay on your machine or infrastructure by default. Enterprise deployments can be scoped to on-prem or private-cloud environments as part of an engagement.",
  },
  {
    q: "How does Lyra handle sensitive data and intellectual property?",
    a: "Because Lyra runs locally in your environment, prompts, code, and outputs do not leave your perimeter unless you explicitly route them out. Combined with MAAX Studio's command gates and mission ledgers, every action is scoped, logged, and attributable to a human authority.",
  },
  {
    q: "How is Lyra evaluated and versioned?",
    a: "Every Lyra release passes a dual-pass evaluation — behavior is measured with and without operating instructions — and is only promoted after a human reviews the raw results. Releases are versioned and auditable, so enterprise teams can pin, review, and roll back the exact model powering their workflows.",
  },
  {
    q: "How can my organization get access today?",
    a: "Lyra is in active development and available today through enterprise early access with MAAX Studio. Request access to be briefed on the current capability envelope, deployment options, and governance controls, or start a project to have Cyryx design and deliver a governed system built on the Lyra stack.",
  },
];

export const Route = createFileRoute("/products/lyra")({
  head: () =>
    buildHead(
      { title: TITLE, description: DESC, path: PATH, ogType: "product", image: LYRA_OG_IMAGE },
      [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
        { name: "Lyra", path: PATH },
      ]),
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "Lyra",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Cross-platform",
        url: CANONICAL_URL,
        description: DESC,
        softwareVersion: "early-access",
        image: LYRA_OG_IMAGE,
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/PreOrder",
          price: "0",
          priceCurrency: "USD",
          category: "Enterprise early access",
        },
        provider: {
          "@type": "Organization",
          name: "Cyryx Labs",
          url: "https://cyryxlabs.com",
        },
      },
      buildFaqJsonLd(FAQS),
      ],
    ),
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
              href={LYRA_MAILTO}
              onClick={() =>
                trackCta({
                  cta: "lyra_early_access",
                  section: "lyra_hero",
                  href: LYRA_MAILTO,
                })
              }
              className="cx-btn cx-liquid-glass inline-flex items-center gap-2 h-11 px-5 rounded-md text-[var(--silver)] hud-label"
            >
              Request enterprise early access
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

        <section
          id="faq"
          className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pb-16"
          aria-labelledby="lyra-faq-heading"
        >
          <HudLabel className="text-[var(--accent-glow)]">FAQ</HudLabel>
          <h2
            id="lyra-faq-heading"
            className="mt-4 max-w-2xl font-display text-2xl sm:text-3xl font-semibold tracking-[-0.01em] text-[var(--silver)]"
          >
            Enterprise questions, answered.
          </h2>
          <dl className="mt-8 grid gap-4 md:grid-cols-2">
            {FAQS.map((item) => (
              <div key={item.q} className="glass-panel rounded-md p-6">
                <dt className="font-display text-lg font-semibold tracking-tight text-[var(--silver)]">
                  {item.q}
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={LYRA_MAILTO}
              onClick={() =>
                trackCta({
                  cta: "lyra_early_access",
                  section: "lyra_faq",
                  href: LYRA_MAILTO,
                })
              }
              className="inline-flex h-11 items-center gap-2 rounded-md bg-[var(--accent-glow)] px-5 hud-label text-[var(--onyx)] font-semibold shadow-[var(--shadow-glow-teal)] hover:brightness-110 transition"
            >
              Request enterprise early access
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <Link
              to={START_PROJECT_HREF}
              onClick={() =>
                trackCta({
                  cta: "start_project",
                  section: "lyra_faq",
                  href: START_PROJECT_HREF,
                })
              }
              className="cx-btn cx-liquid-glass inline-flex items-center gap-2 h-11 px-5 rounded-md text-[var(--silver)] hud-label"
            >
              Start a project
              <ArrowRight className="h-3.5 w-3.5 text-[var(--accent-glow)]" />
            </Link>
          </div>
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
              href={LYRA_MAILTO}
              onClick={() =>
                trackCta({
                  cta: "lyra_early_access",
                  section: "lyra_access",
                  href: LYRA_MAILTO,
                })
              }
              className="inline-flex h-11 items-center gap-2 rounded-md bg-[var(--accent-glow)] px-5 hud-label text-[var(--onyx)] font-semibold shadow-[var(--shadow-glow-teal)] hover:brightness-110 transition"
            >
              Request enterprise early access
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <Link
              to={START_PROJECT_HREF}
              onClick={() =>
                trackCta({
                  cta: "start_project",
                  section: "lyra_access",
                  href: START_PROJECT_HREF,
                })
              }
              className="cx-btn cx-liquid-glass inline-flex items-center gap-2 h-11 px-5 rounded-md text-[var(--silver)] hud-label"
            >
              Start a project
              <ArrowRight className="h-3.5 w-3.5 text-[var(--accent-glow)]" />
            </Link>
            <Link
              to="/products/maax-studio"
              className="inline-flex items-center gap-2 hud-label text-[var(--silver-dim)] hover:text-[var(--accent-glow)] transition-colors px-3 h-11"
            >
              See MAAX Studio
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}