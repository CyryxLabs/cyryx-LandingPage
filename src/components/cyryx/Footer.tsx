import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUp, ArrowUpRight, Github, MessageSquare } from "lucide-react";
import { CyryxLockup } from "./primitives/CyryxMark";
import { PRIMARY_NAVIGATION, PRIMARY_NAVIGATION_CTA, type NavigationItem } from "@/lib/navigation";
import { trackCta } from "@/lib/track-cta";
import { isAssistantEnabled, openAssistant } from "@/lib/assistant-client";
import { cn } from "@/lib/utils";

type FooterItem = NavigationItem & {
  external?: boolean;
};

const LINK_CLASS =
  "cx-footer-link text-sm text-[var(--silver-dim)] transition-colors hover:text-[var(--silver)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)] rounded-sm";

function FooterLink({ item, className }: { item: FooterItem; className?: string }) {
  if (item.external || item.href.startsWith("mailto:")) {
    return (
      <a
        href={item.href}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noopener noreferrer" : undefined}
        className={cn(LINK_CLASS, className)}
      >
        {item.label}
        {item.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
      </a>
    );
  }

  return (
    <Link to={item.href} className={cn(LINK_CLASS, className)} activeOptions={{ exact: true }}>
      {item.label}
    </Link>
  );
}

function XMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const CONTACT: FooterItem[] = [
  { label: "contact@cyryxlabs.com", href: "mailto:contact@cyryxlabs.com" },
  {
    label: "security@cyryxlabs.com",
    href: "mailto:security@cyryxlabs.com?subject=Security%20inquiry",
  },
  { label: "press@cyryxlabs.com", href: "mailto:press@cyryxlabs.com" },
];

const LEGAL: FooterItem[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export function Footer() {
  const year = new Date().getFullYear();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  // The homepage ends with its own start section, and /start and /brief are
  // the destination of the band's button, so it would only point back at them.
  const showCtaBand = !["/", "/start", "/brief"].some(
    (path) => pathname === path || (path !== "/" && pathname.startsWith(`${path}/`)),
  );
  const startHref = PRIMARY_NAVIGATION_CTA.href;
  const assistantEnabled = isAssistantEnabled();

  const scrollTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    document.getElementById("main-content")?.focus({ preventScroll: true });
  };

  return (
    <footer role="contentinfo" className="cx-footer relative overflow-hidden">
      <span aria-hidden className="cx-sweep-line absolute inset-x-0 top-0 block h-px" />
      <div aria-hidden className="cx-footer-glow" />

      <div className="relative mx-auto max-w-7xl px-5 pb-[max(env(safe-area-inset-bottom),6rem)] pt-16 sm:px-8 lg:px-10 lg:pb-10 lg:pt-24">
        {showCtaBand ? (
          <div className="cx-spotlight cx-footer-cta grid gap-8 rounded-2xl border p-7 sm:p-10 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:p-12">
            <div>
              <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--accent-glow)]">
                Start here
              </p>
              <p className="mt-4 max-w-[22ch] font-display text-3xl font-semibold leading-[1.05] tracking-[-0.04em] text-[var(--silver)] sm:text-4xl lg:text-5xl">
                Have a workflow AI should run under control?
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <a
                href={startHref}
                className="cx-btn-primary"
                onClick={() =>
                  trackCta({ cta: "start_project", section: "footer", href: startHref })
                }
              >
                {PRIMARY_NAVIGATION_CTA.label}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
              {assistantEnabled ? (
                <button
                  type="button"
                  className="cx-btn-secondary"
                  onClick={() => openAssistant("footer")}
                >
                  <MessageSquare className="h-4 w-4" aria-hidden />
                  Ask the assistant
                </button>
              ) : (
                <a href="mailto:contact@cyryxlabs.com" className="cx-btn-secondary">
                  Email us
                </a>
              )}
            </div>
          </div>
        ) : null}

        <div
          className={cn(
            "grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] lg:gap-20",
            showCtaBand ? "mt-16 lg:mt-24" : "",
          )}
        >
          <div className="flex flex-col items-start">
            <CyryxLockup className="h-14" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-[var(--silver-dim)]">
              We design, build and run AI systems that act inside your workflows, with clear
              permissions, human approval and a record of every decision.
            </p>
            {showCtaBand ? null : (
              <a
                href={startHref}
                className="cx-btn-primary cx-btn-sm mt-8"
                onClick={() =>
                  trackCta({ cta: "start_project", section: "footer", href: startHref })
                }
              >
                {PRIMARY_NAVIGATION_CTA.label}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            )}
            <ul className="mt-8 flex gap-3" aria-label="Cyryx Labs on social media">
              <li>
                <a
                  href="https://x.com/cyryxlabs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cx-footer-social"
                  aria-label="Cyryx Labs on X (opens in a new tab)"
                >
                  <XMark className="h-4 w-4" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/CyryxLabs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cx-footer-social"
                  aria-label="Cyryx Labs on GitHub (opens in a new tab)"
                >
                  <Github className="h-4 w-4" aria-hidden />
                </a>
              </li>
            </ul>
            <div className="mt-10">
              <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--steel)]">
                Contact
              </p>
              <ul className="mt-4 space-y-2.5">
                {CONTACT.map((item) => (
                  <li key={item.label}>
                    <FooterLink item={item} />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4">
            {PRIMARY_NAVIGATION.map((group) => (
              <nav key={group.id} aria-label={group.label}>
                <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--steel)]">
                  {group.label}
                </p>
                <ul className="mt-5 space-y-3.5">
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

        <div className="mt-16 flex flex-col gap-5 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between lg:mt-24">
          <p className="text-xs tracking-wide text-[var(--silver-dim)]">
            &copy; {year} Cyryx Labs. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {LEGAL.map((item) => (
                <li key={item.label}>
                  <FooterLink item={item} className="text-xs" />
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={scrollTop}
              className="inline-flex min-h-11 items-center gap-2 font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--silver-dim)] transition-colors hover:text-[var(--accent-glow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)]"
            >
              Top of page <ArrowUp className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
