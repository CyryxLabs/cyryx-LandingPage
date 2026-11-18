import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Bot,
  Box,
  Compass,
  Database,
  Globe,
  Plug,
  ShieldCheck,
  Users,
  Workflow,
} from "lucide-react";
import { SOURCES, type SourceId } from "@/data/market";
import type { Service } from "@/data/services";
import { buildStartProjectHref, type StartContextIntent, type StartContextSource } from "@/lib/cta";
import { trackCta, type CtaSection } from "@/lib/track-cta";
import { isAssistantEnabled, openAssistant } from "@/lib/assistant-client";
import { Horizon } from "./Horizon";

const ICONS = {
  compass: Compass,
  workflow: Workflow,
  bot: Bot,
  plug: Plug,
  box: Box,
  database: Database,
  shield: ShieldCheck,
  globe: Globe,
  users: Users,
  activity: Activity,
} as const;

export function ServiceIcon({ name }: { name: Service["icon"] }) {
  const Icon = ICONS[name];
  return (
    <span className="cy-icon" aria-hidden="true">
      <Icon strokeWidth={1.6} />
    </span>
  );
}

/** Splits a headline into masked lines that slide up. `auto` animates on load without JS. */
export function Lines({ lines, auto = false }: { lines: readonly ReactNode[]; auto?: boolean }) {
  return (
    <span className={auto ? "cy-lines cy-lines--auto" : "cy-lines"}>
      {lines.map((line, index) => (
        <span key={index} className="cy-line" style={{ "--cy-i": index } as React.CSSProperties}>
          <span className="cx-hero-title-line">{line}</span>{" "}
        </span>
      ))}
    </span>
  );
}

/**
 * Splits a heading into words that rise out of a blur one after another.
 * `auto` animates on load with CSS only; otherwise the motion hook reveals it.
 */
export function Words({
  text,
  auto = false,
  start = 0,
}: {
  text: string;
  auto?: boolean;
  start?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={auto ? "cy-words cy-words--auto" : "cy-words"}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          <span className="cy-word" style={{ "--cy-i": start + index } as React.CSSProperties}>
            <span>{word}</span>
          </span>
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  id,
  split = false,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
  split?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={split ? "cy-head cy-head--split" : "cy-head"}>
      <div style={{ display: "grid", gap: 18 }}>
        <p className="cy-eyebrow" data-cy-reveal>
          {eyebrow}
        </p>
        <h2 id={id} className="cy-h2">
          {typeof title === "string" ? <Words text={title} /> : title}
        </h2>
      </div>
      {lead || children ? (
        <div style={{ display: "grid", gap: 16 }} data-cy-reveal>
          {lead ? <p className="cy-lead">{lead}</p> : null}
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function SourceNote({ id, prefix = "Source:" }: { id: SourceId; prefix?: string }) {
  const source = SOURCES[id];
  const label = `${source.publisher}, ${source.title}`;
  return (
    <span className="cy-source">
      {prefix}{" "}
      {"url" in source && source.url ? (
        <a href={source.url} target="_blank" rel="noopener noreferrer">
          {label}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : (
        label
      )}
      {" · "}
      {source.detail}
    </span>
  );
}

export function StartButton({
  section,
  source,
  intent,
  label = "Discuss your project",
  variant = "primary",
  small = false,
}: {
  section: CtaSection;
  source?: StartContextSource;
  intent?: StartContextIntent;
  label?: string;
  variant?: "primary" | "ghost";
  small?: boolean;
}) {
  const href = buildStartProjectHref({ source, intent });
  return (
    <a
      href={href}
      data-cta={variant === "primary" ? "primary" : "secondary"}
      className={`cy-btn cy-btn--${variant}${small ? " cy-btn--sm" : ""}`}
      onClick={() => trackCta({ cta: "start_project", section, href })}
    >
      {label}
      <ArrowRight aria-hidden="true" />
    </a>
  );
}

export function AskAssistant({
  source,
  label = "Ask the assistant a question",
}: {
  source: "hero" | "final_cta" | "contact" | "start" | "footer";
  label?: string;
}) {
  if (!isAssistantEnabled()) return null;
  return (
    <button type="button" className="cy-link" onClick={() => openAssistant(source)}>
      {label} <span aria-hidden="true">→</span>
    </button>
  );
}

export function Faq({
  items,
  idPrefix = "faq",
}: {
  items: readonly { q: string; a: string }[];
  idPrefix?: string;
}) {
  return (
    <div className="cy-faq" data-cy-reveal>
      {items.map((item, index) => (
        <details key={item.q} name={idPrefix} open={index === 0}>
          <summary>
            <h3 style={{ font: "inherit", letterSpacing: "inherit", color: "inherit" }}>
              {item.q}
            </h3>
          </summary>
          <div>
            <p>{item.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

export function Crumbs({ items }: { items: readonly { name: string; path?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="cy-crumbs">
        {items.map((item) => (
          <li key={item.name}>
            {item.path ? (
              <Link to={item.path}>{item.name}</Link>
            ) : (
              <span aria-current="page" style={{ color: "var(--cy-ink-2)" }}>
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({
  crumbs,
  eyebrow,
  title,
  lead,
  children,
  aside,
}: {
  crumbs: readonly { name: string; path?: string }[];
  eyebrow: string;
  title: ReactNode;
  lead: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  const copy = (
    <div className="cy-phero__inner">
      <div className="cy-in">
        <Crumbs items={crumbs} />
      </div>
      <p className="cy-eyebrow cy-in" style={{ "--cy-i": 1 } as React.CSSProperties}>
        {eyebrow}
      </p>
      <h1 className="cy-h1 cy-h1--page cy-in" style={{ "--cy-i": 2 } as React.CSSProperties}>
        {title}
      </h1>
      <p className="cy-lead cy-in" style={{ "--cy-i": 3 } as React.CSSProperties}>
        {lead}
      </p>
      {children ? (
        <div className="cy-actions cy-in" style={{ "--cy-i": 4 } as React.CSSProperties}>
          {children}
        </div>
      ) : null}
    </div>
  );
  return (
    <section className="cy-phero" data-hero>
      <Horizon intensity={0.7} />
      <div className="cy-container">
        {aside ? (
          <div className="cy-phero__grid">
            {copy}
            <div className="cy-in" style={{ "--cy-i": 4 } as React.CSSProperties}>
              {aside}
            </div>
          </div>
        ) : (
          copy
        )}
      </div>
    </section>
  );
}

export function FinalCta({
  title = "What should work better in your business?",
  lead = "Tell us about the task, the tools, and what needs to change. You get an honest answer on whether AI is the right tool, and a written scope you approve before work starts.",
  source,
  intent,
}: {
  title?: string;
  lead?: string;
  source?: StartContextSource;
  intent?: StartContextIntent;
}) {
  return (
    <section id="contact" className="cy-section" aria-labelledby="final-cta-heading">
      <div className="cy-container">
        <div className="cy-final" data-cy-reveal="scale">
          <Horizon intensity={1.1} />
          <div className="cy-final__copy">
            <p className="cy-badge">
              <i aria-hidden="true" /> No obligation · Written scope before work starts
            </p>
            <h2 id="final-cta-heading" className="cy-h2">
              <Words text={title} />
            </h2>
            <p className="cy-lead">{lead}</p>
            <div className="cy-actions">
              <StartButton section="final_cta" source={source} intent={intent} />
              <AskAssistant source="final_cta" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
