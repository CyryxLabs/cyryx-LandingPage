import { createFileRoute } from "@tanstack/react-router";
import { SolutionPage } from "@/components/cyryx/seo/SolutionPage";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildHead,
  buildServiceJsonLd,
} from "@/components/cyryx/seo/seo";

const PATH = "/solutions/ai-websites-lead-systems";
const TITLE = "AI websites & lead systems — Cyryx Labs";
const DESC = "AI-native websites and lead systems engineered for execution: structured intake, qualified routing, and governed AI follow-up.";

const FAQ = [
  {
    q: "Is this a marketing site build or a lead-system build?",
    a: "Both — treated as one system. The visible site is the surface; behind it we ship structured intake, qualification, enrichment, first-touch AI responses, and human routing. Design, copy, and infrastructure are scoped together so nothing lands as a disconnected tool.",
  },
  {
    q: "How is the AI kept from saying things it shouldn't?",
    a: "Every AI response passes through gates for tone, scope, factual grounding against your knowledge sources, and disallowed claims. Anything that fails a gate is rewritten, escalated, or suppressed — no free-form outputs land in a customer inbox unreviewed.",
  },
  {
    q: "What CMS and stack do you build on?",
    a: "By default, a TypeScript / React stack (Next.js or TanStack Start) on your CDN of choice, with content managed in a headless CMS or MDX depending on team preference. We optimize for Core Web Vitals, SSR, and structured data from day one.",
  },
  {
    q: "Do you integrate with our existing CRM and sales tooling?",
    a: "Yes. Every qualified lead lands as a structured record in your CRM with mission ID, conversation trace, and gate verdicts attached. Sales teams see why a lead was routed to them, not just that it was.",
  },
  {
    q: "How do you attribute results?",
    a: "We instrument the whole funnel to mission outcomes: booked meetings, signed scopes, revenue. Cost-per-verified-outcome is reported alongside traffic and conversion so acquisition spend and AI spend read on the same page.",
  },
];

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
        buildFaqJsonLd(FAQ),
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
      challenges={[
        "Chatbots that answer confidently and route unqualified traffic to sales.",
        "Contact forms that lose intent between capture and CRM.",
        "Follow-up sequences that take hours when the buying window is minutes.",
        "Vanity dashboards reporting sessions instead of booked meetings.",
        "Marketing sites that ignore Core Web Vitals and pay for it in ad spend.",
      ]}
      architecture={[
        { name: "Front-end surface", detail: "Server-rendered, Core-Web-Vitals-tuned site with structured data and edge caching — built to convert, not just to look good." },
        { name: "Intake layer", detail: "Structured capture flows that record intent, acceptance criteria, and disqualifiers alongside contact fields." },
        { name: "Conversation runtime", detail: "Goal-grounded AI conversations with knowledge grounding, tone control, and command gates on every reply." },
        { name: "Qualification engine", detail: "Rules + evaluators that decide when a lead is ready for a human, backed by full trace evidence." },
        { name: "Routing + CRM sync", detail: "Qualified leads land as structured records in your CRM with mission ID, transcript, and gate verdicts attached." },
        { name: "Attribution + analytics", detail: "Funnel wired to mission outcomes (booked call, signed scope), not just page views and form fills." },
      ]}
      deliverables={[
        { phase: "Discovery & mission design", duration: "1–2 weeks", scope: "Define target ICP, lead missions, qualification criteria, disqualifiers, and messaging positioning.", outputs: ["Lead mission spec", "Qualification + escalation rules", "Site information architecture"] },
        { phase: "Design & content", duration: "2–4 weeks", scope: "Ship enterprise-grade visual design, motion system, and long-form content aligned to the positioning. SEO structure planned in parallel.", outputs: ["Design system + component library", "Copy + long-form pages", "SEO + structured-data plan"] },
        { phase: "Build & wire", duration: "3–6 weeks", scope: "Implement the site, intake flows, conversation runtime, gates, CRM sync, and analytics. Everything instrumented from the first deploy.", outputs: ["Production site", "Governed AI conversation layer", "CRM-integrated lead router"] },
        { phase: "Governed rollout & optimization", duration: "4 weeks + optional retainer", scope: "Progressive rollout, gate calibration against real traces, and iterative optimization against booked-meeting rate.", outputs: ["Rollout playbook", "Tuning report", "Optional monthly optimization retainer"] },
      ]}
      techStack={[
        "TanStack Start / Next.js on Vercel or Cloudflare",
        "Headless CMS (Sanity, Contentful) or MDX",
        "Salesforce, HubSpot, Attio, or Pipedrive CRM sync",
        "OpenAI, Anthropic, Google models (routable per mission)",
        "Structured data + Core Web Vitals tuning by default",
        "Analytics via Posthog, Segment, or your existing stack",
      ]}
      kpis={[
        { metric: "Qualified lead rate", detail: "Percentage of captures that meet qualification criteria — a proxy for whether the site attracts the right buyer." },
        { metric: "Time to first verified touch", detail: "Median minutes from capture to a governed AI response that a human would endorse." },
        { metric: "Booked-meeting rate", detail: "Percentage of qualified leads that convert to booked meetings, tracked per campaign and per landing surface." },
        { metric: "Core Web Vitals health", detail: "P75 LCP, INP, CLS across mobile and desktop — kept in the 'good' band as a hard requirement." },
      ]}
      outcomes={[
        "Higher percentage of contacts that are usable by sales.",
        "Shorter time from first visit to verified next step.",
        "Lower hidden cost from chasing unqualified or hallucinated leads.",
        "Auditable trail of every AI-driven interaction.",
      ]}
      faq={FAQ}
      engagementNote="Delivered as a fixed-price site + lead-system build with an optional monthly optimization retainer. Cyryx owns the engineering; your team owns the messaging, brand voice, and CRM operations."
      relatedAnswers={[
        { label: "What is governed AI execution?", href: "/answers/what-is-governed-ai-execution" },
        { label: "AI execution system vs AI automation", href: "/answers/ai-execution-system-vs-ai-automation" },
        { label: "What are command gates in AI systems?", href: "/answers/what-are-command-gates-in-ai-systems" },
      ]}
    />
  ),
});