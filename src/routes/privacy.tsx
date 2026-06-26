import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";

const LAST_UPDATED = "June 26, 2026";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Cyryx Labs" },
      {
        name: "description",
        content:
          "How Cyryx Labs collects, uses, and protects the information you share when contacting us or using cyryxlabs.com.",
      },
      { property: "og:title", content: "Privacy Policy — Cyryx Labs" },
      {
        property: "og:description",
        content:
          "How Cyryx Labs handles personal information, your rights, and how to contact us.",
      },
      { property: "og:url", content: "/privacy" },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main className="relative">
        <section className="relative pt-28 pb-20 lg:pt-40 lg:pb-28">
          <div className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-12">
            <HudLabel withDot className="text-[var(--accent-glow)]">
              Legal
            </HudLabel>
            <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-[-0.02em] text-silver-gradient">
              Privacy Policy
            </h1>
            <p className="mt-4 text-sm uppercase tracking-[0.18em] text-[var(--silver-dim)]">
              Last updated: {LAST_UPDATED}
            </p>

            <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-[var(--silver-dim)]">
              <p>
                This Privacy Policy is maintained by Cyryx Labs (&ldquo;Cyryx
                Labs&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) and explains
                how we collect, use, disclose, and protect information when you
                visit{" "}
                <a
                  className="text-[var(--silver)] underline underline-offset-4 hover:text-[var(--accent-glow)]"
                  href="https://cyryxlabs.com"
                >
                  cyryxlabs.com
                </a>{" "}
                or contact us through this website. It is designed to align with
                widely accepted privacy principles, including the EU General
                Data Protection Regulation (GDPR), the UK GDPR, the California
                Consumer Privacy Act as amended by the CPRA, and other
                U.S. state privacy laws.
              </p>

              <Section title="1. Information we collect">
                <p>
                  We collect only the information you choose to provide and a
                  limited amount of technical information needed to operate the
                  site securely.
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-5">
                  <li>
                    <span className="text-[var(--silver)]">Contact form data:</span>{" "}
                    your name, email address, optional company name, the message
                    you write, and your consent confirmation.
                  </li>
                  <li>
                    <span className="text-[var(--silver)]">Technical data:</span>{" "}
                    standard server logs (IP address, user agent, request
                    timestamps) and anonymized performance metrics used to keep
                    the site fast and reliable.
                  </li>
                </ul>
                <p className="mt-4">
                  We do not knowingly collect information from children under
                  the age of 16. We do not sell or share personal information
                  for cross-context behavioral advertising.
                </p>
              </Section>

              <Section title="2. How we use your information">
                <ul className="list-disc space-y-2 pl-5">
                  <li>To reply to your inquiry and provide the information or service you requested.</li>
                  <li>To operate, secure, and improve the website.</li>
                  <li>To comply with applicable legal obligations.</li>
                </ul>
                <p className="mt-4">
                  We rely on your <span className="text-[var(--silver)]">consent</span> as the
                  legal basis for processing your contact submissions, and on
                  our <span className="text-[var(--silver)]">legitimate interest</span> in
                  running a secure website for the limited technical data above.
                </p>
              </Section>

              <Section title="3. Sharing and disclosure">
                <p>
                  We do not sell your personal information. We share it only
                  with vetted service providers that help us operate the site
                  (such as hosting and email delivery), and only to the extent
                  needed for those services. We may disclose information if
                  required by law or to protect the rights, property, or safety
                  of Cyryx Labs or others.
                </p>
              </Section>

              <Section title="4. Data retention">
                <p>
                  Contact submissions are retained for as long as needed to
                  follow up on your inquiry and for a reasonable period
                  afterward for record-keeping and legal compliance, and then
                  deleted or anonymized. You can request earlier deletion at any
                  time.
                </p>
              </Section>

              <Section title="5. International transfers">
                <p>
                  Cyryx Labs operates globally. Your information may be
                  processed in countries other than your own. When we transfer
                  personal data internationally, we use safeguards consistent
                  with applicable law (such as Standard Contractual Clauses
                  where required).
                </p>
              </Section>

              <Section title="6. Your rights">
                <p>
                  Depending on where you live, you may have the right to access,
                  correct, delete, or port your personal information; to object
                  to or restrict certain processing; to withdraw consent; and to
                  lodge a complaint with your data protection authority.
                  California residents have additional rights under the CCPA/CPRA,
                  including the right to know, delete, correct, and limit the use
                  of sensitive personal information, and the right not to be
                  discriminated against for exercising these rights.
                </p>
                <p className="mt-4">
                  To exercise any of these rights, email us at{" "}
                  <a
                    className="text-[var(--silver)] underline underline-offset-4 hover:text-[var(--accent-glow)]"
                    href="mailto:privacy@cyryxlabs.com"
                  >
                    privacy@cyryxlabs.com
                  </a>
                  . We will respond within the timeframes required by applicable
                  law.
                </p>
              </Section>

              <Section title="7. Security">
                <p>
                  We use reasonable administrative, technical, and organizational
                  measures to protect personal information. No method of
                  transmission or storage is 100% secure, but we work to apply
                  current best practices.
                </p>
              </Section>

              <Section title="8. Cookies and analytics">
                <p>
                  We use only the cookies and similar technologies strictly
                  necessary to operate the site and to gather aggregated,
                  anonymized performance metrics. We do not use advertising
                  cookies.
                </p>
              </Section>

              <Section title="9. Changes to this policy">
                <p>
                  We may update this Privacy Policy from time to time. When we
                  do, we will update the &ldquo;Last updated&rdquo; date at the
                  top of this page. Material changes will be highlighted on this
                  page.
                </p>
              </Section>

              <Section title="10. Contact us">
                <p>
                  Questions about this Privacy Policy or our data practices?
                  Reach us at{" "}
                  <a
                    className="text-[var(--silver)] underline underline-offset-4 hover:text-[var(--accent-glow)]"
                    href="mailto:privacy@cyryxlabs.com"
                  >
                    privacy@cyryxlabs.com
                  </a>
                  .
                </p>
              </Section>

              <p className="border-t border-[color-mix(in_oklab,var(--silver)_10%,transparent)] pt-6 text-xs text-[var(--silver-dim)]">
                This page is provided for general informational purposes and is
                not legal advice. Please consult qualified counsel for guidance
                specific to your situation.
              </p>

              <div className="pt-2">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 hud-label text-[var(--silver-dim)] hover:text-[var(--accent-glow)] transition-colors"
                >
                  ← Back to Cyryx Labs
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl sm:text-2xl font-semibold uppercase tracking-[0.04em] text-[var(--silver)]">
        {title}
      </h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}