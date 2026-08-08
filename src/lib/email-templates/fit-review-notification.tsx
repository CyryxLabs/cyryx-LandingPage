/* eslint-disable react-refresh/only-export-components -- React Email exports template metadata. */
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
  submissionId?: string;
}

const Email = ({ name, email, company, message, submittedAt, submissionId }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New fit review from {company || name || "the Cyryx Labs website"}.</Preview>
    <BrandShell>
      <Text style={styles.h1}>New fit review received</Text>
      <Text style={styles.p}>
        A prospective client submitted the qualification form on cyryxlabs.com. Review the request
        in the internal workspace before responding.
      </Text>
      <Section style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{name || "—"}</Text>
        <Text style={styles.label}>Work email</Text>
        <Text style={styles.value}>{email || "—"}</Text>
        <Text style={styles.label}>Company</Text>
        <Text style={styles.value}>{company || "—"}</Text>
        <Text style={styles.label}>Fit-review context</Text>
        <Text style={{ ...styles.value, whiteSpace: "pre-wrap" }}>{message || "—"}</Text>
        <Text style={styles.label}>Submitted</Text>
        <Text style={styles.value}>{submittedAt || new Date().toISOString()}</Text>
        <Text style={styles.label}>Submission reference</Text>
        <Text style={styles.value}>{submissionId || "—"}</Text>
      </Section>
      <Text style={styles.p}>
        Use the work email above after completing the internal fit review.
      </Text>
    </BrandShell>
  </Html>
);

function subjectValue(value: unknown): string {
  return String(value || "website inquiry")
    .replace(/[\r\n]+/g, " ")
    .slice(0, 100);
}

export const template = {
  component: Email,
  subject: (data: Record<string, unknown>) =>
    `New fit review — ${subjectValue(data.company || data.name)}`,
  displayName: "Fit-review notification (to Cyryx Labs)",
  to: "contact@cyryxlabs.com",
  previewData: {
    name: "Ada Lovelace",
    email: "ada@example.com",
    company: "Analytical Engines Ltd",
    message: "Project type: Workflow Automation\n\nPrimary problem:\nManual review handoffs.",
    submittedAt: new Date().toISOString(),
    submissionId: "00000000-0000-4000-8000-000000000000",
  },
} satisfies TemplateEntry;
