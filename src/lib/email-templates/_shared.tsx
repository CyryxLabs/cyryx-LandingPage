import * as React from "react";
import { Body, Container, Hr, Section, Text } from "@react-email/components";

export const brand = {
  onyx: "#0A0E14",
  silver: "#D6DEE8",
  silverDim: "#8A93A4",
  accent: "#2DE3C5",
  accentSoft: "#9CF3E2",
  border: "#E6E8EE",
  text: "#0F172A",
  muted: "#525C6B",
  surface: "#F7F8FA",
};

export const styles = {
  body: {
    backgroundColor: "#ffffff",
    margin: 0,
    fontFamily:
      "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
    color: brand.text,
  } as React.CSSProperties,
  container: { maxWidth: "560px", margin: "0 auto", padding: "32px 24px 24px" } as React.CSSProperties,
  brandBar: {
    display: "inline-block",
    padding: "6px 12px",
    fontSize: "11px",
    letterSpacing: "0.28em",
    textTransform: "uppercase" as const,
    color: brand.onyx,
    backgroundColor: brand.accentSoft,
    borderRadius: "4px",
    fontWeight: 600,
  } as React.CSSProperties,
  h1: { fontSize: "24px", lineHeight: 1.2, fontWeight: 600, margin: "20px 0 8px", color: brand.text } as React.CSSProperties,
  p: { fontSize: "15px", lineHeight: 1.6, color: brand.muted, margin: "12px 0" } as React.CSSProperties,
  cta: {
    display: "inline-block",
    backgroundColor: brand.onyx,
    color: brand.accent,
    textDecoration: "none",
    padding: "12px 22px",
    borderRadius: "6px",
    fontWeight: 600,
    fontSize: "14px",
    letterSpacing: "0.06em",
    border: `1px solid ${brand.accent}`,
  } as React.CSSProperties,
  card: {
    border: `1px solid ${brand.border}`,
    borderRadius: "8px",
    padding: "16px 18px",
    backgroundColor: brand.surface,
    margin: "20px 0",
  } as React.CSSProperties,
  label: {
    fontSize: "11px",
    color: brand.silverDim,
    textTransform: "uppercase" as const,
    letterSpacing: "0.16em",
    margin: "0 0 4px",
  } as React.CSSProperties,
  value: { fontSize: "14px", color: brand.text, margin: "0 0 10px" } as React.CSSProperties,
  footer: { fontSize: "11px", color: brand.silverDim, lineHeight: 1.6, textAlign: "center" as const, margin: "24px 0 0" } as React.CSSProperties,
  link: { color: brand.muted, textDecoration: "underline" } as React.CSSProperties,
};

export function BrandShell({ children }: { children: React.ReactNode }) {
  return (
    <Body style={styles.body}>
      <Container style={styles.container}>
        <Section>
          <span style={styles.brandBar}>CYRYX LABS</span>
        </Section>
        {children}
        <Hr style={{ borderColor: brand.border, margin: "28px 0 16px" }} />
        <Text style={styles.footer}>
          Cyryx Labs · Built to achieve. Not just to generate.
          <br />
          You are receiving this email because you contacted us through cyryxlabs.com.
          <br />
          For privacy questions, contact{" "}
          <a href="mailto:privacy@cyryxlabs.com" style={styles.link}>privacy@cyryxlabs.com</a>{" "}
          · See our{" "}
          <a href="https://cyryxlabs.com/privacy" style={styles.link}>Privacy Policy</a>.
        </Text>
      </Container>
    </Body>
  );
}