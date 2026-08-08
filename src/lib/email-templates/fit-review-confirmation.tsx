/* eslint-disable react-refresh/only-export-components -- React Email exports template metadata. */
import * as React from "react";
import { Head, Html, Section, Text } from "@react-email/components";
import { BrandShell, styles } from "./_shared";
import type { TemplateEntry } from "./registry";

interface Props {
  name?: string;
}

const Email = ({ name }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <BrandShell>
      <Text style={styles.h1}>Fit review received, {name || "there"}.</Text>
      <Text style={styles.p}>
        Cyryx Labs received the context you submitted. We will review the business problem, desired
        outcome, timing, and whether Cyryx is the right fit.
      </Text>
      <Text style={styles.p}>
        This message confirms receipt only. It does not confirm acceptance, scope, timing,
        availability, or commercial terms.
      </Text>
      <Text style={styles.p}>
        If you need to add context, email contact@cyryxlabs.com and reference your company name.
      </Text>
      <Section style={{ marginTop: "24px" }}>
        <Text style={{ ...styles.p, color: "#0F172A", fontWeight: 600 }}>
          — The Cyryx Labs team
        </Text>
      </Section>
    </BrandShell>
  </Html>
);

export const template = {
  component: Email,
  subject: "We received your fit review — Cyryx Labs",
  displayName: "Fit-review confirmation (to sender)",
  previewData: { name: "Ada" },
} satisfies TemplateEntry;
