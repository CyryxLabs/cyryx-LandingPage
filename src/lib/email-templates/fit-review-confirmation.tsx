/* eslint-disable react-refresh/only-export-components -- React Email exports template metadata. */
import * as React from "react";
import { Head, Html, Section, Text } from "@react-email/components";
import { BrandShell, styles } from "./_shared";
import type { TemplateEntry } from "./registry";

interface Props {
  name?: string;
  /** Instant first read drafted by the website AI from the submitted brief. */
  aiReply?: string;
}

const Email = ({ name, aiReply }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <BrandShell>
      <Text style={styles.h1}>We have your project brief, {name || "there"}.</Text>
      {aiReply ? (
        <>
          <Text style={styles.p}>Here is a first read of your request:</Text>
          <Section style={styles.card}>
            <Text style={{ ...styles.value, whiteSpace: "pre-wrap" }}>{aiReply}</Text>
          </Section>
          <Text style={{ ...styles.p, fontSize: "13px" }}>
            This first read was drafted instantly by the Cyryx AI system from what you wrote. A
            person on our team reviews every brief before any proposal.
          </Text>
        </>
      ) : (
        <Text style={styles.p}>
          Cyryx Labs received the context you submitted. We will review the business problem,
          desired outcome, timing, and whether Cyryx is the right fit.
        </Text>
      )}
      <Text style={styles.p}>
        This message confirms receipt only. It does not confirm acceptance, scope, timing,
        availability, or commercial terms.
      </Text>
      <Text style={styles.p}>
        If you need to add context, reply to this email or write to contact@cyryxlabs.com.
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
  subject: "We received your project brief — Cyryx Labs",
  displayName: "Project brief confirmation (to sender)",
  previewData: {
    name: "Ada",
    aiReply:
      "You want invoice exceptions routed to the right approver without manual triage. Build looks like the right starting point, with Control defining approval limits. Which system holds the approval rules today?",
  },
} satisfies TemplateEntry;
