-- Attribution reconciliation audit log
CREATE TABLE public.mkt_attribution_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ran_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ran_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  range_key TEXT,
  range_start TIMESTAMPTZ,
  range_end TIMESTAMPTZ,
  scanned INT NOT NULL DEFAULT 0,
  marked_won INT NOT NULL DEFAULT 0,
  cleared INT NOT NULL DEFAULT 0,
  affected_lead_ids UUID[] NOT NULL DEFAULT '{}',
  affected_deal_ids UUID[] NOT NULL DEFAULT '{}',
  pipeline_before NUMERIC NOT NULL DEFAULT 0,
  pipeline_after NUMERIC NOT NULL DEFAULT 0,
  revenue_before NUMERIC NOT NULL DEFAULT 0,
  revenue_after NUMERIC NOT NULL DEFAULT 0,
  diff JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT
);

GRANT SELECT, INSERT ON public.mkt_attribution_audit TO authenticated;
GRANT ALL ON public.mkt_attribution_audit TO service_role;

ALTER TABLE public.mkt_attribution_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth read attribution audit"
  ON public.mkt_attribution_audit FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "auth insert attribution audit"
  ON public.mkt_attribution_audit FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = ran_by OR ran_by IS NULL);

CREATE INDEX mkt_attribution_audit_ran_at_idx ON public.mkt_attribution_audit (ran_at DESC);