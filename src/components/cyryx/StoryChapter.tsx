import type { ReactNode } from "react";

const CHAPTERS = [
  ["01", "The problem"],
  ["02", "Ways to engage"],
  ["03", "How it runs"],
  ["04", "What you receive"],
  ["05", "Governance"],
  ["06", "Start"],
] as const;

type StoryChapterProps = {
  index: (typeof CHAPTERS)[number][0];
  label: (typeof CHAPTERS)[number][1];
  children: ReactNode;
};

export function StoryChapter({ index, label, children }: StoryChapterProps) {
  return (
    <div className="cx-story-chapter relative" data-story-chapter={index}>
      <div
        className="cx-story-chapter-marker relative z-20 mx-auto flex max-w-7xl items-center gap-4 px-5 py-3 sm:px-8 sm:py-5 lg:px-10"
        aria-hidden="true"
      >
        <span
          data-chapter-text
          className="font-mono text-[11px] tracking-[0.2em] text-[var(--accent-glow)]"
        >
          {index}
        </span>
        <span
          data-chapter-text
          className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--steel)]"
        >
          {label}
        </span>
        <span className="relative h-px flex-1 overflow-hidden bg-[color-mix(in_oklab,var(--silver)_12%,transparent)]">
          <span
            data-chapter-line
            className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-[linear-gradient(90deg,var(--accent-glow),color-mix(in_oklab,var(--accent-glow)_12%,transparent))]"
          />
        </span>
      </div>
      {children}
    </div>
  );
}

export function StoryProgress() {
  return (
    <div
      data-story-progress
      aria-hidden="true"
      className="cx-story-progress pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 2xl:flex"
    >
      <div className="relative mr-3 w-px self-stretch overflow-hidden bg-white/10">
        <span
          data-story-progress-fill
          className="absolute inset-x-0 top-0 h-full origin-top scale-y-0 bg-[var(--accent-glow)] shadow-[0_0_12px_color-mix(in_oklab,var(--accent-glow)_48%,transparent)]"
        />
      </div>
      <ol className="space-y-5 rounded-md border border-white/10 bg-[color-mix(in_oklab,var(--onyx)_82%,transparent)] px-3 py-4 backdrop-blur-md">
        {CHAPTERS.map(([chapter, chapterLabel]) => (
          <li
            key={chapter}
            data-story-progress-item={chapter}
            className="flex items-center gap-2 opacity-35 transition-opacity duration-300"
          >
            <span className="h-1 w-1 rounded-full bg-current" />
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--silver)]">
              {chapterLabel}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
