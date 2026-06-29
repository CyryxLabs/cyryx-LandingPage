import { createFileRoute } from "@tanstack/react-router";
import { SolutionPage } from "@/components/cyryx/seo/SolutionPage";
import {
  buildBreadcrumbJsonLd,
  buildHead,
  buildServiceJsonLd,
} from "@/components/cyryx/seo/seo";

const PATH = "/solutions/custom-ai-product-development";
const TITLE = "Custom AI product development — Cyryx Labs";
const DESC = "End-to-end design and engineering of custom AI products built on the same governance primitives as MAAX Studio.";

export const Route = createFileRoute("/solutions/custom-ai-product-development")({
  head: () =>
    buildHead(
      { title: TITLE, description: DESC, path: PATH },
      [
        buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
          { name: "Custom AI product development", path: PATH },
        ]),
        buildServiceJsonLd({
          name: "Custom AI product development",
          serviceType: "AI product engineering",
          description: DESC,
          path: PATH,
        }),
      ],
    ),
  component: () => (
    <SolutionPage
      eyebrow="Custom AI Product Development"
      title="Custom AI products engineered to ship."
      directAnswer="Cyryx Labs partners with founders and product teams to design and build custom AI products end to end: positioning, architecture, runtime, gates, evaluators, UI, and deployment. We bring the same execution primitives that power MAAX Studio to each engagement, so the product you ship is governed and operable from day one."
      whatItIs="A senior, opinionated product engineering partnership focused on AI-native software — from problem definition through production. We build, not advise."
      whoItIsFor={[
        "Founders shipping AI-native products who need engineering depth instead of agency throughput.",
        "Product teams inside larger companies launching new AI products as separate units.",
        "Operators with a strong wedge but no AI execution architecture.",
      ]}
      whatWeBuild={[
        "Product architecture grounded in missions, gates, and ledgers.",
        "AI runtime and orchestration tailored to the product domain.",
        "Front-end experiences that surface governance instead of hiding it.",
        "Evaluators and regression suites that scale with the product.",
        "Operability handoff: dashboards, runbooks, on-call hygiene.",
      ]}
      howWeWork={[
        "Frame the product as missions and outcomes, not features.",
        "Architect the execution layer before the UI.",
        "Ship a vertical slice end to end, then iterate against real users.",
        "Transition operability to your team on a defined schedule.",
      ]}
      outcomes={[
        "A product that ships with governance, observability, and evaluation built in.",
        "Architectural clarity that survives model upgrades and team changes.",
        "Less rework when scaling to new use cases.",
        "A team that owns and can evolve the system after the engagement.",
      ]}
      relatedAnswers={[
        { label: "AI execution system vs AI automation", href: "/answers/ai-execution-system-vs-ai-automation" },
        { label: "What is governed AI execution?", href: "/answers/what-is-governed-ai-execution" },
        { label: "What is goal-grounded generation?", href: "/answers/what-is-goal-grounded-generation" },
      ]}
    />
  ),
});