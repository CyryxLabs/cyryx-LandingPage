import * as React from "react";
import { Head, Html, Preview, Text } from "@react-email/components";
import { BrandShell, brand, styles } from "./_shared";
import type { TemplateEntry } from "./registry";

interface Props { unsubscribeUrl?: string }

const Email = ({ unsubscribeUrl }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You're in — welcome to Cyryx Labs updates.</Preview>
    <BrandShell>
      <Text style={styles.h1}>You're confirmed. Welcome.</Text>
      <Text style={styles.p}>
        Thanks for confirming. You'll now receive occasional updates on our latest systems,
        applied AI research, and product launches — nothing more.
      </Text>
      <Text style={styles.p}>
        We send only when there's something signal-grade to share. You can unsubscribe in one
        click any time using the link below.
      </Text>
      {unsubscribeUrl ? (
        <Text style={{ ...styles.p, fontSize: "12px", color: brand.silverDim }}>
          Don't want these emails?{" "}
          <a href={unsubscribeUrl} style={styles.link}>Unsubscribe instantly</a>.
        </Text>
      ) : null}
    </BrandShell>
  </Html>
);

export const template = {
  component: Email,
  subject: "You're in — welcome to Cyryx Labs",
  displayName: "Newsletter welcome",
  previewData: { unsubscribeUrl: "https://www.cyryxlabs.com/unsubscribe?token=preview" },
} satisfies TemplateEntry;
