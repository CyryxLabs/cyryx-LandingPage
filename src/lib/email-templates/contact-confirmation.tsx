import * as React from "react";
import { Head, Html, Preview, Section, Text } from "@react-email/components";
import { BrandShell, styles } from "./_shared";
import type { TemplateEntry } from "./registry";

interface Props { name?: string }

const Email = ({ name }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>We received your message — Cyryx Labs will reply within 24h.</Preview>
    <BrandShell>
      <Text style={styles.h1}>Thanks, {name || "there"} — message received.</Text>
      <Text style={styles.p}>
        Your inquiry just landed in our inbox. A member of the Cyryx Labs team
        will reply within 24 hours, Monday through Friday.
      </Text>
      <Text style={styles.p}>If you have anything to add, just reply to this email.</Text>
      <Section style={{ marginTop: "24px" }}>
        <Text style={{ ...styles.p, color: "#0F172A", fontWeight: 600 }}>— The Cyryx Labs team</Text>
      </Section>
    </BrandShell>
  </Html>
);

export const template = {
  component: Email,
  subject: "We received your message — Cyryx Labs",
  displayName: "Contact form confirmation (to sender)",
  previewData: { name: "Paulo" },
} satisfies TemplateEntry;