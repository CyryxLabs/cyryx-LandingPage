
-- =========================================================================
-- WORKSPACE v2 — Fresh schema for CRM, Project Management, HR, Finance
-- Drops legacy ws_* tables (starting from scratch per user request).
-- All modules share: comments, attachments, notifications, activity log.
-- =========================================================================

-- Drop legacy hardcoded workspace tables
DROP TABLE IF EXISTS public.ws_deals CASCADE;
DROP TABLE IF EXISTS public.ws_candidates CASCADE;
DROP TABLE IF EXISTS public.ws_products CASCADE;
DROP TABLE IF EXISTS public.ws_campaigns CASCADE;
DROP TABLE IF EXISTS public.ws_finance_metrics CASCADE;
DROP TABLE IF EXISTS public.ws_dev_tasks CASCADE;

-- =========================================================================
-- SHARED: workspace profiles (mirror of auth.users for joins/UI)
-- =========================================================================
CREATE TABLE public.workspace_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  title TEXT,
  department TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.workspace_profiles TO authenticated;
GRANT ALL ON public.workspace_profiles TO service_role;
ALTER TABLE public.workspace_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wp_read_all_auth" ON public.workspace_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "wp_update_own" ON public.workspace_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "wp_insert_own" ON public.workspace_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "wp_admin_all" ON public.workspace_profiles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Trigger: auto-create profile on new user signup
CREATE OR REPLACE FUNCTION public.create_workspace_profile()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.workspace_profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, split_part(NEW.email,'@',1))
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS on_auth_user_created_workspace_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_workspace_profile
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.create_workspace_profile();

-- generic updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_wp_upd BEFORE UPDATE ON public.workspace_profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================================
-- CRM
-- =========================================================================
CREATE TABLE public.crm_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  domain TEXT,
  industry TEXT,
  size TEXT,
  website TEXT,
  notes TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_companies TO authenticated;
GRANT ALL ON public.crm_companies TO service_role;
ALTER TABLE public.crm_companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "crm_co_all_auth" ON public.crm_companies FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_crm_co_upd BEFORE UPDATE ON public.crm_companies FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.crm_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  title TEXT,
  company_id UUID REFERENCES public.crm_companies(id) ON DELETE SET NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  linkedin_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_contacts TO authenticated;
GRANT ALL ON public.crm_contacts TO service_role;
ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "crm_ct_all_auth" ON public.crm_contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_crm_ct_upd BEFORE UPDATE ON public.crm_contacts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.crm_pipelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_pipelines TO authenticated;
GRANT ALL ON public.crm_pipelines TO service_role;
ALTER TABLE public.crm_pipelines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "crm_pl_read" ON public.crm_pipelines FOR SELECT TO authenticated USING (true);
CREATE POLICY "crm_pl_admin" ON public.crm_pipelines FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.crm_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id UUID NOT NULL REFERENCES public.crm_pipelines(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position INT NOT NULL DEFAULT 0,
  probability NUMERIC(5,2) NOT NULL DEFAULT 0,
  is_won BOOLEAN NOT NULL DEFAULT false,
  is_lost BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_stages TO authenticated;
GRANT ALL ON public.crm_stages TO service_role;
ALTER TABLE public.crm_stages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "crm_st_read" ON public.crm_stages FOR SELECT TO authenticated USING (true);
CREATE POLICY "crm_st_admin" ON public.crm_stages FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.crm_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  pipeline_id UUID NOT NULL REFERENCES public.crm_pipelines(id) ON DELETE RESTRICT,
  stage_id UUID NOT NULL REFERENCES public.crm_stages(id) ON DELETE RESTRICT,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  company_id UUID REFERENCES public.crm_companies(id) ON DELETE SET NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  value NUMERIC(14,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  expected_close_date DATE,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','won','lost')),
  source TEXT,
  position INT NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_deals TO authenticated;
GRANT ALL ON public.crm_deals TO service_role;
ALTER TABLE public.crm_deals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "crm_dl_all_auth" ON public.crm_deals FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_crm_dl_upd BEFORE UPDATE ON public.crm_deals FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_crm_deals_stage ON public.crm_deals(stage_id);
CREATE INDEX idx_crm_deals_owner ON public.crm_deals(owner_id);

CREATE TABLE public.crm_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES public.crm_deals(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  kind TEXT NOT NULL CHECK (kind IN ('call','email','meeting','task','note')),
  subject TEXT NOT NULL,
  body TEXT,
  due_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.crm_activities TO authenticated;
GRANT ALL ON public.crm_activities TO service_role;
ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "crm_ac_all_auth" ON public.crm_activities FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =========================================================================
-- PROJECT MANAGEMENT
-- =========================================================================
CREATE TABLE public.pm_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  key TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#7dd3fc',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','archived','on_hold')),
  lead_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pm_projects TO authenticated;
GRANT ALL ON public.pm_projects TO service_role;
ALTER TABLE public.pm_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pm_pr_all_auth" ON public.pm_projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_pm_pr_upd BEFORE UPDATE ON public.pm_projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.pm_sprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.pm_projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  goal TEXT,
  start_at DATE,
  end_at DATE,
  status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned','active','completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pm_sprints TO authenticated;
GRANT ALL ON public.pm_sprints TO service_role;
ALTER TABLE public.pm_sprints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pm_sp_all_auth" ON public.pm_sprints FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE TABLE public.pm_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.pm_projects(id) ON DELETE CASCADE,
  sprint_id UUID REFERENCES public.pm_sprints(id) ON DELETE SET NULL,
  parent_task_id UUID REFERENCES public.pm_tasks(id) ON DELETE CASCADE,
  code TEXT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'backlog' CHECK (status IN ('backlog','todo','in_progress','in_review','done','canceled')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
  type TEXT NOT NULL DEFAULT 'task' CHECK (type IN ('task','bug','feature','story','epic')),
  assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reporter_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  due_at TIMESTAMPTZ,
  estimate_hours NUMERIC(6,2),
  spent_hours NUMERIC(6,2) DEFAULT 0,
  position INT NOT NULL DEFAULT 0,
  labels TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pm_tasks TO authenticated;
GRANT ALL ON public.pm_tasks TO service_role;
ALTER TABLE public.pm_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pm_tk_all_auth" ON public.pm_tasks FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_pm_tk_upd BEFORE UPDATE ON public.pm_tasks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_pm_tasks_project ON public.pm_tasks(project_id);
CREATE INDEX idx_pm_tasks_status ON public.pm_tasks(status);
CREATE INDEX idx_pm_tasks_assignee ON public.pm_tasks(assignee_id);

CREATE TABLE public.pm_task_watchers (
  task_id UUID NOT NULL REFERENCES public.pm_tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (task_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.pm_task_watchers TO authenticated;
GRANT ALL ON public.pm_task_watchers TO service_role;
ALTER TABLE public.pm_task_watchers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pm_tw_all_auth" ON public.pm_task_watchers FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =========================================================================
-- HR
-- =========================================================================
CREATE TABLE public.hr_departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  head_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hr_departments TO authenticated;
GRANT ALL ON public.hr_departments TO service_role;
ALTER TABLE public.hr_departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr_dp_read" ON public.hr_departments FOR SELECT TO authenticated USING (true);
CREATE POLICY "hr_dp_admin" ON public.hr_departments FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.hr_employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  title TEXT,
  department_id UUID REFERENCES public.hr_departments(id) ON DELETE SET NULL,
  manager_id UUID REFERENCES public.hr_employees(id) ON DELETE SET NULL,
  employment_type TEXT DEFAULT 'full_time' CHECK (employment_type IN ('full_time','part_time','contractor','intern')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','on_leave','terminated')),
  start_date DATE,
  end_date DATE,
  salary NUMERIC(12,2),
  salary_currency TEXT DEFAULT 'USD',
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hr_employees TO authenticated;
GRANT ALL ON public.hr_employees TO service_role;
ALTER TABLE public.hr_employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr_em_read" ON public.hr_employees FOR SELECT TO authenticated USING (true);
CREATE POLICY "hr_em_admin" ON public.hr_employees FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_hr_em_upd BEFORE UPDATE ON public.hr_employees FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.hr_job_openings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department_id UUID REFERENCES public.hr_departments(id) ON DELETE SET NULL,
  description TEXT,
  location TEXT,
  employment_type TEXT DEFAULT 'full_time',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('draft','open','on_hold','closed')),
  hiring_manager_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  salary_min NUMERIC(12,2),
  salary_max NUMERIC(12,2),
  posted_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hr_job_openings TO authenticated;
GRANT ALL ON public.hr_job_openings TO service_role;
ALTER TABLE public.hr_job_openings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr_jo_all_auth" ON public.hr_job_openings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_hr_jo_upd BEFORE UPDATE ON public.hr_job_openings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.hr_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.hr_job_openings(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  stage TEXT NOT NULL DEFAULT 'applied' CHECK (stage IN ('applied','screening','interview','offer','hired','rejected','withdrawn')),
  source TEXT,
  resume_url TEXT,
  linkedin_url TEXT,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hr_candidates TO authenticated;
GRANT ALL ON public.hr_candidates TO service_role;
ALTER TABLE public.hr_candidates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr_cd_all_auth" ON public.hr_candidates FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_hr_cd_upd BEFORE UPDATE ON public.hr_candidates FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_hr_candidates_job ON public.hr_candidates(job_id);
CREATE INDEX idx_hr_candidates_stage ON public.hr_candidates(stage);

CREATE TABLE public.hr_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.hr_employees(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  period TEXT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  strengths TEXT,
  growth_areas TEXT,
  goals TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','shared','acknowledged')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hr_reviews TO authenticated;
GRANT ALL ON public.hr_reviews TO service_role;
ALTER TABLE public.hr_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr_rv_admin_all" ON public.hr_reviews FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "hr_rv_self_read" ON public.hr_reviews FOR SELECT TO authenticated USING (
  employee_id IN (SELECT id FROM public.hr_employees WHERE user_id = auth.uid())
  OR reviewer_id = auth.uid()
);
CREATE TRIGGER trg_hr_rv_upd BEFORE UPDATE ON public.hr_reviews FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.hr_time_off (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.hr_employees(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('vacation','sick','personal','other')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','canceled')),
  reason TEXT,
  approver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hr_time_off TO authenticated;
GRANT ALL ON public.hr_time_off TO service_role;
ALTER TABLE public.hr_time_off ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hr_to_all_auth" ON public.hr_time_off FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =========================================================================
-- FINANCE
-- =========================================================================
CREATE TABLE public.fin_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('bank','credit_card','cash','other')),
  currency TEXT NOT NULL DEFAULT 'USD',
  opening_balance NUMERIC(14,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fin_accounts TO authenticated;
GRANT ALL ON public.fin_accounts TO service_role;
ALTER TABLE public.fin_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fin_ac_admin" ON public.fin_accounts FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "fin_ac_read_auth" ON public.fin_accounts FOR SELECT TO authenticated USING (true);

CREATE TABLE public.fin_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('income','expense')),
  color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (name, kind)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fin_categories TO authenticated;
GRANT ALL ON public.fin_categories TO service_role;
ALTER TABLE public.fin_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fin_cat_read" ON public.fin_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "fin_cat_admin" ON public.fin_categories FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.fin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  occurred_on DATE NOT NULL,
  amount NUMERIC(14,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  kind TEXT NOT NULL CHECK (kind IN ('income','expense','transfer')),
  category_id UUID REFERENCES public.fin_categories(id) ON DELETE SET NULL,
  account_id UUID REFERENCES public.fin_accounts(id) ON DELETE SET NULL,
  counterparty TEXT,
  description TEXT,
  reference TEXT,
  attachment_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fin_transactions TO authenticated;
GRANT ALL ON public.fin_transactions TO service_role;
ALTER TABLE public.fin_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fin_tx_admin" ON public.fin_transactions FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "fin_tx_read_auth" ON public.fin_transactions FOR SELECT TO authenticated USING (true);
CREATE INDEX idx_fin_tx_date ON public.fin_transactions(occurred_on);

CREATE TABLE public.fin_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  plan TEXT,
  mrr NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('trial','active','paused','canceled')),
  started_at DATE,
  canceled_at DATE,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  company_id UUID REFERENCES public.crm_companies(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fin_subscriptions TO authenticated;
GRANT ALL ON public.fin_subscriptions TO service_role;
ALTER TABLE public.fin_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fin_sub_admin" ON public.fin_subscriptions FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "fin_sub_read" ON public.fin_subscriptions FOR SELECT TO authenticated USING (true);
CREATE TRIGGER trg_fin_sub_upd BEFORE UPDATE ON public.fin_subscriptions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.fin_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  company_id UUID REFERENCES public.crm_companies(id) ON DELETE SET NULL,
  amount NUMERIC(14,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','sent','paid','overdue','void')),
  issued_at DATE,
  due_at DATE,
  paid_at DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fin_invoices TO authenticated;
GRANT ALL ON public.fin_invoices TO service_role;
ALTER TABLE public.fin_invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "fin_inv_admin" ON public.fin_invoices FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "fin_inv_read" ON public.fin_invoices FOR SELECT TO authenticated USING (true);
CREATE TRIGGER trg_fin_inv_upd BEFORE UPDATE ON public.fin_invoices FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================================
-- CROSS-CUTTING: comments, attachments, notifications, activity
-- Polymorphic (entity_type, entity_id)
-- =========================================================================
CREATE TABLE public.ws_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  edited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ws_comments TO authenticated;
GRANT ALL ON public.ws_comments TO service_role;
ALTER TABLE public.ws_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wc_read" ON public.ws_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "wc_insert" ON public.ws_comments FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());
CREATE POLICY "wc_update_own" ON public.ws_comments FOR UPDATE TO authenticated USING (author_id = auth.uid()) WITH CHECK (author_id = auth.uid());
CREATE POLICY "wc_delete_own_or_admin" ON public.ws_comments FOR DELETE TO authenticated USING (author_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_ws_comments_entity ON public.ws_comments(entity_type, entity_id);

CREATE TABLE public.ws_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  content_type TEXT,
  size_bytes BIGINT,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ws_attachments TO authenticated;
GRANT ALL ON public.ws_attachments TO service_role;
ALTER TABLE public.ws_attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wa_read" ON public.ws_attachments FOR SELECT TO authenticated USING (true);
CREATE POLICY "wa_insert" ON public.ws_attachments FOR INSERT TO authenticated WITH CHECK (uploaded_by = auth.uid());
CREATE POLICY "wa_delete_own_or_admin" ON public.ws_attachments FOR DELETE TO authenticated USING (uploaded_by = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_ws_attachments_entity ON public.ws_attachments(entity_type, entity_id);

CREATE TABLE public.ws_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  kind TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  title TEXT NOT NULL,
  body TEXT,
  url TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ws_notifications TO authenticated;
GRANT ALL ON public.ws_notifications TO service_role;
ALTER TABLE public.ws_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wn_read_own" ON public.ws_notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "wn_update_own" ON public.ws_notifications FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "wn_delete_own" ON public.ws_notifications FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "wn_insert_auth" ON public.ws_notifications FOR INSERT TO authenticated WITH CHECK (true);
CREATE INDEX idx_ws_notifications_user ON public.ws_notifications(user_id, read_at);

CREATE TABLE public.ws_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  action TEXT NOT NULL,
  changes JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.ws_activity_log TO authenticated;
GRANT ALL ON public.ws_activity_log TO service_role;
ALTER TABLE public.ws_activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wal_read" ON public.ws_activity_log FOR SELECT TO authenticated USING (true);
CREATE POLICY "wal_insert" ON public.ws_activity_log FOR INSERT TO authenticated WITH CHECK (actor_id = auth.uid() OR actor_id IS NULL);
CREATE INDEX idx_ws_activity_entity ON public.ws_activity_log(entity_type, entity_id);

-- =========================================================================
-- SEED: default CRM pipeline + stages, HR departments, finance categories
-- =========================================================================
DO $$
DECLARE pl_id UUID;
BEGIN
  INSERT INTO public.crm_pipelines (name, is_default) VALUES ('Sales', true) RETURNING id INTO pl_id;
  INSERT INTO public.crm_stages (pipeline_id, name, position, probability, is_won, is_lost) VALUES
    (pl_id, 'Lead', 0, 10, false, false),
    (pl_id, 'Qualified', 1, 25, false, false),
    (pl_id, 'Proposal', 2, 50, false, false),
    (pl_id, 'Negotiation', 3, 75, false, false),
    (pl_id, 'Won', 4, 100, true, false),
    (pl_id, 'Lost', 5, 0, false, true);
END $$;

INSERT INTO public.hr_departments (name) VALUES
  ('Engineering'), ('Product'), ('Design'), ('Sales'), ('Marketing'), ('People'), ('Finance');

INSERT INTO public.fin_categories (name, kind) VALUES
  ('Subscription revenue','income'),('Services revenue','income'),('Other income','income'),
  ('Payroll','expense'),('Contractors','expense'),('Software','expense'),('Infrastructure','expense'),
  ('Marketing','expense'),('Travel','expense'),('Office','expense'),('Legal & Professional','expense'),('Other expense','expense');

-- Backfill workspace_profiles for existing auth users
INSERT INTO public.workspace_profiles (user_id, email, full_name)
SELECT id, email, split_part(email,'@',1) FROM auth.users
ON CONFLICT (user_id) DO NOTHING;
