import { cn } from "@/lib/utils";

export function SkipLink() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Standard link behavior (href="#main-content") handles the focus shift
    // to elements with tabIndex={-1} in modern browsers.
  };

  return (
    <a
      href="#main-content"
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const target = document.getElementById("main-content");
          if (target) {
            target.focus({ preventScroll: false });
            target.scrollIntoView({ behavior: 'auto', block: 'start' });
          }
        }
      }}
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
