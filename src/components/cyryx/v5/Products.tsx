import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { CYRYX_PRODUCTS, type CyryxProduct } from "@/data/offer";
import { trackCta } from "@/lib/track-cta";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

const STAGE_TONE: Record<CyryxProduct["stage"], string> = {
  Available:
    "border-[color-mix(in_oklab,var(--accent-glow)_55%,transparent)] text-[var(--accent-glow)]",
  Waitlist: "border-white/20 text-[var(--silver)]",
  "In daily use": "border-white/20 text-[var(--silver)]",
};

function ProductLink({
  link,
  primary,
}: {
  link: NonNullable<CyryxProduct["secondary"]>;
  primary?: boolean;
}) {
  const className = cn(
    "inline-flex min-h-11 items-center gap-2 font-mono text-[12px] uppercase tracking-[0.14em] transition-colors",
    primary
      ? "text-[var(--silver)] hover:text-[var(--accent-glow)]"
      : "text-[var(--silver-dim)] hover:text-[var(--silver)]",
  );
  const onClick = () => trackCta({ cta: "view_product", section: "product", href: link.href });
  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={onClick}
      >
        {link.label} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  if (link.href.includes("?")) {
    return (
      <a href={link.href} className={className} onClick={onClick}>
        {link.label} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </a>
    );
  }
  return (
    <Link to={link.href} className={className} onClick={onClick}>
      {link.label} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
    </Link>
  );
}

export function ProductCard({
  product,
  headingLevel = 3,
}: {
  product: CyryxProduct;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article
      id={product.id}
      className="group relative flex h-full scroll-mt-28 flex-col rounded-xl border border-white/10 bg-[var(--obsidian)] p-6 transition-colors hover:border-white/20 sm:p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--steel)]">
          {product.category}
        </span>
        <span
          className={cn(
            "rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.14em]",
            STAGE_TONE[product.stage],
          )}
        >
          {product.stage}
        </span>
      </div>
      <Heading className="mt-6 font-display text-4xl font-semibold tracking-[-0.04em] text-[var(--silver)] sm:text-5xl">
        {product.name}
      </Heading>
      <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--silver-dim)]">
        {product.stageNote}
      </p>
      <p className="mt-5 text-[15px] leading-relaxed text-[var(--silver-dim)] sm:text-base">
        {product.summary}
      </p>
      <ul className="mt-6 hidden space-y-2.5 border-t border-white/10 pt-5 text-[15px] text-[var(--silver)] sm:block">
        {product.points.map((point) => (
          <li key={point} className="flex gap-3">
            <span aria-hidden className="text-[var(--accent-glow)]">
              /
            </span>
            {point}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap gap-x-6 pt-6">
        <ProductLink link={product.primary} primary />
        {product.secondary && <ProductLink link={product.secondary} />}
      </div>
    </article>
  );
}

/** Software Cyryx builds and runs itself — each with its real stage. */
export function Products() {
  return (
    <section
      id="products"
      aria-labelledby="products-heading"
      data-story-section
      className="relative scroll-mt-24 overflow-hidden py-12 sm:py-20 lg:py-28"
    >
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          id="products-heading"
          title="Software we build and run ourselves."
          lead="The same team that builds for clients ships its own products. Each one shows the stage it is really in."
        />
        <ul className="cx-stagger mt-8 grid gap-4 sm:mt-16 lg:grid-cols-3">
          {CYRYX_PRODUCTS.map((product) => (
            <li key={product.id} className="cx-stagger-item">
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
        <div className="cx-reveal mt-8 sm:mt-10">
          <Link
            to="/products"
            className="inline-flex min-h-11 items-center gap-2 font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--silver-dim)] transition-colors hover:text-[var(--silver)]"
          >
            All products <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
