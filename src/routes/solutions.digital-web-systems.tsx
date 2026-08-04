import { createFileRoute } from "@tanstack/react-router";
import { SolutionPage } from "@/components/cyryx/seo/SolutionPage";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildHead,
  buildServiceJsonLd,
} from "@/components/cyryx/seo/seo";

const PATH = "/solutions/digital-web-systems";
const TITLE = "Digital & Web Systems — Cyryx Labs";
const DESC =
  "Enterprise websites and connected digital systems designed for clarity, conversion, integration, measurement, and long-term ownership.";

const FAQ = [
  {
    q: "Is this only website design?",
    a: "No. The visual experience matters, but Cyryx also treats the website as an operating system for messaging, content, lead capture, analytics, integrations, and future product or automation needs.",
  },
  {
    q: "Do you guarantee traffic, ranking, leads, or revenue?",
    a: "No. We design and engineer the digital foundation, measurement, and conversion paths in scope. Market demand, media, content, competition, and sales execution also shape commercial outcomes.",
  },
  {
    q: "Can the site connect to our CRM and operating tools?",
    a: "Yes, when those integrations are included in scope and supported by the selected platforms, access, and data model. Integration behavior and ownership are documented before launch.",
  },
  {
    q: "How are ownership and continuing care handled?",
    a: "Domain, platform, code, design, content, credentials, licensing, support, and transfer terms are defined for the engagement. Continuing care is optional and governed by a written operating scope.",
  },
];

export const Route = createFileRoute("/solutions/digital-web-systems")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Solutions", path: "/solutions" },
        { name: "Digital & Web Systems", path: PATH },
      ]),
      buildServiceJsonLd({
        name: "Digital & Web Systems",
        serviceType: "Website strategy, design, engineering, and integration",
        description: DESC,
        path: PATH,
      }),
      buildFaqJsonLd(FAQ),
    ]),
  component: () => (
    <SolutionPage
      startIntent="digital-system"
      eyebrow="Digital & Web Systems"
      title="Make the digital experience earn attention—and support the operation."
      directAnswer="Cyryx designs and engineers websites and connected digital systems that help the right audience understand the business, trust the offer, and take the next step. Behind the interface, we establish the content, measurement, integration, and ownership foundations required to keep the system useful."
      whatItIs="A strategy, narrative, experience-design, and engineering engagement for public websites, digital platforms, conversion paths, and the selected systems connected to them."
      whoItIsFor={[
        "Companies whose current website no longer reflects the business or buyer journey.",
        "Teams preparing a new category, offer, product, or market-facing narrative.",
        "Organizations that need the website connected to measurement, CRM, content, or workflow systems.",
      ]}
      whatWeBuild={[
        "Positioning hierarchy, page architecture, and narrative flow for the target audience.",
        "Responsive visual systems aligned to the approved brand direction.",
        "Accessible, performant front-end and content architecture.",
        "Lead, contact, analytics, CMS, CRM, and workflow integrations included in scope.",
        "Launch, ownership, documentation, and optional continuing care.",
      ]}
      howWeWork={[
        "Understand the business, audience, offer, current evidence, and desired decision path.",
        "Design the information architecture, story, visual system, and conversion journey.",
        "Build the experience and connect the selected operating systems.",
        "Validate content, accessibility, responsive behavior, performance, and analytics.",
        "Launch with clear ownership, documentation, and an agreed care model if required.",
      ]}
      challenges={[
        "A visual redesign that leaves the positioning and buyer journey unresolved.",
        "Pages that describe the company without explaining why a buyer should act.",
        "Lead capture disconnected from the team's real follow-up process.",
        "Motion that competes with readability, accessibility, or performance.",
        "A launch with unclear platform, content, credential, and support ownership.",
      ]}
      architecture={[
        {
          name: "Narrative",
          detail:
            "Positioning, proof, audience questions, information hierarchy, and calls to action.",
        },
        {
          name: "Experience",
          detail:
            "Responsive layout, brand expression, interaction, motion, accessibility, and content behavior.",
        },
        {
          name: "Platform",
          detail:
            "Front-end, content system, hosting, deployment, analytics, and technical search foundations.",
        },
        {
          name: "Connections",
          detail:
            "Forms, CRM, notifications, workflows, and other integrations included in the engagement.",
        },
        {
          name: "Operations",
          detail: "Ownership, publishing, monitoring, change, and optional continuing care.",
        },
      ]}
      deliverables={[
        {
          phase: "Strategy & story",
          duration: "Engagement-defined",
          scope:
            "Clarify the audience, offer, evidence, information architecture, and decision path.",
          outputs: [
            "Messaging and page architecture",
            "Content requirements",
            "Experience direction",
          ],
        },
        {
          phase: "Design",
          duration: "Engagement-defined",
          scope:
            "Translate the approved brand and narrative into a responsive visual and interaction system.",
          outputs: [
            "Key page designs",
            "Component and motion system",
            "Responsive behavior direction",
          ],
        },
        {
          phase: "Build & connect",
          duration: "Engagement-defined",
          scope:
            "Engineer the approved experience and implement the selected content, analytics, and integrations.",
          outputs: [
            "Working digital system",
            "Integrated conversion paths",
            "Content and analytics setup",
          ],
        },
        {
          phase: "Validate & launch",
          duration: "Engagement-defined",
          scope:
            "Test material journeys, accessibility, responsive behavior, performance, analytics, and ownership before release.",
          outputs: [
            "Launch readiness evidence",
            "Handover and documentation",
            "Optional care agreement",
          ],
        },
      ]}
      kpis={[
        {
          metric: "Message comprehension",
          detail:
            "Whether target users can understand the company, relevance, and next step from the experience.",
        },
        {
          metric: "Journey completion",
          detail:
            "Completion of the agreed high-value paths such as inquiry, qualification, application, or product exploration.",
        },
        {
          metric: "Experience quality",
          detail:
            "The agreed accessibility, responsive, performance, and usability signals for the system.",
        },
        {
          metric: "Operational reliability",
          detail:
            "Whether content, forms, analytics, integrations, and ownership work as documented.",
        },
      ]}
      outcomes={[
        "A clearer market story for the audience the business needs to reach.",
        "A distinctive digital experience that remains usable and credible.",
        "Conversion paths connected to measurement and follow-up ownership.",
        "A maintainable platform prepared for the next stage of the business.",
      ]}
      faq={FAQ}
      engagementNote="Scope, timing, commercial terms, content responsibilities, revision and acceptance process, platform and third-party costs, ownership, licensing, support, and continuing care are defined for each engagement."
      relatedAnswers={[
        { label: "Explore workflow automation", href: "/solutions/workflow-automation" },
        { label: "Explore custom AI products", href: "/solutions/custom-ai-product-development" },
        { label: "See the engagement model", href: "/engagement-model" },
      ]}
    />
  ),
});
