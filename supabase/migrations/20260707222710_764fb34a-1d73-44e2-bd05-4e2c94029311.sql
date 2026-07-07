
-- CHANNELS
CREATE TABLE public.mkt_channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  kind text NOT NULL DEFAULT 'paid',
  active boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mkt_channels TO authenticated;
GRANT ALL ON public.mkt_channels TO service_role;
ALTER TABLE public.mkt_channels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mkt_channels_all_auth" ON public.mkt_channels FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_mkt_channels_updated BEFORE UPDATE ON public.mkt_channels
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- CAMPAIGNS
CREATE TABLE public.mkt_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  channel_id uuid REFERENCES public.mkt_channels(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'planned',
  start_at date,
  end_at date,
  budget numeric(14,2) DEFAULT 0,
  spend numeric(14,2) DEFAULT 0,
  goal text,
  notes text,
  owner_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mkt_campaigns TO authenticated;
GRANT ALL ON public.mkt_campaigns TO service_role;
ALTER TABLE public.mkt_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mkt_campaigns_all_auth" ON public.mkt_campaigns FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_mkt_campaigns_updated BEFORE UPDATE ON public.mkt_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_mkt_campaigns_channel ON public.mkt_campaigns(channel_id);

-- LEADS (attribution bridge)
CREATE TABLE public.mkt_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES public.mkt_campaigns(id) ON DELETE SET NULL,
  channel_id uuid REFERENCES public.mkt_channels(id) ON DELETE SET NULL,
  contact_id uuid REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  deal_id uuid REFERENCES public.crm_deals(id) ON DELETE SET NULL,
  source text,
  first_touch_at timestamptz NOT NULL DEFAULT now(),
  converted_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mkt_leads TO authenticated;
GRANT ALL ON public.mkt_leads TO service_role;
ALTER TABLE public.mkt_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mkt_leads_all_auth" ON public.mkt_leads FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_mkt_leads_updated BEFORE UPDATE ON public.mkt_leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_mkt_leads_campaign ON public.mkt_leads(campaign_id);
CREATE INDEX idx_mkt_leads_deal ON public.mkt_leads(deal_id);
CREATE INDEX idx_mkt_leads_contact ON public.mkt_leads(contact_id);

-- ATTRIBUTION VIEW
CREATE OR REPLACE VIEW public.mkt_attribution_v AS
SELECT
  c.id AS campaign_id,
  c.name AS campaign_name,
  c.channel_id,
  ch.name AS channel_name,
  c.status,
  c.budget,
  c.spend,
  COUNT(DISTINCT l.id) AS leads_count,
  COUNT(DISTINCT l.deal_id) FILTER (WHERE l.deal_id IS NOT NULL) AS deals_count,
  COUNT(DISTINCT d.id) FILTER (WHERE s.is_won) AS won_deals,
  COALESCE(SUM(d.value) FILTER (WHERE d.status <> 'lost'), 0) AS pipeline_value,
  COALESCE(SUM(d.value) FILTER (WHERE s.is_won), 0) AS won_value
FROM public.mkt_campaigns c
LEFT JOIN public.mkt_channels ch ON ch.id = c.channel_id
LEFT JOIN public.mkt_leads l ON l.campaign_id = c.id
LEFT JOIN public.crm_deals d ON d.id = l.deal_id
LEFT JOIN public.crm_stages s ON s.id = d.stage_id
GROUP BY c.id, ch.name;

GRANT SELECT ON public.mkt_attribution_v TO authenticated;
GRANT SELECT ON public.mkt_attribution_v TO service_role;
