export function GridFloor({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 grid-floor opacity-60 ${className}`}
    />
  );
}