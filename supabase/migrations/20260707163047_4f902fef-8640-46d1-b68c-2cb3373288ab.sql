
-- Enums
CREATE TYPE public.deal_stage AS ENUM ('lead','qualified','proposal','negotiation','won','lost');
CREATE TYPE public.product_status AS ENUM ('idea','building','beta','live','sunset');
CREATE TYPE public.task_status AS ENUM ('backlog','todo','in_progress','review','done');
CREATE TYPE public.task_priority AS ENUM ('low','medium','high','urgent');
CREATE TYPE public.candidate_stage AS ENUM ('applied','screening','interview','offer','hired','rejected');
CREATE TYPE public.campaign_status AS ENUM ('planned','running','paused','completed');

-- Shared trigger fn
CREATE OR REPLACE FUNCTION public.ws_touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- 1. Deals
CREATE TABLE public.ws_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text,
  contact_email text,
  value_usd numeric(12,2) DEFAULT 0,
  stage public.deal_stage NOT NULL DEFAULT 'lead',
  owner_email text,
  notes text,
  expected_close_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ws_deals TO authenticated;
GRANT ALL ON public.ws_deals TO service_role;
ALTER TABLE public.ws_deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "team read deals" ON public.ws_deals FOR SELECT TO authenticated USING (true);
CREATE POLICY "team write deals" ON public.ws_deals FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER ws_deals_touch BEFORE UPDATE ON public.ws_deals FOR EACH ROW EXECUTE FUNCTION public.ws_touch_updated_at();

-- 2. Products
CREATE TABLE public.ws_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  status public.product_status NOT NULL DEFAULT 'idea',
  description text,
  health smallint DEFAULT 80 CHECK (health BETWEEN 0 AND 100),
  roadmap_note text,
  owner_email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ws_products TO authenticated;
GRANT ALL ON public.ws_products TO service_role;
ALTER TABLE public.ws_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "team read products" ON public.ws_products FOR SELECT TO authenticated USING (true);
CREATE POLICY "team write products" ON public.ws_products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER ws_products_touch BEFORE UPDATE ON public.ws_products FOR EACH ROW EXECUTE FUNCTION public.ws_touch_updated_at();

-- 3. Dev tasks
CREATE TABLE public.ws_dev_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  status public.task_status NOT NULL DEFAULT 'backlog',
  priority public.task_priority NOT NULL DEFAULT 'medium',
  assignee_email text,
  product_id uuid REFERENCES public.ws_products(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ws_dev_tasks TO authenticated;
GRANT ALL ON public.ws_dev_tasks TO service_role;
ALTER TABLE public.ws_dev_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "team read tasks" ON public.ws_dev_tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "team write tasks" ON public.ws_dev_tasks FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER ws_tasks_touch BEFORE UPDATE ON public.ws_dev_tasks FOR EACH ROW EXECUTE FUNCTION public.ws_touch_updated_at();

-- 4. Candidates
CREATE TABLE public.ws_candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  role text,
  stage public.candidate_stage NOT NULL DEFAULT 'applied',
  source text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ws_candidates TO authenticated;
GRANT ALL ON public.ws_candidates TO service_role;
ALTER TABLE public.ws_candidates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "team read candidates" ON public.ws_candidates FOR SELECT TO authenticated USING (true);
CREATE POLICY "team write candidates" ON public.ws_candidates FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER ws_candidates_touch BEFORE UPDATE ON public.ws_candidates FOR EACH ROW EXECUTE FUNCTION public.ws_touch_updated_at();

-- 5. Campaigns
CREATE TABLE public.ws_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  channel text,
  status public.campaign_status NOT NULL DEFAULT 'planned',
  budget_usd numeric(10,2) DEFAULT 0,
  spent_usd numeric(10,2) DEFAULT 0,
  leads integer DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ws_campaigns TO authenticated;
GRANT ALL ON public.ws_campaigns TO service_role;
ALTER TABLE public.ws_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "team read campaigns" ON public.ws_campaigns FOR SELECT TO authenticated USING (true);
CREATE POLICY "team write campaigns" ON public.ws_campaigns FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER ws_campaigns_touch BEFORE UPDATE ON public.ws_campaigns FOR EACH ROW EXECUTE FUNCTION public.ws_touch_updated_at();

-- 6. Finance metrics
CREATE TABLE public.ws_finance_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month date NOT NULL UNIQUE,
  mrr_usd numeric(12,2) DEFAULT 0,
  new_revenue_usd numeric(12,2) DEFAULT 0,
  expenses_usd numeric(12,2) DEFAULT 0,
  cash_usd numeric(12,2) DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ws_finance_metrics TO authenticated;
GRANT ALL ON public.ws_finance_metrics TO service_role;
ALTER TABLE public.ws_finance_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "team read finance" ON public.ws_finance_metrics FOR SELECT TO authenticated USING (true);
CREATE POLICY "team write finance" ON public.ws_finance_metrics FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER ws_finance_touch BEFORE UPDATE ON public.ws_finance_metrics FOR EACH ROW EXECUTE FUNCTION public.ws_touch_updated_at();
