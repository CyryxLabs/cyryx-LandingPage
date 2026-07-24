export type PublicationCategory =
  | "Governance"
  | "Agentic AI"
  | "Token Intelligence"
  | "Architecture";

export type PublicationStatus = "published" | "new" | "draft";

export interface ControlDomain {
  id: string;
  name: string;
  controls: number;
  mustControls: number;
}

export interface FrameworkMappingRow {
  domain: string;
  euAiAct: string;
  nist: string;
  iso: string;
}

export interface ConformanceLevel {
  level: string;
  name: string;
  requirement: string;
  badge: string;
}

export interface Publication {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  authors: string[];
  affiliation?: string;
  date: string;
  publishedAt: string;
  version?: string;
  documentId?: string;
  license?: string;
  licenseUrl?: string;
  doi?: string;
  doiUrl?: string;
  conceptDoi?: string;
  conceptDoiUrl?: string;
  recordUrl?: string;
  sourceUrl?: string;
  contactEmail?: string;
  category: PublicationCategory;
  status: PublicationStatus;
  keywords: string[];
  abstract: string;
  controlDomains?: ControlDomain[];
  frameworkMapping?: FrameworkMappingRow[];
  conformanceLevels?: ConformanceLevel[];
  referenceImplementation?: string;
}

/**
 * Public record verified against the Zenodo API on 2026-07-23.
 * Record: https://zenodo.org/records/21045760
 */
export const CGP_V1: Publication = {
  id: "cgp-v1",
  slug: "cgp-v1",
  title: "CGP: Cyryx Governance Protocol for Agentic AI Execution",
  subtitle: "Version 1.0 — Technical Report CGP-2026-001",
  authors: ["CYRYX Labs"],
  affiliation: "Cyryx Labs LLC, United States of America",
  date: "June 29, 2026",
  publishedAt: "2026-06-29",
  version: "1.0",
  documentId: "CGP-2026-001",
  license: "CC BY 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
  doi: "10.5281/zenodo.21045760",
  doiUrl: "https://doi.org/10.5281/zenodo.21045760",
  conceptDoi: "10.5281/zenodo.21045759",
  conceptDoiUrl: "https://doi.org/10.5281/zenodo.21045759",
  recordUrl: "https://zenodo.org/records/21045760",
  sourceUrl: "https://zenodo.org/api/records/21045760/files/CGP_v1_arXiv_LaTeX_Source.tex/content",
  contactEmail: "cgp@cyryxlabs.com",
  category: "Governance",
  status: "published",
  keywords: [
    "agentic AI",
    "AI governance",
    "EU AI Act",
    "NIST AI RMF",
    "ISO 42001",
    "autonomous agents",
    "governed execution",
  ],
  abstract: `Existing AI governance frameworks — the EU AI Act, the NIST AI Risk Management Framework (AI RMF), and ISO/IEC 42001 — were designed for AI systems operating under continuous human supervision: classifiers, recommenders, and single-turn generators. None were designed for agentic AI systems that autonomously decompose goals into multi-step plans, execute sequences of environment-modifying actions, coordinate multiple specialized sub-agents, and maintain state across sessions. Singapore's Model AI Governance Framework (January 2026) is the only published governance document that acknowledges this gap, identifying three unaddressed risks: cascading failure propagation, emergent scope expansion, and attribution gaps across agent chains.

This document introduces the Cyryx Governance Protocol (CGP) v1.0, a technical framework that fills these gaps with seven control domains and twenty-eight normative controls (MUST/SHOULD/MAY). CGP is designed as an extension to existing frameworks — not a replacement — with explicit mapping to EU AI Act Articles 9, 12, 13, 14, and 15; NIST AI RMF functions GOVERN, MAP, MEASURE, and MANAGE; and ISO 42001 Clause 6, 7, 8, and 9 controls. Every control in CGP v1.0 has a reference implementation in MAAX Studio by Cyryx Labs. CGP is published under Creative Commons Attribution 4.0 (CC BY 4.0) for open community adoption and review.`,
  controlDomains: [
    { id: "CD1", name: "Mission Authorization", controls: 4, mustControls: 3 },
    { id: "CD2", name: "Scope Boundary Enforcement", controls: 4, mustControls: 4 },
    { id: "CD3", name: "Checkpoint Integrity", controls: 4, mustControls: 3 },
    { id: "CD4", name: "Command Gate System", controls: 4, mustControls: 3 },
    { id: "CD5", name: "Decision Attribution", controls: 4, mustControls: 4 },
    { id: "CD6", name: "Evidence Chain", controls: 4, mustControls: 4 },
    { id: "CD7", name: "Cost Governance", controls: 5, mustControls: 4 },
  ],
  frameworkMapping: [
    {
      domain: "CD1 — Mission Authorization",
      euAiAct: "Art. 14, Art. 9",
      nist: "GOVERN 1.1, MAP 1.5",
      iso: "Clause 6.1, Annex A-6.2",
    },
    {
      domain: "CD2 — Scope Boundary",
      euAiAct: "Art. 9, Art. 13",
      nist: "MAP 3.5, MEASURE 2.5",
      iso: "Annex A-8.4, Clause 8.1",
    },
    {
      domain: "CD3 — Checkpoint Integrity",
      euAiAct: "Art. 9.4",
      nist: "MANAGE 2.2, MANAGE 3.1",
      iso: "Annex A-8.5, Annex A-9.1",
    },
    {
      domain: "CD4 — Command Gates",
      euAiAct: "Art. 9, Art. 15",
      nist: "MEASURE 2.1, MEASURE 2.3",
      iso: "Annex A-8.3, Annex A-8.6",
    },
    {
      domain: "CD5 — Decision Attribution",
      euAiAct: "Art. 12, Art. 14.4",
      nist: "GOVERN 6.1, GOVERN 6.2",
      iso: "Annex A-8.2, Clause 7.5",
    },
    {
      domain: "CD6 — Evidence Chain",
      euAiAct: "Art. 12, Art. 17",
      nist: "GOVERN 6.2, MEASURE 2.8",
      iso: "Clause 9.1, Annex A-8.7",
    },
    {
      domain: "CD7 — Cost Governance",
      euAiAct: "Not explicitly addressed",
      nist: "GOVERN 4.1, MANAGE 4.1",
      iso: "Annex A-8.4, Clause 9.1",
    },
  ],
  conformanceLevels: [
    {
      level: "CGP-L1",
      name: "Agentic Baseline",
      requirement: "All MUST controls in CD1, CD3, CD5, and CD6",
      badge: "Baseline",
    },
    {
      level: "CGP-L2",
      name: "Governed Execution",
      requirement: "All MUST controls across all seven domains",
      badge: "Governed",
    },
    {
      level: "CGP-L3",
      name: "Enterprise Agentic Governance",
      requirement: "All MUST and SHOULD controls plus third-party review",
      badge: "Enterprise",
    },
  ],
  referenceImplementation: "MAAX Studio by Cyryx Labs",
};

export const PUBLICATIONS: Publication[] = [CGP_V1];

export function getPublicationBySlug(slug: string): Publication | undefined {
  return PUBLICATIONS.find((publication) => publication.slug === slug);
}

export function hasNewPublication(withinDays = 30): boolean {
  const cutoff = Date.now() - withinDays * 24 * 60 * 60 * 1000;
  return PUBLICATIONS.some(
    (publication) =>
      publication.status === "new" || new Date(publication.publishedAt).getTime() >= cutoff,
  );
}
