import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildHead,
  buildServiceJsonLd,
} from "@/components/cyryx/seo/seo";
import { START_PROJECT_HREF } from "@/lib/cta";
import { Check } from "lucide-react";

const PATH = "/solutions/digital-web-systems";
const TITLE = "Digital & Web Systems — Cyryx Labs";
const DESC =
  "Conversion-ready websites and connected digital systems for businesses that need to be found, understood, and contacted — engineered to add CRM, automation, and AI when the operation is ready.";

type Pkg = {
  name: string;
  price: string;
  audience: string;
  bullets: string[];
};

const PACKAGES: Pkg[] = [
  {
    name: "48-Hour Website Launch",
    price: "Starting at $1,500",
    audience: "Small service businesses requiring a credible one-page digital presence.",
    bullets: [
      "One responsive page on a defined template system",
      "Services, trust, service area, contact, and CTA",
      "Contact form and click-to-call",
      "Domain connection and basic analytics",
      "Basic technical SEO",
      "One consolidated revision round",
    ],
  },
  {
    name: "Local Service Growth Website",
    price: "Standard engagement $3,500",
    audience: "Local and professional service businesses building for search and conversion.",
    bullets: [
      "Up to five responsive pages",
      "Service and service-area structure",
      "Quote or contact capture, click-to-call",
      "Basic on-page search setup",
      "Analytics and conversion events",
      "Two consolidated revision rounds, launch and handover",
    ],
  },
  {
    name: "Conversion Website + CRM",
    price: "Starting at $7,500",
    audience: "Growing businesses that need lead capture connected to a governed pipeline.",
    bullets: [
      "Conversion website with segmented forms",
      "Basic CRM pipeline with internal notifications",
      "Lead routing and confirmation workflow",
      "Basic reporting",
      "30-day operational review",
    ],
  },
  {
    name: "Business Web Platform",
    price: "Starting at $15,000",
    audience: "Established companies needing a scalable owned platform.",
    bullets: [
      "Paid discovery and information architecture",
      "Design system and CMS",
      "Agreed integrations",
      "Analytics, training, launch, and handover",
    ],
  },
];

const EXCLUSIONS = [
  "Guaranteed traffic, ranking, leads, or revenue",
  "Unlimited pages or unlimited revisions",
  "Ongoing SEO unless separately contracted",
  "Paid media",
  "Unlicensed content",
  "Complex application development unless separately scoped",
  "Third-party platform and usage costs",
];

const ACCEPTANCE = [
  "Pages match approved wireframes and copy.",
  "Forms deliver to the confirmed inbox and CRM (when included).",
  "Analytics and conversion events fire correctly on staging and production.",
  "Core Web Vitals meet the thresholds documented in the scope.",
  "Accessibility conforms to the WCAG 2.2 AA checkpoints listed in the scope.",
  "Access, credentials, and ownership are transferred and recorded.",
];

const FAQ = [
  {
    q: "Will you guarantee traffic or ranking?",
    a: "No. We build the digital foundation required to be found and to convert. Traffic and ranking are downstream of published content, links, paid media, and market conditions we don't control. Ongoing SEO is a separate, contracted engagement.",
  },
  {
    q: "Do I own everything at the end?",
    a: "Yes. Domain, hosting, CMS accounts, analytics, source code, design files, and content are transferred to your ownership. We document access and roles at handover.",
  },
  {
    q: "Can we add CRM, automation, or AI later?",
    a: "Yes. Every Cyryx website is architected so that forms, CRM, automations, and AI can be added later without a rebuild. See Workflow Automation and Applied AI Systems for the next steps.",
  },
  {
    q: "What is not included?",
    a: "See the exclusions section on this page. Anything outside the written scope is a change order — priced and approved before work begins.",
  },
  {
    q: "What is website care?",
    a: "Defined operational coverage starting at $149 per month: security updates, uptime monitoring, small content updates within an agreed monthly time budget, and quarterly review. Exclusions are listed in the care agreement.",
  },
];

export const Route = createFileRoute("/solutions/digital-web-systems")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Solutions", path: "/solutions" },
        { name: "Digital & Web Systems", path: PATH },
      ]),
      buildServiceJsonLd({
        name: "Digital & Web Systems",
        serviceType: "Website design and engineering",
        description: DESC,
        path: PATH,
      }),
      buildFaqJsonLd(FAQ),
    ]),
  component: DigitalWebSystemsPage,
});

function DigitalWebSystemsPage() {
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content" className="relative">
        <section className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pt-32 pb-16 lg:pt-44">
          <nav aria-label="Breadcrumb" className="text-xs text-[var(--silver-dim)]">
            <Link to="/" className="hover:text-[var(--accent-glow)]">Home</Link>
            <span className="mx-2 opacity-60">/</span>
            <Link to="/solutions" className="hover:text-[var(--accent-glow)]">Solutions</Link>
            <span className="mx-2 opacity-60">/</span>
            <span className="text-[var(--silver)]">Digital & Web Systems</span>
          </nav>
          <HudLabel withDot className="mt-6 text-[var(--accent-glow)]">Digital & Web Systems</HudLabel>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-[-0.02em] text-silver-gradient">
            Digital infrastructure your customers can trust.
          </h1>
          <p className="mt-6 max-w-2xl text-base lg:text-lg leading-relaxed text-[var(--silver-dim)]">
            Cyryx builds conversion-ready websites and connected digital systems for businesses that need to be found, understood, and contacted — with the architecture required to add CRM, workflow automation, and AI when the operation is ready.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={START_PROJECT_HREF} className="cx-btn cx-liquid-glass inline-flex items-center gap-2 h-11 px-5 rounded-md text-[var(--silver)] hud-label">
              Request a website assessment
              <span aria-hidden className="text-[var(--accent-glow)]">→</span>
            </a>
            <Link to="/engagement-model" className="inline-flex items-center h-11 px-3 hud-label text-[var(--silver-dim)] hover:text-[var(--accent-glow)]">
              View engagement model
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pb-16">
          <h2 className="font-display text-2xl font-semibold text-[var(--silver)]">The digital foundation problem</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--silver-dim)]">
            Most operating businesses run on a website that no longer represents them, a CRM that no one owns, forms that don't route, and analytics no one reads. Before automation or AI can add value, the digital foundation has to be credible, measured, and yours.
          </p>
        </section>

        <section className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pb-16">
          <h2 className="font-display text-2xl font-semibold text-[var(--silver)]">Who this is for</h2>
          <ul className="mt-4 grid gap-2 text-base leading-relaxed text-[var(--silver-dim)] sm:grid-cols-2">
            <li>· Local and professional service businesses.</li>
            <li>· Growing companies replacing outdated sites.</li>
            <li>· Teams that need CRM and lead routing on top of a real website.</li>
            <li>· Organizations planning to add automation or AI to their operations.</li>
          </ul>
        </section>

        <section className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pb-16">
          <h2 className="font-display text-2xl font-semibold text-[var(--silver)]">Packages</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {PACKAGES.map((p) => (
              <article key={p.name} className="glass-panel rounded-md p-6">
                <div className="hud-label text-[var(--accent-glow)]">{p.price}</div>
                <h3 className="mt-2 font-display text-lg font-semibold text-[var(--silver)]">{p.name}</h3>
                <p className="mt-2 text-sm text-[var(--silver-dim)]">{p.audience}</p>
                <ul className="mt-4 space-y-2 text-sm text-[var(--silver-dim)]">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-glow)]" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm text-[var(--silver-dim)]">
            Website care: defined coverage starting at $149 per month. Custom scope available.
          </p>
        </section>

        <section className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pb-16">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-semibold text-[var(--silver)]">Acceptance criteria</h2>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--silver-dim)]">
                {ACCEPTANCE.map((a) => (
                  <li key={a} className="flex gap-2"><span aria-hidden className="text-[var(--accent-glow)]">·</span><span>{a}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold text-[var(--silver)]">Not included</h2>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--silver-dim)]">
                {EXCLUSIONS.map((e) => (
                  <li key={e} className="flex gap-2"><span aria-hidden className="text-[var(--silver-dim)]">×</span><span>{e}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pb-16">
          <h2 className="font-display text-2xl font-semibold text-[var(--silver)]">Expansion path</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--silver-dim)]">
            A Cyryx website is designed to grow. When the operation is ready, expand into{" "}
            <Link to="/solutions/workflow-automation" className="text-[var(--accent-glow)] hover:underline">Workflow Automation</Link>,{" "}
            <a href="/solutions/applied-ai-systems" className="text-[var(--accent-glow)] hover:underline">Applied AI Systems</a>, and{" "}
            <Link to="/managed-operations" className="text-[var(--accent-glow)] hover:underline">Managed Operations</Link>{" "}
            without a rebuild.
          </p>
        </section>

        <section className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pb-16">
          <h2 className="font-display text-2xl font-semibold text-[var(--silver)]">FAQ</h2>
          <div className="mt-4 divide-y divide-[color-mix(in_oklab,var(--silver)_10%,transparent)] rounded-md border border-[color-mix(in_oklab,var(--silver)_10%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_40%,transparent)]">
            {FAQ.map((f, i) => (
              <details key={f.q} className="group p-5" open={i === 0}>
                <summary className="cursor-pointer list-none rounded-sm text-sm font-medium text-[var(--silver)] hover:text-[var(--accent-glow)]">
                  <span className="mr-2 text-[var(--accent-glow)]">Q.</span>
                  {f.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pb-24">
          <div className="flex flex-wrap gap-3">
            <a href={START_PROJECT_HREF} className="cx-btn cx-liquid-glass inline-flex items-center gap-2 h-11 px-5 rounded-md text-[var(--silver)] hud-label">
              Request a website assessment
              <span aria-hidden className="text-[var(--accent-glow)]">→</span>
            </a>
            <Link to="/solutions" className="inline-flex items-center h-11 px-3 hud-label text-[var(--silver-dim)] hover:text-[var(--accent-glow)]">
              Back to solutions
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}