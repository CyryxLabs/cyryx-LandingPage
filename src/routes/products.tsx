import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/cyryx/StubPage";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";

const PATH = "/products";
const TITLE = "Products — Cyryx Labs";
const DESC = "Proprietary AI products built by Cyryx Labs for the agentic era.";

export const Route = createFileRoute("/products")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Products", path: PATH },
      ]),
    ]),
  component: () => (
    <StubPage
      eyebrow="Cyryx Labs · Products"
      title="Proprietary AI products for the agentic era."
      description="MAAX Studio and the Cyryx Applied AI Lab — proprietary execution systems developed inside Cyryx Labs for teams operationalizing AI."
      status="Catalog Expanding"
    />
  ),
});