import { getCopy } from "@/copy";
import { useCopyVariant } from "@/lib/copy-variant";
import { buildStartProjectHref } from "@/lib/cta";
import { trackCta } from "@/lib/track-cta";
import { isAssistantEnabled, openAssistant } from "@/lib/assistant-client";

/**
 * Home hero, institutional revision (2026-11-06).
 *
 * The founder retired the monolith film for the home page: the hero is now
 * the promise beside the thing every client actually receives first, a written
 * project plan. The plan is a labelled example built from sample values; it
 * states no price, client or result as fact.
 */
export function HomeHero() {
  const copy = getCopy(useCopyVariant()).hero;
  const startHref = buildStartProjectHref({ source: "home" });
  const assistantEnabled = isAssistantEnabled();

  return (
    <section id="top" data-hero aria-labelledby="hero-heading" className="hm-hero">
      <div className="container hm-hero__grid">
        <div className="cx-hero-panel hm-hero__copy">
          <h1 id="hero-heading" className="hm-hero__title">
            <span data-hero-line className="cx-hero-title-line">
              {copy.headline}
            </span>
          </h1>
          <p className="cx-hero-sub lead hm-hero__sub">{copy.sub}</p>
          <div className="cx-hero-ctas hm-actions">
            <a
              href={startHref}
              data-cta="primary"
              className="hm-btn hm-btn--primary"
              onClick={() => trackCta({ cta: "start_project", section: "hero", href: startHref })}
            >
              {copy.ctaPrimary}
            </a>
            <a
              href="#services"
              data-cta="secondary"
              className="hm-btn hm-btn--quiet"
              onClick={() => trackCta({ cta: "see_delivery", section: "hero", href: "#services" })}
            >
              {copy.ctaSecondary}
            </a>
          </div>
          {assistantEnabled && (
            <button
              type="button"
              className="hm-textlink hm-hero__ask"
              onClick={() => openAssistant("hero")}
            >
              {copy.assistantNote}
            </button>
          )}
        </div>

        <figure className="hm-plan" aria-labelledby="hero-plan-caption">
          <div className="hm-plan__sheet">
            <div className="hm-plan__head">
              <p className="hm-plan__title">Project plan</p>
              <p className="hm-plan__tag">Example</p>
            </div>
            <dl className="hm-plan__facts">
              <div>
                <dt>Client</dt>
                <dd>Example Clinic</dd>
              </div>
              <div>
                <dt>Goal</dt>
                <dd>Online booking with automatic reminders</dd>
              </div>
              <div>
                <dt>Timeline</dt>
                <dd>3 to 4 weeks</dd>
              </div>
              <div>
                <dt>Price</dt>
                <dd>Fixed, agreed before work starts</dd>
              </div>
            </dl>
            <div className="hm-plan__block">
              <p className="hm-plan__label">Scope</p>
              <ul className="hm-plan__list">
                <li>Website with online booking</li>
                <li>Email and text reminders</li>
                <li>Staff guide and handover</li>
              </ul>
            </div>
            <div className="hm-plan__block">
              <p className="hm-plan__label">Acceptance checklist</p>
              <ul className="hm-plan__checks">
                <li data-done="true">Booking works on phone and desktop</li>
                <li data-done="true">Reminders reach the patient</li>
                <li data-done="false">Your team signs off the final review</li>
              </ul>
            </div>
          </div>
          <figcaption id="hero-plan-caption" className="hm-plan__caption">
            Every project starts with a written plan like this one, before any work begins.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
