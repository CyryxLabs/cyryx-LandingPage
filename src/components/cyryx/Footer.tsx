import { Link } from "@tanstack/react-router";
import { CyryxLockup } from "./primitives/CyryxMark";
import { PRIMARY_NAVIGATION, PRIMARY_NAVIGATION_CTA, type NavigationItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type FooterItem = NavigationItem & {
  external?: boolean;
  mailto?: boolean;
};

function isInternal(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}

function FooterLink({ item, className }: { item: FooterItem; className?: string }) {
  const external = item.external;
  const mailto = item.mailto || item.href.startsWith("mailto:");

  if (mailto || external) {
    return (
      <a
        href={item.href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={cn(
          "text-sm sm:text-sm text-[var(--silver-dim)] hover:text-[var(--accent-glow)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)] rounded-sm whitespace-normal break-words",

          className,
        )}
      >
        {item.label}
      </a>
    );
  }

  return (
    <Link
      to={item.href}
      className={cn(
        "text-sm sm:text-sm text-[var(--silver-dim)] hover:text-[var(--accent-glow)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)] rounded-sm whitespace-normal break-words",
        className,
      )}
      activeOptions={{ exact: true }}
    >
      {item.label}
    </Link>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  // Social links preserved as external
  const SOCIAL: FooterItem[] = [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/cyryx-labs", external: true },
    { label: "X", href: "https://x.com/cyryxlabs", external: true },
    { label: "GitHub", href: "https://github.com/cyryxlabs", external: true },
  ];

  // Legal row items
  const LEGAL: FooterItem[] = [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Press", href: "mailto:press@cyryxlabs.com" },
    { label: "Security", href: "mailto:security@cyryxlabs.com?subject=Security%20inquiry" },
  ];

  return (
    <footer
      role="contentinfo"
      className="relative border-t border-[color-mix(in_oklab,var(--accent-glow)_18%,transparent)] bg-[var(--graphite)]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pt-14 pb-[max(env(safe-area-inset-bottom),2.5rem)] lg:pt-20 lg:pb-14 overflow-hidden">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2.8fr)]">
          {/* Brand area */}
          <div className="flex flex-col items-start">
            <CyryxLockup className="h-14" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[var(--silver-dim)]">
              The execution layer for enterprise AI. Advisory, engineering, products, research, and
              optional operations for controlled execution.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center">
              <Link
                to={PRIMARY_NAVIGATION_CTA.href}
                className="cx-btn cx-liquid-glass inline-flex items-center gap-2 h-11 px-5 rounded-md text-[var(--silver)] text-sm font-medium tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)]"
              >
                {PRIMARY_NAVIGATION_CTA.label}
                <span aria-hidden className="text-[var(--accent-glow)] text-lg">
                  →
                </span>
              </Link>
            </div>

            <div className="mt-10">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--silver)] font-semibold opacity-50">
                Follow
              </div>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                {SOCIAL.map((s) => (
                  <li key={s.label}>
                    <FooterLink item={s} />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sitemap columns */}
          <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-4 min-[400px]:grid-cols-2 gap-x-1">
            {PRIMARY_NAVIGATION.map((group) => (
              <nav key={group.id} aria-label={group.label}>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--silver)] font-semibold opacity-50">
                  {group.label}
                </div>
                <ul className="mt-6 space-y-4">
                  {group.children.map((item) => (
                    <li key={item.label}>
                      <FooterLink item={item} />
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-20 flex flex-col gap-6 border-t border-[color-mix(in_oklab,var(--silver)_8%,transparent)] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs tracking-wide text-[var(--silver-dim)] font-medium">
            &copy; {year} Cyryx Labs. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {LEGAL.map((item) => (
              <li key={item.label}>
                <FooterLink item={item} className="text-xs" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
