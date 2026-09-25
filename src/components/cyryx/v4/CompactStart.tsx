import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageSquare } from "lucide-react";
import { HudLabel } from "../primitives/HudLabel";
import { trackCta } from "@/lib/track-cta";
import { buildStartProjectHref } from "@/lib/cta";
import { useCopyVariant } from "@/lib/copy-variant";
import { getCopy } from "@/copy";
import { isAssistantEnabled, openAssistant } from "@/lib/assistant-client";

export function CompactStart() {
  const copy = getCopy(useCopyVariant()).finalCta;
  const startHref = buildStartProjectHref({ source: "home" });
  const assistantEnabled = isAssistantEnabled();
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      data-story-section
      className="relative overflow-hidden py-14 sm:py-24"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,color-mix(in_oklab,var(--accent-glow)_10%,transparent),transparent_42%)]"
      />
      <div aria-hidden className="cx-aurora" />
      <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8 lg:px-10">
        <div className="cx-reveal">
          <HudLabel withDot>{copy.eyebrow}</HudLabel>
          <h2
            id="contact-heading"
            className="mx-auto mt-6 max-w-[18ch] font-display text-[1.75rem] sm:text-[2.125rem] lg:text-[2.75rem] xl:text-[3.5rem] font-semibold leading-[1] tracking-[-0.045em] text-silver-gradient sm:mt-7"
          >
            {copy.headline}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--silver-dim)] sm:mt-7 sm:text-lg">
            {copy.body}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:mt-9 sm:flex-row">
            <a
              href={startHref}
              className="cx-btn-primary"
              onClick={() =>
                trackCta({ cta: "start_project", section: "final_cta", href: startHref })
              }
            >
              {copy.ctaPrimary} <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <Link
              to="/engagement-model"
              className="cx-btn-secondary"
              onClick={() =>
                trackCta({
                  cta: "see_how_we_work",
                  section: "final_cta",
                  href: "/engagement-model",
                })
              }
            >
              {copy.ctaSecondary} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          {assistantEnabled && (
            <button
              type="button"
              onClick={() => openAssistant("final_cta")}
              className="mx-auto mt-5 inline-flex min-h-11 items-center gap-2 text-sm text-[var(--silver-dim)] underline-offset-4 hover:text-[var(--accent-glow)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)]"
            >
              <MessageSquare className="h-4 w-4 text-[var(--accent-glow)]" aria-hidden />
              Prefer to ask first? Chat with the Cyryx assistant.
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
