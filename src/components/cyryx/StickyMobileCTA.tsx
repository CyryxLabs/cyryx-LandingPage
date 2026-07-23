import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useCopyVariant } from "@/lib/copy-variant";
import { getCopy } from "@/copy";
import { trackCta } from "@/lib/track-cta";

/**
 * Mobile-only sticky bottom CTA. Hidden on lg+. Appears after the user has
 * scrolled past the hero (~one viewport) so it never competes with the hero CTAs,
 * and gets out of the way when the contact section is in view.
 */
export function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);
  const headerCta = getCopy(useCopyVariant()).header.cta;

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

  if (!visible) return null;

  return (
    <div className="cx-sticky-cta lg:hidden" data-visible role="region" aria-label="Quick actions">
      <div className="mx-auto flex max-w-7xl items-center">
        <a
          href="#contact"
          aria-label={headerCta}
          onClick={() => trackCta({ cta: "start_project", section: "sticky", href: "#contact" })}
          className="cx-liquid-glass inline-flex h-12 min-h-11 w-full items-center justify-center gap-2 rounded-md px-4 hud-label font-semibold text-[var(--accent-glow)] shadow-[var(--shadow-glow-teal)] active:brightness-95"
        >
          {headerCta}
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
