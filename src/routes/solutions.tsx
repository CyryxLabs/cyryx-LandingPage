import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import {
  FinalCta,
  PageHero,
  SectionHead,
  ServiceIcon,
  SourceNote,
  StartButton,
} from "@/components/site/ui";
import { buildBreadcrumbJsonLd, buildHead, buildWebPageJsonLd } from "@/components/cyryx/seo/seo";
import { ADOPTION_GAP, MARKET_REVIEWED } from "@/data/market";
import { SERVICES, type ServiceStage } from "@/data/services";
import { absoluteSiteUrl } from "@/lib/site-url";

const PATH = "/solutions";
const TITLE = "AI Solutions for US Businesses | Cyryx Labs";
const DESC =
  "Ten AI services for US companies: strategy, workflow automation, AI agents, systems integration, data readiness, governance, training and operations.";

const STAGES: readonly { stage: ServiceStage; title: string; line: string }[] = [
  {
    stage: "Advise",
    title: "Advise",
    line: "Decide what is worth building, and prepare your people for it.",
  },
  { stage: "Build", title: "Build", line: "Ship the automation, agent, integration or product." },
  { stage: "Control", title: "Control", line: "Keep AI inside rules, permissions and a budget." },
  { stage: "Operate", title: "Operate", line: "Keep it running and improving after launch." },
];

export const Route = createFileRoute("/solutions")({
  head: ({ matches }) => {
    const leafPath = matches.at(-1)?.pathname.replace(/\/$/, "") || "/";
    if (leafPath !== PATH) return {};
    return buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Solutions", path: PATH },
      ]),
      buildWebPageJsonLd({
        name: TITLE,
        description: DESC,
        path: PATH,
        dateModified: MARKET_REVIEWED,
      }),
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Cyryx Labs AI services",
        itemListElement: SERVICES.map((service, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: service.name,
          url: absoluteSiteUrl(service.path),
        })),
      },
    ]);
  },
  component: SolutionsHub,
});

function SolutionsHub() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  if (pathname !== "/solutions" && pathname !== "/solutions/") return <Outlet />;

  return (
    <SiteShell source="solutions">
      <PageHero
        crumbs={[{ name: "Home", path: "/" }, { name: "Solutions" }]}
        eyebrow="Solutions"
        title="Every obstacle between you and working AI has a service."
        lead="Cyryx Labs offers ten AI services for US companies, grouped into four stages: Advise, Build, Control and Operate. Take one on its own or connect several into a program."
      >
        <StartButton section="hero" source="solutions" />
        <a href="#services" className="cy-btn cy-btn--ghost">
          Browse all ten
        </a>
      </PageHero>

      <section id="services" className="cy-section" aria-label="Services by stage">
        <div className="cy-container" style={{ display: "grid", gap: "clamp(56px, 7vw, 104px)" }}>
          {STAGES.map((group) => {
            const services = SERVICES.filter((service) => service.stage === group.stage);
            return (
              <div key={group.stage}>
                <SectionHead
                  id={`stage-${group.stage.toLowerCase()}`}
                  eyebrow={`Stage · ${group.title}`}
                  title={group.line}
                />
                <div className="cy-grid cy-grid--3">
                  {services.map((service, index) => (
                    <Link
                      key={service.slug}
                      to={service.path}
                      className="cy-card cy-spot"
                      data-cy-reveal
                      style={{ "--cy-i": index } as React.CSSProperties}
                    >
                      <ServiceIcon name={service.icon} />
                      <h3 className="cy-h3">{service.name}</h3>
                      <p>{service.cardLine}</p>
                      <p className="cy-card__pain">{service.cardPain}</p>
                      <span className="cy-card__go">
                        Learn more <span aria-hidden="true">→</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="cy-section cy-section--alt" aria-labelledby="why-heading">
        <div className="cy-container">
          <SectionHead
            id="why-heading"
            eyebrow="Market context"
            title="Most companies use AI. Few have it built into core work."
            lead="Figures from 2026 third-party surveys, linked to each publisher's page. They describe the market, not Cyryx Labs results."
            split
          />
          <div className="cy-stats">
            {ADOPTION_GAP.map((item, index) => (
              <article
                key={item.id}
                className="cy-stat"
                data-cy-reveal
                style={{ "--cy-i": index } as React.CSSProperties}
              >
                <p className="cy-product__cat">{item.segment}</p>
                <div className="cy-stat__pair">
                  <span className="cy-stat__big">{item.uses}%</span>
                  <span className="cy-stat__vs">
                    {item.works}%<small>working</small>
                  </span>
                </div>
                <p>
                  {item.uses}% {item.usesLabel}. Only {item.works}% {item.worksLabel}.
                </p>
                <SourceNote id={item.source} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <FinalCta source="solutions" />
    </SiteShell>
  );
}
