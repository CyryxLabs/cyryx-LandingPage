import { createFileRoute } from "@tanstack/react-router";
import { SolutionPage } from "@/components/cyryx/seo/SolutionPage";
import {
  buildBreadcrumbJsonLd,
  buildHead,
  buildServiceJsonLd,
} from "@/components/cyryx/seo/seo";

const PATH = "/solutions/ai-websites-lead-systems";
const TITLE = "AI websites & lead systems — Cyryx Labs";
const DESC = "AI-native websites and lead systems engineered for execution: structured intake, qualified routing, and governed AI follow-up.";

export const Route = createFileRoute("/solutions/ai-websites-lead-systems")({
  head: () =>
    buildHead(
      { title: TITLE, description: DESC, path: PATH },
      [
        buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
          { name: "AI websites & lead systems", path: PATH },
        ]),
        buildServiceJsonLd({
          name: "AI websites & lead systems",
          serviceType: "AI website and lead system engineering",
          description: DESC,
          path: PATH,
        }),
      ],
    ),
  component: () => (
    <SolutionPage
      eyebrow="AI Websites & Lead Systems"
      title="AI websites and lead systems that actually convert."
      directAnswer="Cyryx Labs designs and ships AI-native websites and lead systems with structured intake, qualified routing, and governed AI follow-up. We treat the site as the front-end of an execution system, not a brochure — every form, conversation, and reply is wired to a verified outcome."
      whatItIs="An end-to-end front-end + capture + follow-up layer where AI handles qualification, enrichment, and first-touch responses under explicit governance. The visible site is the surface; the underlying system runs goal-grounded conversations and routes only verified leads to humans."
      whoItIsFor={[
        "Founder-led companies whose websites under-convert qualified traffic.",
        "Operators replacing legacy chatbots and contact forms with governed AI flows.",
        "Teams running paid acquisition where slow or low-quality follow-up wastes spend.",
      ]}
      whatWeBuild={[
        "AI-native site builds on a modern stack with measured Core Web Vitals.",
        "Structured intake flows that capture intent and acceptance criteria, not just contact details.",
        "Goal-grounded AI conversations with command gates for tone, policy, and data handling.",
        "Routing to humans only for leads that pass qualification gates; instant first-touch otherwise.",
        "Analytics wired to mission outcomes (booked call, signed scope), not vanity metrics.",
      ]}
      howWeWork={[
        "Discovery: define the lead mission, acceptance criteria, and disqualifiers.",
        "Architecture: capture flows, AI components, gates, and human escalation paths.",
        "Build: ship in iterations, instrumented from day one.",
        "Govern: tune gates against real conversation traces and human verdicts.",
      ]}
      outcomes={[
        "Higher percentage of contacts that are usable by sales.",
        "Shorter time from first visit to verified next step.",
        "Lower hidden cost from chasing unqualified or hallucinated leads.",
        "Auditable trail of every AI-driven interaction.",
      ]}
      relatedAnswers={[
        { label: "What is governed AI execution?", href: "/answers/what-is-governed-ai-execution" },
        { label: "AI execution system vs AI automation", href: "/answers/ai-execution-system-vs-ai-automation" },
        { label: "What are command gates in AI systems?", href: "/answers/what-are-command-gates-in-ai-systems" },
      ]}
    />
  ),
});