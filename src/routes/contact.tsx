import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail } from "lucide-react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";
import { buildStartProjectHref, CONTACT_EMAIL } from "@/lib/cta";
import { trackCta } from "@/lib/track-cta";

const PATH = "/contact";
const TITLE = "Contact Cyryx Labs";
const DESC =
  "Contact Cyryx Labs about projects, research, partnerships, privacy or careers. Project opportunities start with a short project brief.";

const CONTACT_PATHS = [
  {
    label: "Project opportunities",
    title: "Bring us the business constraint.",
    body: "Use the project brief for advisory, digital systems, automation, internal assistants, custom AI products, governance, or managed operations.",
    action: "Start a project",
    cta: "start_project",
    href: buildStartProjectHref({ source: "contact" }),
  },
  {
    label: "Research and collaboration",
    title: "Start with a specific question.",
    body: "For applied research, technical collaboration, or partnership inquiries, include the topic, intended outcome, and relevant organization.",
    action: "Review research",
    cta: "view_research",
    href: "/research",
  },
] as const;

const DIRECT_CHANNELS = [
  {
    label: "General inquiries",
    email: CONTACT_EMAIL,
    subject: "General inquiry",
  },
  {
    label: "Privacy",
    email: "privacy@cyryxlabs.com",
    subject: "Privacy inquiry",
  },
  {
    label: "Careers",
    email: "careers@cyryxlabs.com",
    subject: "Careers inquiry",
  },
] as const;

export const Route = createFileRoute("/contact")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Contact", path: PATH },
      ]),
    ]),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content" className="relative overflow-hidden">
        <section className="mx-auto max-w-7xl px-5 pb-24 pt-32 sm:px-8 lg:px-12 lg:pb-32 lg:pt-44">
          <nav aria-label="Breadcrumb" className="text-xs text-[var(--silver-dim)]">
            <Link to="/" className="transition-colors hover:text-[var(--accent-glow)]">
              Home
            </Link>
            <span className="mx-2 opacity-60">/</span>
            <span className="text-[var(--silver)]">Contact</span>
          </nav>

          <div className="mt-10 grid gap-12 border-b border-[color-mix(in_oklab,var(--silver)_14%,transparent)] pb-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.6fr)] lg:items-end lg:gap-20 lg:pb-24">
            <div>
              <HudLabel withDot>Contact Cyryx Labs</HudLabel>
              <h1 className="mt-7 max-w-[12ch] font-display text-5xl font-semibold leading-[0.96] tracking-[-0.05em] text-silver-gradient sm:text-6xl lg:text-8xl">
                Start in the right place.
              </h1>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg">
              Projects, research, privacy and careers follow different
              paths. Choose the context below so your inquiry reaches the right workflow.
            </p>
          </div>

          <div className="mt-20 lg:mt-28">
            <HudLabel>Inquiry paths</HudLabel>
            <div className="mt-8 border-y border-[color-mix(in_oklab,var(--silver)_14%,transparent)]">
              {CONTACT_PATHS.map((path, index) => (
                <article
                  key={path.label}
                  className="grid gap-5 border-b border-[color-mix(in_oklab,var(--silver)_14%,transparent)] py-8 last:border-b-0 sm:grid-cols-[3rem_minmax(0,1fr)] lg:grid-cols-[5rem_minmax(16rem,0.65fr)_minmax(18rem,1fr)_auto] lg:items-center lg:gap-10 lg:py-10"
                >
                  <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--accent-glow)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--steel)]">
                      {path.label}
                    </p>
                    <h2 className="mt-3 font-display text-2xl tracking-[-0.03em] text-[var(--silver)] sm:text-3xl">
                      {path.title}
                    </h2>
                  </div>
                  <p className="sm:col-start-2 text-sm leading-relaxed text-[var(--silver-dim)] lg:col-start-auto lg:text-base">
                    {path.body}
                  </p>
                  <Link
                    to={path.href}
                    onClick={() =>
                      trackCta({
                        cta: path.cta,
                        section: "contact",
                        href: path.href,
                      })
                    }
                    className="sm:col-start-2 inline-flex min-h-11 items-center gap-2 justify-self-start hud-label text-[var(--silver)] transition-colors hover:text-[var(--accent-glow)] lg:col-start-auto lg:justify-self-end"
                  >
                    {path.action}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </article>
              ))}
            </div>
          </div>

          <section
            aria-labelledby="direct-contact-heading"
            className="mt-20 grid gap-10 lg:mt-28 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-20"
          >
            <div>
              <HudLabel>Direct channels</HudLabel>
              <h2
                id="direct-contact-heading"
                className="mt-6 max-w-[13ch] font-display text-4xl tracking-[-0.04em] text-[var(--silver)] sm:text-5xl"
              >
                A concise note is enough.
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-[var(--silver-dim)]">
                Include the reason for your inquiry, the relevant organization, and the response you
                need. Sensitive project details should wait until an appropriate channel is agreed.
              </p>
            </div>
            <ul className="border-y border-[color-mix(in_oklab,var(--silver)_14%,transparent)]">
              {DIRECT_CHANNELS.map((channel) => {
                const href = `mailto:${channel.email}?subject=${encodeURIComponent(channel.subject)}`;
                return (
                  <li
                    key={channel.label}
                    className="border-b border-[color-mix(in_oklab,var(--silver)_14%,transparent)] last:border-b-0"
                  >
                    <a
                      href={href}
                      onClick={() =>
                        trackCta({
                          cta: "contact_email",
                          section: "contact",
                          href,
                        })
                      }
                      className="group grid min-h-20 gap-2 py-5 sm:grid-cols-[minmax(9rem,0.6fr)_minmax(0,1fr)_auto] sm:items-center sm:gap-6"
                    >
                      <span className="text-xs uppercase tracking-[0.14em] text-[var(--steel)]">
                        {channel.label}
                      </span>
                      <span className="break-all text-sm text-[var(--silver)] sm:text-base">
                        {channel.email}
                      </span>
                      <Mail
                        className="h-4 w-4 text-[var(--accent-glow)] transition-transform group-hover:-translate-y-0.5"
                        aria-hidden
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        </section>
      </main>
      <Footer />
    </div>
  );
}
