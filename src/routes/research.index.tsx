import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ArrowRight, Download, ExternalLink } from "lucide-react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { PUBLICATIONS, type PublicationCategory } from "@/data/publications";
import {
  buildBreadcrumbJsonLd,
  jsonLdScript,
} from "@/components/cyryx/seo/seo";

export const Route = createFileRoute("/research/")({
  head: () => ({
    meta: [
      { title: "Applied Research — Cyryx Labs" },
      {
        name: "description",
        content:
          "Cyryx Applied Research develops the architectures, protocols, and evaluation models behind governed AI execution systems and productized AI infrastructure.",
      },
      { property: "og:title", content: "Applied Research — Cyryx Labs" },
      {
        property: "og:description",
        content:
          "Applied research and architecture behind Cyryx products and client systems — agentic execution, context intelligence, governance, model routing, cost intelligence.",
      },
      { property: "og:url", content: "https://cyryxlabs.com/research" },
    ],
    links: [{ rel: "canonical", href: "https://cyryxlabs.com/research" }],
    scripts: [
      jsonLdScript(
        buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Research", path: "/research" },
        ]),
      ),
    ],
  }),
  component: ResearchHub,
});

const FILTERS: Array<"All" | PublicationCategory> = [
  "All",
  "Governance",
  "Agentic AI",
  "Token Intelligence",
  "Architecture",
];

function ResearchHub() {
  const [active, setActive] = useState<(typeof FILTERS)[number]>("All");

  const items = useMemo(
    () => (active === "All" ? PUBLICATIONS : PUBLICATIONS.filter((p) => p.category === active)),
    [active],
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#C7C9CC]">
      <Header />
      <main className="pt-32 lg:pt-40">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 pb-12">
          <p className="font-[Inter] text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0E5B57]">
            Cyryx Labs · Applied Research
          </p>
          <h1 className="mt-4 font-[Orbitron] text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            Research &amp; Publications
          </h1>
          <p className="mt-4 max-w-2xl font-[Inter] text-base leading-relaxed text-[#C7C9CC]">
            Technical frameworks, governance protocols, and applied research from Cyryx Labs —
            published openly for the community.
          </p>

          {/* Filters */}
          <div className="mt-8 flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const isActive = f === active;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActive(f)}
                  className={`rounded-full px-4 py-1.5 font-[Inter] text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-[#0E5B57] text-white"
                      : "bg-[#1B1E22] text-[#9AA3AF] hover:text-white"
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </section>

        {/* Grid */}
        <section className="mx-auto max-w-7xl px-6 pb-24">
          {items.length === 0 ? (
            <p className="py-24 text-center font-[Inter] text-sm text-[#9AA3AF]">
              No publications in this category yet.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p) => (
                <PublicationCard key={p.id} pub={p} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

function PublicationCard({ pub }: { pub: (typeof PUBLICATIONS)[number] }) {
  const isNew = pub.status === "new";
  return (
    <Link
      to="/research/$slug"
      params={{ slug: pub.slug }}
      className="group block rounded-lg border border-[#1B1E22] bg-[#121417] p-6 transition-all duration-200 hover:border-[#0E5B57] hover:shadow-lg"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded bg-[#0D3B3B] px-2 py-0.5 font-[Inter] text-[11px] font-medium uppercase tracking-wider text-[#0E5B57]">
          {pub.category}
        </span>
        <span
          className={`rounded px-2 py-0.5 font-[Inter] text-[11px] font-medium uppercase ${
            isNew ? "bg-[#0E5B57] text-white" : "bg-[#1B1E22] text-[#9AA3AF]"
          }`}
        >
          {isNew ? "New" : "Published"}
        </span>
      </div>

      <h2 className="mt-4 font-[Orbitron] text-base font-semibold leading-snug text-white">
        {pub.title}
      </h2>

      <p className="mt-2 font-[Inter] text-[13px] text-[#9AA3AF]">
        {pub.authors.join(", ")} · {pub.date}
        {pub.doi ? <> · DOI {pub.doi}</> : null}
      </p>

      <p className="mt-3 line-clamp-3 font-[Inter] text-sm leading-relaxed text-[#C7C9CC]">
        {pub.abstract}
      </p>

      <div className="my-4 h-px bg-[#1B1E22]" />

      <div className="flex flex-wrap items-center gap-4 font-[Inter] text-[12px] text-[#9AA3AF]">
        {pub.pdfUrl && (
          <span className="inline-flex items-center gap-1 group-hover:text-white">
            <Download className="h-3.5 w-3.5" /> PDF
          </span>
        )}
        {pub.doiUrl && (
          <span className="inline-flex items-center gap-1 group-hover:text-white">
            <ExternalLink className="h-3.5 w-3.5" /> DOI
          </span>
        )}
        <span className="ml-auto inline-flex items-center gap-1 text-[#0E5B57] group-hover:text-white">
          Read more <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}