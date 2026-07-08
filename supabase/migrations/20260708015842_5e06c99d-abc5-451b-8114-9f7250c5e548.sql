-- Auto-reconcile mkt_leads.converted_at whenever a CRM deal changes stage
CREATE OR REPLACE FUNCTION public.reconcile_deal_attribution()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  is_won_stage boolean;
BEGIN
  SELECT is_won INTO is_won_stage FROM public.crm_stages WHERE id = NEW.stage_id;
  IF is_won_stage THEN
    UPDATE public.mkt_leads
       SET converted_at = COALESCE(converted_at, NEW.updated_at)
     WHERE deal_id = NEW.id;
  ELSE
    UPDATE public.mkt_leads
       SET converted_at = NULL
     WHERE deal_id = NEW.id AND converted_at IS NOT NULL;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_crm_deals_attribution ON public.crm_deals;
CREATE TRIGGER trg_crm_deals_attribution
AFTER INSERT OR UPDATE OF stage_id ON public.crm_deals
FOR EACH ROW
EXECUTE FUNCTION public.reconcile_deal_attribution();

-- Broadcast crm_deals + mkt_leads changes for near-real-time dashboards
ALTER PUBLICATION supabase_realtime ADD TABLE public.crm_deals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mkt_leads;