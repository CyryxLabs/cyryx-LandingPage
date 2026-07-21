import { Linkedin, Github, ArrowUpRight } from "lucide-react";
import { CyryxMark } from "./primitives/CyryxMark";
import { HudLabel } from "./primitives/HudLabel";
import { productNavigation, solutionNavigation } from "./navigation";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { label: "Solutions", href: "/solutions" },
      { label: "Products", href: "/products" },
      { label: "How we work", href: "/how-we-work" },
      { label: "Research", href: "/research" },
      { label: "Company", href: "/company" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Solutions",
    links: solutionNavigation,
  },
  {
    title: "Products",
    links: productNavigation,
  },
];

export function Footer() {
  return (
    <footer className="cx-brand-chrome relative border-t border-white/10 bg-[var(--onyx)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pt-12 pb-[max(env(safe-area-inset-bottom),3rem)] lg:py-20">
        <div className="cx-stagger grid gap-12 lg:grid-cols-[1fr_2.5fr]">
          {/* Brand */}
          <div className="cx-stagger-item">
            <CyryxMark size={72} />
            <p className="mt-5 text-sm leading-relaxed text-[var(--silver-dim)] max-w-xs">
              An AI lab and systems company for organizations moving from strategy to controlled
              execution.
            </p>
            <p className="mt-6 font-display text-sm tracking-[0.32em] uppercase text-[var(--silver-dim)]">
              Advise. Build. Operate.
            </p>
            <p className="mt-8 text-xs text-[var(--silver-dim)]">
              &copy; 2026 Cyryx Labs. All rights reserved.
            </p>
          </div>

          {/* Link columns */}
          <div className="cx-stagger-item grid grid-cols-2 gap-8 md:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <HudLabel>{col.title}</HudLabel>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="text-sm text-[var(--silver-dim)] hover:text-[var(--accent-glow)] transition-colors"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[color-mix(in_oklab,var(--silver)_8%,transparent)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <span className="hud-label text-[var(--silver-dim)]">
              Cyryx Labs — The execution layer for enterprise AI.
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a
              href="/privacy"
              className="hud-label text-[var(--silver-dim)] hover:text-[var(--silver)] transition"
            >
              Privacy
            </a>
            <a
              href="mailto:contact@cyryxlabs.com"
              className="inline-flex items-center gap-2 hud-label text-[var(--silver-dim)] hover:text-[var(--silver)] transition"
            >
              Email <ArrowUpRight size={13} />
            </a>
            <a
              href="https://www.linkedin.com/company/cyryx-labs"
              aria-label="Cyryx Labs on LinkedIn"
              className="text-[var(--silver-dim)] hover:text-[var(--silver)]"
            >
              <Linkedin size={17} />
            </a>
            <a
              href="https://github.com/cyryxlabs"
              aria-label="Cyryx Labs on GitHub"
              className="text-[var(--silver-dim)] hover:text-[var(--silver)]"
            >
              <Github size={17} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
