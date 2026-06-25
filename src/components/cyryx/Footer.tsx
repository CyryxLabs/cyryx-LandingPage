import { Linkedin, Twitter, Youtube, Github, ArrowRight } from "lucide-react";
import { CyryxWordmark } from "./primitives/CyryxMark";
import { HudLabel } from "./primitives/HudLabel";

const COLUMNS = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/company" },
      { label: "Products", href: "/products" },
      { label: "Solutions", href: "/solutions" },
      { label: "Applied AI Lab", href: "/research" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "MAAX Studio", href: "/products/maax-studio" },
      { label: "Applied AI Lab", href: "/research" },
      { label: "Solutions", href: "/solutions" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Research", href: "/research" },
      { label: "Documentation", href: "#" },
      { label: "Brand", href: "#" },
      { label: "Early Access", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-[color-mix(in_oklab,var(--accent-glow)_18%,transparent)] bg-[var(--graphite)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-14 lg:py-20">
        <div className="cx-stagger grid gap-10 lg:grid-cols-[1.3fr_2.2fr_1.5fr]">
          {/* Brand */}
          <div className="cx-stagger-item">
            <CyryxWordmark className="h-10" />
            <p className="mt-5 text-sm leading-relaxed text-[var(--silver-dim)] max-w-xs">
              AI products and execution systems for the agentic era.
            </p>
            <p className="mt-6 font-display text-sm tracking-[0.32em] uppercase text-[var(--silver-dim)]">
              Intelligence <span className="text-[var(--accent-glow)]">·</span> Execution <span className="text-[var(--accent-glow)]">·</span> Command
            </p>
            <p className="mt-8 text-xs text-[var(--silver-dim)]">
              &copy; 2026 Cyryx Labs. All rights reserved.
            </p>
          </div>

          {/* Link columns */}
          <div className="cx-stagger-item grid grid-cols-1 sm:grid-cols-3 gap-8">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <HudLabel>{col.title}</HudLabel>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="text-sm text-[var(--silver-dim)] hover:text-[var(--accent-glow)] transition-colors">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="cx-stagger-item">
            <HudLabel>Stay Connected</HudLabel>
            <p className="mt-4 text-sm text-[var(--silver-dim)]">
              Get updates on our latest systems, research, and launches.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-5 flex items-stretch gap-0 rounded-md border border-[color-mix(in_oklab,var(--silver)_14%,transparent)] focus-within:border-[var(--accent-glow)] focus-within:shadow-[var(--shadow-glow-teal)] transition-all"
            >
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="Enter your email"
                className="flex-1 min-w-0 bg-transparent px-4 py-3 text-sm text-[var(--silver)] placeholder:text-[var(--silver-dim)] outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="grid w-12 place-items-center bg-[color-mix(in_oklab,var(--accent-glow)_14%,transparent)] hover:bg-[var(--accent-glow)] hover:text-[var(--onyx)] text-[var(--accent-glow)] transition"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-6 flex items-center gap-2">
              {[
                { Icon: Linkedin, label: "LinkedIn" },
                { Icon: Twitter, label: "X" },
                { Icon: Youtube, label: "YouTube" },
                { Icon: Github, label: "GitHub" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid h-11 w-11 place-items-center rounded-md border border-[color-mix(in_oklab,var(--silver)_12%,transparent)] text-[var(--silver-dim)] hover:text-[var(--accent-glow)] hover:border-[var(--accent-glow)] transition"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-[color-mix(in_oklab,var(--silver)_8%,transparent)] pt-6">
          <div className="flex items-center gap-4">
            <span className="hud-label text-[var(--silver-dim)]">
              Cyryx Labs — AI products and governed execution systems for the agentic era
            </span>
            <span className="inline-flex items-center gap-1.5 hud-label text-[var(--accent-glow)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-glow)] shadow-[0_0_8px_var(--accent-glow)] animate-pulse" />
              SYS_STATUS: OPTIMAL
            </span>
          </div>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Security"].map((l) => (
              <a key={l} href="#" className="hud-label text-[var(--silver-dim)] hover:text-[var(--silver)] transition">
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}