import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";

const PATH = "/terms";
const TITLE = "Terms of Service — Cyryx Labs";
const DESC =
  "Terms of Service governing use of the Cyryx Labs website and engagements with Cyryx Labs LLC.";

export const Route = createFileRoute("/terms")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Terms of Service", path: PATH },
      ]),
    ]),
  component: TermsPage,
});

function TermsPage() {
  const effective = "January 1, 2026";
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-12 pt-32 pb-24 lg:pt-44">
        <HudLabel withDot className="text-[var(--accent-glow)]">Legal</HudLabel>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-[-0.02em] text-silver-gradient">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm text-[var(--silver-dim)]">Effective {effective}</p>

        <Section heading="1. Acceptance of terms">
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern access to and use of the
            website at cyryxlabs.com and any related services (collectively, the
            &ldquo;Site&rdquo;) operated by Cyryx Labs LLC, a Florida limited liability
            company (&ldquo;Cyryx Labs&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). By
            accessing or using the Site you agree to these Terms. If you do not agree,
            do not use the Site.
          </p>
        </Section>

        <Section heading="2. Engagements and Master Service Agreement">
          <p>
            All paid engagements are performed under a separate written Master Service
            Agreement (&ldquo;MSA&rdquo;) and one or more Statements of Work between
            Cyryx Labs and the client. Nothing on the Site creates a contract to
            deliver services, and information on the Site is not a binding offer.
          </p>
        </Section>

        <Section heading="3. Intellectual property">
          <p>
            All content on the Site — including text, graphics, logos, marks, and
            software — is the property of Cyryx Labs or its licensors and is
            protected by intellectual property laws. You may not copy, modify,
            distribute, or create derivative works from any portion of the Site
            without our prior written consent, except as permitted for personal,
            non-commercial evaluation.
          </p>
        </Section>

        <Section heading="4. Acceptable use">
          <p>You agree not to:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-[var(--accent-glow)]">
            <li>use the Site in a manner that violates any applicable law;</li>
            <li>attempt to gain unauthorized access to any portion of the Site or
              related systems;</li>
            <li>introduce viruses, malware, or otherwise disrupt Site operation;</li>
            <li>scrape, harvest, or reverse engineer any portion of the Site except
              as permitted by applicable law.</li>
          </ul>
        </Section>

        <Section heading="5. Third-party services">
          <p>
            The Site relies on third-party infrastructure and services for hosting,
            email delivery, analytics, and related functions. Their availability and
            terms are outside our control. We are not responsible for third-party
            services except as explicitly stated in an MSA.
          </p>
        </Section>

        <Section heading="6. Disclaimers">
          <p>
            The Site and all Site content are provided on an &ldquo;as is&rdquo; and
            &ldquo;as available&rdquo; basis without warranties of any kind, whether
            express or implied, including implied warranties of merchantability,
            fitness for a particular purpose, and non-infringement. We do not
            warrant that the Site will be uninterrupted, error-free, or free of
            harmful components.
          </p>
        </Section>

        <Section heading="7. Limitation of liability">
          <p>
            To the maximum extent permitted by law, Cyryx Labs and its members,
            officers, employees, and affiliates will not be liable for any indirect,
            incidental, special, consequential, or punitive damages, or for lost
            profits, revenues, or data, arising out of or related to your use of
            the Site. Our aggregate liability arising out of or related to the Site
            will not exceed one hundred U.S. dollars (US$100).
          </p>
        </Section>

        <Section heading="8. Indemnification">
          <p>
            You agree to indemnify and hold harmless Cyryx Labs from any claim,
            liability, or expense (including reasonable attorneys&rsquo; fees) arising
            out of your breach of these Terms or misuse of the Site.
          </p>
        </Section>

        <Section heading="9. Governing law and venue">
          <p>
            These Terms are governed by the laws of the State of Florida, without
            regard to conflict-of-laws principles. The exclusive venue for any
            dispute arising out of or related to these Terms or the Site will be
            the state or federal courts located in St. Lucie County, Florida, and
            you consent to the personal jurisdiction of those courts.
          </p>
        </Section>

        <Section heading="10. Changes to these Terms">
          <p>
            We may update these Terms from time to time. Material changes will be
            reflected by updating the effective date above. Continued use of the
            Site after changes take effect constitutes acceptance of the updated
            Terms.
          </p>
        </Section>

        <Section heading="11. Contact">
          <p>
            Questions about these Terms may be sent to{" "}
            <a
              href="mailto:contact@cyryxlabs.com"
              className="text-[var(--accent-glow)] hover:underline"
            >
              contact@cyryxlabs.com
            </a>
            .
          </p>
        </Section>
      </main>
      <Footer />
    </div>
  );
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-lg sm:text-xl font-semibold tracking-tight text-[var(--silver)]">
        {heading}
      </h2>
      <div className="mt-3 text-[15px] leading-relaxed text-[var(--silver-dim)]">
        {children}
      </div>
    </section>
  );
}