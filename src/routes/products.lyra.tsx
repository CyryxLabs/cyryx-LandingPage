import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudGrid } from "@/components/cyryx/primitives/HudGrid";
import { ArrowRight } from "lucide-react";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildHead,
} from "@/components/cyryx/seo/seo";
import { CONTACT_EMAIL, START_PROJECT_HREF } from "@/lib/cta";
import { trackCta } from "@/lib/track-cta";
import lyraOgAsset from "@/assets/lyra-og-1200x630.jpg.asset.json";
import lyraMarkAsset from "@/assets/lyra-mark.png.asset.json";

const PATH = "/products/lyra";
const TITLE = "Lyra — Private AI Intelligence | Cyryx Labs";
const DESC =
  "Lyra is Cyryx Labs' private, model-agnostic intelligence and execution runtime. Built to execute real work under human command.";
const LYRA_OG_IMAGE = `https://cyryxlabs.com${lyraOgAsset.url}`;
const LYRA_MARK_URL = lyraMarkAsset.url;
const LYRA_EMAIL = `${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Lyra enterprise early access",
)}`;
const LYRA_MAILTO = `mailto:${LYRA_EMAIL}`;
const CANONICAL_URL = `https://cyryxlabs.com${PATH}`;

const PILLARS = [
  {
    name: "Private, model-agnostic",
    copy:
      "Lyra's rules of conduct live in the model, not in a prompt. It declines unverified claims, protects data by default, and stays within approved scope.",
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
    a: "Lyra is Cyryx Labs' local-first agentic model, purpose-built to execute real work inside a system of command gates, evidence, and human authority. Its identity, safety doctrine, and operating conduct are trained into the model itself — not layered as prompts that can be stripped away.",
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
  head: () => {
    const head = buildHead(
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
    );
    return {
      ...head,
      links: [
        ...(head.links ?? []),
        {
          rel: "preload",
          as: "image",
          href: LYRA_MARK_URL,
          fetchpriority: "high",
        },
      ],
    };
  },
  component: LyraPage,
});

function LyraPage() {
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content" className="relative">
        <HudGrid />
        <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8 lg:px-12 pt-28 sm:pt-32 lg:pt-40 pb-24">
          {/* Breadcrumb / HUD */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-3 sm:gap-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--silver-dim)]"
          >
            <span className="text-[var(--accent-glow)]">[01]</span>
            <Link to="/" className="hover:text-[var(--silver)] transition-colors">
              Home
            </Link>
            <span className="opacity-40">/</span>
            <Link to="/products" className="hover:text-[var(--silver)] transition-colors">
              Products
            </Link>
            <span className="opacity-40">/</span>
            <span className="text-[var(--silver)]">Lyra</span>
          </nav>

          {/* Hero — asymmetric split */}
          <section className="relative mt-12 sm:mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 -left-24 h-[520px] w-[520px] rounded-full bg-[var(--accent-glow)] opacity-[0.06] blur-3xl"
            />
            <div className="relative lg:col-span-7 order-2 lg:order-1">
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--accent-glow)]">
                <span className="h-px w-6 sm:w-8 bg-[var(--accent-glow)]" />
                Lyra · REV_0.1 · In Development
              </div>
              <h1 className="mt-6 sm:mt-8 font-display text-[clamp(2.25rem,7vw,4.5rem)] font-light leading-[1.02] tracking-[-0.03em] text-[var(--silver)]">
                The sovereign engine of{" "}
                <span className="font-semibold text-silver-gradient">Operational AI</span>.
              </h1>
              <p className="mt-6 sm:mt-8 max-w-[52ch] text-[15px] sm:text-base lg:text-lg text-[var(--silver-dim)] leading-relaxed">
                Cyryx Labs' proprietary model — built to execute real work under
                human command. Local, sovereign, and honest about what it knows.
              </p>
            </div>
            <div className="relative lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative aspect-square w-40 sm:w-52 lg:w-[320px] xl:w-[360px]">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 m-auto rounded-full bg-[var(--accent-glow)] opacity-[0.10] blur-3xl"
                />
                <img
                  src={LYRA_MARK_URL}
                  alt="Lyra — Native Intelligence Layer"
                  width={720}
                  height={720}
                  fetchPriority="high"
                  decoding="async"
                  loading="eager"
                  className="relative h-full w-full object-contain select-none [mix-blend-mode:screen]"
                  draggable={false}
                />
                <div className="mt-4 text-center font-mono text-[9px] uppercase tracking-[0.4em] text-[var(--silver-dim)]">
                  Native Intelligence Layer
                </div>
              </div>
            </div>

            <div className="relative lg:col-span-12 order-3 border-t border-[color-mix(in_oklab,var(--silver)_10%,transparent)] pt-8 sm:pt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-16">
              <p className="lg:col-span-8 max-w-[68ch] text-sm sm:text-[15px] text-[var(--silver-dim)] leading-relaxed">
                Most AI models are built to answer. Lyra is built to execute —
                inside a system of gates, evidence, and human command. Its
                identity, safety doctrine, and operating conduct are trained
                into the model itself, not applied as instructions that can be
                stripped away. Lyra is the proprietary model at the core of
                our enterprise operational intelligence and execution platform and MAAX Studio.
              </p>
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-stretch">
              <a
                href={LYRA_MAILTO}
                onClick={() =>
                  trackCta({
                    cta: "lyra_early_access",
                    section: "lyra_hero",
                    href: LYRA_MAILTO,
                  })
                }
                  className="inline-flex flex-1 items-center justify-center gap-2 px-6 h-12 bg-[var(--accent-glow)] text-[var(--onyx)] font-mono font-bold uppercase tracking-[0.2em] text-[11px] shadow-[var(--shadow-glow-teal)] hover:brightness-110 transition"
              >
                Request Early Access
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <Link
                to="/products/maax-studio"
                  className="inline-flex flex-1 items-center justify-center gap-2 px-6 h-12 border border-[color-mix(in_oklab,var(--silver)_18%,transparent)] text-[var(--silver)] font-mono font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-[color-mix(in_oklab,var(--silver)_6%,transparent)] transition-colors"
              >
                See MAAX Studio
              </Link>
            </div>
            </div>
          </section>

          {/* Pillars — hairline grid */}
          <section className="mt-24 sm:mt-28 lg:mt-36">
            <div className="mb-10 flex items-center gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--accent-glow)]">
                § Pillars
              </span>
              <div className="flex-1 h-px bg-[color-mix(in_oklab,var(--silver)_12%,transparent)]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[color-mix(in_oklab,var(--silver)_12%,transparent)] border border-[color-mix(in_oklab,var(--silver)_12%,transparent)]">
              {PILLARS.map((p, i) => (
                <article
                  key={p.name}
                  className="bg-[var(--onyx)] p-7 sm:p-8 lg:p-10 flex flex-col gap-5 hover:bg-[color-mix(in_oklab,var(--graphite)_60%,var(--onyx))] transition-colors"
                >
                  <div className="font-mono text-[10px] tracking-[0.2em] text-[var(--accent-glow)]">
                    {String(i + 1).padStart(2, "0")} // {p.name.split(" ")[0].toUpperCase()}
                  </div>
                  <h2 className="font-display text-lg lg:text-xl font-semibold tracking-tight text-[var(--silver)] leading-snug">
                    {p.name}
                  </h2>
                  <p className="text-[13.5px] leading-relaxed text-[var(--silver-dim)]">
                    {p.copy}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* Lyra × MAAX band */}
          <section className="relative mt-24 sm:mt-28 lg:mt-36 h-56 sm:h-64 lg:h-72 flex items-center justify-center overflow-hidden border-y border-[color-mix(in_oklab,var(--silver)_12%,transparent)]">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--onyx)] via-[var(--graphite)] to-[var(--onyx)] opacity-70" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 md:gap-10 px-6 text-center">
              <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--silver)]">
                LYRA
              </div>
              <div className="h-px w-12 md:w-24 bg-[var(--accent-glow)]" />
              <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-light tracking-[0.25em] uppercase text-[color-mix(in_oklab,var(--silver)_55%,transparent)]">
                MAAX STUDIO
              </div>
            </div>
            <div className="hidden sm:block absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[0.4em] text-[var(--silver-dim)] uppercase whitespace-nowrap">
              One command layer · Sovereign engine · Engine-agnostic runtime
            </div>
          </section>
          <div className="mt-8 sm:mt-10 mx-auto max-w-[62ch] text-center">
            <p className="text-sm sm:text-[15px] leading-relaxed text-[var(--silver-dim)]">
              Lyra is the sovereign engine of our enterprise operational intelligence and execution platform and MAAX Studio — 
              the governed agentic IDE. our enterprise operational intelligence and execution platform is engine-agnostic by design: 
              Lyra provides local, governed, zero-marginal-cost execution, 
              and frontier models can be attached when a mission demands 
              maximum capability.
            </p>
          </div>

          {/* FAQ — editorial 2-col */}
          <section
            id="faq"
            className="mt-24 sm:mt-28 lg:mt-36 mx-auto max-w-5xl"
            aria-labelledby="lyra-faq-heading"
          >
            <div className="mb-10 sm:mb-12 flex items-center gap-4">
              <span
                id="lyra-faq-heading"
                className="font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--accent-glow)]"
              >
                § Common Inquiries
              </span>
              <div className="flex-1 h-px bg-[color-mix(in_oklab,var(--silver)_12%,transparent)]" />
            </div>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-10 sm:gap-y-12">
              {FAQS.map((item, i) => (
                <div key={item.q} className="space-y-3 border-t border-[color-mix(in_oklab,var(--silver)_10%,transparent)] pt-5 sm:pt-6">
                  <div className="font-mono text-[10px] tracking-[0.25em] text-[var(--accent-glow)]">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <dt className="font-display text-base sm:text-lg font-bold uppercase tracking-wide text-[var(--silver)]">
                    {item.q}
                  </dt>
                  <dd className="text-sm leading-relaxed text-[var(--silver-dim)] max-w-[62ch]">
                    {item.a}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Access — monumental */}
          <section className="mt-24 sm:mt-28 lg:mt-36 border-t border-[color-mix(in_oklab,var(--silver)_12%,transparent)] pt-20 sm:pt-24 pb-24 sm:pb-32 text-center">
            <div className="mb-6 font-mono text-[10px] uppercase tracking-[0.4em] text-[var(--accent-glow)]">
              § Secure Authorization Required
            </div>
            <h2 className="font-display text-[clamp(2.75rem,10vw,7rem)] font-bold tracking-[-0.04em] leading-none text-silver-gradient">
              GET ACCESS
            </h2>
            <p className="mt-6 sm:mt-8 mx-auto max-w-[58ch] text-sm sm:text-[15px] leading-relaxed text-[var(--silver-dim)]">
              Lyra is in active development, available today through early
              access with MAAX Studio and our enterprise operational intelligence and execution platform. Direct access to Lyra may
              open as the model matures.
            </p>
            <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={LYRA_MAILTO}
                onClick={() =>
                  trackCta({
                    cta: "lyra_early_access",
                    section: "lyra_access",
                    href: LYRA_MAILTO,
                  })
                }
                className="group relative inline-flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-[var(--accent-glow)] blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative inline-flex items-center gap-2 px-12 h-14 border border-[var(--accent-glow)] text-[var(--accent-glow)] font-mono font-bold uppercase tracking-[0.3em] text-[11px] hover:bg-[var(--accent-glow)] hover:text-[var(--onyx)] transition-all duration-300">
                  Request Early Access
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
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
                className="inline-flex items-center justify-center gap-2 px-10 h-14 border border-[color-mix(in_oklab,var(--silver)_18%,transparent)] text-[var(--silver)] font-mono font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-[color-mix(in_oklab,var(--silver)_6%,transparent)] transition-colors"
              >
                Start a Project
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}