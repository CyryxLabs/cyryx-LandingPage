import {
  ProductsGlyph,
  SolutionsGlyph,
  LabGlyph,
  MaaxStudioGlyph,
  MaaxRuntimeGlyph,
} from "./primitives/BrandGlyphs";

const ITEMS = [
  { n: "01", Glyph: ProductsGlyph, title: "Products" },
  { n: "02", Glyph: SolutionsGlyph, title: "Solutions" },
  { n: "03", Glyph: LabGlyph, title: "Applied AI Lab" },
  { n: "04", Glyph: MaaxStudioGlyph, title: "MAAX Studio" },
  { n: "05", Glyph: MaaxRuntimeGlyph, title: "MAAX Runtime" },
];

export function CapabilityStrip() {
  return (
    <section
      id="overview"
      className="relative border-y border-[color-mix(in_oklab,var(--silver)_8%,transparent)] bg-[var(--graphite)]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
        <div
          className="cx-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5
            divide-y divide-[color-mix(in_oklab,var(--silver)_8%,transparent)]
            sm:divide-y-0
            sm:[&>*:nth-child(n+3)]:border-t sm:[&>*:nth-child(n+3)]:border-[color-mix(in_oklab,var(--silver)_8%,transparent)]
            sm:[&>*:nth-child(even)]:border-l sm:[&>*:nth-child(even)]:border-[color-mix(in_oklab,var(--silver)_8%,transparent)]
            lg:divide-y-0 lg:[&>*]:border-t-0
            lg:[&>*:not(:first-child)]:border-l lg:[&>*:not(:first-child)]:border-[color-mix(in_oklab,var(--silver)_8%,transparent)]"
        >
          {ITEMS.map(({ n, Glyph, title }) => (
            <div
              key={title}
              className="cx-stagger-item group relative flex items-center gap-4 px-2 py-4 sm:px-5 sm:py-5 lg:flex-col lg:items-start lg:gap-3 lg:px-6 lg:py-2"
            >
              <Glyph
                aria-hidden="true"
                className="h-10 w-10 shrink-0 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 lg:h-11 lg:w-11"
              />
              <div className="flex min-w-0 flex-col gap-1">
                <span className="font-mono text-[10px] font-semibold tracking-[0.28em] text-metal-dim">
                  {n}
                </span>
                <span className="hud-label text-metal text-[13px] leading-tight">
                  {title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}