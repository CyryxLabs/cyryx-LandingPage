import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Download, Loader2, Sparkles } from "lucide-react";
import {
  AI_AUTONOMY,
  BUDGET_BANDS,
  DATA_SENSITIVITY,
  ENGAGEMENT_TYPES,
  PLATFORMS,
  PRIORITIES,
  PROJECT_STAGES,
  PROJECT_TYPES,
  REGULATIONS,
  TIMELINES,
  briefQuality,
  briefToMarkdown,
  type BriefRequirements,
} from "@/lib/brief.schema";
import { getLeadAttribution } from "@/lib/lead-attribution";
import { getActiveCopyVariant } from "@/lib/copy-variant";
import { trackCta } from "@/lib/track-cta";
import { BriefUploads, mimeFor, type BriefFile } from "./BriefUploads";
import { ChipGroup, ListInput, Repeater, SelectInput, TextArea, TextInput } from "./fields";

type Persona = BriefRequirements["users"][number];
type Feature = BriefRequirements["features"][number];
type Integration = BriefRequirements["integrations"][number];
type Stakeholder = BriefRequirements["stakeholders"][number];

type BriefState = {
  description: string;
  contact: {
    name: string;
    email: string;
    phone: string;
    role: string;
    company: string;
    website: string;
    country: string;
    timezone: string;
  };
  engagement: {
    type: string;
    budgetBand: string;
    timeline: string;
    deadline: string;
    stage: string;
  };
  requirements: BriefRequirements;
  consent: boolean;
  marketingOptIn: boolean;
};

const EMPTY_REQUIREMENTS: BriefRequirements = {
  projectName: "",
  projectType: "",
  summary: "",
  problem: "",
  goals: [],
  successMetrics: [],
  whyNow: "",
  users: [],
  scenarios: [],
  features: [],
  outOfScope: "",
  mvpDefinition: "",
  platforms: [],
  locales: [],
  integrations: [],
  data: { sources: "", sensitivity: [], volume: "", retention: "", regulations: [] },
  ai: { useCases: "", autonomy: "", humanApproval: "", providerConstraints: "" },
  nonFunctional: {
    performance: "",
    availability: "",
    security: "",
    accessibility: "",
    scalability: "",
  },
  design: { brandAssets: "", references: [], designSystem: "" },
  technical: { stackPreferences: "", hosting: "", existingSystems: "", constraints: "" },
  stakeholders: [],
  risks: "",
  openQuestions: "",
  freeText: "",
};

function emptyState(): BriefState {
  return {
    description: "",
    contact: {
      name: "",
      email: "",
      phone: "",
      role: "",
      company: "",
      website: "",
      country: "",
      timezone: "",
    },
    engagement: { type: "Not sure", budgetBand: "", timeline: "", deadline: "", stage: "" },
    requirements: structuredClone(EMPTY_REQUIREMENTS),
    consent: false,
    marketingOptIn: false,
  };
}

const DRAFT_KEY = "cyryx-brief-draft-v1";
const PATH = "/brief";

const STEPS = [
  { id: "start", title: "The idea", blurb: "What you want built, in your own words." },
  {
    id: "problem",
    title: "Problem and goals",
    blurb: "Why it matters and how you will measure it.",
  },
  { id: "users", title: "Users", blurb: "Who uses it and what they need to get done." },
  { id: "scope", title: "Scope", blurb: "Features by priority, the MVP, and what is out." },
  { id: "systems", title: "Data, AI and systems", blurb: "Integrations, data, compliance and AI." },
  { id: "quality", title: "Quality and tech", blurb: "Performance, security, design and stack." },
  { id: "context", title: "Files and context", blurb: "Attachments, budget, timeline and people." },
  { id: "review", title: "Review and send", blurb: "Your details, a final check, and submit." },
] as const;

async function sha256Hex(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function uploadWithProgress(
  url: string,
  file: File,
  mime: string,
  onProgress: (p: number) => void,
) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", mime);
    xhr.setRequestHeader("x-upsert", "false");
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error("upload"));
    xhr.onerror = () => reject(new Error("upload"));
    xhr.send(file);
  });
}

function download(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function BriefWizard({ assistAvailable }: { assistAvailable: boolean }) {
  const [state, setState] = useState<BriefState>(emptyState);
  const [files, setFiles] = useState<BriefFile[]>([]);
  const [step, setStep] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));
  const [restorable, setRestorable] = useState<BriefState | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [assist, setAssist] = useState<{
    status: "idle" | "working" | "done" | "error";
    message?: string;
  }>({
    status: "idle",
  });
  const [submit, setSubmit] = useState<{
    status: "idle" | "uploading" | "sending" | "done" | "error";
    message?: string;
    reference?: string;
    markdown?: string;
  }>({ status: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const startedRef = useRef<number | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const [nickname, setNickname] = useState("");

  // Restore offer for an unfinished draft on this device.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { state?: BriefState };
      if (parsed.state?.requirements) setRestorable(parsed.state);
    } catch {
      /* storage unavailable */
    }
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timezone) setState((s) => ({ ...s, contact: { ...s.contact, timezone } }));
  }, []);

  // Autosave (text only; files stay in memory).
  useEffect(() => {
    if (!startedRef.current || submit.status === "done") return;
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ state: { ...state, consent: false }, savedAt: Date.now() }),
        );
        setSavedAt(new Date());
      } catch {
        /* storage unavailable */
      }
    }, 800);
    return () => window.clearTimeout(timer);
  }, [state, submit.status]);

  const markStarted = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = Date.now();
    trackCta({ cta: "form_start", section: "brief", href: PATH });
  }, []);

  const update = useCallback(
    <K extends keyof BriefState>(key: K, value: BriefState[K]) => {
      markStarted();
      setState((s) => ({ ...s, [key]: value }));
    },
    [markStarted],
  );
  const req = state.requirements;
  const setReq = (patch: Partial<BriefRequirements>) =>
    update("requirements", { ...req, ...patch });

  const quality = useMemo(
    () => briefQuality({ ...req, hasAttachments: files.length > 0 }),
    [req, files.length],
  );

  const goTo = (index: number) => {
    const next = Math.max(0, Math.min(STEPS.length - 1, index));
    if (next > step) {
      trackCta({ cta: "form_step_complete", section: "brief", href: `${PATH}#${STEPS[step].id}` });
    }
    setStep(next);
    setVisited((v) => new Set(v).add(next));
    requestAnimationFrame(() =>
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  const runAssist = async () => {
    markStarted();
    if (state.description.trim().length < 40) {
      setAssist({ status: "error", message: "Write at least a few sentences first." });
      return;
    }
    setAssist({ status: "working" });
    try {
      const response = await fetch("/api/public/brief/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: state.description }),
      });
      const result = (await response.json()) as {
        draft?: Partial<BriefRequirements>;
        error?: string;
      };
      if (!response.ok || !result.draft) throw new Error(result.error);
      const draft = result.draft;
      // Fill only empty fields: never overwrite what the visitor wrote.
      const merged: BriefRequirements = { ...req };
      const filled: string[] = [];
      for (const [key, value] of Object.entries(draft) as [keyof BriefRequirements, unknown][]) {
        const current = merged[key] as unknown;
        const isEmpty =
          current === "" ||
          (Array.isArray(current) && current.length === 0) ||
          current === undefined;
        const hasValue = Array.isArray(value) ? value.length > 0 : Boolean(value);
        if (isEmpty && hasValue) {
          (merged as Record<string, unknown>)[key] = value;
          filled.push(String(key));
        }
      }
      update("requirements", merged);
      setAssist({
        status: "done",
        message: filled.length
          ? `Drafted ${filled.length} sections from your description. Review each step and edit freely.`
          : "Your brief already covers what the description says.",
      });
      trackCta({ cta: "form_step_complete", section: "brief", href: `${PATH}#assist` });
    } catch {
      setAssist({
        status: "error",
        message:
          "The drafting assistant is not available right now. You can fill the steps directly.",
      });
    }
  };

  const validateContact = () => {
    const next: Record<string, string> = {};
    if (state.contact.name.trim().length < 2) next.name = "Your name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.contact.email.trim()))
      next.email = "Enter a valid work email.";
    if (state.contact.company.trim().length < 2) next.company = "Company is required.";
    if (req.problem.trim().length < 20 && req.summary.trim().length < 20)
      next.problem = "Describe the problem or the product in a couple of sentences (step 2).";
    if (!state.consent) next.consent = "Please accept so we can process your brief.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async () => {
    if (!validateContact()) return;
    let intakeId: string | undefined;
    let attachments: Array<Record<string, unknown>> = [];

    try {
      if (files.length) {
        setSubmit({ status: "uploading" });
        const manifest = files.map((f) => ({
          name: f.file.name,
          bytes: f.file.size,
          mime: mimeFor(f.file),
        }));
        const initResponse = await fetch("/api/public/brief/init", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: state.contact.email.trim(), files: manifest }),
        });
        const init = (await initResponse.json()) as {
          intakeId?: string;
          uploads?: Array<{ name: string; path: string; signedUrl: string }>;
          error?: string;
        };
        if (!initResponse.ok || !init.intakeId || !init.uploads) {
          throw new Error(
            "We couldn't prepare the file upload. You can remove the files and send the brief now, then email them to contact@cyryxlabs.com.",
          );
        }
        intakeId = init.intakeId;
        attachments = [];
        for (let index = 0; index < files.length; index += 1) {
          const item = files[index];
          const upload = init.uploads[index];
          const mime = manifest[index].mime;
          const [hash] = await Promise.all([
            sha256Hex(item.file),
            uploadWithProgress(upload.signedUrl, item.file, mime, (progress) =>
              setFiles((current) =>
                current.map((f) => (f.id === item.id ? { ...f, progress } : f)),
              ),
            ),
          ]);
          attachments.push({
            path: upload.path,
            name: item.file.name.slice(0, 200),
            mime,
            bytes: item.file.size,
            sha256: hash,
            caption: item.caption,
          });
        }
      }

      setSubmit({ status: "sending" });
      const response = await fetch("/api/public/brief/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intakeId,
          contact: state.contact,
          engagement: state.engagement,
          requirements: req,
          attachments,
          consent: state.consent,
          marketingOptIn: state.marketingOptIn,
          nickname,
          startedAt: startedRef.current ?? undefined,
          attribution: getLeadAttribution(getActiveCopyVariant()),
        }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        reference?: string;
        markdown?: string;
      };
      if (!response.ok || !result.ok)
        throw new Error(result.error || "We couldn't save your brief right now.");
      trackCta({ cta: "generate_lead", section: "brief", href: PATH });
      try {
        window.localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
      setSubmit({
        status: "done",
        reference: result.reference,
        markdown:
          result.markdown ??
          briefToMarkdown({
            contact: state.contact,
            engagement: state.engagement,
            requirements: req,
          }),
      });
      requestAnimationFrame(() =>
        topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    } catch (error) {
      trackCta({ cta: "qualification_form_error", section: "brief", href: PATH });
      setSubmit({
        status: "error",
        message:
          error instanceof Error && error.message
            ? error.message
            : "We couldn't save your brief right now.",
      });
    }
  };

  const markdown = useMemo(
    () =>
      briefToMarkdown({
        contact: state.contact,
        engagement: state.engagement,
        requirements: req,
        attachments: files.map((f) => ({ name: f.file.name, caption: f.caption })),
      }),
    [state.contact, state.engagement, req, files],
  );

  if (submit.status === "done") {
    return (
      <div ref={topRef} className="scroll-mt-28">
        <div
          role="status"
          className="cx-spotlight rounded-2xl border border-[color-mix(in_oklab,var(--accent-glow)_35%,transparent)] bg-[var(--obsidian)] p-7 sm:p-10"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent-glow)]">
            Brief received
          </p>
          <h3 className="mt-4 font-display text-3xl font-semibold tracking-[-0.035em] text-[var(--silver)] sm:text-4xl">
            Thank you. Your brief is with our team.
          </h3>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--silver-dim)]">
            A person from Cyryx Labs will review it, send you any clarifying questions, and turn it
            into a product requirements document for you to review before anything is built.
          </p>
          {submit.reference ? (
            <p className="mt-4 font-mono text-[12px] text-[var(--steel)]">
              Reference: {submit.reference}
            </p>
          ) : null}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="cx-btn-primary"
              onClick={() => download("cyryx-project-brief.md", submit.markdown ?? markdown)}
            >
              <Download className="h-4 w-4" aria-hidden /> Download your brief
            </button>
            <Link to="/engagement-model" className="cx-btn-secondary">
              See how we work <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const busy = submit.status === "uploading" || submit.status === "sending";
  const current = STEPS[step];

  return (
    <div ref={topRef} className="scroll-mt-28">
      {restorable ? (
        <div
          role="region"
          aria-label="Unfinished brief"
          className="mb-6 flex flex-col gap-3 rounded-lg border border-[color-mix(in_oklab,var(--accent-glow)_35%,transparent)] bg-[var(--obsidian)] p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-[var(--silver)]">
            You have an unfinished brief saved on this device.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="cx-btn-primary cx-btn-sm"
              onClick={() => {
                startedRef.current = Date.now();
                setState({ ...emptyState(), ...restorable, consent: false });
                setRestorable(null);
              }}
            >
              Continue it
            </button>
            <button
              type="button"
              className="cx-btn-secondary cx-btn-sm"
              onClick={() => {
                try {
                  window.localStorage.removeItem(DRAFT_KEY);
                } catch {
                  /* ignore */
                }
                setRestorable(null);
              }}
            >
              Start fresh
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12">
        {/* Progress and quality */}
        <aside className="lg:sticky lg:top-32 lg:self-start" aria-label="Brief progress">
          <div className="rounded-xl border border-white/10 bg-[var(--obsidian)] p-5">
            <div className="flex items-center gap-4">
              <QualityRing score={quality.score} />
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--steel)]">
                  Brief quality
                </p>
                <p className="mt-1 text-sm text-[var(--silver)]">
                  {quality.score >= 80
                    ? "Build-ready detail"
                    : quality.score >= 50
                      ? "Good start"
                      : "Add what you know"}
                </p>
              </div>
            </div>
            <ol className="mt-5 hidden gap-1 lg:grid">
              {STEPS.map((s, index) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => goTo(index)}
                    aria-current={index === step ? "step" : undefined}
                    className={`flex min-h-10 w-full items-center gap-3 rounded-md px-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)] ${
                      index === step
                        ? "bg-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)] text-[var(--silver)]"
                        : "text-[var(--silver-dim)] hover:text-[var(--silver)]"
                    }`}
                  >
                    <span
                      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] ${
                        visited.has(index) && index < step
                          ? "border-[var(--accent-glow)] bg-[var(--accent-glow)] text-[var(--onyx)]"
                          : index === step
                            ? "border-[var(--accent-glow)] text-[var(--accent-glow)]"
                            : "border-white/20 text-[var(--steel)]"
                      }`}
                    >
                      {visited.has(index) && index < step ? (
                        <Check className="h-3.5 w-3.5" aria-hidden />
                      ) : (
                        index + 1
                      )}
                    </span>
                    {s.title}
                  </button>
                </li>
              ))}
            </ol>
            {quality.missing.length ? (
              <div className="mt-5 hidden border-t border-white/10 pt-4 lg:block">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--steel)]">
                  Still missing
                </p>
                <ul className="mt-2 space-y-1 text-[13px] text-[var(--silver-dim)]">
                  {quality.missing.slice(0, 6).map((item) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <p className="mt-4 text-[12px] text-[var(--steel)]" aria-live="polite">
              {savedAt
                ? `Draft saved on this device at ${savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                : "Your draft is saved on this device as you type."}
            </p>
          </div>
        </aside>

        <div className="min-w-0">
          {/* Mobile progress */}
          <div className="mb-6 lg:hidden">
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--steel)]">
              <span>
                Step {step + 1} of {STEPS.length}
              </span>
              <span>{current.title}</span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded bg-white/10" aria-hidden>
              <div
                className="h-full bg-[var(--accent-glow)] transition-[width] duration-300"
                style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[color-mix(in_oklab,var(--obsidian)_92%,transparent)] p-5 sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent-glow)]">
              {String(step + 1).padStart(2, "0")} · {current.title}
            </p>
            <h3 className="mt-3 font-display text-2xl font-semibold tracking-[-0.03em] text-[var(--silver)] sm:text-3xl">
              {current.blurb}
            </h3>
            <p className="mt-2 text-sm text-[var(--silver-dim)]">
              Answer what you know and skip the rest. Anything missing becomes an open question, not
              a guess.
            </p>

            <div className="mt-8 grid gap-7">
              {step === 0 ? (
                <>
                  <TextArea
                    label="Describe what you need"
                    hint="A paragraph or two is enough: what you want to build, for whom, and why."
                    value={state.description}
                    onChange={(v) => update("description", v)}
                    rows={6}
                    maxLength={6000}
                    placeholder="e.g. We run 40 clinics and schedule staff in spreadsheets. We want a web app where managers publish shifts, staff swap them, and payroll gets an export every two weeks…"
                  />
                  {assistAvailable ? (
                    <div className="rounded-lg border border-white/10 bg-[var(--onyx)] p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-[var(--silver-dim)]">
                          Let the Cyryx assistant draft the next steps from your description. It
                          only fills empty fields and never guesses numbers.
                        </p>
                        <button
                          type="button"
                          onClick={runAssist}
                          disabled={assist.status === "working"}
                          className="cx-btn-secondary cx-btn-sm shrink-0 disabled:opacity-60"
                        >
                          {assist.status === "working" ? (
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                          ) : (
                            <Sparkles className="h-4 w-4" aria-hidden />
                          )}
                          Draft my brief
                        </button>
                      </div>
                      {assist.message ? (
                        <p
                          role="status"
                          className={`mt-3 text-sm ${assist.status === "error" ? "text-[#d3b36a]" : "text-[var(--accent-glow)]"}`}
                        >
                          {assist.message}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <TextInput
                      label="Project name"
                      hint="A working title is fine."
                      value={req.projectName}
                      onChange={(v) => setReq({ projectName: v })}
                      maxLength={160}
                    />
                    <SelectInput
                      label="Where are you today?"
                      value={state.engagement.stage}
                      onChange={(v) => update("engagement", { ...state.engagement, stage: v })}
                      options={PROJECT_STAGES}
                    />
                  </div>
                  <ChipGroup
                    label="What kind of project is it?"
                    options={PROJECT_TYPES}
                    value={req.projectType ? [req.projectType] : []}
                    onChange={(v) => setReq({ projectType: v[0] ?? "" })}
                  />
                  <ChipGroup
                    label="How would you like to work with us?"
                    hint="Advise: strategy and architecture. Build: we design and build it. Control: governance and cost control for AI you run. Operate: we run it for you."
                    options={ENGAGEMENT_TYPES}
                    value={state.engagement.type ? [state.engagement.type] : []}
                    onChange={(v) =>
                      update("engagement", { ...state.engagement, type: v[0] ?? "Not sure" })
                    }
                  />
                </>
              ) : null}

              {step === 1 ? (
                <>
                  <TextInput
                    label="One-line summary"
                    hint="If someone asked what this product does, what would you say?"
                    value={req.summary}
                    onChange={(v) => setReq({ summary: v })}
                    maxLength={300}
                  />
                  <TextArea
                    label="The problem"
                    required
                    hint="What is broken, slow, expensive or missing today? Who feels it and how often?"
                    value={req.problem}
                    onChange={(v) => setReq({ problem: v })}
                    rows={5}
                    error={errors.problem}
                  />
                  <TextArea
                    label="Why now"
                    hint="A deadline, a customer, a cost, a competitor, a regulation?"
                    value={req.whyNow}
                    onChange={(v) => setReq({ whyNow: v })}
                    rows={3}
                    maxLength={1200}
                  />
                  <ListInput
                    label="Business goals"
                    hint="The outcomes this should produce. Press Enter to add each one."
                    values={req.goals}
                    onChange={(v) => setReq({ goals: v })}
                    placeholder="e.g. Cut scheduling time for managers"
                  />
                  <ListInput
                    label="How you will measure success"
                    hint="Numbers you would track after launch, if you have them."
                    values={req.successMetrics}
                    onChange={(v) => setReq({ successMetrics: v })}
                    placeholder="e.g. Scheduling time per week from 6 h to under 1 h"
                  />
                </>
              ) : null}

              {step === 2 ? (
                <>
                  <Repeater<Persona>
                    label="Who will use it"
                    hint="Add each type of user: customers, staff, admins, partners."
                    items={req.users}
                    onChange={(v) => setReq({ users: v })}
                    create={() => ({ name: "", description: "", needs: "" })}
                    addLabel="Add a user type"
                    max={8}
                    itemLabel={(item, index) => item.name || `User type ${index + 1}`}
                    render={(item, set) => (
                      <div className="grid gap-4">
                        <TextInput
                          label="Name"
                          value={item.name}
                          onChange={(v) => set({ name: v })}
                          placeholder="e.g. Clinic manager"
                          maxLength={120}
                        />
                        <TextArea
                          label="Who they are"
                          value={item.description}
                          onChange={(v) => set({ description: v })}
                          rows={2}
                          maxLength={800}
                        />
                        <TextArea
                          label="What they need to get done"
                          value={item.needs}
                          onChange={(v) => set({ needs: v })}
                          rows={2}
                          maxLength={800}
                        />
                      </div>
                    )}
                  />
                  <ListInput
                    label="Key scenarios"
                    hint="Short stories of use: “A manager publishes next week’s shifts in under 5 minutes.”"
                    values={req.scenarios}
                    onChange={(v) => setReq({ scenarios: v })}
                    placeholder="Describe one scenario and press Enter"
                    max={15}
                  />
                </>
              ) : null}

              {step === 3 ? (
                <>
                  <Repeater<Feature>
                    label="Features"
                    hint="Must = useless without it. Should = important. Could = nice to have. Won't = not now."
                    items={req.features}
                    onChange={(v) => setReq({ features: v })}
                    create={() => ({ title: "", description: "", priority: "Should" })}
                    addLabel="Add a feature"
                    max={40}
                    itemLabel={(item, index) =>
                      `${item.priority} · ${item.title || `Feature ${index + 1}`}`
                    }
                    render={(item, set) => (
                      <div className="grid gap-4">
                        <TextInput
                          label="Feature"
                          value={item.title}
                          onChange={(v) => set({ title: v })}
                          placeholder="e.g. Shift swap requests"
                          maxLength={160}
                        />
                        <TextArea
                          label="What it should do"
                          value={item.description}
                          onChange={(v) => set({ description: v })}
                          rows={2}
                          maxLength={1200}
                        />
                        <ChipGroup
                          label="Priority"
                          options={PRIORITIES}
                          value={[item.priority]}
                          onChange={(v) =>
                            set({ priority: (v[0] as Feature["priority"]) ?? "Should" })
                          }
                        />
                      </div>
                    )}
                  />
                  <TextArea
                    label="What is the smallest useful first version?"
                    hint="The MVP: what must work on day one for this to be worth launching."
                    value={req.mvpDefinition}
                    onChange={(v) => setReq({ mvpDefinition: v })}
                    rows={3}
                    maxLength={2000}
                  />
                  <TextArea
                    label="Out of scope"
                    hint="What this project should not do, at least for now."
                    value={req.outOfScope}
                    onChange={(v) => setReq({ outOfScope: v })}
                    rows={3}
                    maxLength={2000}
                  />
                  <ChipGroup
                    label="Platforms"
                    options={PLATFORMS}
                    multiple
                    value={req.platforms}
                    onChange={(v) => setReq({ platforms: v })}
                  />
                  <ListInput
                    label="Languages and regions"
                    values={req.locales}
                    onChange={(v) => setReq({ locales: v })}
                    placeholder="e.g. English (US), Portuguese (Brazil)"
                    max={10}
                  />
                </>
              ) : null}

              {step === 4 ? (
                <>
                  <Repeater<Integration>
                    label="Systems it must connect to"
                    hint="CRM, ERP, payments, identity, data warehouse, internal APIs, spreadsheets…"
                    items={req.integrations}
                    onChange={(v) => setReq({ integrations: v })}
                    create={() => ({ system: "", purpose: "", direction: "both" })}
                    addLabel="Add a system"
                    max={20}
                    itemLabel={(item, index) => item.system || `System ${index + 1}`}
                    render={(item, set) => (
                      <div className="grid gap-4">
                        <TextInput
                          label="System"
                          value={item.system}
                          onChange={(v) => set({ system: v })}
                          placeholder="e.g. Salesforce, SAP, Stripe, internal API"
                          maxLength={120}
                        />
                        <TextArea
                          label="What for"
                          value={item.purpose}
                          onChange={(v) => set({ purpose: v })}
                          rows={2}
                          maxLength={600}
                        />
                        <ChipGroup
                          label="Direction"
                          options={["read", "write", "both"]}
                          value={[item.direction]}
                          onChange={(v) =>
                            set({ direction: (v[0] as Integration["direction"]) ?? "both" })
                          }
                        />
                      </div>
                    )}
                  />
                  <TextArea
                    label="Data sources"
                    hint="Where the data comes from and who owns it."
                    value={req.data.sources}
                    onChange={(v) => setReq({ data: { ...req.data, sources: v } })}
                    rows={3}
                    maxLength={1500}
                  />
                  <ChipGroup
                    label="Sensitive data involved"
                    options={DATA_SENSITIVITY}
                    multiple
                    value={req.data.sensitivity}
                    onChange={(v) => setReq({ data: { ...req.data, sensitivity: v } })}
                  />
                  <ChipGroup
                    label="Regulations that apply"
                    options={REGULATIONS}
                    multiple
                    value={req.data.regulations}
                    onChange={(v) => setReq({ data: { ...req.data, regulations: v } })}
                  />
                  <div className="grid gap-6 sm:grid-cols-2">
                    <TextInput
                      label="Data volume"
                      value={req.data.volume}
                      onChange={(v) => setReq({ data: { ...req.data, volume: v } })}
                      placeholder="e.g. 20k records/month"
                      maxLength={300}
                    />
                    <TextInput
                      label="Retention"
                      value={req.data.retention}
                      onChange={(v) => setReq({ data: { ...req.data, retention: v } })}
                      placeholder="e.g. 5 years"
                      maxLength={300}
                    />
                  </div>
                  <div className="border-t border-white/10 pt-6">
                    <TextArea
                      label="Where AI should help"
                      hint="Classify, summarize, draft, answer, extract, decide, act? Leave empty if AI is not part of it."
                      value={req.ai.useCases}
                      onChange={(v) => setReq({ ai: { ...req.ai, useCases: v } })}
                      rows={3}
                      maxLength={2000}
                    />
                  </div>
                  <ChipGroup
                    label="How much should AI decide on its own?"
                    options={AI_AUTONOMY}
                    value={req.ai.autonomy ? [req.ai.autonomy] : []}
                    onChange={(v) => setReq({ ai: { ...req.ai, autonomy: v[0] ?? "" } })}
                  />
                  <TextArea
                    label="Where a person must approve"
                    value={req.ai.humanApproval}
                    onChange={(v) => setReq({ ai: { ...req.ai, humanApproval: v } })}
                    rows={2}
                    maxLength={1500}
                    placeholder="e.g. Refunds over $500, anything sent to a patient"
                  />
                  <TextInput
                    label="AI provider constraints"
                    value={req.ai.providerConstraints}
                    onChange={(v) => setReq({ ai: { ...req.ai, providerConstraints: v } })}
                    placeholder="e.g. Data must stay in the EU; only approved vendors"
                    maxLength={1000}
                  />
                </>
              ) : null}

              {step === 5 ? (
                <>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <TextArea
                      label="Performance"
                      value={req.nonFunctional.performance}
                      onChange={(v) =>
                        setReq({ nonFunctional: { ...req.nonFunctional, performance: v } })
                      }
                      rows={2}
                      maxLength={800}
                      placeholder="e.g. Pages load in under 2 s"
                    />
                    <TextArea
                      label="Availability"
                      value={req.nonFunctional.availability}
                      onChange={(v) =>
                        setReq({ nonFunctional: { ...req.nonFunctional, availability: v } })
                      }
                      rows={2}
                      maxLength={800}
                      placeholder="e.g. Business hours, or 24/7"
                    />
                    <TextArea
                      label="Security and access"
                      value={req.nonFunctional.security}
                      onChange={(v) =>
                        setReq({ nonFunctional: { ...req.nonFunctional, security: v } })
                      }
                      rows={2}
                      maxLength={1200}
                      placeholder="e.g. SSO with Microsoft, roles, audit log"
                    />
                    <TextArea
                      label="Accessibility"
                      value={req.nonFunctional.accessibility}
                      onChange={(v) =>
                        setReq({ nonFunctional: { ...req.nonFunctional, accessibility: v } })
                      }
                      rows={2}
                      maxLength={800}
                      placeholder="e.g. WCAG 2.2 AA"
                    />
                    <TextArea
                      label="Scale"
                      value={req.nonFunctional.scalability}
                      onChange={(v) =>
                        setReq({ nonFunctional: { ...req.nonFunctional, scalability: v } })
                      }
                      rows={2}
                      maxLength={800}
                      placeholder="e.g. 500 users now, 5,000 in two years"
                    />
                  </div>
                  <div className="grid gap-6 border-t border-white/10 pt-6 sm:grid-cols-2">
                    <TextArea
                      label="Brand and design assets"
                      value={req.design.brandAssets}
                      onChange={(v) => setReq({ design: { ...req.design, brandAssets: v } })}
                      rows={2}
                      maxLength={800}
                      placeholder="Logo, brand guide, Figma files you can share"
                    />
                    <TextArea
                      label="Design system"
                      value={req.design.designSystem}
                      onChange={(v) => setReq({ design: { ...req.design, designSystem: v } })}
                      rows={2}
                      maxLength={800}
                      placeholder="Existing component library, if any"
                    />
                  </div>
                  <ListInput
                    label="Products you like (links)"
                    hint="References for look, feel or flow. Tell us what you like about each."
                    values={req.design.references}
                    onChange={(v) => setReq({ design: { ...req.design, references: v } })}
                    placeholder="https://… — what you like about it"
                    max={10}
                  />
                  <div className="grid gap-6 border-t border-white/10 pt-6 sm:grid-cols-2">
                    <TextArea
                      label="Technology preferences"
                      value={req.technical.stackPreferences}
                      onChange={(v) =>
                        setReq({ technical: { ...req.technical, stackPreferences: v } })
                      }
                      rows={2}
                      maxLength={1000}
                      placeholder="Languages, frameworks or clouds you require or avoid"
                    />
                    <TextArea
                      label="Hosting"
                      value={req.technical.hosting}
                      onChange={(v) => setReq({ technical: { ...req.technical, hosting: v } })}
                      rows={2}
                      maxLength={600}
                      placeholder="Your cloud account, ours, on-premises"
                    />
                    <TextArea
                      label="Existing systems and code"
                      value={req.technical.existingSystems}
                      onChange={(v) =>
                        setReq({ technical: { ...req.technical, existingSystems: v } })
                      }
                      rows={2}
                      maxLength={1500}
                    />
                    <TextArea
                      label="Other constraints"
                      value={req.technical.constraints}
                      onChange={(v) => setReq({ technical: { ...req.technical, constraints: v } })}
                      rows={2}
                      maxLength={1500}
                      placeholder="Procurement, security review, vendor rules"
                    />
                  </div>
                </>
              ) : null}

              {step === 6 ? (
                <>
                  <BriefUploads
                    files={files}
                    onChange={(v) => {
                      markStarted();
                      setFiles(v);
                    }}
                    disabled={busy}
                  />
                  <div className="grid gap-6 border-t border-white/10 pt-6 sm:grid-cols-3">
                    <SelectInput
                      label="Budget range"
                      value={state.engagement.budgetBand}
                      onChange={(v) => update("engagement", { ...state.engagement, budgetBand: v })}
                      options={BUDGET_BANDS}
                    />
                    <SelectInput
                      label="Timeline"
                      value={state.engagement.timeline}
                      onChange={(v) => update("engagement", { ...state.engagement, timeline: v })}
                      options={TIMELINES}
                    />
                    <TextInput
                      label="Hard deadline"
                      type="date"
                      value={state.engagement.deadline}
                      onChange={(v) => update("engagement", { ...state.engagement, deadline: v })}
                    />
                  </div>
                  <Repeater<Stakeholder>
                    label="People involved"
                    hint="Who needs to be part of decisions and reviews."
                    items={req.stakeholders}
                    onChange={(v) => setReq({ stakeholders: v })}
                    create={() => ({ name: "", role: "", decisionMaker: false })}
                    addLabel="Add a person"
                    max={12}
                    itemLabel={(item, index) => item.name || `Person ${index + 1}`}
                    render={(item, set) => (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <TextInput
                          label="Name"
                          value={item.name}
                          onChange={(v) => set({ name: v })}
                          maxLength={120}
                        />
                        <TextInput
                          label="Role"
                          value={item.role}
                          onChange={(v) => set({ role: v })}
                          maxLength={120}
                        />
                        <label className="flex min-h-11 items-center gap-3 text-sm text-[var(--silver-dim)] sm:col-span-2">
                          <input
                            type="checkbox"
                            checked={item.decisionMaker}
                            onChange={(e) => set({ decisionMaker: e.target.checked })}
                            className="h-4 w-4 accent-[var(--accent-glow)]"
                          />
                          Makes the final decision
                        </label>
                      </div>
                    )}
                  />
                  <TextArea
                    label="Risks or worries"
                    value={req.risks}
                    onChange={(v) => setReq({ risks: v })}
                    rows={3}
                    maxLength={2000}
                  />
                  <TextArea
                    label="Questions you already have"
                    value={req.openQuestions}
                    onChange={(v) => setReq({ openQuestions: v })}
                    rows={3}
                    maxLength={2000}
                  />
                  <TextArea
                    label="Anything else we should know"
                    value={req.freeText}
                    onChange={(v) => setReq({ freeText: v })}
                    rows={3}
                    maxLength={4000}
                  />
                </>
              ) : null}

              {step === 7 ? (
                <>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <TextInput
                      label="Full name"
                      required
                      autoComplete="name"
                      value={state.contact.name}
                      onChange={(v) => update("contact", { ...state.contact, name: v })}
                      error={errors.name}
                      maxLength={120}
                    />
                    <TextInput
                      label="Work email"
                      required
                      type="email"
                      autoComplete="email"
                      value={state.contact.email}
                      onChange={(v) => update("contact", { ...state.contact, email: v })}
                      error={errors.email}
                    />
                    <TextInput
                      label="Company"
                      required
                      autoComplete="organization"
                      value={state.contact.company}
                      onChange={(v) => update("contact", { ...state.contact, company: v })}
                      error={errors.company}
                      maxLength={160}
                    />
                    <TextInput
                      label="Your role"
                      autoComplete="organization-title"
                      value={state.contact.role}
                      onChange={(v) => update("contact", { ...state.contact, role: v })}
                      maxLength={120}
                    />
                    <TextInput
                      label="Company website"
                      type="url"
                      value={state.contact.website}
                      onChange={(v) => update("contact", { ...state.contact, website: v })}
                      placeholder="https://"
                      maxLength={300}
                    />
                    <TextInput
                      label="Phone"
                      type="tel"
                      autoComplete="tel"
                      value={state.contact.phone}
                      onChange={(v) => update("contact", { ...state.contact, phone: v })}
                      maxLength={40}
                    />
                    <TextInput
                      label="Country"
                      autoComplete="country-name"
                      value={state.contact.country}
                      onChange={(v) => update("contact", { ...state.contact, country: v })}
                      maxLength={80}
                    />
                    <TextInput
                      label="Time zone"
                      value={state.contact.timezone}
                      onChange={(v) => update("contact", { ...state.contact, timezone: v })}
                      maxLength={80}
                    />
                  </div>

                  <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                    <label>
                      Nickname
                      <input
                        tabIndex={-1}
                        autoComplete="off"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                      />
                    </label>
                  </div>

                  <BriefReview
                    markdown={markdown}
                    score={quality.score}
                    missing={quality.missing}
                    onDownload={() => download("cyryx-project-brief.md", markdown)}
                  />

                  <label className="flex items-start gap-3 text-sm text-[var(--silver-dim)]">
                    <input
                      type="checkbox"
                      checked={state.consent}
                      onChange={(e) => update("consent", e.target.checked)}
                      aria-invalid={Boolean(errors.consent)}
                      className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent-glow)]"
                    />
                    <span>
                      I agree that Cyryx Labs stores this brief and its files to assess and plan my
                      project, as described in the{" "}
                      <Link
                        to="/privacy"
                        className="text-[var(--accent-glow)] underline underline-offset-4"
                      >
                        Privacy Policy
                      </Link>
                      . <span className="text-[var(--accent-glow)]">*</span>
                    </span>
                  </label>
                  {errors.consent ? (
                    <p className="-mt-4 text-sm text-red-300">{errors.consent}</p>
                  ) : null}
                  <label className="-mt-2 flex items-start gap-3 text-sm text-[var(--silver-dim)]">
                    <input
                      type="checkbox"
                      checked={state.marketingOptIn}
                      onChange={(e) => update("marketingOptIn", e.target.checked)}
                      className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent-glow)]"
                    />
                    <span>Send me occasional updates from Cyryx Labs (optional).</span>
                  </label>
                  <p className="text-xs leading-relaxed text-[var(--steel)]">
                    Please don&apos;t include passwords, API keys or regulated personal data.
                    We&apos;ll agree a secure channel if we need anything sensitive.
                  </p>
                </>
              ) : null}
            </div>

            {submit.status === "error" && submit.message ? (
              <p
                role="alert"
                className="mt-6 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200"
              >
                {submit.message}
              </p>
            ) : null}
            {Object.keys(errors).length && step === STEPS.length - 1 ? (
              <p role="alert" className="mt-6 text-sm text-red-300">
                Check the highlighted fields.
                {errors.problem ? (
                  <button type="button" className="ml-2 underline" onClick={() => goTo(1)}>
                    Go to the problem step
                  </button>
                ) : null}
              </p>
            ) : null}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => goTo(step - 1)}
                disabled={step === 0 || busy}
                className="cx-btn-secondary disabled:invisible"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden /> Back
              </button>
              {step < STEPS.length - 1 ? (
                <button type="button" onClick={() => goTo(step + 1)} className="cx-btn-primary">
                  Continue <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={busy}
                  className="cx-btn-primary disabled:opacity-60"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                  {submit.status === "uploading"
                    ? "Uploading files…"
                    : submit.status === "sending"
                      ? "Sending…"
                      : "Send my brief"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QualityRing({ score }: { score: number }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  return (
    <div
      className="relative h-14 w-14 shrink-0"
      role="img"
      aria-label={`Brief quality ${score} out of 100`}
    >
      <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90">
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="5"
        />
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke="var(--accent-glow)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - score / 100)}
          style={{ transition: "stroke-dashoffset 500ms ease" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-mono text-sm text-[var(--silver)]">
        {score}
      </span>
    </div>
  );
}

function BriefReview({
  markdown,
  score,
  missing,
  onDownload,
}: {
  markdown: string;
  score: number;
  missing: string[];
  onDownload: () => void;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[var(--onyx)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--steel)]">
          Your brief · quality {score}/100
        </p>
        <button type="button" onClick={onDownload} className="cx-btn-secondary cx-btn-sm">
          <Download className="h-4 w-4" aria-hidden /> Download .md
        </button>
      </div>
      {missing.length ? (
        <p className="border-b border-white/10 px-4 py-3 text-[13px] text-[var(--silver-dim)]">
          Optional but useful: {missing.join(", ")}.
        </p>
      ) : null}
      <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words px-4 py-4 font-mono text-[12.5px] leading-relaxed text-[var(--silver-dim)]">
        {markdown}
      </pre>
    </div>
  );
}
