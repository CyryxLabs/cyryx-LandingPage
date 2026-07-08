import { supabase } from "@/integrations/supabase/client";

// Pure helper: derives display counters + deltas from a ReconcileResult.
// Extracted so it can be unit-tested independently of Supabase / React.
export type DiffSummary = {
  changes: number;
  markedWon: number;
  cleared: number;
  netLeads: number;
  affectedLeads: number;
  affectedDeals: number;
  pipelineDelta: number;
  revenueDelta: number;
  pipelinePct: number | null;
  revenuePct: number | null;
};

export function summarizeDiff(result: {
  diff: { action: "marked_won" | "cleared" }[];
  marked_won: number;
  cleared: number;
  affected_lead_ids: string[];
  affected_deal_ids: string[];
  pipeline_before: number;
  pipeline_after: number;
  revenue_before: number;
  revenue_after: number;
}): DiffSummary {
  const pipelineDelta = result.pipeline_after - result.pipeline_before;
  const revenueDelta = result.revenue_after - result.revenue_before;
  return {
    changes: result.diff.length,
    markedWon: result.marked_won,
    cleared: result.cleared,
    netLeads: result.marked_won - result.cleared,
    affectedLeads: result.affected_lead_ids.length,
    affectedDeals: result.affected_deal_ids.length,
    pipelineDelta,
    revenueDelta,
    pipelinePct: result.pipeline_before > 0 ? (pipelineDelta / result.pipeline_before) * 100 : null,
    revenuePct: result.revenue_before > 0 ? (revenueDelta / result.revenue_before) * 100 : null,
  };
}

export type ReconcileDiffEntry = {
  lead_id: string;
  deal_id: string;
  action: "marked_won" | "cleared";
  before_converted_at: string | null;
  after_converted_at: string | null;
  deal_value: number;
  campaign_id: string | null;
  channel_id: string | null;
};

export type ReconcileResult = {
  audit_id: string | null;
  ran_at: string;
  range_key?: string;
  range_start?: string;
  range_end?: string;
  scanned: number;
  marked_won: number;
  cleared: number;
  affected_lead_ids: string[];
  affected_deal_ids: string[];
  pipeline_before: number;
  pipeline_after: number;
  revenue_before: number;
  revenue_after: number;
  diff: ReconcileDiffEntry[];
};

// Client-side attribution reconciliation. Keeps mkt_leads.converted_at in sync
// with the current CRM deal stage, computes a before/after diff, and writes an
// audit row to mkt_attribution_audit.
export async function reconcileAttribution(opts?: {
  rangeKey?: string;
  rangeStart?: Date | number | null;
  rangeEnd?: Date | number | null;
}): Promise<ReconcileResult> {
  const [leadsRes, dealsRes, stagesRes] = await Promise.all([
    (supabase as any).from("mkt_leads").select("id, deal_id, converted_at, campaign_id, channel_id"),
    (supabase as any).from("crm_deals").select("id, stage_id, updated_at"),
    (supabase as any).from("crm_stages").select("id, is_won"),
  ]);
  if (leadsRes.error) throw leadsRes.error;
  if (dealsRes.error) throw dealsRes.error;
  if (stagesRes.error) throw stagesRes.error;

  const wonStages = new Set(
    (stagesRes.data ?? []).filter((s: any) => s.is_won).map((s: any) => s.id),
  );
  const dealMap = new Map<string, { stage_id: string; updated_at: string; value?: number }>();
  for (const d of dealsRes.data ?? []) {
    dealMap.set(d.id, { stage_id: d.stage_id, updated_at: d.updated_at, value: Number((d as any).value ?? 0) });
  }

  // Deal values for pipeline/revenue totals (fetch once, includes value)
  const dealsFull = await (supabase as any).from("crm_deals").select("id,stage_id,value");
  const dealValueMap = new Map<string, { value: number; stage_id: string }>();
  for (const d of dealsFull.data ?? []) {
    dealValueMap.set(d.id, { value: Number(d.value ?? 0), stage_id: d.stage_id });
  }

  function totals(leadsRows: any[]) {
    let pipeline = 0;
    let revenue = 0;
    for (const l of leadsRows) {
      if (!l.deal_id) continue;
      const d = dealValueMap.get(l.deal_id);
      if (!d) continue;
      pipeline += d.value;
      if (l.converted_at) revenue += d.value;
    }
    return { pipeline, revenue };
  }

  const leads = leadsRes.data ?? [];
  const before = totals(leads);

  const diff: ReconcileDiffEntry[] = [];
  const nextLeads = leads.map((l: any) => ({ ...l }));
  const updates: Promise<unknown>[] = [];

  for (const l of leads) {
    if (!l.deal_id) continue;
    const deal = dealMap.get(l.deal_id);
    if (!deal) continue;
    const isWon = wonStages.has(deal.stage_id);
    const dealValue = dealValueMap.get(l.deal_id)?.value ?? 0;
    if (isWon && !l.converted_at) {
      updates.push(
        (supabase as any)
          .from("mkt_leads")
          .update({ converted_at: deal.updated_at })
          .eq("id", l.id),
      );
      diff.push({
        lead_id: l.id, deal_id: l.deal_id, action: "marked_won",
        before_converted_at: null, after_converted_at: deal.updated_at,
        deal_value: dealValue, campaign_id: l.campaign_id ?? null, channel_id: l.channel_id ?? null,
      });
      const idx = nextLeads.findIndex((x: any) => x.id === l.id);
      if (idx >= 0) nextLeads[idx].converted_at = deal.updated_at;
    } else if (!isWon && l.converted_at) {
      updates.push(
        (supabase as any).from("mkt_leads").update({ converted_at: null }).eq("id", l.id),
      );
      diff.push({
        lead_id: l.id, deal_id: l.deal_id, action: "cleared",
        before_converted_at: l.converted_at, after_converted_at: null,
        deal_value: dealValue, campaign_id: l.campaign_id ?? null, channel_id: l.channel_id ?? null,
      });
      const idx = nextLeads.findIndex((x: any) => x.id === l.id);
      if (idx >= 0) nextLeads[idx].converted_at = null;
    }
  }
  await Promise.all(updates);

  const after = totals(nextLeads);
  const marked_won = diff.filter((d) => d.action === "marked_won").length;
  const cleared = diff.filter((d) => d.action === "cleared").length;
  const affected_lead_ids = Array.from(new Set(diff.map((d) => d.lead_id)));
  const affected_deal_ids = Array.from(new Set(diff.map((d) => d.deal_id)));

  const ran_at = new Date().toISOString();
  const { data: userRes } = await supabase.auth.getUser();
  const rangeStart = opts?.rangeStart ? new Date(opts.rangeStart).toISOString() : null;
  const rangeEnd = opts?.rangeEnd ? new Date(opts.rangeEnd).toISOString() : null;

  const { data: audit } = await (supabase as any)
    .from("mkt_attribution_audit")
    .insert({
      ran_by: userRes?.user?.id ?? null,
      range_key: opts?.rangeKey ?? null,
      range_start: rangeStart,
      range_end: rangeEnd,
      scanned: leads.length,
      marked_won,
      cleared,
      affected_lead_ids,
      affected_deal_ids,
      pipeline_before: before.pipeline,
      pipeline_after: after.pipeline,
      revenue_before: before.revenue,
      revenue_after: after.revenue,
      diff,
    })
    .select("id")
    .maybeSingle();

  return {
    audit_id: audit?.id ?? null,
    ran_at,
    range_key: opts?.rangeKey,
    range_start: rangeStart ?? undefined,
    range_end: rangeEnd ?? undefined,
    scanned: leads.length,
    marked_won,
    cleared,
    affected_lead_ids,
    affected_deal_ids,
    pipeline_before: before.pipeline,
    pipeline_after: after.pipeline,
    revenue_before: before.revenue,
    revenue_after: after.revenue,
    diff,
  };
}