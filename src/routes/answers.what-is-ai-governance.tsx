import { createFileRoute } from "@tanstack/react-router";
import { AnswerPage } from "@/components/cyryx/seo/AnswerPage";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildHead,
  buildTechArticleJsonLd,
} from "@/components/cyryx/seo/seo";

const PATH = "/answers/what-is-ai-governance";
const TITLE = "What is AI governance? | Cyryx Labs";
const DESC =
  "AI governance assigns authority, rules, evidence, and oversight across the lifecycle of AI systems so organizations can direct and control their use.";

const faqs = [
  {
    q: "Is AI governance the same as AI compliance?",
    a: "No. Compliance addresses applicable obligations. Governance is the broader operating system for deciding who has authority, how risk is managed, what evidence is required, and how an AI system is monitored throughout its lifecycle.",
  },
  {
    q: "Does every AI use case need the same controls?",
    a: "No. Controls should reflect context, affected people, system authority, applicable obligations, and the severity and reversibility of potential harm. A low-impact drafting aid and a system that changes customer eligibility should not share one undifferentiated approval path.",
  },
  {
    q: "Can an AI governance framework guarantee that an AI system is safe?",
    a: "No. A framework can improve how risks, evidence, decisions, and accountability are managed; it cannot eliminate uncertainty or guarantee that every outcome will be safe or compliant.",
  },
  {
    q: "Is this page legal advice about the EU AI Act?",
    a: "No. This explainer provides an engineering and operating perspective. Organizations should obtain qualified legal advice for their specific systems, roles, jurisdictions, and obligations.",
  },
];

export const Route = createFileRoute("/answers/what-is-ai-governance")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH, ogType: "article" }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Answers", path: "/answers" },
        { name: "AI governance", path: PATH },
      ]),
      buildFaqJsonLd(faqs),
      buildTechArticleJsonLd({
        headline: "What is AI governance?",
        description: DESC,
        path: PATH,
        datePublished: "2026-08-17",
        dateModified: "2026-08-17",
        authors: ["Cyryx Labs"],
        authorType: "Organization",
        keywords: ["AI governance", "AI risk management", "responsible AI"],
      }),
    ]),
  component: () => (
    <AnswerPage
      eyebrow="AI governance"
      title="What is AI governance?"
      directAnswer="AI governance is the system of decision rights, policies, processes, evidence, and oversight used to direct and control how an organization develops, procures, deploys, operates, and retires AI. It connects business objectives to accountable owners, risk-based controls, lifecycle records, monitoring, and escalation rather than treating governance as a one-time model review."
      definition={[
        "AI governance establishes who can make which decisions about an AI system, what evidence those decisions require, and how the organization verifies that the system remains within its intended purpose and risk boundaries over time.",
        "NIST AI RMF organizes AI risk work around Govern, Map, Measure, and Manage. ISO/IEC 42001 describes requirements for an AI management system. The EU AI Act establishes legal obligations for defined actors and uses risk-based requirements. These sources overlap, but they are not interchangeable: a risk framework, a management-system standard, and a law serve different functions.",
      ]}
      whyItMatters={[
        "AI failures are often organizational as well as technical: unclear ownership, missing evidence, unapproved changes, weak escalation, or a gap between policy and runtime behavior.",
        "Governance gives leaders a repeatable way to decide which AI uses are acceptable, which controls are proportionate, and when a system must be changed, paused, or retired.",
      ]}
      howItWorks={[
        "Inventory the AI system and its context: intended purpose, users, affected parties, data, dependencies, deployment conditions, and system authority.",
        "Assign decision rights and accountability across business, product, engineering, security, privacy, legal, risk, and operations.",
        "Classify risk and applicable obligations using the organization's documented criteria; record assumptions and unresolved questions.",
        "Define lifecycle controls and required evidence for design, testing, approval, release, monitoring, change management, incidents, and retirement.",
        "Connect policy to operating mechanisms such as access controls, evaluations, human review, logging, escalation, rollback, and independent assurance where appropriate.",
        "Monitor the deployed system and its context, then revisit decisions when models, data, use, regulation, or observed outcomes change.",
      ]}
      example="A company considering an AI assistant for customer support first defines whether the assistant may only draft responses or may send them. It records approved knowledge sources, prohibited claims, privacy constraints, evaluation thresholds, human-review rules, incident ownership, and rollback conditions. Release approval is based on documented evidence, and material model or policy changes trigger reassessment."
      cyryxPerspective="Cyryx treats AI governance as an operating architecture that must connect board-level intent and organizational policy to the controls, evidence, interfaces, and human authority present in actual workflows. Frameworks inform that architecture; they do not replace context-specific analysis, accountable decisions, or qualified legal advice."
      metrics={[
        "Coverage of inventoried AI systems with named business and technical owners.",
        "Percentage of required lifecycle evidence that is current, traceable, and independently reviewable.",
        "Control effectiveness by risk and failure mode, not merely policy completion.",
        "Time to detect, escalate, contain, and learn from AI-related incidents.",
        "Rate of material changes assessed before release versus discovered after deployment.",
        "Exceptions by age, owner, rationale, compensating control, and expiration date.",
      ]}
      mistakes={[
        "Treating governance as a committee or policy document disconnected from delivery and operations.",
        "Applying one checklist to every system without considering intended purpose, authority, context, and impact.",
        "Equating a framework adoption, certification, or vendor claim with compliance or system safety.",
        "Reviewing the model while ignoring data, integrations, human decisions, interfaces, and downstream actions.",
        "Collecting documentation without defining who can stop deployment or revoke authority when evidence fails.",
        "Assuming the initial assessment remains valid after a material change in model, use, data, or operating environment.",
      ]}
      faqs={faqs}
      publishedAt="2026-08-17"
      reviewedAt="2026-08-17"
      primarySources={[
        {
          title: "Artificial Intelligence Risk Management Framework (AI RMF 1.0)",
          publisher: "U.S. National Institute of Standards and Technology",
          url: "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10",
        },
        {
          title: "Regulation (EU) 2024/1689 (Artificial Intelligence Act)",
          publisher: "Official Journal of the European Union",
          url: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        },
        {
          title: "ISO/IEC 42001:2023 — AI management systems",
          publisher: "International Organization for Standardization",
          url: "https://www.iso.org/standard/42001",
        },
      ]}
      related={[
        { label: "What is governed AI execution?", href: "/answers/what-is-governed-ai-execution" },
        {
          label: "What are command gates in AI systems?",
          href: "/answers/what-are-command-gates-in-ai-systems",
        },
        { label: "AI Governance & Safety", href: "/solutions/ai-governance-cost-control" },
        { label: "Cyryx Solutions", href: "/solutions" },
        { label: "Cyryx Applied AI Lab", href: "/research" },
      ]}
    />
  ),
});
