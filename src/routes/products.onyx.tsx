import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Faq, PageHero, SectionHead } from "@/components/site/ui";
import { OnyxPortrait, OnyxScreens } from "@/components/site/ProductShowcase";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildHead,
  buildWebPageJsonLd,
} from "@/components/cyryx/seo/seo";
import {
  ONYX_AVAILABILITY,
  ONYX_BETA,
  ONYX_CONTROL,
  ONYX_DAY,
  ONYX_FAQ,
  ONYX_HEADLINE,
  ONYX_HOW,
  ONYX_SITE,
  ONYX_SKILLS,
  ONYX_STATS,
  ONYX_SUMMARY,
} from "@/data/onyx";
import { trackCta } from "@/lib/track-cta";

const PATH = "/products/onyx";
const TITLE = "Onyx — AI Coworker for Windows | Cyryx Labs";
const DESC =
  "Onyx is an AI coworker by Cyryx Labs for your Windows PC: live voice, inbox, research, your apps and a memory kept on your PC. Free beta for Windows 10 and 11.";
const FAQ = ONYX_FAQ;

function OnyxLink({ section, label }: { section: "product" | "final_cta"; label: string }) {
  return (
    <a
      href={ONYX_SITE}
      target="_blank"
      rel="noopener noreferrer"
      className="cy-btn cy-btn--primary"
      onClick={() => trackCta({ cta: "view_product", section, href: ONYX_SITE })}
    >
      {label}
      <ArrowUpRight aria-hidden="true" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export const Route = createFileRoute("/products/onyx")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH, ogType: "product" }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
        { name: "Onyx", path: PATH },
      ]),
      buildWebPageJsonLd({ name: TITLE, description: DESC, path: PATH }),
      buildFaqJsonLd(FAQ.map((item) => ({ q: item.q, a: item.a }))),
    ]),
  component: OnyxPage,
});

function OnyxPage() {
  return (
    <SiteShell source="products" sticky={false}>
      <PageHero
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: "Onyx" },
        ]}
        eyebrow="Onyx · AI coworker for Windows · Free beta"
        title={ONYX_HEADLINE}
        lead={ONYX_SUMMARY}
        aside={<OnyxPortrait priority />}
      >
        <OnyxLink section="product" label="Get the free beta at onyx.cyryxlabs.com" />
      </PageHero>

      <section className="cy-section cy-section--tight" aria-label="Onyx at a glance">
        <div className="cy-container" style={{ display: "grid", gap: 26 }}>
          <dl className="cy-show__stats" data-cy-reveal>
            {ONYX_STATS.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
          <ul className="cy-show__chips" aria-label="What Onyx does" data-cy-reveal>
            {ONYX_SKILLS.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
          <p className="cy-show__note" data-cy-reveal>
            {ONYX_AVAILABILITY}
          </p>
        </div>
      </section>

      <section className="cy-section cy-section--alt" aria-labelledby="onyx-how-heading">
        <div className="cy-container">
          <SectionHead
            id="onyx-how-heading"
            eyebrow="How it works"
            title="Not a chat window. A coworker on your PC."
            lead="Onyx runs on your machine, in a window of its own. You talk, it answers out loud, and when words aren't enough it opens the work in front of you."
            split
          />
          <ul className="cy-how">
            {ONYX_HOW.map((item, index) => (
              <li
                key={item.title}
                data-cy-reveal
                style={{ "--cy-i": index % 2 } as React.CSSProperties}
              >
                <div className="cy-how__shot">
                  <img
                    src={item.image}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="cy-how__text">
                  <span className="cy-card__n">{String(index + 1).padStart(2, "0")}</span>
                  <h3 className="cy-h3">{item.title}</h3>
                  <p className="cy-muted">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="cy-show__note" style={{ marginTop: 18 }} data-cy-reveal>
            Real Onyx windows, captured with example data.
          </p>
        </div>
      </section>

      <section className="cy-section" aria-labelledby="onyx-day-heading">
        <div className="cy-container">
          <SectionHead
            id="onyx-day-heading"
            eyebrow="A day with Onyx"
            title="It works while you sleep."
            lead="One owner, one ordinary Tuesday."
            split
          />
          <ol className="cy-day">
            {ONYX_DAY.map((item) => (
              <li key={item.time} data-cy-reveal>
                <time>{item.time}</time>
                <h3 className="cy-h3">{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="cy-section cy-section--alt" aria-labelledby="onyx-cc-heading">
        <div className="cy-container">
          <SectionHead
            id="onyx-cc-heading"
            eyebrow="Command Center"
            title="Everything it does, on one board."
            lead="The Command Center shows your day, Onyx's live work, your calendar, mail and a neural map of your Second Brain."
            split
          />
          <OnyxScreens />
        </div>
      </section>

      <section className="cy-section" aria-labelledby="onyx-control-heading">
        <div className="cy-container">
          <SectionHead
            id="onyx-control-heading"
            eyebrow="Control"
            title="Powerful. On a leash you hold."
            lead="Onyx isn't a person, and it doesn't replace your judgement. It takes the repeatable work off your desk and hands back what needs a human."
            split
          />
          <ul className="cy-guard">
            {ONYX_CONTROL.map((item, index) => (
              <li
                key={item.title}
                data-cy-reveal
                style={{ "--cy-i": index % 3 } as React.CSSProperties}
              >
                <span className="cy-card__n">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="cy-h3">{item.title}</h3>
                <p className="cy-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="cy-section cy-section--alt" aria-labelledby="onyx-beta-heading">
        <div className="cy-container">
          <SectionHead
            id="onyx-beta-heading"
            eyebrow="Beta"
            title="Join the beta. It's free."
            lead="Download Onyx, install it on your PC and put it to work. Setup walks you through your free AI keys in a few minutes."
            split
          >
            <OnyxLink section="product" label="Open the Onyx site" />
          </SectionHead>
          <ul className="cy-grid cy-grid--2">
            {ONYX_BETA.map((item, index) => (
              <li
                key={item.title}
                className="cy-card cy-spot"
                data-cy-reveal
                style={{ "--cy-i": index % 2 } as React.CSSProperties}
              >
                <h3 className="cy-h3">{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="cy-section" aria-labelledby="onyx-faq-heading">
        <div className="cy-container cy-split">
          <div className="cy-split__aside">
            <p className="cy-eyebrow" data-cy-reveal>
              Questions
            </p>
            <h2 id="onyx-faq-heading" className="cy-h2" data-cy-reveal>
              About Onyx.
            </h2>
            <p className="cy-muted" data-cy-reveal>
              Need an assistant for a whole team?{" "}
              <Link to="/solutions/internal-ai-assistants" className="cy-link cy-link--under">
                See AI Agents &amp; Assistants
              </Link>
            </p>
          </div>
          <Faq items={FAQ} idPrefix="onyx-faq" />
        </div>
      </section>

      <section className="cy-section" aria-labelledby="onyx-cta-heading">
        <div className="cy-container">
          <div className="cy-final" data-cy-reveal="scale">
            <div style={{ display: "grid", gap: 22, justifyItems: "center" }}>
              <h2 id="onyx-cta-heading" className="cy-h2">
                Your next hire doesn&apos;t need a desk.
              </h2>
              <p className="cy-lead">
                Onyx is free while in beta, for Windows 10 and 11. The download is on the Onyx site.
              </p>
              <div className="cy-actions">
                <OnyxLink section="final_cta" label="Get the free beta" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
