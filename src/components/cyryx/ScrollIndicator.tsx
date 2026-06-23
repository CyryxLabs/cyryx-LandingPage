export function ScrollIndicator() {
  return (
    <a href="#systems" aria-label="Scroll to explore" className="group flex flex-col items-center gap-3">
      <span className="hud-label text-[var(--silver-dim)] group-hover:text-[var(--accent-glow)] transition-colors">
        Scroll to explore
      </span>
      <span className="relative block h-10 w-6 rounded-full border border-[color-mix(in_oklab,var(--silver)_22%,transparent)]">
        <span className="absolute left-1/2 top-2 h-1.5 w-1 -translate-x-1/2 rounded-full bg-[var(--accent-glow)] shadow-[0_0_8px_var(--accent-glow)] animate-[scrollDot_1.8s_ease-in-out_infinite]" />
      </span>
      <style>{`@keyframes scrollDot { 0%,100% { transform: translate(-50%, 0); opacity: 1 } 50% { transform: translate(-50%, 14px); opacity: 0.3 } }`}</style>
    </a>
  );
}