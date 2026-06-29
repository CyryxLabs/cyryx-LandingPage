import { createFileRoute } from "@tanstack/react-router";
import { SolutionPage } from "@/components/cyryx/seo/SolutionPage";
import {
  buildBreadcrumbJsonLd,
  buildHead,
  buildServiceJsonLd,
} from "@/components/cyryx/seo/seo";

const PATH = "/solutions/ai-integrations";
const TITLE = "AI integrations — Cyryx Labs";
const DESC = "Production-grade AI integrations into your CRM, billing, support, and data tools — with governance and observability included.";

export const Route = createFileRoute("/solutions/ai-integrations")({
  head: () =>
    buildHead(
      { title: TITLE, description: DESC, path: PATH },
      [
        buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
          { name: "AI integrations", path: PATH },
        ]),
        buildServiceJsonLd({
          name: "AI integrations",
          serviceType: "AI integration engineering",
          description: DESC,
          path: PATH,
        }),
      ],
    ),
  component: () => (
    <SolutionPage
      eyebrow="AI Integrations"
      title="AI integrations that hold up under real load."
      directAnswer="Cyryx Labs builds and stabilizes AI integrations across your existing stack — CRM, billing, support, data warehouse, internal APIs. Every integration ships with input validation, command gates, retry semantics, and observability, so the AI layer behaves like infrastructure rather than a science project."
      whatItIs="Targeted integration engagements that connect AI capabilities into the systems your business already runs on, with the same governance discipline as a custom product build."
      whoItIsFor={[
        "Teams whose AI tools work in isolation but break when wired into production systems.",
        "Companies replacing fragile no-code glue with engineered integrations.",
        "Operators standardizing how AI talks to revenue and operations systems.",
      ]}
      whatWeBuild={[
        "Connectors with explicit input/output contracts.",
        "Gates for policy, scope, and rate-control before downstream writes.",
        "Idempotency, retry, and reconciliation strategies for AI-driven actions.",
        "Observability dashboards for cost, latency, and failure modes.",
        "Documentation and runbooks for ongoing operability.",
      ]}
      howWeWork={[
        "Inventory the systems and actions AI needs to touch.",
        "Define contracts, gates, and failure handling per integration.",
        "Implement, instrument, and stage behind feature flags.",
        "Roll out incrementally with rollback paths.",
      ]}
      outcomes={[
        "Stable AI-driven actions across production systems.",
        "Clear cost-per-action visibility instead of opaque model bills.",
        "Fewer late-night incidents traced to AI-side glue.",
        "A pattern your team can replicate for the next integration.",
      ]}
      relatedAnswers={[
        { label: "What are command gates in AI systems?", href: "/answers/what-are-command-gates-in-ai-systems" },
        { label: "AI execution system vs AI automation", href: "/answers/ai-execution-system-vs-ai-automation" },
        { label: "How to measure AI output quality", href: "/answers/how-to-measure-ai-output-quality" },
      ]}
    />
  ),
});