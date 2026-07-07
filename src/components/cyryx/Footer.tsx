import { CyryxWordmark } from "./primitives/CyryxMark";
import { CONTACT_EMAIL, START_PROJECT_HREF } from "@/lib/cta";

type Item = { label: string; href: string; badge?: string; external?: boolean };
type Column = { title: string; items: Item[] };

// Enterprise-style IA modeled on Stripe / Vercel / Anthropic footers:
// Products · Solutions · Resources · Company · Legal + brand column
// with contact + social. Links to pages that don't exist yet route to
// mailto so the CTA still succeeds; those move to real routes (and
// eventually to product subdomains like maax.cyryxlabs.com,
// lyra.cyryxlabs.com, docs.cyryxlabs.com) as they ship.
const COLUMNS: Column[] = [
  {
    title: "Products",
    items: [
      { label: "MAAX Studio", href: "/products/maax-studio", badge: "Early access" },
      { label: "Lyra", href: "/products/lyra", badge: "Coming soon" },
      { label: "All products", href: "/products" },
    ],
  },
  {
    title: "Solutions",
    items: [
      { label: "AI product development", href: "/solutions/custom-ai-product-development" },
      { label: "Workflow automation", href: "/solutions/workflow-automation" },
      { label: "Internal AI assistants", href: "/solutions/internal-ai-assistants" },
      { label: "AI integrations", href: "/solutions/ai-integrations" },
      { label: "Governance & cost control", href: "/solutions/ai-governance-cost-control" },
      { label: "AI websites & lead systems", href: "/solutions/ai-websites-lead-systems" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Applied AI Lab", href: "/research" },
      { label: "Answers", href: "/answers" },
      { label: "Docs", href: `mailto:${CONTACT_EMAIL}?subject=Docs%20access`, badge: "Soon" },
      { label: "Support", href: `mailto:${CONTACT_EMAIL}?subject=Support%20request` },
      { label: "Status", href: `mailto:${CONTACT_EMAIL}?subject=Status%20page` },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", href: "/company" },
      { label: "Careers", href: "/careers", badge: "Talent network" },
      { label: "Contact", href: `mailto:${CONTACT_EMAIL}` },
      { label: "Press", href: `mailto:press@cyryxlabs.com` },
    ],
  },
];

const LEGAL: Item[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Security", href: `mailto:security@cyryxlabs.com?subject=Security%20inquiry` },
  { label: "Responsible AI", href: `mailto:${CONTACT_EMAIL}?subject=Responsible%20AI%20policy` },
];

const SOCIAL: Item[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/cyryx-labs", external: true },
  { label: "X", href: "https://x.com/cyryxlabs", external: true },
  { label: "GitHub", href: "https://github.com/cyryxlabs", external: true },
];

function isInternal(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}

function LinkItem({ item }: { item: Item }) {
  const external = item.external || (!isInternal(item.href) && !item.href.startsWith("mailto:"));
  return (
    <a
      href={item.href}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      className="group inline-flex items-center gap-2 text-sm text-[var(--silver-dim)] hover:text-[var(--accent-glow)] transition-colors"
    >
      <span>{item.label}</span>
      {item.badge && (
        <span className="rounded-sm border border-[color-mix(in_oklab,var(--accent-glow)_35%,transparent)] px-1.5 py-0.5 text-[10px] uppercase tracking-[0.14em] text-[var(--accent-glow)]">
          {item.badge}
        </span>
      )}
    </a>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      role="contentinfo"
      className="relative border-t border-[color-mix(in_oklab,var(--accent-glow)_18%,transparent)] bg-[var(--graphite)]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pt-14 pb-[max(env(safe-area-inset-bottom),2.5rem)] lg:pt-20 lg:pb-14">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,2.4fr)]">
          {/* Brand + contact block */}
          <div>
            <CyryxWordmark className="h-9" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[var(--silver-dim)]">
              AI products and execution systems for the agentic era. Governed,
              auditable, built to ship.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={START_PROJECT_HREF}
                className="cx-btn cx-liquid-glass inline-flex items-center gap-2 h-10 px-4 rounded-md text-[var(--silver)] hud-label"
              >
                Start a project
                <span aria-hidden className="text-[var(--accent-glow)]">→</span>
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 h-10 px-3 hud-label text-[var(--silver-dim)] hover:text-[var(--accent-glow)] transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
            </div>

            <div className="mt-8">
              <div className="hud-label text-[var(--silver)]">Follow</div>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {SOCIAL.map((s) => (
                  <li key={s.label}>
                    <LinkItem item={s} />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sitemap columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <div className="hud-label text-[var(--silver)]">{col.title}</div>
                <ul className="mt-4 space-y-3">
                  {col.items.map((item) => (
                    <li key={item.label}>
                      <LinkItem item={item} />
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-[color-mix(in_oklab,var(--silver)_8%,transparent)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="hud-label text-[var(--silver-dim)]">
            &copy; {year} Cyryx Labs. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL.map((item) => (
              <li key={item.label}>
                <LinkItem item={item} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}