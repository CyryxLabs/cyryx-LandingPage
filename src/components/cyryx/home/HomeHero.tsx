import { CyryxHeroSequence } from "@/components/cyryx/CyryxHeroSequence";
import { getCopy } from "@/copy";
import { useCopyVariant } from "@/lib/copy-variant";
import { buildStartProjectHref } from "@/lib/cta";
import { trackCta } from "@/lib/track-cta";
import { isAssistantEnabled, openAssistant } from "@/lib/assistant-client";

/**
 * Home hero, Hallmark redesign (2026-11-06).
 *
 * Poster posture over the approved monolith film. The scroll scene, sticky
 * stage, media frame, grade, content layer and story panels keep the data
 * hooks `useCyryxScrollAnimations` drives, so the film still scrubs with the
 * scroll. The three story panels carry the terms of the offer; they only show
 * while the scrub runs (`data-scroll-scrub`), and the same terms are written
 * out in the deal section for reduced motion and no-script visitors.
 */
export function HomeHero() {
  const copy = getCopy(useCopyVariant()).hero;
  const startHref = buildStartProjectHref({ source: "home" });
  const assistantEnabled = isAssistantEnabled();
  // Two-sentence titles break at the sentence, the only place a break belongs.
  const split = copy.headline.indexOf(". ");
  const titleLines =
    split === -1
      ? [copy.headline]
      : [copy.headline.slice(0, split + 1), copy.headline.slice(split + 2)];

  return (
    <section id="top" data-hero aria-labelledby="hero-heading" className="hm-hero">
      <div data-hero-scroll-scene className="hm-hero__scene">
        <div data-hero-sticky className="hm-hero__stage">
          <div data-hero-media-frame className="hm-hero__media">
            <CyryxHeroSequence />
            <div aria-hidden="true" className="cx-hero-grade hm-hero__grade" />
          </div>

          {copy.rail.length > 0 && (
            <div aria-hidden="true" data-hero-story className="hm-hero__story">
              {copy.rail.map((line, index) => (
                <p
                  key={line}
                  data-hero-story-panel
                  data-story-index={index}
                  className={`hm-hero__statement hm-hero__statement--${index + 1}`}
                >
                  {line}
                </p>
              ))}
            </div>
          )}

          {/* The film's playhead, a hairline that fills as the scene scrubs. */}
          <div aria-hidden="true" className="hm-hero__progress">
            <span data-scroll-progress />
          </div>

          <div data-hero-content className="hm-hero__content">
            <div className="container hm-hero__frame">
              <div className="cx-hero-panel hm-hero__copy">
                <h1 id="hero-heading" className="hm-hero__title">
                  <span data-hero-line className="cx-hero-title-line">
                    {titleLines.map((line, index) => (
                      <span key={line}>
                        {index > 0 && " "}
                        {line}
                      </span>
                    ))}
                  </span>
                </h1>
                <p className="cx-hero-sub lead hm-hero__sub">{copy.sub}</p>
                <div className="cx-hero-ctas hm-actions">
                  <a
                    href={startHref}
                    data-cta="primary"
                    className="hm-btn hm-btn--primary"
                    onClick={() =>
                      trackCta({ cta: "start_project", section: "hero", href: startHref })
                    }
                  >
                    {copy.ctaPrimary}
                  </a>
                  <a
                    href="#services"
                    data-cta="secondary"
                    className="hm-btn hm-btn--quiet"
                    onClick={() =>
                      trackCta({ cta: "see_delivery", section: "hero", href: "#services" })
                    }
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
