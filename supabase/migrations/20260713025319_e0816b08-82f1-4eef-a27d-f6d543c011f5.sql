
-- 1) Lock down broad RLS policies

-- CRM: owner-or-admin
DROP POLICY IF EXISTS crm_ac_all_auth ON public.crm_activities;
CREATE POLICY crm_ac_owner_or_admin ON public.crm_activities FOR ALL TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (owner_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS crm_co_all_auth ON public.crm_companies;
CREATE POLICY crm_co_owner_or_admin ON public.crm_companies FOR ALL TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (owner_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS crm_ct_all_auth ON public.crm_contacts;
CREATE POLICY crm_ct_owner_or_admin ON public.crm_contacts FOR ALL TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (owner_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS crm_dl_all_auth ON public.crm_deals;
CREATE POLICY crm_dl_owner_or_admin ON public.crm_deals FOR ALL TO authenticated
  USING (owner_id = auth.uid() OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (owner_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

-- mkt_leads: admin only (no owner column)
DROP POLICY IF EXISTS mkt_leads_all_auth ON public.mkt_leads;
CREATE POLICY mkt_leads_admin ON public.mkt_leads FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- FIN: drop broad read; admin ALL policies already cover reads
DROP POLICY IF EXISTS fin_ac_read_auth ON public.fin_accounts;
DROP POLICY IF EXISTS fin_tx_read_auth ON public.fin_transactions;
DROP POLICY IF EXISTS fin_inv_read ON public.fin_invoices;
DROP POLICY IF EXISTS fin_sub_read ON public.fin_subscriptions;

-- HR candidates: admin only
DROP POLICY IF EXISTS hr_cd_all_auth ON public.hr_candidates;
CREATE POLICY hr_cd_admin ON public.hr_candidates FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- HR employees: replace broad read with self-or-admin
DROP POLICY IF EXISTS hr_em_read ON public.hr_employees;
CREATE POLICY hr_em_self_read ON public.hr_employees FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

-- mkt_attribution_audit: admin only read
DROP POLICY IF EXISTS "auth read attribution audit" ON public.mkt_attribution_audit;
CREATE POLICY mkt_attr_audit_admin_read ON public.mkt_attribution_audit FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

-- workspace_profiles: self-or-admin read (wp_admin_all already covers admin ALL)
DROP POLICY IF EXISTS wp_read_all_auth ON public.workspace_profiles;
CREATE POLICY wp_read_self ON public.workspace_profiles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Also tighten other ALWAYS TRUE ALL policies flagged by the linter
DROP POLICY IF EXISTS mkt_campaigns_all_auth ON public.mkt_campaigns;
CREATE POLICY mkt_campaigns_admin ON public.mkt_campaigns FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS mkt_channels_all_auth ON public.mkt_channels;
CREATE POLICY mkt_channels_admin ON public.mkt_channels FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS hr_jo_all_auth ON public.hr_job_openings;
CREATE POLICY hr_jo_admin ON public.hr_job_openings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS hr_to_all_auth ON public.hr_time_off;
CREATE POLICY hr_to_self_or_admin ON public.hr_time_off FOR ALL TO authenticated
  USING (
    public.has_role(auth.uid(),'admin')
    OR employee_id IN (SELECT id FROM public.hr_employees WHERE user_id = auth.uid())
  )
  WITH CHECK (
    public.has_role(auth.uid(),'admin')
    OR employee_id IN (SELECT id FROM public.hr_employees WHERE user_id = auth.uid())
  );

-- 2) Storage: restrict workspace-attachments SELECT to uploader or admin
DROP POLICY IF EXISTS wsa_read_authenticated ON storage.objects;
CREATE POLICY wsa_read_own_or_admin ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'workspace-attachments'
    AND (owner = auth.uid() OR public.has_role(auth.uid(),'admin'))
  );

-- 3) Revoke EXECUTE on SECURITY DEFINER helpers from public/anon/authenticated
-- Keep public.has_role executable (used by RLS policies).
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text,text,bigint,jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text,jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text,bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text,integer,integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_cyryxlabs_domain() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.email_queue_wake() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.bootstrap_admin_ppetruff() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.grant_admin_from_allowlist() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.create_workspace_profile() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_watchers_on_comment() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_assignee_on_task_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.reconcile_deal_attribution() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.email_queue_dispatch() FROM PUBLIC, anon, authenticated;
