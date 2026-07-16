import { cn } from "@/lib/utils";

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className={cn(
        "skip-link",
        "sr-only focus:not-sr-only",
        "fixed left-4 top-4 z-[100]",
        "inline-flex h-11 items-center justify-center rounded-md px-5",
        "bg-[var(--accent-glow)] text-[var(--onyx)] font-semibold",
        "shadow-[0_0_20px_var(--accent-glow)]",
        "outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      )}
    >
      Skip to content
    </a>
  );
}
