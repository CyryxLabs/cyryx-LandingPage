import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useId, type MouseEventHandler } from "react";

interface InternalHeroCtaBase {
  label: string;
  ariaLabel?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export type InternalHeroCta = InternalHeroCtaBase &
  (
    | {
        to: string;
        href?: never;
      }
    | {
        href: string;
        to?: never;
      }
  );

export interface InternalHeroLifecycleItem {
  number: string;
  label: string;
  detail?: string;
  active?: boolean;
}

export interface InternalHeroChapter {
  title: string;
  body: string;
  label?: string;
}

export interface InternalHeroProps {
  eyebrow: string;
  title: string;
  titleScale?: "default" | "compact";
  body: string;
  primaryCta: InternalHeroCta;
  secondaryCta?: InternalHeroCta;
  boundaryNote?: string;
  lifecycleLabel?: string;
  lifecycle: readonly InternalHeroLifecycleItem[];
  nextChapter?: InternalHeroChapter;
}

function HeroCta({ cta, variant }: { cta: InternalHeroCta; variant: "primary" | "ghost" }) {
  const className = `cy-btn cy-btn--${variant}`;
  const content = (
    <>
      {cta.label}
      <ArrowRight aria-hidden="true" />
    </>
  );
  if (cta.to !== undefined) {
    return (
      <Link to={cta.to} aria-label={cta.ariaLabel} onClick={cta.onClick} className={className}>
        {content}
      </Link>
    );
  }
  return (
    <a href={cta.href} aria-label={cta.ariaLabel} onClick={cta.onClick} className={className}>
      {content}
    </a>
  );
}

/**
 * Hero for the content pages that predate the 2026-11 site system (brief,
 * careers, engagement model, AEXOS). Same props as before; the rendered
 * surface is the shared institutional page hero, with no crest or monolith
 * imagery.
 */
export function InternalHero({
  eyebrow,
  title,
  body,
  primaryCta,
  secondaryCta,
  boundaryNote,
  lifecycleLabel = "Operating lifecycle",
  lifecycle,
  nextChapter,
}: InternalHeroProps) {
  const headingId = useId();

  return (
    <>
      <section
        aria-labelledby={headingId}
        data-internal-hero
        data-hero
        className="cy-scope cy-phero"
      >
        <div className="cy-container cy-phero__grid">
          <div className="cy-phero__inner">
            <p className="cy-eyebrow cy-in">{eyebrow}</p>
            <h1
              id={headingId}
              className="cy-h1 cy-h1--page cy-in"
              style={{ "--cy-i": 1 } as React.CSSProperties}
            >
              {title}
            </h1>
            <p className="cy-lead cy-in" style={{ "--cy-i": 2 } as React.CSSProperties}>
              {body}
            </p>
            <div className="cy-actions cy-in" style={{ "--cy-i": 3 } as React.CSSProperties}>
              <HeroCta cta={primaryCta} variant="primary" />
              {secondaryCta ? <HeroCta cta={secondaryCta} variant="ghost" /> : null}
            </div>
            {boundaryNote ? (
              <p
                className="cy-source cy-in"
                style={{ "--cy-i": 4, maxWidth: "60ch" } as React.CSSProperties}
              >
                {boundaryNote}
              </p>
            ) : null}
          </div>
          {lifecycle.length > 0 ? (
            <div className="cy-in" style={{ "--cy-i": 3 } as React.CSSProperties}>
              <p className="cy-eyebrow" style={{ marginBottom: 14 }}>
                {lifecycleLabel}
              </p>
              <ol style={{ display: "grid", gap: 10, margin: 0, padding: 0, listStyle: "none" }}>
                {lifecycle.map((item) => (
                  <li
                    key={`${item.number}-${item.label}`}
                    className="cy-kv"
                    aria-current={item.active ? "step" : undefined}
                    style={item.active ? { borderColor: "rgba(25, 199, 192, 0.45)" } : undefined}
                  >
                    <span
                      style={{
                        font: "500 0.6875rem/1.2 var(--cy-mono)",
                        letterSpacing: "0.1em",
                        color: item.active ? "var(--cy-teal)" : "var(--cy-mute)",
                      }}
                    >
                      {item.number}
                    </span>
                    <span style={{ color: "var(--cy-ink)", fontWeight: 500 }}>{item.label}</span>
                    {item.detail ? (
                      <span style={{ fontSize: "0.875rem", color: "var(--cy-mute)" }}>
                        {item.detail}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
        </div>
      </section>
      {nextChapter ? (
        <section
          className="cy-scope cx-internal-chapter"
          style={{ padding: "clamp(48px, 6vw, 88px) 0" }}
        >
          <div className="cy-container">
            {nextChapter.label ? <p className="cy-eyebrow">{nextChapter.label}</p> : null}
            <h2 className="cy-h2" style={{ marginTop: 16 }}>
              {nextChapter.title}
            </h2>
            <p className="cy-lead" style={{ marginTop: 16 }}>
              {nextChapter.body}
            </p>
          </div>
        </section>
      ) : null}
    </>
  );
}
