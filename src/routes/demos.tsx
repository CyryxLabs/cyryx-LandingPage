import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { FinalCta, PageHero, SectionHead } from "@/components/site/ui";
import { WorkflowDemo } from "@/components/home/WorkflowDemo";
import { buildBreadcrumbJsonLd, buildHead, buildWebPageJsonLd } from "@/components/cyryx/seo/seo";
import { EVIDENCE, WORKFLOW_DEMO } from "@/data/home";

const PATH = "/demos";
const TITLE = "Demos | Cyryx Labs";
const DESC =
  "See how Cyryx Labs works: an interactive workflow demo with sample data and labelled product examples that say what is real and what is simulated.";

export const Route = createFileRoute("/demos")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Demos", path: PATH },
      ]),
      buildWebPageJsonLd({ name: TITLE, description: DESC, path: PATH }),
    ]),
  component: DemosPage,
});

function DemosPage() {
  return (
    <SiteShell source="demos">
      <PageHero
        crumbs={[{ name: "Home", path: "/" }, { name: "Demos" }]}
        eyebrow="Demos"
        title="See how the work moves."
        lead="Every example on this page says what it is—internal demo or internal product—what is real, and what is simulated. Client case studies will be added only with the client’s approval."
      >
        <a href="#workflow" className="cy-btn cy-btn--primary">
          Open the workflow demo
        </a>
        <a href="#examples" className="cy-btn cy-btn--ghost">
          Product examples
        </a>
      </PageHero>

      <section id="workflow" className="cy-section hm" aria-labelledby="demo-wf-heading">
        <div className="cy-container">
          <SectionHead
            id="demo-wf-heading"
            eyebrow="Internal demo · sample data"
            title={WORKFLOW_DEMO.title}
            lead={WORKFLOW_DEMO.lead}
            split
          />
          <WorkflowDemo section="demos" />
          <p className="hm-disclaim" style={{ marginTop: 20 }}>
            <b>{WORKFLOW_DEMO.label}</b> {WORKFLOW_DEMO.note}
          </p>
        </div>
      </section>

      <section id="examples" className="cy-section hm" aria-labelledby="demo-ex-heading">
        <div className="cy-container">
          <SectionHead
            id="demo-ex-heading"
            eyebrow="Examples"
            title="What each example shows"
            lead="Labels: Internal product, Internal demo, Client work, Concept. Only the first two exist today."
            split
          />
          <div className="hm-ev">
            {EVIDENCE.map((item) => (
              <article className="hm-evc" key={item.title}>
                <span className="hm-tag">{item.type}</span>
                <h3>{item.title}</h3>
                <dl>
                  <div>
                    <dt>What is real</dt>
                    <dd>{item.real}</dd>
                  </div>
                  <div>
                    <dt>What is simulated</dt>
                    <dd>{item.simulated}</dd>
                  </div>
                </dl>
                {item.href === PATH ? (
                  <a className="hm-lnk" href="#workflow">
                    Open the demo <span aria-hidden="true">→</span>
                  </a>
                ) : (
                  <Link className="hm-lnk" to={item.href}>
                    {item.cta} <span aria-hidden="true">→</span>
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <FinalCta
        title="Have a workflow like this?"
        lead="Tell us about the task, the tools, and what needs to change. We will help define whether a product, an integration, or a custom build is the right next step."
        source="demos"
        intent="workflow-automation"
      />
    </SiteShell>
  );
}
