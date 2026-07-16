import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import {
  buildBreadcrumbJsonLd,
  buildHead,
} from "@/components/cyryx/seo/seo";
import { START_PROJECT_HREF } from "@/lib/cta";

const PATH = "/company";
const TITLE = "Company — Cyryx Labs";
const DESC = "Cyryx Labs is an AI technology company building products, execution systems, and applied research. Most AI produces output; Cyryx builds systems that verify outcomes.";

export const Route = createFileRoute("/company")({
  head: () =>
    buildHead(
      { title: TITLE, description: DESC, path: PATH },
      [
        buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Company", path: PATH },
        ]),
      ],
    ),
  component: CompanyPage,
});

function CompanyPage() {
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-12 pt-32 pb-24 lg:pt-44">
        <HudLabel withDot className="text-[var(--accent-glow)]">About Cyryx Labs</HudLabel>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-[-0.02em] text-silver-gradient">
          An AI technology company. Not an AI agency.
        </h1>
        <p className="mt-6 text-base lg:text-lg leading-relaxed text-[var(--silver-dim)]">
          Cyryx Labs builds AI products, AI execution systems, and applied AI research. We are not a chatbot shop, a prompt-engineering service, or a generic AI agency. Our core thesis is direct: most AI produces output; Cyryx builds systems that verify outcomes.
        </p>

        <Section heading="What we do">
          <p>
            We design and ship software. The work happens across five core units that share one architecture and one operating model:
          </p>
          <ul className="mt-4 space-y-4 text-base leading-relaxed text-[var(--silver-dim)]">
            <li>
              <strong className="text-[var(--silver)]">Operational AI</strong> — our enterprise operational intelligence and execution platform. In development.
            </li>
            <li>
              <strong className="text-[var(--silver)]"><Link to="/products/maax-studio" className="hover:text-[var(--accent-glow)]">MAAX Studio</Link></strong> — a local-first agentic software execution environment for AI-native builders.
            </li>
            <li>
              <strong className="text-[var(--silver)]"><Link to="/products/lyra" className="hover:text-[var(--accent-glow)]">Lyra</Link></strong> — our local-first agentic model: governed, local-first, and the sovereign engine of MAAX Studio.
            </li>
            <li>
              <strong className="text-[var(--silver)]"><Link to="/solutions" className="hover:text-[var(--accent-glow)]">Cyryx Solutions</Link></strong> — our commercial implementation layer. Custom AI systems built on the same governance primitives as our products.
            </li>
            <li>
              <strong className="text-[var(--silver)]"><Link to="/research" className="hover:text-[var(--accent-glow)]">Applied Research</Link></strong> — our engineering and research discipline. Protocols and evaluations published openly via the Applied AI Lab.
            </li>
          </ul>
        </Section>

        <Section heading="How we operate">
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-[var(--silver-dim)] marker:text-[var(--accent-glow)]">
            <li>Senior engineering, opinionated architecture, small teams.</li>
            <li>Missions before workflows: we write the goal and acceptance criteria first.</li>
            <li>Governance as architecture, not as a guardrail prompt.</li>
            <li>Operability handoff is part of the engagement — your team owns the system after we ship.</li>
          </ul>
        </Section>

        <Section heading="What we do not do">
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-[var(--silver-dim)] marker:text-[var(--accent-glow)]">
            <li>Generic chatbots without grounding, gates, or measurable outcomes.</li>
            <li>Demoware that ships great and breaks under real load.</li>
            <li>Prompt-engineering retainers without execution architecture.</li>
            <li>Hype-driven claims about AI capability or business impact.</li>
          </ul>
        </Section>

        <Section heading="Talk to us">
          <p>
            If you are operationalizing AI inside a real business — and you want execution systems that you can audit, evolve, and trust — start a conversation.
          </p>
          <div className="mt-6">
            <a
              href={START_PROJECT_HREF}
              className="cx-btn cx-liquid-glass inline-flex items-center gap-2 h-11 px-5 rounded-md text-[var(--silver)] hud-label"
            >
              Start a project
              <span aria-hidden className="text-[var(--accent-glow)]">→</span>
            </a>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[var(--silver)]">
        {heading}
      </h2>
      <div className="mt-4 text-base leading-relaxed text-[var(--silver-dim)]">{children}</div>
    </section>
  );
}