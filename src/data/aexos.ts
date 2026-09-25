/**
 * Public AEXOS facts for the product pages.
 *
 * Source: the published npm package @aexos/core (README, LICENSE, constitution
 * and docs), version 5.3.0. Numbers are the ones the package counts from its
 * own tree. Nothing here comes from internal go-to-market material: no prices,
 * launch plans or roadmap items.
 */

export const AEXOS_VERSION = "5.3.0";

export const AEXOS_PROBLEMS = [
  {
    title: "Planning is inconsistent",
    body: "Every session starts from a different prompt, so the same kind of work is planned a different way each time.",
  },
  {
    title: "Context gets lost",
    body: "The agent that implements never sees what the agent that planned understood.",
  },
  {
    title: "Authority drifts",
    body: "Any agent can change anything, including pushing code nobody reviewed.",
  },
  {
    title: "Output goes unverified",
    body: "Work is called done because it was generated, not because it passed a check.",
  },
] as const;

export const AEXOS_ANSWERS = [
  {
    title: "Procedures, not prompts",
    body: "Each task is a procedure with declared inputs, outputs and a completion checklist. The expertise lives in the procedure, so it runs the same way every time.",
  },
  {
    title: "Stories carry the context",
    body: "Development begins and ends with a story file that holds everything the developer agent needs, from acceptance criteria to QA evidence.",
  },
  {
    title: "Scoped authority",
    body: "Every agent has a scope. Only the DevOps agent may push, open pull requests or publish releases.",
  },
  {
    title: "Gates that can stop work",
    body: "Stories are validated before implementation and gated by QA before they ship. A blocking check stops execution.",
  },
] as const;

/** The story development cycle, in order. Commands are the documented ones. */
export const AEXOS_CYCLE = [
  {
    key: "create",
    step: "Create",
    agent: "@sm",
    command: "*draft",
    output: "Story 4.2 drafted from the epic · status Draft",
    status: "Draft",
  },
  {
    key: "validate",
    step: "Validate",
    agent: "@po",
    command: "*validate-story-draft",
    output: "10-point check · 8/10 · GO",
    status: "GO",
  },
  {
    key: "implement",
    step: "Implement",
    agent: "@dev",
    command: "*develop",
    output: "Working against 6 acceptance criteria · status InProgress",
    status: "InProgress",
  },
  {
    key: "gate",
    step: "QA gate",
    agent: "@qa",
    command: "*gate",
    output: "Verdict PASS · evidence written to the story",
    status: "PASS",
  },
  {
    key: "push",
    step: "Push",
    agent: "@devops",
    command: "*push",
    output: "Pushed by the only agent allowed to push · story Done",
    status: "Done",
  },
] as const;

export const AEXOS_CONCEPTS = [
  {
    name: "Agent",
    body: "A role with a scope of authority and a list of procedures it may run. It routes work; it does not hold the expertise.",
  },
  {
    name: "Task",
    body: "An executable procedure with declared inputs, outputs and a completion checklist.",
  },
  { name: "Template", body: "The shape of the document a task produces." },
  { name: "Checklist", body: "The validation a task must pass before it counts as done." },
  { name: "Data", body: "The knowledge base a task reads from." },
  {
    name: "Workflow",
    body: "A sequence of connected tasks, with the conditions for moving between them.",
  },
] as const;

/** Counted from the package tree (README, v5.3.0). */
export const AEXOS_NUMBERS = [
  { value: 64, label: "Specialised agents", detail: "12 core roles and 52 squad specialists" },
  { value: 291, label: "Tasks", detail: "Executable procedures" },
  { value: 33, label: "Workflows", detail: "Connected task sequences" },
  { value: 62, label: "Checklists", detail: "Validation before done" },
  { value: 9, label: "Squads", detail: "Business domains beyond code" },
] as const;

export const AEXOS_ROLES = [
  { handle: "@aexos-master", role: "Orchestrator. Reads the registry and routes each request." },
  { handle: "@analyst", role: "Business analysis and research" },
  { handle: "@pm", role: "Product requirements and epics" },
  { handle: "@po", role: "Story validation and backlog" },
  { handle: "@sm", role: "Story drafting from epics" },
  { handle: "@architect", role: "Architecture and technical design" },
  { handle: "@dev", role: "Implementation against acceptance criteria" },
  { handle: "@qa", role: "Quality gates and test architecture" },
  { handle: "@data-engineer", role: "Database design and operations" },
  { handle: "@devops", role: "The only role allowed to push, open PRs and release" },
  { handle: "@ux-design-expert", role: "UX, UI and design systems" },
  { handle: "@squad-creator", role: "Builds new squads" },
] as const;

export const AEXOS_SQUADS = [
  "CEO",
  "Board",
  "Products",
  "Marketing",
  "Sales",
  "Operations",
  "Customer Success",
  "Business Administration",
  "Claude Code Mastery",
] as const;

export const AEXOS_GATES = [
  { layer: "Pre-commit", checks: "Lint and type checks on every commit." },
  {
    layer: "Pre-push",
    checks:
      "The story's acceptance criteria and status are checked before code leaves the machine.",
  },
  { layer: "CI", checks: "The full test suite plus structural validators." },
] as const;

export const AEXOS_PRINCIPLES = [
  {
    name: "CLI first",
    body: "The command line is the whole product. No UI is ever required to operate it.",
  },
  { name: "Agent authority", body: "Each agent acts only inside its scope." },
  { name: "Story-driven", body: "No development without a story that defines it." },
  { name: "No invention", body: "Agents work from requirements and sources, not assumptions." },
  { name: "Quality first", body: "Checks run before work moves forward." },
] as const;

/** Environments documented as working in the package's IDE integration guide. */
export const AEXOS_ENVIRONMENTS = ["Claude Code", "Gemini CLI", "Codex CLI"] as const;

export const AEXOS_REQUIREMENTS = [
  "Node.js 18 or later (20+ recommended)",
  "npm 9 or later",
  "Linux, macOS or Windows",
] as const;

export const AEXOS_EDITIONS = [
  {
    name: "Core",
    state: "Available on npm",
    body: "Free to use under the AEXOS license for personal, internal, educational and commercial work, including work you deliver to clients. The CLI, the core roles, the squads, tasks and workflows, and the doctor, validate and update commands.",
  },
  {
    name: "Pro",
    state: "Commercial license",
    body: "Pro capabilities and squads for licensed users, available under a paid commercial agreement. Talk to us about access.",
  },
] as const;

export const AEXOS_FAQ = [
  {
    q: "Is AEXOS open source?",
    a: "No. AEXOS is proprietary software from Cyryx Labs. The Core edition is free to use under the AEXOS license, including for commercial work; redistribution and hosted resale are not permitted.",
  },
  {
    q: "Does AEXOS replace human review?",
    a: "No. It structures and checks the work, but you remain responsible for reviewing and accepting what the agents produce.",
  },
  {
    q: "Does it only work for software projects?",
    a: "Software delivery is the core. The squads extend the same method to business domains such as product, marketing, sales and operations.",
  },
  {
    q: "What does it take to try it?",
    a: "Node.js 18 or later and one command: npx @aexos/core init my-project. Restart your AI coding environment afterwards so it loads the generated agents.",
  },
] as const;
