import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { FOUNDER } from "@/data/team";
import { trackCta } from "@/lib/track-cta";

type ProofItem = {
  label: string;
  value: string;
  href: string;
  external?: boolean;
};

/**
 * One row of proof directly under the hero. Every item links to something a
 * visitor can check for themselves today.
 */
const ITEMS: readonly ProofItem[] = [
  {
    label: "Published research",
    value: "Cyryx Governance Protocol v1 · DOI 10.5281/zenodo.21045760",
    href: "/research/cgp-v1",
  },
  {
    label: "Method, in the open",
    value: "How an engagement runs, step by step",
    href: "/engagement-model",
  },
  {
    label: "Technical answers",
    value: "Explainers on governed AI execution",
    href: "/answers",
  },
  {
    label: "Code",
    value: "github.com/CyryxLabs",
    href: "https://github.com/CyryxLabs",
    external: true,
  },
];

export function ProofStrip() {
  const items: ProofItem[] = FOUNDER
    ? [{ label: "Founder-led", value: `${FOUNDER.name}, ${FOUNDER.role}`, href: "#team" }, ...ITEMS]
    : [...ITEMS];

  return (
    <section
      aria-label="What you can verify today"
      className="border-y border-[color-mix(in_oklab,var(--silver)_12%,transparent)] bg-[var(--obsidian)]"
    >
      <ul
        className={`mx-auto grid max-w-7xl gap-px bg-[color-mix(in_oklab,var(--silver)_10%,transparent)] sm:grid-cols-2 ${
          items.length === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4"
        }`}
      >
        {items.map((item) => {
          const content = (
            <>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent-glow)]">
                {item.label}
              </span>
              <span className="mt-2 flex items-start justify-between gap-3 text-sm leading-snug text-[var(--silver)]">
                <span>{item.value}</span>
                <ArrowUpRight
                  className="mt-0.5 h-4 w-4 shrink-0 text-[var(--steel)] transition-colors group-hover:text-[var(--accent-glow)]"
                  aria-hidden
                />
              </span>
            </>
          );
          const className =
            "group flex h-full flex-col bg-[var(--obsidian)] px-5 py-5 transition-colors hover:bg-[var(--graphite)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent-glow)] sm:px-6";
          const onClick = () =>
            trackCta({ cta: "proof_link", section: "proof_strip", href: item.href });
          return (
            <li key={item.label} className="cx-spotlight bg-[var(--obsidian)]">
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                  onClick={onClick}
                >
                  {content}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : item.href.startsWith("#") ? (
                <a href={item.href} className={className} onClick={onClick}>
                  {content}
                </a>
              ) : (
                <Link to={item.href} className={className} onClick={onClick}>
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
