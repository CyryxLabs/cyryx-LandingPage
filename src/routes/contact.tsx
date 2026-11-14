import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/SiteShell";
import { ContactForm } from "@/components/site/ContactForm";
import { AskAssistant, PageHero, StartButton } from "@/components/site/ui";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";
import { CYRYX_ORGANIZATION_ID } from "@/data/seo-entities";
import { CONTACT_EMAIL } from "@/lib/cta";
import { absoluteSiteUrl } from "@/lib/site-url";
import { trackCta } from "@/lib/track-cta";

const PATH = "/contact";
const TITLE = "Contact Cyryx Labs";
const DESC =
  "Contact Cyryx Labs about an AI project, research, partnerships, privacy or careers. Send a message or book a free 20-minute fit check.";

const CHANNELS = [
  { label: "General", email: CONTACT_EMAIL, subject: "General inquiry" },
  { label: "Privacy", email: "privacy@cyryxlabs.com", subject: "Privacy inquiry" },
  { label: "Careers", email: "careers@cyryxlabs.com", subject: "Careers inquiry" },
  { label: "Press", email: "press@cyryxlabs.com", subject: "Press inquiry" },
] as const;

export const Route = createFileRoute("/contact")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Contact", path: PATH },
      ]),
      {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "@id": `${absoluteSiteUrl(PATH)}#webpage`,
        url: absoluteSiteUrl(PATH),
        name: TITLE,
        description: DESC,
        about: { "@id": CYRYX_ORGANIZATION_ID },
      },
    ]),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteShell source="contact" sticky={false}>
      <PageHero
        crumbs={[{ name: "Home", path: "/" }, { name: "Contact" }]}
        eyebrow="Contact"
        title="Tell us what you want to change."
        lead="A sentence or two is enough. A person reads every message, and project inquiries start with a free 20-minute fit check."
      />

      <section className="cy-section cy-section--tight" aria-labelledby="contact-form-heading">
        <div className="cy-container cy-split" style={{ gridTemplateColumns: undefined }}>
          <div className="cy-split__aside">
            <h2
              id="contact-form-heading"
              className="cy-h2"
              style={{ fontSize: "clamp(1.6rem, 2vw + 1rem, 2.4rem)" }}
            >
              Three ways to reach us
            </h2>
            <ol className="cy-rows">
              <li>
                <span>01</span>
                <div>
                  <h3 className="cy-h3">Send a message</h3>
                  <p>Use the form. Good for any question.</p>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <h3 className="cy-h3">Start a project</h3>
                  <p>A short brief gets you to the fit check faster.</p>
                  <div style={{ marginTop: 12 }}>
                    <StartButton
                      section="contact"
                      source="contact"
                      small
                      label="Start a project brief"
                    />
                  </div>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <h3 className="cy-h3">Ask the assistant</h3>
                  <p>Instant answers about services, products and how we work.</p>
                  <AskAssistant source="contact" label="Open the assistant" />
                </div>
              </li>
            </ol>
            <div>
              <p className="cy-eyebrow" style={{ marginBottom: 12 }}>
                Email
              </p>
              <ul style={{ display: "grid", gap: 4 }}>
                {CHANNELS.map((channel) => {
                  const href = `mailto:${channel.email}?subject=${encodeURIComponent(channel.subject)}`;
                  return (
                    <li key={channel.label}>
                      <a
                        href={href}
                        className="cy-link"
                        style={{ fontWeight: 500 }}
                        onClick={() => trackCta({ cta: "contact_email", section: "contact", href })}
                      >
                        <span className="cy-muted" style={{ minWidth: 72 }}>
                          {channel.label}
                        </span>
                        {channel.email}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="cy-score__card">
            <ContactForm />
            <p className="cy-source" style={{ marginTop: 16, display: "block" }}>
              Cyryx Labs LLC · Port St. Lucie, Florida · See the{" "}
              <Link to="/privacy">privacy policy</Link>.
            </p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
