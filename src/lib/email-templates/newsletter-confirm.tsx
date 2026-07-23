import * as React from "react";
import { Button, Head, Html, Preview, Section, Text } from "@react-email/components";
import { BrandShell, brand, styles } from "./_shared";
import type { TemplateEntry } from "./registry";

interface Props { confirmUrl?: string }

const Email = ({ confirmUrl }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your subscription to Cyryx Labs updates.</Preview>
    <BrandShell>
      <Text style={styles.h1}>One last step — confirm your email.</Text>
      <Text style={styles.p}>
        You asked to receive updates on Cyryx Labs systems, research, and product launches.
        To comply with GDPR / LGPD, we need a final confirm before adding you to the list.
      </Text>
      <Section style={{ margin: "24px 0" }}>
        <Button href={confirmUrl || "https://cyryxlabs.com"} style={styles.cta}>
          Confirm subscription
        </Button>
      </Section>
      <Text style={{ ...styles.p, fontSize: "13px", color: brand.silverDim }}>
        This link expires in 48 hours. If you did not request this, simply ignore this email —
        no subscription is created until you click confirm.
      </Text>
    </BrandShell>
  </Html>
);

export const template = {
  component: Email,
  subject: "Confirm your Cyryx Labs subscription",
  displayName: "Newsletter double opt-in",
  previewData: { confirmUrl: "https://cyryxlabs.com/newsletter/confirm?token=preview" },
} satisfies TemplateEntry;