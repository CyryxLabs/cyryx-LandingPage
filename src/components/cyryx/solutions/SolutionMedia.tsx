export interface SolutionVisual {
  imageSmall: string;
  imageLarge: string;
  alt: string;
  diagramVariant: "flow" | "stack" | "radial" | "matrix";
  diagramLabel: string;
  diagramCaption: string;
}

export function SolutionMedia({ visual }: { visual: SolutionVisual }) {
  const srcSet = `${visual.imageSmall} 768w, ${visual.imageLarge} 1440w`;

  return (
    <figure
      data-solution-media
      className="cx-solution-media overflow-hidden rounded-lg border border-white/10 bg-[var(--obsidian)]"
    >
      <picture>
        <source
          type="image/webp"
          srcSet={srcSet}
          sizes="(min-width: 1280px) 76rem, (min-width: 768px) calc(100vw - 4rem), calc(100vw - 2.5rem)"
        />
        <img
          src={visual.imageLarge}
          srcSet={srcSet}
          sizes="(min-width: 1280px) 76rem, (min-width: 768px) calc(100vw - 4rem), calc(100vw - 2.5rem)"
          alt={visual.alt}
          width={1440}
          height={900}
          loading="eager"
          decoding="async"
          className="block aspect-[4/5] h-auto w-full object-cover sm:aspect-[8/5]"
        />
      </picture>
    </figure>
  );
}
