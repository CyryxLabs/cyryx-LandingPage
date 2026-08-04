import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useId, type MouseEventHandler } from "react";
import structuralAperture from "@/assets/cyryx-structural-aperture-1920.webp";

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
}

export function InternalHero({
  eyebrow,
  title,
  titleScale = "default",
  body,
  primaryCta,
  secondaryCta,
  boundaryNote,
  lifecycleLabel = "Operating lifecycle",
  lifecycle,
}: InternalHeroProps) {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className={`relative isolate min-h-[83svh] overflow-hidden border-b border-white/10 bg-[var(--onyx)] px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:px-0 lg:pb-0 ${
        titleScale === "compact" ? "lg:pt-32" : "lg:pt-48"
      }`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20">
        <img
          src={structuralAperture}
          alt=""
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="h-full w-full object-cover object-left opacity-[0.48] saturate-[0.82] contrast-[1.06] sm:object-center sm:opacity-[0.5] lg:opacity-[0.52]"
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[rgba(5,6,7,0.56)] sm:bg-[rgba(5,6,7,0.52)] lg:bg-[rgba(5,6,7,0.48)]"
      />

      <div className="grid w-full gap-12 lg:grid-cols-[minmax(0,42vw)_minmax(9rem,12vw)] lg:items-center lg:gap-[14vw] lg:pl-[19vw] lg:pr-[5vw]">
        <div className="min-w-0">
          <p className="font-mono text-[9px] font-medium uppercase tracking-[0.25em] text-[var(--accent-glow)] sm:text-[10px]">
            {eyebrow}
          </p>
          <h1
            id={headingId}
            className={`mt-6 max-w-[12.5ch] [font-family:var(--font-editorial-hero)] text-[clamp(3rem,13.5vw,4.5rem)] font-normal leading-[0.96] tracking-[-0.035em] text-[#e4e0d8] sm:max-w-[11.5ch] sm:text-[clamp(4.25rem,9vw,5.75rem)] ${
              titleScale === "compact"
                ? "lg:max-w-[23.75rem] lg:text-[clamp(4rem,5vw,5.25rem)] lg:tracking-[-0.05em]"
                : "lg:max-w-[42vw] lg:text-[clamp(4.5rem,7vw,6.75rem)]"
            }`}
          >
            {title}
          </h1>
          <p className="mt-6 max-w-[33.75rem] text-[15px] leading-[1.55] text-[color-mix(in_oklab,var(--silver)_78%,transparent)] sm:mt-7 sm:text-base sm:leading-[1.6]">
            {body}
          </p>

          <ol
            aria-label={`${lifecycleLabel} sequence`}
            className="mt-5 hidden flex-wrap items-center gap-y-2 font-mono text-[9px] uppercase tracking-[0.22em] text-[var(--silver)] sm:flex"
          >
            {lifecycle.map((item, index) => (
              <li key={`sequence-${item.number}-${item.label}`} className="flex items-center">
                {index > 0 ? (
                  <span aria-hidden="true" className="mx-3 text-[var(--accent-glow)]">
                    /
                  </span>
                ) : null}
                {item.label}
              </li>
            ))}
          </ol>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 sm:mt-6">
            <HeroLink action={primaryCta} variant="primary" />
            {secondaryCta ? <HeroLink action={secondaryCta} variant="secondary" /> : null}
          </div>

          {boundaryNote ? (
            <p
              role="note"
              aria-label="Scope boundary"
              className="mt-6 max-w-[33.75rem] border-l border-[var(--teal)] pl-4 text-xs leading-relaxed text-[color-mix(in_oklab,var(--steel)_82%,transparent)] sm:text-[13px]"
            >
              {boundaryNote}
            </p>
          ) : null}
        </div>

        <aside aria-label={lifecycleLabel} className="max-w-xs pt-1 lg:max-w-none lg:self-center">
          <p className="font-mono text-[8px] uppercase tracking-[0.24em] text-[color-mix(in_oklab,var(--steel)_72%,transparent)]">
            {lifecycleLabel}
          </p>
          <ol className="relative mt-4 space-y-0 before:absolute before:bottom-4 before:left-[3px] before:top-4 before:w-px before:bg-white/20">
            {lifecycle.map((item) => (
              <li
                key={`${item.number}-${item.label}`}
                aria-current={item.active ? "step" : undefined}
                className="relative min-w-0 py-3.5 pl-8 lg:py-4"
              >
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-[1.25rem] z-10 h-[7px] w-[7px] rounded-full border ${
                    item.active
                      ? "border-[var(--accent-glow)] bg-[var(--accent-glow)]"
                      : "border-white/35 bg-[var(--onyx)]"
                  }`}
                />
                <div className="flex items-baseline gap-2.5">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-[var(--accent-glow)]">
                    {item.number}
                  </span>
                  <span className="font-display text-[15px] font-medium tracking-[-0.02em] text-[var(--silver)]">
                    {item.active ? <span className="sr-only">Current focus: </span> : null}
                    {item.label}
                  </span>
                </div>
                {item.detail ? (
                  <p className="mt-2 text-xs leading-relaxed text-[var(--steel)]">{item.detail}</p>
                ) : null}
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </section>
  );
}

function HeroLink({
  action,
  variant,
}: {
  action: InternalHeroCta;
  variant: "primary" | "secondary";
}) {
  const variantClass =
    variant === "primary"
      ? "border-white/40 bg-[rgba(5,6,7,0.34)] px-5 text-[var(--silver)] hover:border-[var(--accent-glow)] hover:text-white sm:px-6"
      : "border-transparent bg-transparent px-0 text-[var(--silver-dim)] hover:text-[var(--accent-glow)]";

  const className = `group inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm border py-2.5 text-center font-mono text-[9px] font-medium uppercase tracking-[0.22em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--onyx)] ${variantClass}`;
  const content = (
    <>
      <span>{action.label}</span>
      <ArrowRight
        aria-hidden="true"
        className="ml-2 h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5"
      />
    </>
  );

  if (action.href) {
    return (
      <a
        href={action.href}
        aria-label={action.ariaLabel ?? action.label}
        onClick={action.onClick}
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      to={action.to}
      aria-label={action.ariaLabel ?? action.label}
      onClick={action.onClick}
      preload="intent"
      className={className}
    >
      {content}
    </Link>
  );
}
