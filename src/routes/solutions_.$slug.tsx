import { createFileRoute, notFound } from "@tanstack/react-router";
import { SolutionDetailPage } from "@/components/cyryx/enterprise/PageShell";
import {
  solutionKeys,
  solutions,
  type SolutionKey,
} from "@/components/cyryx/enterprise/internalContent";

function getSolution(slug: string) {
  const key = solutionKeys.find((candidate) => solutions[candidate].slug === slug);
  if (!key) throw notFound();
  return solutions[key as SolutionKey];
}

export const Route = createFileRoute("/solutions_/$slug")({
  loader: ({ params }) => getSolution(params.slug),
  head: ({ params }) => {
    const content = getSolution(params.slug);
    return {
      meta: [
        { title: `${content.eyebrow} — Cyryx Labs` },
        { name: "description", content: content.promise },
        { property: "og:title", content: `${content.eyebrow} — Cyryx Labs` },
        { property: "og:description", content: content.promise },
        { property: "og:url", content: `https://cyryxlabs.com/solutions/${content.slug}` },
      ],
      links: [{ rel: "canonical", href: `https://cyryxlabs.com/solutions/${content.slug}` }],
    };
  },
  component: SolutionRouteComponent,
});

function SolutionRouteComponent() {
  const content = Route.useLoaderData();
  return <SolutionDetailPage content={content} />;
}
