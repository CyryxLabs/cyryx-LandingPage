import { CyryxWordmark } from "./primitives/CyryxMark";

const NAV: { label: string; href: string }[] = [
  { label: "About", href: "/company" },
  { label: "Solutions", href: "/solutions" },
  { label: "MAAX Studio", href: "#maax" },
  { label: "Lab", href: "/research" },
  { label: "Contact", href: "#contact" },
];

const LEGAL: { label: string; href: string }[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-[color-mix(in_oklab,var(--accent-glow)_18%,transparent)] bg-[var(--graphite)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pt-12 pb-[max(env(safe-area-inset-bottom),3rem)] lg:pt-16 lg:pb-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md">
            <CyryxWordmark className="h-9" />
            <p className="mt-5 text-sm leading-relaxed text-[var(--silver-dim)]">
              Cyryx Labs — AI products and execution systems for the agentic era.
            </p>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
            <nav aria-label="Site" className="flex flex-wrap gap-x-6 gap-y-3">
              {NAV.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="hud-label text-[var(--silver-dim)] hover:text-[var(--accent-glow)] transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-3">
              {LEGAL.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="hud-label text-[var(--silver-dim)] hover:text-[var(--silver)] transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-10 border-t border-[color-mix(in_oklab,var(--silver)_8%,transparent)] pt-6">
          <p className="hud-label text-[var(--silver-dim)]">
            &copy; 2026 Cyryx Labs
          </p>
        </div>
      </div>
    </footer>
  );
}