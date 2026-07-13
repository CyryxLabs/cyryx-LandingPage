
DROP POLICY IF EXISTS pm_pr_all_auth ON public.pm_projects;
CREATE POLICY pm_pr_auth ON public.pm_projects FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS pm_sp_all_auth ON public.pm_sprints;
CREATE POLICY pm_sp_auth ON public.pm_sprints FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS pm_tk_all_auth ON public.pm_tasks;
CREATE POLICY pm_tk_auth ON public.pm_tasks FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS pm_tw_all_auth ON public.pm_task_watchers;
CREATE POLICY pm_tw_auth ON public.pm_task_watchers FOR ALL TO authenticated
  USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS wn_insert_auth ON public.ws_notifications;
CREATE POLICY wn_insert_auth ON public.ws_notifications FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);
