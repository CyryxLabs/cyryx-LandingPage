import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Check, ShieldCheck, X } from "lucide-react";
import { useRef } from "react";
import { MaaxWaitlistForm } from "./MaaxWaitlistForm";

const VALUE_POINTS = [
  "Priority consideration for upcoming access waves",
  "Product updates focused on real software execution",
  "A direct path to share your team's operating requirements",
] as const;

type MaaxWaitlistDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MaaxWaitlistDialog({ open, onOpenChange }: MaaxWaitlistDialogProps) {
  const returnFocusRef = useRef<HTMLElement | null>(null);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-black/82 backdrop-blur-md data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed inset-x-3 top-1/2 z-[101] max-h-[calc(100svh-1.5rem)] -translate-y-1/2 overflow-y-auto rounded-xl border border-white/14 bg-[var(--obsidian)] shadow-[0_32px_120px_rgba(0,0,0,0.78),0_0_80px_color-mix(in_oklab,var(--accent-glow)_9%,transparent)] outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:left-1/2 sm:right-auto sm:w-[calc(100vw-3rem)] sm:max-w-5xl sm:-translate-x-1/2"
          onOpenAutoFocus={() => {
            returnFocusRef.current =
              document.activeElement instanceof HTMLElement ? document.activeElement : null;
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            returnFocusRef.current?.focus();
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-80"
            style={{
              background:
                "radial-gradient(circle at 12% 16%, color-mix(in oklab, var(--accent-glow) 13%, transparent), transparent 32%), linear-gradient(115deg, transparent 48%, color-mix(in oklab, var(--accent-glow) 4%, transparent) 50%, transparent 52%)",
            }}
          />

          <DialogPrimitive.Close
            className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/14 bg-black/30 text-[var(--silver-dim)] transition hover:border-[var(--accent-glow)] hover:text-[var(--accent-glow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)] sm:right-6 sm:top-6"
            aria-label="Close MAAX Studio early-access form"
          >
            <X className="h-5 w-5" aria-hidden />
          </DialogPrimitive.Close>

          <div className="relative grid lg:grid-cols-[0.78fr_1.22fr]">
            <div className="border-b border-white/10 p-6 pr-16 sm:p-9 sm:pr-20 lg:border-b-0 lg:border-r lg:p-12">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--accent-glow)]">
                MAAX Studio / Early access
              </p>
              <DialogPrimitive.Title className="mt-5 max-w-md font-display text-4xl font-semibold leading-[0.98] tracking-[-0.05em] text-[var(--silver)] sm:text-5xl">
                Be considered for the next access wave.
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="mt-5 max-w-md text-[15px] leading-relaxed text-[var(--silver-dim)]">
                Join the list if your team is exploring agentic software execution and wants a
                controlled way to coordinate context, work, and review.
              </DialogPrimitive.Description>

              <ul className="mt-8 space-y-4">
                {VALUE_POINTS.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-relaxed text-[var(--silver-dim)]"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-glow)]"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex items-start gap-3 border-t border-white/10 pt-6 text-xs leading-relaxed text-[var(--steel)]">
                <ShieldCheck
                  className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-glow)]"
                  aria-hidden
                />
                <span>
                  Your details are used only to assess early-access fit and contact you about MAAX
                  Studio.
                </span>
              </div>
            </div>

            <div className="bg-[color-mix(in_oklab,var(--graphite)_72%,transparent)] p-6 sm:p-9 lg:p-12">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--accent-glow)]">
                Join the list
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-[-0.035em] text-[var(--silver)]">
                Tell us about the team and intended use.
              </h2>
              <p className="mb-7 mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">
                The qualification context helps us assess fit for a reviewed access wave. No public
                launch date is promised.
              </p>
              <MaaxWaitlistForm />
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
