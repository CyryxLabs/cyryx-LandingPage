import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

/**
 * Mobile-only sticky bottom CTA. Hidden on lg+. Appears after the user has
 * scrolled past the hero (~one viewport) so it never competes with the hero CTAs,
 * and gets out of the way when the contact section is in view.
 */
export function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.body.dataset.hasStickyCta = "true";

    const contact = document.getElementById("contact");
    let contactInView = false;

    const io = contact
      ? new IntersectionObserver(
          (entries) => {
            contactInView = entries[0]?.isIntersecting ?? false;
            update();
          },
          { rootMargin: "0px 0px -20% 0px" },
        )
      : null;
    io?.observe(contact!);

    const update = () => {
      const past = window.scrollY > window.innerHeight * 0.6;
      setVisible(past && !contactInView);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      io?.disconnect();
      delete document.body.dataset.hasStickyCta;
    };
  }, []);

  return (
    <div
      className="cx-sticky-cta lg:hidden"
      data-visible={visible || undefined}
      role="region"
      aria-label="Quick actions"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-2">
        <a
          href="#contact"
          className="inline-flex h-12 min-h-11 flex-1 items-center justify-center gap-2 rounded-md bg-[var(--accent-glow)] px-4 hud-label font-semibold text-[var(--onyx)] shadow-[var(--shadow-glow-teal)] active:brightness-95"
        >
          Talk to us
          <ArrowRight className="h-4 w-4" />
        </a>
        <a
          href="#maax"
          className="cx-liquid-glass inline-flex h-12 min-h-11 min-w-11 items-center justify-center rounded-md px-4 hud-label text-[var(--silver)]"
        >
          MAAX
        </a>
      </div>
    </div>
  );
}