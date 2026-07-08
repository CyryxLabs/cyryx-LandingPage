import { supabase } from "@/integrations/supabase/client";

// Client-side attribution reconciliation.
// Keeps mkt_leads.converted_at in sync with the current CRM deal stage:
// - if deal is on a won stage and converted_at is NULL → set converted_at = deal.updated_at
// - if deal is not won and converted_at is not NULL → clear converted_at
// - if lead has no deal_id → left alone
export async function reconcileAttribution(): Promise<{
  scanned: number;
  marked_won: number;
  cleared: number;
}> {
  const [leadsRes, dealsRes, stagesRes] = await Promise.all([
    (supabase as any).from("mkt_leads").select("id, deal_id, converted_at"),
    (supabase as any).from("crm_deals").select("id, stage_id, updated_at"),
    (supabase as any).from("crm_stages").select("id, is_won"),
  ]);
  if (leadsRes.error) throw leadsRes.error;
  if (dealsRes.error) throw dealsRes.error;
  if (stagesRes.error) throw stagesRes.error;

  const wonStages = new Set(
    (stagesRes.data ?? []).filter((s: any) => s.is_won).map((s: any) => s.id),
  );
  const dealMap = new Map<string, { stage_id: string; updated_at: string }>();
  for (const d of dealsRes.data ?? []) {
    dealMap.set(d.id, { stage_id: d.stage_id, updated_at: d.updated_at });
  }

  const leads = leadsRes.data ?? [];
  let marked_won = 0;
  let cleared = 0;

  const updates: Promise<unknown>[] = [];
  for (const l of leads) {
    if (!l.deal_id) continue;
    const deal = dealMap.get(l.deal_id);
    if (!deal) continue;
    const isWon = wonStages.has(deal.stage_id);
    if (isWon && !l.converted_at) {
      updates.push(
        (supabase as any)
          .from("mkt_leads")
          .update({ converted_at: deal.updated_at })
          .eq("id", l.id),
      );
      marked_won++;
    } else if (!isWon && l.converted_at) {
      updates.push(
        (supabase as any).from("mkt_leads").update({ converted_at: null }).eq("id", l.id),
      );
      cleared++;
    }
  }
  await Promise.all(updates);
  return { scanned: leads.length, marked_won, cleared };
}