import { useId, type SVGProps } from "react";

/**
 * Cyryx Labs brand glyphs — metallic silver→teal gradient.
 * Unique to the brand, designed for the three core pillars:
 *  - ProductsGlyph: stacked runtime modules (MAAX-style)
 *  - SolutionsGlyph: interconnected workflow graph
 *  - LabGlyph: applied research / governed execution
 */

type GlyphProps = SVGProps<SVGSVGElement> & { title?: string };

function GradientDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="var(--silver)" />
        <stop offset="55%" stopColor="var(--silver-dim)" />
        <stop offset="100%" stopColor="var(--accent-glow)" />
      </linearGradient>
    </defs>
  );
}

function useSvgGradientId(prefix: string) {
  return `${prefix}-${useId().replace(/:/g, "")}`;
}

export function ProductsGlyph({ title, ...props }: GlyphProps) {
  const id = useSvgGradientId("cx-glyph-products");
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke={`url(#${id})`}
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : "presentation"}
      aria-label={title}
      {...props}
    >
      <GradientDefs id={id} />
      {/* stacked runtime modules — isometric */}
      <path d="M24 6 L40 14 L24 22 L8 14 Z" />
      <path d="M8 14 V26 L24 34 V22" />
      <path d="M40 14 V26 L24 34" />
      <path d="M8 26 V32 L24 40 L40 32 V26" opacity="0.55" />
      <circle cx="24" cy="22" r="1.6" fill={`url(#${id})`} stroke="none" />
    </svg>
  );
}

export function SolutionsGlyph({ title, ...props }: GlyphProps) {
  const id = useSvgGradientId("cx-glyph-solutions");
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke={`url(#${id})`}
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : "presentation"}
      aria-label={title}
      {...props}
    >
      <GradientDefs id={id} />
      {/* interconnected workflow graph */}
      <path d="M10 12 L24 22 L38 12" />
      <path d="M24 22 V38" />
      <path d="M10 36 L24 38 L38 36" opacity="0.6" />
      <circle cx="10" cy="12" r="3" fill="var(--graphite)" />
      <circle cx="38" cy="12" r="3" fill="var(--graphite)" />
      <circle cx="24" cy="22" r="3.2" fill="var(--graphite)" />
      <circle cx="10" cy="36" r="2.4" fill="var(--graphite)" />
      <circle cx="38" cy="36" r="2.4" fill="var(--graphite)" />
      <circle cx="24" cy="38" r="2.4" fill={`url(#${id})`} stroke="none" />
    </svg>
  );
}

export function LabGlyph({ title, ...props }: GlyphProps) {
  const id = useSvgGradientId("cx-glyph-lab");
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke={`url(#${id})`}
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : "presentation"}
      aria-label={title}
      {...props}
    >
      <GradientDefs id={id} />
      {/* governed execution — flask + orbit */}
      <path d="M19 6 H29" />
      <path d="M21 6 V18 L12 36 a4 4 0 0 0 3.5 6 H32.5 a4 4 0 0 0 3.5 -6 L27 18 V6" />
      <path d="M16 30 H32" opacity="0.55" />
      <ellipse cx="24" cy="22" rx="14" ry="5" transform="rotate(-18 24 22)" opacity="0.55" />
      <circle cx="24" cy="34" r="1.6" fill={`url(#${id})`} stroke="none" />
    </svg>
  );
}

export function MaaxStudioGlyph({ title, ...props }: GlyphProps) {
  const id = useSvgGradientId("cx-glyph-maax-studio");
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke={`url(#${id})`}
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : "presentation"}
      aria-label={title}
      {...props}
    >
      <GradientDefs id={id} />
      {/* faceted prism — multi-agent generation */}
      <path d="M24 8 L38 20 L30 40 H18 L10 20 Z" />
      <path d="M24 8 L18 40" opacity="0.55" />
      <path d="M24 8 L30 40" opacity="0.55" />
      <path d="M10 20 L38 20" opacity="0.55" />
      {/* divergent rays from apex */}
      <path d="M24 8 V2" />
      <path d="M24 8 L18 2.5" opacity="0.7" />
      <path d="M24 8 L30 2.5" opacity="0.7" />
      <circle cx="24" cy="22" r="1.8" fill={`url(#${id})`} stroke="none" />
    </svg>
  );
}

export function MaaxRuntimeGlyph({ title, ...props }: GlyphProps) {
  const id = useSvgGradientId("cx-glyph-maax-runtime");
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke={`url(#${id})`}
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : "presentation"}
      aria-label={title}
      {...props}
    >
      <GradientDefs id={id} />
      {/* hexagonal governance ring */}
      <path d="M24 5 L40 14 V32 L24 41 L8 32 V14 Z" />
      {/* inner rotated square — execution core */}
      <path d="M24 16 L32 23 L24 30 L16 23 Z" />
      {/* orbital pipeline trace */}
      <path d="M6 23 H16" opacity="0.7" />
      <path d="M32 23 H42" opacity="0.7" />
      <circle cx="24" cy="23" r="1.6" fill={`url(#${id})`} stroke="none" />
    </svg>
  );
}

export const BrandGlyphs = {
  Products: ProductsGlyph,
  Solutions: SolutionsGlyph,
  Lab: LabGlyph,
  MaaxStudio: MaaxStudioGlyph,
  MaaxRuntime: MaaxRuntimeGlyph,
};