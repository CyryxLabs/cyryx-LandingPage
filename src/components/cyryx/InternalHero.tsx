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
      className="relative isolate overflow-hidden border-b border-white/10 bg-[var(--onyx)] px-5 pb-20 pt-28 sm:px-8 sm:pb-24 sm:pt-36 lg:px-12 lg:pb-28 lg:pt-44"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20">
        <img
          src={structuralAperture}
          alt=""
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="h-full w-full object-cover object-[68%_center] opacity-[0.07] saturate-0 sm:opacity-10 lg:opacity-25"
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[rgba(5,6,7,0.78)]"
      />

      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.36fr)] lg:items-end lg:gap-20">
        <div className="max-w-4xl">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--accent-glow)] sm:text-[11px]">
            {eyebrow}
          </p>
          <h1
            id={headingId}
            className="mt-7 max-w-[14ch] font-display text-[clamp(2.75rem,7vw,6.75rem)] font-semibold leading-[0.93] tracking-[-0.055em] text-[var(--silver)]"
          >
            {title}
          </h1>
          <p className="mt-7 max-w-[46rem] text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg sm:leading-8">
            {body}
          </p>

          <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <HeroLink action={primaryCta} variant="primary" />
            {secondaryCta ? <HeroLink action={secondaryCta} variant="secondary" /> : null}
          </div>

          {boundaryNote ? (
            <p
              role="note"
              aria-label="Scope boundary"
              className="mt-7 max-w-2xl border-l border-[var(--teal)] pl-4 text-sm leading-relaxed text-[var(--steel)]"
            >
              {boundaryNote}
            </p>
          ) : null}
        </div>

        <aside
          aria-label={lifecycleLabel}
          className="border-t border-white/15 pt-5 lg:border-l lg:border-t-0 lg:pb-1 lg:pl-8 lg:pt-0"
        >
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--steel)]">
            {lifecycleLabel}
          </p>
          <ol className="mt-4 grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-4 lg:block lg:overflow-visible lg:border-0 lg:bg-transparent">
            {lifecycle.map((item) => (
              <li
                key={`${item.number}-${item.label}`}
                aria-current={item.active ? "step" : undefined}
                className={`min-w-0 bg-[rgba(10,13,15,0.94)] p-4 sm:min-h-24 lg:min-h-0 lg:border-t lg:bg-transparent lg:px-0 lg:py-5 ${
                  item.active ? "border-[var(--accent-glow)]" : "border-white/10 lg:border-white/10"
                }`}
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-[var(--accent-glow)]">
                    {item.number}
                  </span>
                  <span className="font-display text-base font-medium tracking-[-0.02em] text-[var(--silver)] sm:text-lg">
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
      ? "border-[var(--silver)] bg-[var(--silver)] text-[var(--onyx)] hover:border-white hover:bg-white"
      : "border-white/20 bg-[rgba(10,13,15,0.72)] text-[var(--silver)] hover:border-[var(--accent-glow)] hover:text-[var(--accent-glow)]";

  const className = `inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border px-6 py-3 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--onyx)] ${variantClass}`;
  const content = (
    <>
      <span>{action.label}</span>
      <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4 shrink-0" />
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
