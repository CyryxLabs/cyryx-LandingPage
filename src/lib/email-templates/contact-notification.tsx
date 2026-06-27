import * as React from "react";
import { Head, Html, Preview, Section, Text } from "@react-email/components";
import { BrandShell, styles } from "./_shared";
import type { TemplateEntry } from "./registry";

interface Props {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
  submittedAt?: string;
  ipHash?: string;
}

const Email = ({ name, email, company, message, submittedAt, ipHash }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New inquiry from {name || "Cyryx Labs website"}.</Preview>
    <BrandShell>
      <Text style={styles.h1}>New inquiry from the website</Text>
      <Text style={styles.p}>Someone just submitted the contact form on cyryxlabs.com.</Text>
      <Section style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{name || "—"}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{email || "—"}</Text>
        <Text style={styles.label}>Company</Text>
        <Text style={styles.value}>{company || "—"}</Text>
        <Text style={styles.label}>Message</Text>
        <Text style={{ ...styles.value, whiteSpace: "pre-wrap" }}>{message || "—"}</Text>
        <Text style={styles.label}>Submitted</Text>
        <Text style={styles.value}>{submittedAt || new Date().toISOString()}</Text>
        {ipHash ? (
          <>
            <Text style={styles.label}>IP fingerprint (hashed)</Text>
            <Text style={styles.value}>{ipHash}</Text>
          </>
        ) : null}
      </Section>
      <Text style={styles.p}>Reply directly to this email to respond to the sender.</Text>
    </BrandShell>
  </Html>
);

export const template = {
  component: Email,
  subject: (d: Record<string, unknown>) => `New contact inquiry — ${(d.name as string) || "anonymous"}`,
  displayName: "Contact form notification (to Cyryx Labs)",
  to: "contact@cyryxlabs.com",
  previewData: {
    name: "Paulo Cyryx",
    email: "paulo@example.com",
    company: "Cyryx Labs",
    message: "Quero validar uma ideia de produto AI para Q3.",
    submittedAt: new Date().toISOString(),
  },
} satisfies TemplateEntry;