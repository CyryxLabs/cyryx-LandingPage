export function HudGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-[0.18]"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, color-mix(in oklab, var(--silver) 22%, transparent) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-[color-mix(in_oklab,var(--silver)_22%,transparent)] to-transparent" />
    </div>
  );
}