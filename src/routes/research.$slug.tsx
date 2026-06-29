import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Download, ExternalLink, Github, Quote, X, Copy, Check, Shield, Scan, Fingerprint } from "lucide-react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { getPublicationBySlug, type Publication } from "@/data/publications";

export const Route = createFileRoute("/research/$slug")({
  loader: ({ params }) => {
    const pub = getPublicationBySlug(params.slug);
    if (!pub) throw notFound();
    return { pub };
  },
  head: ({ loaderData }) => {
    const pub = loaderData?.pub;
    const title = pub ? `${pub.title} — Cyryx Labs Research` : "Research — Cyryx Labs";
    const desc = pub ? pub.abstract.slice(0, 180) : "Cyryx Labs research publication.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
      links: pub ? [{ rel: "canonical", href: `/research/${pub.slug}` }] : [],
    };
  },
  component: PaperPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-[#0A0A0A] text-[#C7C9CC]">
      <Header />
      <main className="mx-auto max-w-3xl px-6 pt-40 text-center">
        <h1 className="font-[Orbitron] text-2xl text-white">Publication not found</h1>
        <Link to="/research" className="mt-6 inline-block text-[#0E5B57] hover:text-white">
          ← Back to Research
        </Link>
      </main>
      <Footer />
    </div>
  ),
});

function PaperPage() {
  const { pub } = Route.useLoaderData();
  const [citeOpen, setCiteOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#C7C9CC]">
      <Header />
      <main className="pt-24 lg:pt-32">
        <PaperHeader pub={pub} onCite={() => setCiteOpen(true)} />
        <Abstract pub={pub} />
        <ThreeGaps />
        <ControlDomains pub={pub} />
        <FrameworkMappingSection pub={pub} />
        <Conformance pub={pub} />
        <ReferenceImplementation />
        <ContributeAndContact pub={pub} />
      </main>
      <Footer />
      {citeOpen && <CitationModal pub={pub} onClose={() => setCiteOpen(false)} />}
    </div>
  );
}

/* ---------- Section 1: Header ---------- */
function PaperHeader({ pub, onCite }: { pub: Publication; onCite: () => void }) {
  return (
    <section className="bg-[#121417]">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <Link
          to="/research"
          className="inline-flex items-center gap-2 font-[Inter] text-[13px] text-[#9AA3AF] hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Research / {pub.version ? `${pub.id.toUpperCase()}` : pub.id}
        </Link>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded bg-[#0D3B3B] px-2 py-0.5 font-[Inter] text-[11px] font-medium uppercase tracking-wider text-[#0E5B57]">
            {pub.category}
          </span>
          <span className="rounded bg-[#1B1E22] px-2 py-0.5 font-[Inter] text-[11px] font-medium uppercase text-[#9AA3AF]">
            Published · {pub.date}
          </span>
        </div>

        <h1 className="mt-4 font-[Orbitron] text-2xl font-bold leading-tight text-white lg:text-[32px]">
          {pub.title}
        </h1>
        <p className="mt-3 font-[Inter] text-base text-[#C7C9CC]">{pub.subtitle}</p>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-[Inter] text-[13px] text-[#9AA3AF]">
          <span>Authors: <span className="text-[#C7C9CC]">{pub.authors.join(", ")}</span></span>
          <span>Date: <span className="text-[#C7C9CC]">{pub.date}</span></span>
          {pub.doi && pub.doiUrl && (
            <span>
              DOI:{" "}
              <a href={pub.doiUrl} target="_blank" rel="noopener noreferrer" className="text-[#0E5B57] hover:text-white">
                {pub.doi}
              </a>
            </span>
          )}
          {pub.license && pub.licenseUrl && (
            <span>
              License:{" "}
              <a href={pub.licenseUrl} target="_blank" rel="noopener noreferrer" className="text-[#0E5B57] hover:text-white">
                {pub.license}
              </a>
            </span>
          )}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {pub.pdfUrl && (
            <a
              href={pub.pdfUrl}
              download
              className="inline-flex items-center gap-2 rounded-md bg-[#0E5B57] px-4 py-2 font-[Inter] text-sm font-medium text-white transition hover:brightness-110"
            >
              <Download className="h-4 w-4" /> Download PDF
            </a>
          )}
          {pub.doiUrl && (
            <a
              href={pub.doiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-[#0E5B57] px-4 py-2 font-[Inter] text-sm font-medium text-[#0E5B57] transition hover:bg-[#0E5B57]/10"
            >
              DOI <ExternalLink className="h-4 w-4" />
            </a>
          )}
          {pub.githubUrl && (
            <a
              href={pub.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-[#0E5B57] px-4 py-2 font-[Inter] text-sm font-medium text-[#0E5B57] transition hover:bg-[#0E5B57]/10"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
          )}
          <button
            type="button"
            onClick={onCite}
            className="inline-flex items-center gap-2 rounded-md border border-[#0E5B57] px-4 py-2 font-[Inter] text-sm font-medium text-[#0E5B57] transition hover:bg-[#0E5B57]/10"
          >
            <Quote className="h-4 w-4" /> Cite this paper
          </button>
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 2: Abstract ---------- */
function Abstract({ pub }: { pub: Publication }) {
  return (
    <section className="bg-[#0A0A0A]">
      <div className="mx-auto max-w-[800px] px-6 py-12">
        <p className="font-[Inter] text-[12px] font-semibold uppercase tracking-[0.18em] text-[#0E5B57]">
          Abstract
        </p>
        <div className="mb-6 mt-2 h-px w-12 bg-[#0E5B57]" />
        <div className="space-y-4 text-justify font-[Inter] text-base leading-relaxed text-[#C7C9CC]">
          {pub.abstract.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="font-[Inter] text-[13px] text-[#9AA3AF]">Keywords:</span>
          {pub.keywords.map((kw) => (
            <span
              key={kw}
              className="rounded-full bg-[#1B1E22] px-3 py-1 font-[Inter] text-xs text-[#C7C9CC]"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 3: Three Gaps ---------- */
function ThreeGaps() {
  const items = [
    {
      icon: Shield,
      title: "Cascading Failure Prevention",
      body:
        "When an agent fails mid-execution, failures propagate silently. CGP enforces rollback checkpoints and gate-failure halts.",
    },
    {
      icon: Scan,
      title: "Scope Creep Control",
      body:
        "Agents expand their own scope without authorization. CGP enforces explicit scope boundaries that cannot be exceeded implicitly.",
    },
    {
      icon: Fingerprint,
      title: "Decision Attribution",
      body:
        '"The AI decided" is not auditable. CGP requires operator-level, model-level, and human-level attribution for every consequential decision.',
    },
  ];
  return (
    <section className="bg-[#121417]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="font-[Orbitron] text-xl font-semibold text-white">
          The Three Gaps CGP Fills
        </h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-lg border border-[#1B1E22] border-t-2 border-t-[#0E5B57] bg-[#23272B] p-6"
            >
              <Icon className="h-6 w-6 text-[#0E5B57]" />
              <h3 className="mt-3 font-[Orbitron] text-base text-white">{title}</h3>
              <p className="mt-2 font-[Inter] text-sm leading-relaxed text-[#C7C9CC]">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 4: Control Domains ---------- */
function ControlDomains({ pub }: { pub: Publication }) {
  if (!pub.controlDomains) return null;
  return (
    <section className="bg-[#0A0A0A]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="font-[Orbitron] text-xl font-semibold text-white">
          Seven Control Domains · 28 Normative Controls
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {pub.controlDomains.map((d) => (
            <div
              key={d.id}
              className="rounded-md border border-[#1B1E22] bg-[#121417] p-4 transition-colors hover:border-[#0E5B57]"
            >
              <p className="font-[Orbitron] text-[11px] text-[#0E5B57]">{d.id}</p>
              <p className="mt-1 font-[Inter] text-[13px] font-medium text-white">{d.name}</p>
              <p className="mt-1 font-[Inter] text-xs text-[#9AA3AF]">
                {d.controls} controls · {d.mustControls} MUST
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 5: Framework Mapping ---------- */
function FrameworkMappingSection({ pub }: { pub: Publication }) {
  if (!pub.frameworkMapping) return null;
  return (
    <section className="bg-[#121417]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="font-[Orbitron] text-xl font-semibold text-white">
          Mapping to Existing Frameworks
        </h2>
        <p className="mt-3 font-[Inter] text-sm text-[#C7C9CC]">
          CGP extends — not replaces — the EU AI Act, NIST AI RMF, and ISO 42001.
        </p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="bg-[#23272B] text-left font-[Inter] text-[13px] font-semibold text-white">
                <th className="border border-[#1B1E22] px-4 py-3">CGP Domain</th>
                <th className="border border-[#1B1E22] px-4 py-3">EU AI Act</th>
                <th className="border border-[#1B1E22] px-4 py-3">NIST AI RMF</th>
                <th className="border border-[#1B1E22] px-4 py-3">ISO 42001</th>
              </tr>
            </thead>
            <tbody className="font-[Inter] text-[13px] text-[#C7C9CC]">
              {pub.frameworkMapping.map((row, i) => (
                <tr key={row.domain} className={i % 2 === 0 ? "bg-[#121417]" : "bg-[#0A0A0A]"}>
                  <td className="border border-[#1B1E22] px-4 py-3">{row.domain}</td>
                  <td className="border border-[#1B1E22] px-4 py-3">{row.euAiAct}</td>
                  <td className="border border-[#1B1E22] px-4 py-3">{row.nist}</td>
                  <td className="border border-[#1B1E22] px-4 py-3">{row.iso}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 6: Conformance ---------- */
function Conformance({ pub }: { pub: Publication }) {
  if (!pub.conformanceLevels) return null;
  const borderTop = (a: string) =>
    a === "emerald" ? "border-t-[#0E5B57]" : a === "white" ? "border-t-white" : "border-t-[#9AA3AF]";
  return (
    <section className="bg-[#0A0A0A]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="font-[Orbitron] text-xl font-semibold text-white">Conformance Levels</h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {pub.conformanceLevels.map((c) => (
            <div
              key={c.level}
              className={`rounded-lg border-2 ${borderTop(c.accent)} border-b border-l border-r border-[#1B1E22] bg-[#121417] p-6`}
            >
              <span
                className={`inline-block rounded px-2 py-0.5 font-[Inter] text-[11px] font-medium uppercase ${
                  c.accent === "emerald" ? "bg-[#0E5B57] text-white" : "bg-[#1B1E22] text-[#9AA3AF]"
                }`}
              >
                {c.badge}
              </span>
              <p className="mt-3 font-[Orbitron] text-[13px] text-[#0E5B57]">{c.level}</p>
              <p className="mt-1 font-[Inter] text-base font-semibold text-white">{c.name}</p>
              <p className="mt-2 font-[Inter] text-[13px] text-[#C7C9CC]">{c.requirement}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center font-[Inter] text-[13px] italic text-[#9AA3AF]">
          CGP v1.0 is not yet a certifiable standard. Organizations may claim "CGP v1.0 conformant
          at Level [1/2/3]" after self-assessment.
        </p>
      </div>
    </section>
  );
}

/* ---------- Section 7: Reference Implementation ---------- */
function ReferenceImplementation() {
  const features = [
    "Mission State Machine (14 states, 20 transitions)",
    "Command Gates (6 deterministic quality gates)",
    "Evidence Vault (cryptographic audit chain)",
    "Secure Apply Engine (transactional rollback)",
    "Mission Ledger (real-time cost attribution)",
    "Operator Corps (7 specialized operators)",
  ];
  return (
    <section className="bg-[#121417]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="font-[Orbitron] text-xl font-semibold text-white">Reference Implementation</h2>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div>
            <p className="font-[Inter] text-[15px] leading-relaxed text-[#C7C9CC]">
              Every control in CGP v1.0 has a reference implementation in MAAX Studio by Cyryx
              Labs. MAAX Studio is the first IDE built around governed agentic execution — with
              Mission State Machine, Command Gates, Evidence Vault, and Secure Apply Engine as
              architectural primitives.
            </p>
            <Link
              to="/products/maax-studio"
              className="mt-4 inline-flex items-center gap-1 font-[Inter] text-sm text-[#0E5B57] hover:underline"
            >
              Learn about MAAX Studio →
            </Link>
          </div>
          <div className="rounded-lg border border-[#0E5B57] bg-[#23272B] p-6">
            <p className="font-[Inter] text-[11px] font-semibold uppercase tracking-wider text-[#0E5B57]">
              Implemented in MAAX Studio
            </p>
            <ul className="mt-3 space-y-2 font-[Inter] text-[13px] text-[#C7C9CC]">
              {features.map((f) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 8: Contribute & Contact ---------- */
function ContributeAndContact({ pub }: { pub: Publication }) {
  return (
    <section className="bg-[#0A0A0A]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="font-[Orbitron] text-base text-white">Contribute to CGP</h3>
            <p className="mt-3 font-[Inter] text-sm text-[#C7C9CC]">
              CGP is published under CC BY 4.0. Open an issue, submit a gap report, or share your
              implementation.
            </p>
            {pub.githubUrl && (
              <a
                href={pub.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-md border border-[#0E5B57] px-4 py-2 font-[Inter] text-sm text-[#0E5B57] hover:bg-[#0E5B57]/10"
              >
                <Github className="h-4 w-4" /> View on GitHub →
              </a>
            )}
          </div>
          <div>
            <h3 className="font-[Orbitron] text-base text-white">Contact</h3>
            <p className="mt-3 font-[Inter] text-sm text-[#C7C9CC]">
              {pub.affiliation ?? "Cyryx Labs LLC"}
            </p>
            <div className="mt-3 space-y-1 font-[Inter] text-sm">
              {pub.contactEmail && (
                <a href={`mailto:${pub.contactEmail}`} className="block text-[#0E5B57] hover:text-white">
                  {pub.contactEmail}
                </a>
              )}
              <a href="/research" className="block text-[#0E5B57] hover:text-white">
                cyryxlabs.com/research
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 9: Citation Modal ---------- */
function CitationModal({ pub, onClose }: { pub: Publication; onClose: () => void }) {
  const [tab, setTab] = useState<"bibtex" | "apa" | "plain">("bibtex");
  const [copied, setCopied] = useState(false);

  const bibtex = `@techreport{cyryxlabs2026cgp,
  title     = {${pub.title}},
  author    = {{${pub.authors.join(" and ")}}},
  year      = {2026},
  month     = {June},
  number    = {${pub.documentId ?? ""}},
  institution = {${pub.affiliation ?? "Cyryx Labs LLC"}},
  note      = {Version ${pub.version ?? "1.0"}. ${pub.license ?? ""}.
               Available at ${pub.doiUrl ?? ""}}
}`;

  const apa = `${pub.authors.join(", ")}. (2026). ${pub.title} (Version ${pub.version}, Technical Report ${pub.documentId}). ${pub.affiliation ?? "Cyryx Labs LLC"}. ${pub.doiUrl ?? ""}`;

  const plain = `${pub.authors.join(", ")}. "${pub.title}." Technical Report ${pub.documentId}, Version ${pub.version}. ${pub.date}. DOI: ${pub.doi}. License: ${pub.license}.`;

  const content = tab === "bibtex" ? bibtex : tab === "apa" ? apa : plain;

  async function copyText() {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg border border-[#1B1E22] bg-[#121417] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h3 className="font-[Orbitron] text-base text-white">Cite this paper</h3>
          <button onClick={onClose} aria-label="Close" className="text-[#9AA3AF] hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 flex gap-4 border-b border-[#1B1E22]">
          {(["bibtex", "apa", "plain"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-2 font-[Inter] text-[13px] font-medium uppercase tracking-wider transition ${
                tab === t
                  ? "border-b-2 border-[#0E5B57] text-[#0E5B57]"
                  : "text-[#9AA3AF] hover:text-white"
              }`}
            >
              {t === "bibtex" ? "BibTeX" : t === "apa" ? "APA" : "Plain text"}
            </button>
          ))}
        </div>

        <div className="relative mt-4">
          <pre className="overflow-x-auto rounded-md border border-[#1B1E22] bg-[#0A0A0A] p-4 font-mono text-[13px] leading-relaxed text-[#C7C9CC] whitespace-pre-wrap">
            {content}
          </pre>
          <button
            type="button"
            onClick={copyText}
            className="absolute right-2 top-2 inline-flex items-center gap-1 rounded border border-[#1B1E22] bg-[#121417] px-2 py-1 font-[Inter] text-[11px] text-[#9AA3AF] hover:text-white"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[#0E5B57] px-4 py-2 font-[Inter] text-sm text-[#0E5B57] hover:bg-[#0E5B57]/10"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}