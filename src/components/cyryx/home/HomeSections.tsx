import { Link } from "@tanstack/react-router";

import { getCopy } from "@/copy";
import { CYRYX_PRODUCTS, FAQ_ITEMS, START_OFFERS } from "@/data/offer";
import { isAssistantEnabled, openAssistant } from "@/lib/assistant-client";
import { useCopyVariant } from "@/lib/copy-variant";
import { buildStartProjectHref } from "@/lib/cta";
import { trackCta } from "@/lib/track-cta";

/* Home sections, Hallmark redesign (2026-11-06). Content comes from
 * data/offer.ts and copy/; the composition lives in styles/hallmark-home.css. */

/** Six concrete first purchases, each with its timeline and its own way in. */
export function OfferIndex() {
  return (
    <section id="services" aria-labelledby="services-heading" className="hm-section hm-offers">
      <div className="container">
        <div className="hm-head hm-head--split">
          <h2 id="services-heading">Where clients usually start.</h2>
          <p className="lead">
            Six engagements with a defined scope. Each begins with a free 20-minute fit check.
          </p>
        </div>
        <ol className="hm-offer-list">
          {START_OFFERS.map((offer) => {
            const startHref = buildStartProjectHref({ source: "home", intent: offer.intent });
            return (
              <li key={offer.id} id={`service-${offer.id}`} className="hm-offer">
                <h3 className="hm-offer__name">
                  <a
                    href={offer.href}
                    onClick={() =>
                      trackCta({ cta: "see_delivery", section: "paths", href: offer.href })
                    }
                  >
                    {offer.name}
                  </a>
                </h3>
                <p className="hm-offer__line">{offer.line}</p>
                <p className="hm-offer__time num">{offer.time}</p>
                <a
                  href={startHref}
                  className="hm-textlink hm-offer__start"
                  aria-label={`Ask about ${offer.name}`}
                  onClick={() =>
                    trackCta({ cta: "start_project", section: "paths", href: startHref })
                  }
                >
                  Ask about this
                </a>
              </li>
            );
          })}
        </ol>
        <p className="hm-offers__more">
          <Link
            to="/solutions"
            className="hm-textlink"
            onClick={() => trackCta({ cta: "see_delivery", section: "paths", href: "/solutions" })}
          >
            See every service we offer
          </Link>
        </p>
      </div>
    </section>
  );
}

/** What every quote contains, and the one guarantee. */
export function TheDeal() {
  return (
    <section id="how-it-works" aria-labelledby="deal-heading" className="hm-section hm-deal">
      <div className="container hm-split">
        <div className="hm-split__head">
          <h2 id="deal-heading">Scope, price and checklist, in writing.</h2>
          <p className="lead">What you have in hand before any work begins.</p>
        </div>
        <div className="hm-split__text">
          <dl className="hm-terms">
            <div>
              <dt>A fixed price</dt>
              <dd>Scope, timeline and price, agreed in writing before work begins.</dd>
            </div>
            <div>
              <dt>A checklist you approve</dt>
              <dd>The project is finished when it passes the acceptance checklist, not before.</dd>
            </div>
            <div>
              <dt>Yours to keep</dt>
              <dd>You own the code, content and data at final payment.</dd>
            </div>
            <div>
              <dt>English and Spanish</dt>
              <dd>For companies across the US and Latin America.</dd>
            </div>
          </dl>
          <p className="hm-fineprint">
            We don’t guarantee traffic, rankings or revenue. We guarantee what we agreed to build.
          </p>
        </div>
      </div>
    </section>
  );
}

/** Our own products, at their real stage. */
export function HomeProducts() {
  return (
    <section id="products" aria-labelledby="products-heading" className="hm-section hm-products">
      <div className="container">
        <div className="hm-head">
          <h2 id="products-heading">Products we build and operate.</h2>
          <p className="lead">Our own software, each shown at its real stage.</p>
        </div>
        <ul className="hm-product-grid">
          {CYRYX_PRODUCTS.map((product) => {
            const link = product.primary;
            const onClick = () =>
              trackCta({ cta: "view_product", section: "product", href: link.href });
            return (
              <li key={product.id} id={product.id} className="hm-product">
                <h3 className="hm-product__name">{product.name}</h3>
                <p className="hm-product__category">{product.category}</p>
                <p className="hm-product__stage" data-stage={product.stage}>
                  {product.stage}
                </p>
                <p className="hm-product__summary">{product.summary}</p>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hm-textlink hm-product__link"
                    onClick={onClick}
                  >
                    {link.label}
                    <span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <a href={link.href} className="hm-textlink hm-product__link" onClick={onClick}>
                    {link.label}
                  </a>
                )}
              </li>
            );
          })}
        </ul>
        <p className="hm-products__foot">
          <a
            href="https://www.npmjs.com/package/@aexos/core"
            target="_blank"
            rel="noopener noreferrer"
            className="hm-textlink"
            onClick={() =>
              trackCta({
                cta: "proof_link",
                section: "product",
                href: "https://www.npmjs.com/package/@aexos/core",
              })
            }
          >
            @aexos/core on npm
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
          <Link
            to="/research/$slug"
            params={{ slug: "cgp-v1" }}
            className="hm-textlink"
            onClick={() =>
              trackCta({ cta: "read_cgp", section: "research_band", href: "/research/cgp-v1" })
            }
          >
            Cyryx Governance Protocol v1, DOI 10.5281/zenodo.21045760
          </Link>
          <Link
            to="/products"
            className="hm-textlink"
            onClick={() => trackCta({ cta: "view_product", section: "product", href: "/products" })}
          >
            All products
          </Link>
        </p>
      </div>
    </section>
  );
}

/** Control: the limits every AI system ships with. */
export function HomeControl() {
  const href = "/solutions/ai-governance-cost-control";
  return (
    <section
      id="control"
      aria-labelledby="control-heading"
      className="hm-section hm-band hm-control"
    >
      <div className="container">
        <div className="hm-head hm-head--split">
          <h2 id="control-heading">AI within limits you set.</h2>
          <p className="lead">Every AI system we deliver ships with these three controls.</p>
        </div>
        <ol className="hm-rules">
          <li>
            <h3>Written limits</h3>
            <p>What it may read, change and spend, set before launch.</p>
          </li>
          <li>
            <h3>A person approves</h3>
            <p>Anything that leaves your company waits for a yes.</p>
          </li>
          <li>
            <h3>A record of every step</h3>
            <p>An activity log you can read, export and audit.</p>
          </li>
        </ol>
        <p className="hm-control__more">
          <Link
            to={href}
            className="hm-textlink"
            onClick={() => trackCta({ cta: "see_how_we_work", section: "operating_model", href })}
          >
            How we set AI limits
          </Link>
        </p>
      </div>
    </section>
  );
}

/** The questions people ask before they call; mirrors the FAQPage JSON-LD. */
export function HomeQuestions() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="hm-section hm-faq">
      <div className="container hm-faq__grid">
        <h2 id="faq-heading">Questions clients ask first.</h2>
        <div className="hm-faq__list">
          {FAQ_ITEMS.map((item) => (
            <details key={item.q} className="hm-faq__item">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

const START_STEPS = [
  {
    title: "Get a free fit check",
    body: "A short form, then a 20-minute call. We tell you honestly whether to build.",
  },
  {
    title: "Receive a fixed plan and quote",
    body: "Scope, timeline, acceptance checklist and price, in writing.",
  },
  {
    title: "Launch, and keep improving",
    body: "We launch and train your team. Ongoing care is optional.",
  },
] as const;

/** The close: the three real steps and the fit check. */
export function HomeStart() {
  const copy = getCopy(useCopyVariant()).finalCta;
  const startHref = buildStartProjectHref({ source: "home" });
  const assistantEnabled = isAssistantEnabled();
  return (
    <section id="contact" aria-labelledby="contact-heading" className="hm-section hm-start">
      <div className="container hm-start__grid">
        <div className="hm-start__text">
          <h2 id="contact-heading">{copy.headline}</h2>
          <p className="lead">{copy.body}</p>
          <div className="hm-actions">
            <a
              href={startHref}
              className="hm-btn hm-btn--primary"
              onClick={() =>
                trackCta({ cta: "start_project", section: "final_cta", href: startHref })
              }
            >
              {copy.ctaPrimary}
            </a>
            <Link
              to="/engagement-model"
              className="hm-btn hm-btn--quiet"
              onClick={() =>
                trackCta({
                  cta: "see_how_we_work",
                  section: "final_cta",
                  href: "/engagement-model",
                })
              }
            >
              {copy.ctaSecondary}
            </Link>
          </div>
          {assistantEnabled && (
            <button
              type="button"
              className="hm-textlink"
              onClick={() => openAssistant("final_cta")}
            >
              Ask a question first
            </button>
          )}
        </div>
        <ol className="hm-steps">
          {START_STEPS.map((step) => (
            <li key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
