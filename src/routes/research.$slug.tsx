import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, Copy, Download } from "lucide-react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import {
  buildBreadcrumbJsonLd,
  buildHead,
  buildTechArticleJsonLd,
} from "@/components/cyryx/seo/seo";
import { getPublicationBySlug, type Publication } from "@/data/publications";

export const Route = createFileRoute("/research/$slug")({
  loader: ({ params }) => {
    const publication = getPublicationBySlug(params.slug);
    if (!publication) throw notFound();
    return { publication };
  },
  head: ({ loaderData }) => {
    const publication = loaderData?.publication;
    if (!publication) {
      return buildHead({
        title: "Research — Cyryx Labs",
        description: "Applied research and technical publications from Cyryx Labs.",
        path: "/research",
      });
    }

    const path = `/research/${publication.slug}`;
    const description = publication.publicSummary;
    return buildHead(
      {
        title: `${publication.documentId} — Cyryx Labs Research`,
        description,
        path,
        ogType: "article",
      },
      [
        buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Research", path: "/research" },
          { name: publication.title, path },
        ]),
        buildTechArticleJsonLd({
          headline: publication.title,
          description,
          path,
          datePublished: publication.publishedAt,
          authors: publication.authors,
          authorType: publication.authors.some((author) => /cyryx labs/i.test(author))
            ? "Organization"
            : "Person",
          identifier: publication.doi ? `https://doi.org/${publication.doi}` : undefined,
          license: publication.licenseUrl,
          keywords: publication.keywords,
        }),
      ],
    );
  },
  component: ResearchPublicationPage,
  notFoundComponent: ResearchNotFound,
});

function ResearchPublicationPage() {
  const { publication } = Route.useLoaderData();
  const [copied, setCopied] = useState(false);
  const recordVerified = publication.evidence.publicationRecord.state === "verified";
  const citation = recordVerified
    ? `${publication.authors.join(", ")}. (${publication.publishedAt.slice(0, 4)}). ${publication.title} (Version ${publication.version}, Technical Report ${publication.documentId}). ${publication.affiliation}. ${publication.doiUrl}`
    : "";

  async function copyCitation() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(citation);
      } else {
        copyWithTemporaryTextarea(citation);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 5000);
    } catch {
      copyWithTemporaryTextarea(citation);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 5000);
    }
  }

  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <section className="relative overflow-hidden border-b border-white/10 px-5 pb-20 pt-32 sm:px-8 lg:pb-28 lg:pt-44">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 72% 34%, color-mix(in oklab, var(--accent-glow) 13%, transparent), transparent 34%)",
            }}
          />
          <div className="relative mx-auto max-w-7xl">
            <Link
              to="/research"
              className="inline-flex min-h-11 items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--silver-dim)] transition hover:text-[var(--accent-glow)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
              Applied Research
            </Link>

            <div className="mt-8 grid gap-12 lg:grid-cols-[1.16fr_0.84fr] lg:items-end lg:gap-20">
              <div>
                <HudLabel withDot>
                  {publication.category} / {publication.documentId}
                </HudLabel>
                <h1 className="mt-7 max-w-[15ch] font-display text-4xl font-semibold leading-[0.98] tracking-[-0.05em] text-silver-gradient sm:text-6xl lg:text-7xl">
                  {publication.title}
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-[var(--silver-dim)]">
                  {publication.subtitle}
                </p>
              </div>

              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10">
                {[
                  ["Published", publication.date],
                  ["Version", publication.version],
                  ["Author", publication.authors.join(", ")],
                  ["License", publication.license],
                ].map(([label, value]) => (
                  <div key={label} className="bg-[var(--obsidian)] p-5">
                    <dt className="font-mono text-[8px] uppercase tracking-[0.18em] text-[var(--steel)]">
                      {label}
                    </dt>
                    <dd className="mt-2 text-sm text-[var(--silver)]">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              {publication.doiUrl && recordVerified && (
                <a
                  href={publication.doiUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[var(--silver)] px-6 font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--onyx)] transition hover:bg-white"
                >
                  Open DOI record <ArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              )}
              {publication.sourceUrl && recordVerified && (
                <a
                  href={publication.sourceUrl}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/15 px-6 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--silver)] transition hover:border-[var(--accent-glow)] hover:text-[var(--accent-glow)]"
                >
                  Download LaTeX source <Download className="h-4 w-4" aria-hidden />
                </a>
              )}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="research-evidence-heading"
          className="border-b border-white/10 bg-[var(--obsidian)] px-5 py-12 sm:px-8 sm:py-16"
        >
          <div className="mx-auto max-w-7xl">
            <HudLabel>Evidence states</HudLabel>
            <h2
              id="research-evidence-heading"
              className="mt-5 max-w-[18ch] font-display text-3xl tracking-[-0.035em] text-[var(--silver)] sm:text-4xl"
            >
              Publication is not implementation, conformance, or certification.
            </h2>
            <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-4">
              {Object.values(publication.evidence).map((item) => (
                <article key={item.label} className="bg-[var(--graphite)] p-5 sm:p-6">
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-[var(--accent-glow)]">
                    {item.state}
                  </p>
                  <h3 className="mt-4 font-display text-xl text-[var(--silver)]">{item.label}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">
                    {item.summary}
                  </p>
                  {item.checkedAt ? (
                    <p className="mt-4 font-mono text-[8px] uppercase tracking-[0.14em] text-[var(--steel)]">
                      Reviewed {item.checkedAt}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[0.34fr_0.66fr] lg:gap-24">
            <div>
              <HudLabel>Website summary of the publication</HudLabel>
              <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--steel)]">
                {recordVerified && publication.doi
                  ? `DOI ${publication.doi}`
                  : "Record unavailable"}
              </p>
            </div>
            <div className="space-y-6 text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg">
              {publication.abstract.split("\n\n").map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
              <div className="flex flex-wrap gap-2 pt-3">
                {publication.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-white/10 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-[var(--steel)]"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {publication.controlDomains && (
          <section className="border-y border-white/10 bg-[var(--obsidian)] px-5 py-20 sm:px-8 sm:py-28">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-8 lg:grid-cols-[0.6fr_0.4fr] lg:items-end">
                <div>
                  <HudLabel>Protocol architecture</HudLabel>
                  <h2 className="mt-6 max-w-[15ch] font-display text-4xl tracking-[-0.045em] text-[var(--silver)] sm:text-6xl">
                    Seven control domains. Twenty-eight normative controls.
                  </h2>
                </div>
                <p className="text-sm leading-relaxed text-[var(--silver-dim)]">
                  CGP is presented as an extension to existing governance frameworks, with explicit
                  operating controls for agentic execution.
                </p>
              </div>

              <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
                {publication.controlDomains.map((domain) => (
                  <article key={domain.id} className="min-h-48 bg-[var(--graphite)] p-6">
                    <span className="font-mono text-[9px] text-[var(--accent-glow)]">
                      {domain.id}
                    </span>
                    <h3 className="mt-8 font-display text-xl tracking-[-0.025em] text-[var(--silver)]">
                      {domain.name}
                    </h3>
                    <p className="mt-4 font-mono text-[8px] uppercase tracking-[0.15em] text-[var(--steel)]">
                      {domain.controls} controls / {domain.mustControls} MUST
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {publication.frameworkMapping && (
          <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
            <HudLabel>Framework mapping</HudLabel>
            <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <h2 className="max-w-[16ch] font-display text-4xl tracking-[-0.045em] text-[var(--silver)] sm:text-5xl">
                Designed to extend, not replace.
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-[var(--silver-dim)]">
                The paper maps each CGP domain to relevant provisions in the EU AI Act, NIST AI RMF,
                and ISO/IEC 42001.
              </p>
            </div>

            <div className="mt-10 max-w-full overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full border-collapse text-left" style={{ minWidth: 840 }}>
                <thead className="bg-[var(--graphite)] font-mono text-[8px] uppercase tracking-[0.14em] text-[var(--steel)]">
                  <tr>
                    <th className="px-5 py-4">CGP domain</th>
                    <th className="px-5 py-4">EU AI Act</th>
                    <th className="px-5 py-4">NIST AI RMF</th>
                    <th className="px-5 py-4">ISO/IEC 42001</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-sm text-[var(--silver-dim)]">
                  {publication.frameworkMapping.map((row) => (
                    <tr key={row.domain} className="transition hover:bg-white/[0.025]">
                      <th className="px-5 py-4 font-medium text-[var(--silver)]">{row.domain}</th>
                      <td className="px-5 py-4">{row.euAiAct}</td>
                      <td className="px-5 py-4">{row.nist}</td>
                      <td className="px-5 py-4">{row.iso}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {publication.conformanceLevels && (
          <section className="border-y border-white/10 bg-[var(--graphite)] px-5 py-20 sm:px-8 sm:py-28">
            <div className="mx-auto max-w-7xl">
              <HudLabel>Conformance model</HudLabel>
              <div className="mt-10 grid gap-4 lg:grid-cols-3">
                {publication.conformanceLevels.map((level) => (
                  <article key={level.level} className="rounded-lg border border-white/10 p-7">
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--accent-glow)]">
                      {level.level} / {level.badge}
                    </span>
                    <h3 className="mt-8 font-display text-2xl text-[var(--silver)]">
                      {level.name}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-[var(--silver-dim)]">
                      {level.requirement}
                    </p>
                  </article>
                ))}
              </div>
              <p className="mt-6 max-w-3xl text-xs leading-relaxed text-[var(--steel)]">
                These levels describe protocol requirements. CGP v1.0 is not a third-party
                certification or an independent compliance determination.
              </p>
            </div>
          </section>
        )}

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
          <div className="grid min-w-0 gap-10 rounded-xl border border-white/10 bg-[var(--obsidian)] p-7 sm:p-10 lg:grid-cols-[0.45fr_0.55fr] lg:gap-16">
            <div className="min-w-0">
              <HudLabel>Publication record</HudLabel>
              <h2 className="mt-6 font-display text-4xl tracking-[-0.045em] text-[var(--silver)]">
                Open, citable, versioned.
              </h2>
              <dl className="mt-8 space-y-4 text-sm">
                <RecordRow
                  label="DOI"
                  value={recordVerified ? publication.doi : undefined}
                  href={recordVerified ? publication.doiUrl : undefined}
                />
                <RecordRow
                  label="Concept DOI"
                  value={recordVerified ? publication.conceptDoi : undefined}
                  href={recordVerified ? publication.conceptDoiUrl : undefined}
                />
                <RecordRow
                  label="License"
                  value={publication.license}
                  href={publication.licenseUrl}
                />
              </dl>
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-[var(--steel)]">
                Suggested citation
              </p>
              <p className="mt-4 break-words rounded-lg border border-white/10 bg-[var(--onyx)] p-5 font-mono text-xs leading-relaxed text-[var(--silver-dim)]">
                {recordVerified
                  ? citation
                  : "The publication record is not currently available for citation."}
              </p>
              <button
                type="button"
                onClick={copyCitation}
                disabled={!recordVerified}
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md border border-white/15 px-5 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--silver)] transition hover:border-[var(--accent-glow)] hover:text-[var(--accent-glow)]"
              >
                {copied ? (
                  <Check className="h-4 w-4" aria-hidden />
                ) : (
                  <Copy className="h-4 w-4" aria-hidden />
                )}
                {copied ? "Citation copied" : "Copy citation"}
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function copyWithTemporaryTextarea(value: string) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function RecordRow({ label, value, href }: { label: string; value?: string; href?: string }) {
  if (!value) return null;
  return (
    <div className="grid min-w-0 grid-cols-1 gap-2 border-t border-white/10 pt-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-4">
      <dt className="font-mono text-[8px] uppercase tracking-[0.16em] text-[var(--steel)]">
        {label}
      </dt>
      <dd className="min-w-0">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex max-w-full items-start gap-1 break-all text-[var(--silver)] hover:text-[var(--accent-glow)]"
          >
            {value} <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

function ResearchNotFound() {
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
        <HudLabel>Research record</HudLabel>
        <h1 className="mt-6 font-display text-4xl text-[var(--silver)]">Publication not found.</h1>
        <Link
          to="/research"
          className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm text-[var(--accent-glow)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Return to Research
        </Link>
      </main>
      <Footer />
    </div>
  );
}
